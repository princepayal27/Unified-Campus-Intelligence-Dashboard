# backend/mcp/events/schemas.py

"""
Pydantic models for the Events MCP server.
Defines request/response shapes used across routes and services.
"""

from pydantic import BaseModel


class Event(BaseModel):
    """Represents a single campus event record."""

    id: str
    title: str
    description: str
    category: str
    date: str
    time: str
    venue: str
    organizer: str
    registrationOpen: bool


class UpcomingEventsResponse(BaseModel):
    """Response model for the upcoming-events endpoint."""

    events: list[Event]


class SearchEventsResponse(BaseModel):
    """Response model for the event-search endpoint."""

    results: list[Event]