# backend/mcp/events/routes.py

"""
API routes for the Events MCP server.

Each route is a thin wrapper around the corresponding service/tool
function defined in services.py, translating results into the
Pydantic response models defined in schemas.py.
"""

from fastapi import APIRouter, Query

from schemas import UpcomingEventsResponse, SearchEventsResponse
from services import get_upcoming_events, search_events

router = APIRouter()


@router.get("/upcoming", response_model=UpcomingEventsResponse)
def get_upcoming_events_route() -> UpcomingEventsResponse:
    """
    Return upcoming events (today or later), sorted by nearest date first,
    limited to the next 10 events.

    Example:
        GET /events/upcoming
    """
    events = get_upcoming_events()
    return UpcomingEventsResponse(events=events)


@router.get("/search", response_model=SearchEventsResponse)
def search_events_route(
    q: str = Query(..., min_length=1, description="Search term to match against title, category, or organizer"),
) -> SearchEventsResponse:
    """
    Search for events by title, category, or organizer
    (case-insensitive, partial match). Returns an empty list if no matches.

    Example:
        GET /events/search?q=ai
    """
    results = search_events(q)
    return SearchEventsResponse(results=results)