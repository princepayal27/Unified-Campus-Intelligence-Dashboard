# backend/app/ai/tool_executor.py

"""
Async tool executor for the AI orchestration layer.

Maps each OpenAI tool/function name to the corresponding MCP server
HTTP call, executes them via httpx.AsyncClient, and returns normalized
JSON-serializable results ready to be sent back to the OpenAI API as
tool messages.

Supports both single and parallel multi-tool execution via
execute_multiple_tools(), which uses asyncio.gather() so all tools
run concurrently regardless of how many the model selects.
"""

import asyncio
import os
import json
from typing import Any, Callable, Awaitable

import httpx

from .schemas import ToolExecutionResult

# ------------------------------------------------------------------ #
# MCP server base URLs (configurable via environment variables)
# ------------------------------------------------------------------ #
LIBRARY_MCP_URL = os.getenv("LIBRARY_MCP_URL", "http://localhost:8001")
EVENTS_MCP_URL = os.getenv("EVENTS_MCP_URL", "http://localhost:8002")
CAFETERIA_MCP_URL = os.getenv("CAFETERIA_MCP_URL", "http://localhost:8003")
ACADEMICS_MCP_URL = os.getenv("ACADEMICS_MCP_URL", "http://localhost:8004")

MCP_REQUEST_TIMEOUT = float(os.getenv("MCP_REQUEST_TIMEOUT", "10"))


# ------------------------------------------------------------------ #
# Individual tool implementations
# ------------------------------------------------------------------ #

async def _search_book(client: httpx.AsyncClient, args: dict[str, Any]) -> Any:
    resp = await client.get(f"{LIBRARY_MCP_URL}/library/search", params={"q": args.get("query", "")})
    resp.raise_for_status()
    return resp.json()


async def _check_availability(client: httpx.AsyncClient, args: dict[str, Any]) -> Any:
    resp = await client.get(f"{LIBRARY_MCP_URL}/library/availability/{args.get('book_id', '')}")
    resp.raise_for_status()
    return resp.json()


async def _get_due_dates(client: httpx.AsyncClient, args: dict[str, Any]) -> Any:
    resp = await client.get(f"{LIBRARY_MCP_URL}/library/due-dates")
    resp.raise_for_status()
    return resp.json()


async def _get_upcoming_events(client: httpx.AsyncClient, args: dict[str, Any]) -> Any:
    resp = await client.get(f"{EVENTS_MCP_URL}/events/upcoming")
    resp.raise_for_status()
    return resp.json()


async def _search_events(client: httpx.AsyncClient, args: dict[str, Any]) -> Any:
    resp = await client.get(f"{EVENTS_MCP_URL}/events/search", params={"q": args.get("query", "")})
    resp.raise_for_status()
    return resp.json()


async def _get_full_menu(client: httpx.AsyncClient, args: dict[str, Any]) -> Any:
    resp = await client.get(f"{CAFETERIA_MCP_URL}/cafeteria/menu")
    resp.raise_for_status()
    return resp.json()


async def _get_menu_by_type(client: httpx.AsyncClient, args: dict[str, Any]) -> Any:
    meal_type = args.get("meal_type", "")
    resp = await client.get(f"{CAFETERIA_MCP_URL}/cafeteria/menu/{meal_type}")
    resp.raise_for_status()
    return resp.json()


async def _search_academic_handbook(client: httpx.AsyncClient, args: dict[str, Any]) -> Any:
    resp = await client.post(
        f"{ACADEMICS_MCP_URL}/academics/search",
        json={"query": args.get("query", ""), "top_k": 3},
    )
    resp.raise_for_status()
    return resp.json()


# ------------------------------------------------------------------ #
# Tool name -> implementation registry
# ------------------------------------------------------------------ #

ToolFn = Callable[[httpx.AsyncClient, dict[str, Any]], Awaitable[Any]]

TOOL_DISPATCH: dict[str, ToolFn] = {
    "search_book": _search_book,
    "check_availability": _check_availability,
    "get_due_dates": _get_due_dates,
    "get_upcoming_events": _get_upcoming_events,
    "search_events": _search_events,
    "get_full_menu": _get_full_menu,
    "get_menu_by_type": _get_menu_by_type,
    "search_academic_handbook": _search_academic_handbook,
}


# ------------------------------------------------------------------ #
# Single tool execution
# ------------------------------------------------------------------ #

async def execute_tool(
    client: httpx.AsyncClient,
    tool_name: str,
    arguments_json: str,
) -> ToolExecutionResult:
    """
    Execute a single tool call against the appropriate MCP server.

    Returns a ToolExecutionResult with success=False and an error dict
    in result if anything goes wrong, so the caller can continue
    processing other tools and inform the LLM of partial failures.
    """
    try:
        arguments: dict[str, Any] = json.loads(arguments_json) if arguments_json else {}
    except json.JSONDecodeError:
        return ToolExecutionResult(
            tool_name=tool_name,
            result={"error": f"Could not parse arguments for tool '{tool_name}': {arguments_json!r}"},
            success=False,
        )

    handler = TOOL_DISPATCH.get(tool_name)

    if handler is None:
        return ToolExecutionResult(
            tool_name=tool_name,
            result={"error": f"Unknown tool '{tool_name}'."},
            success=False,
        )

    try:
        data = await handler(client, arguments)
        return ToolExecutionResult(tool_name=tool_name, result=data, success=True)

    except httpx.TimeoutException:
        return ToolExecutionResult(
            tool_name=tool_name,
            result={"error": f"Request to '{tool_name}' timed out."},
            success=False,
        )

    except httpx.HTTPStatusError as exc:
        status = exc.response.status_code
        if status == 404:
            message = f"No data found for '{tool_name}' with the given arguments."
        elif status == 400:
            message = f"Invalid arguments provided for '{tool_name}'."
        else:
            message = f"The '{tool_name}' service returned an error (status {status})."
        return ToolExecutionResult(tool_name=tool_name, result={"error": message}, success=False)

    except httpx.RequestError as exc:
        return ToolExecutionResult(
            tool_name=tool_name,
            result={"error": f"Could not reach the '{tool_name}' service: {exc}"},
            success=False,
        )

    except Exception as exc:  # noqa: BLE001
        return ToolExecutionResult(
            tool_name=tool_name,
            result={"error": f"Unexpected error while executing '{tool_name}': {exc}"},
            success=False,
        )


# ------------------------------------------------------------------ #
# Parallel multi-tool execution
# ------------------------------------------------------------------ #

async def execute_multiple_tools(tool_calls: list) -> list[ToolExecutionResult]:
    """
    Execute any number of tool calls concurrently using asyncio.gather().

    A single shared httpx.AsyncClient is used for all requests in the
    batch to benefit from connection pooling.

    Args:
        tool_calls: list of tool_call objects from an OpenAI assistant
            message (each with .id, .function.name, .function.arguments).

    Returns:
        List of ToolExecutionResult in the same order as tool_calls.
        Individual failures do NOT raise — they are captured as
        ToolExecutionResult with success=False so the LLM can be
        informed of partial results.
    """
    async with httpx.AsyncClient(timeout=MCP_REQUEST_TIMEOUT) as client:
        results: list[ToolExecutionResult] = await asyncio.gather(
            *[
                execute_tool(client, tc.function.name, tc.function.arguments)
                for tc in tool_calls
            ]
        )
    return list(results)