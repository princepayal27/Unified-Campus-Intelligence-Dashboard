# backend/app/ai/schemas.py

"""
Pydantic models for the AI orchestration layer.
"""

from typing import Any
from pydantic import BaseModel


class ChatRequest(BaseModel):
    """Request body for POST /ai/chat."""

    message: str


class ChatResponse(BaseModel):
    """Response body for POST /ai/chat."""

    response: str
    tools_used: list[str] = []


class ToolExecutionResult(BaseModel):
    """Result of executing a single tool call against an MCP server."""

    tool_name: str
    result: Any
    success: bool = True


class MultiToolResponse(BaseModel):
    """Aggregated result from multiple parallel tool executions."""

    tools_used: list[str]
    final_response: str