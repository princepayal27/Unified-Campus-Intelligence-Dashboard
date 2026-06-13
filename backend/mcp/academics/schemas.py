# backend/mcp/academics/schemas.py

"""
Pydantic models for the Academic Handbook Semantic Search MCP server.
Defines request/response shapes used across routes and services.
"""

from pydantic import BaseModel, Field


class HandbookChunk(BaseModel):
    """Represents a single chunk of academic handbook text."""

    id: str
    section: str
    content: str


class SearchRequest(BaseModel):
    """Request body for the semantic search endpoint."""

    query: str = Field(..., min_length=1, description="Natural language question to search for")
    top_k: int = Field(default=3, ge=1, le=10, description="Number of top matching chunks to return")


class SearchResponse(BaseModel):
    """Response model for the semantic search endpoint."""

    query: str
    results: list[HandbookChunk]


# --- Dashboard data models -------------------------------------------------


class AttendanceRecord(BaseModel):
    """Overall attendance summary for the student."""

    overallPercentage: float
    totalClasses: int
    attendedClasses: int
    status: str


class UpcomingClass(BaseModel):
    """A single upcoming class entry."""

    id: str
    subjectCode: str
    subjectName: str
    faculty: str
    startTime: str
    room: str


class Assignment(BaseModel):
    """A single assignment entry."""

    id: str
    subjectCode: str
    title: str
    dueDate: str
    priority: str
    submitted: bool


class DashboardResponse(BaseModel):
    """Response model for the academics dashboard endpoint."""

    attendance: AttendanceRecord
    classes: list[UpcomingClass]
    assignments: list[Assignment]