# backend/mcp/library/schemas.py

"""
Pydantic models for the Library MCP server.
Defines request/response shapes used across routes and services.
"""

from typing import Optional
from pydantic import BaseModel, Field


class Book(BaseModel):
    """Represents a single library book record."""

    id: str
    title: str
    author: str
    category: str
    available: bool
    dueDate: Optional[str] = Field(
        default=None,
        description="ISO date string when book is due back, or null if available.",
    )


class SearchResponse(BaseModel):
    """Response model for the book search endpoint."""

    results: list[Book]


class AvailabilityResponse(BaseModel):
    """Response model for the availability-check endpoint."""

    book_id: str
    available: bool
    dueDate: Optional[str] = None


class DueDateEntry(BaseModel):
    """A single entry in the due-dates list."""

    id: str
    title: str
    author: str
    dueDate: str


class DueDateResponse(BaseModel):
    """Response model for the due-dates endpoint."""

    due_books: list[DueDateEntry]