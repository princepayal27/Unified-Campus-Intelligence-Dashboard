# backend/mcp/library/routes.py

"""
API routes for the Library MCP server.

Each route is a thin wrapper around the corresponding service/tool
function defined in services.py, translating results into the
Pydantic response models defined in schemas.py.
"""

from fastapi import APIRouter, HTTPException, Query

from schemas import (
    SearchResponse,
    AvailabilityResponse,
    DueDateResponse,
    DueDateEntry,
)
from services import search_books, check_book_availability, get_due_books

router = APIRouter()


@router.get("/search", response_model=SearchResponse)
def search_book_route(
    q: str = Query(..., min_length=1, description="Search term to match against title or author"),
) -> SearchResponse:
    """
    Search for books by title or author (case-insensitive, partial match).

    Example:
        GET /library/search?q=python
    """
    results = search_books(q)
    return SearchResponse(results=results)


@router.get("/availability/{book_id}", response_model=AvailabilityResponse)
def check_availability_route(book_id: str) -> AvailabilityResponse:
    """
    Check whether a specific book is available for checkout.

    Returns 404 if no book matches the given ID.

    Example:
        GET /library/availability/BOOK003
    """
    book = check_book_availability(book_id)

    if book is None:
        raise HTTPException(status_code=404, detail=f"Book with id '{book_id}' not found")

    return AvailabilityResponse(
        book_id=book.id,
        available=book.available,
        dueDate=book.dueDate,
    )


@router.get("/due-dates", response_model=DueDateResponse)
def get_due_dates_route() -> DueDateResponse:
    """
    Return all currently borrowed books along with their due dates.

    Example:
        GET /library/due-dates
    """
    due_books = get_due_books()

    entries = [
        DueDateEntry(
            id=book.id,
            title=book.title,
            author=book.author,
            dueDate=book.dueDate,  # type: ignore[arg-type]  # guaranteed non-null by get_due_books()
        )
        for book in due_books
    ]

    return DueDateResponse(due_books=entries)