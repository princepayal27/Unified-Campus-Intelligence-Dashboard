# backend/app/ai/orchestrator.py

"""
Core orchestration logic for the campus AI assistant.

Supports single-tool and multi-tool parallel execution.

Flow:
    1. Receive user message.
    2. Send message + tool definitions to OpenAI/OpenRouter.
    3. If the model requests tool calls (one or many), execute ALL of
       them in parallel via asyncio.gather().
    4. Append every tool result to the conversation as tool messages.
    5. Re-send the full conversation to the model for final synthesis.
    6. Return the final response text plus the list of tools used.
"""

import os
from typing import Any

from openai import AsyncOpenAI

from .prompts import SYSTEM_PROMPT
from .tool_registry import TOOLS
from .tool_executor import execute_multiple_tools
from .schemas import MultiToolResponse
from .utils import safe_json_dumps

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# Maximum tool-call rounds to prevent infinite loops.
MAX_TOOL_ROUNDS = 5

_client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
)


def _build_tool_messages(tool_calls: list, results: list) -> list[dict[str, Any]]:
    """
    Build the list of role="tool" messages to append to the conversation
    after parallel execution. Order matches the original tool_calls list.

    Args:
        tool_calls: the raw tool_call objects from the assistant message.
        results: ToolExecutionResult list in the same order.

    Returns:
        List of message dicts with role="tool".
    """
    return [
        {
            "role": "tool",
            "tool_call_id": tc.id,
            "content": safe_json_dumps(result.result),
        }
        for tc, result in zip(tool_calls, results)
    ]


def _assistant_message_dict(assistant_message: Any) -> dict[str, Any]:
    """
    Serialize an OpenAI assistant message (with tool_calls) into a plain
    dict suitable for appending to the messages list sent back to the API.
    """
    return {
        "role": "assistant",
        "content": assistant_message.content,
        "tool_calls": [
            {
                "id": tc.id,
                "type": "function",
                "function": {
                    "name": tc.function.name,
                    "arguments": tc.function.arguments,
                },
            }
            for tc in (assistant_message.tool_calls or [])
        ],
    }


async def run_chat(user_message: str) -> MultiToolResponse:
    """
    Run the full multi-tool chat orchestration for a single user message.

    Args:
        user_message: the raw text the user typed.

    Returns:
        A MultiToolResponse containing the final natural-language answer
        and the ordered list of tool names that were called.

    Raises:
        RuntimeError: if OPENAI_API_KEY is not configured.
    """
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY is not set. Configure it in your .env file.")

    messages: list[dict[str, Any]] = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message},
    ]

    all_tools_used: list[str] = []

    for _ in range(MAX_TOOL_ROUNDS):
        response = await _client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
        )

        choice = response.choices[0]
        assistant_message = choice.message

        # No tool calls → this is the final answer.
        if not assistant_message.tool_calls:
            return MultiToolResponse(
                tools_used=all_tools_used,
                final_response=assistant_message.content or "",
            )

        # Track tool names for the response metadata.
        tool_calls = assistant_message.tool_calls
        all_tools_used.extend(tc.function.name for tc in tool_calls)

        # Append the assistant's tool-call request to history.
        messages.append(_assistant_message_dict(assistant_message))

        # Execute ALL tool calls in parallel.
        results = await execute_multiple_tools(tool_calls)

        # Append every tool result to the conversation.
        messages.extend(_build_tool_messages(tool_calls, results))

    # If MAX_TOOL_ROUNDS exhausted, force a final synthesis with no
    # further tool calls.
    final_response = await _client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=messages,
        tool_choice="none",
    )

    return MultiToolResponse(
        tools_used=all_tools_used,
        final_response=final_response.choices[0].message.content or (
            "I gathered information but couldn't finalize a response. Please try rephrasing."
        ),
    )