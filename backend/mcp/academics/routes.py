# backend/mcp/academics/routes.py

"""
API routes for the Academics MCP server.

Includes:
- POST /academics/search    -> semantic search over the handbook
- GET  /academics/dashboard  -> structured dashboard data (attendance,
                                 classes, assignments)
"""

from fastapi import APIRouter, HTTPException

from schemas import SearchRequest, SearchResponse, DashboardResponse
from services import semantic_search, is_initialized, get_dashboard_data
from utils import is_blank_query

router = APIRouter()


@router.post("/search", response_model=SearchResponse)
def semantic_search_route(request: SearchRequest) -> SearchResponse:
    """
    Perform a semantic search over the academic handbook.

    Embeds the user's query, performs a FAISS nearest-neighbor search,
    and returns the top-k most relevant handbook chunks.

    Returns 400 if the query is empty/whitespace.
    Returns 503 if the search index has not finished initializing.

    Example:
        POST /academics/search
        { "query": "What is the minimum attendance requirement?" }
    """
    if is_blank_query(request.query):
        raise HTTPException(status_code=400, detail="Query must not be empty")

    if not is_initialized():
        raise HTTPException(
            status_code=503,
            detail="Semantic search index is still initializing. Please try again shortly.",
        )

    results = semantic_search(request.query, top_k=request.top_k)

    return SearchResponse(query=request.query, results=results)


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard_route() -> DashboardResponse:
    """
    Return the student's academics dashboard data: overall attendance,
    upcoming classes, and pending assignments.

    Returns 500 if the underlying data file is missing or malformed.

    Example:
        GET /academics/dashboard
    """
    try:
        return get_dashboard_data()
    except (FileNotFoundError, ValueError) as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc