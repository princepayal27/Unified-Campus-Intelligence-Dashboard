# backend/app/ai/router.py

"""
FastAPI router exposing the AI chat endpoint.
"""

from fastapi import APIRouter, HTTPException

from .schemas import ChatRequest, ChatResponse
from .orchestrator import run_chat

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_route(request: ChatRequest) -> ChatResponse:
    """
    Main AI chat endpoint.

    Accepts a user message, runs multi-tool orchestration (calling one
    or more MCP servers in parallel as needed), and returns the final
    natural-language response together with the list of tools used.

    Example:
        POST /ai/chat
        { "message": "Show my due books and today's lunch" }

    Response:
        {
            "response": "You have 2 books due...\n\nFor lunch today...",
            "tools_used": ["get_due_dates", "get_full_menu"]
        }
    """
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message must not be empty")

    try:
        multi_response = await run_chat(request.message)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"AI chat failed: {exc}") from exc

    return ChatResponse(
        response=multi_response.final_response,
        tools_used=multi_response.tools_used,
    )