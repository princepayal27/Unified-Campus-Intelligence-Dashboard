# backend/mcp/library/services.py

"""
Business logic for the Library MCP server.

These functions are written as standalone, importable "tools" so they can
be registered directly with an AI orchestrator (e.g. OpenAI tool calling)
in addition to being used by the FastAPI routes.

Currently backed by a local JSON file (data/books.json). Swapping to a
real database later only requires changing load_books(); all other
functions operate on the in-memory list of Book objects.
"""

from typing import Optional

from schemas import Book
from utils import DATA_FILE, read_json_file, normalize_text


def load_books() -> list[Book]:
    """
    Load and validate all books from the mock data source.

    Returns:
        A list of validated Book models.

    Raises:
        FileNotFoundError: if the data file is missing.
        ValueError: if the data file is malformed or fails validation.
    """
    raw_records = read_json_file(DATA_FILE)

    try:
        return [Book(**record) for record in raw_records]
    except Exception as exc:
        raise ValueError(f"Invalid book record in {DATA_FILE}: {exc}") from exc


def search_books(query: str) -> list[Book]:
    """
    Tool: search_book(query)

    Search books by title or author, case-insensitive, partial match.

    Args:
        query: search string to match against title/author.

    Returns:
        List of matching Book models. Empty list if no matches.
    """
    if not query or not query.strip():
        return []

    normalized_query = normalize_text(query)
    books = load_books()

    return [
        book
        for book in books
        if normalized_query in normalize_text(book.title)
        or normalized_query in normalize_text(book.author)
    ]


def check_book_availability(book_id: str) -> Optional[Book]:
    """
    Tool: check_availability(book_id)

    Look up a single book by its ID.

    Args:
        book_id: unique identifier of the book.

    Returns:
        The matching Book if found, otherwise None.
    """
    books = load_books()

    for book in books:
        if book.id == book_id:
            return book

    return None


def get_due_books() -> list[Book]:
    """
    Tool: get_due_dates()

    Return all books that are currently unavailable (borrowed) and
    therefore have a due date.

    Returns:
        List of Book models where available is False and dueDate is set.
    """
    books = load_books()

    return [book for book in books if not book.available and book.dueDate is not None]