# backend/mcp/academics/services.py

"""
Business logic for the Academics MCP server.

Combines two responsibilities:
1. Semantic search over the academic handbook (embedding model + FAISS,
   built once at startup via initialize()).
2. Structured academics dashboard data (attendance, upcoming classes,
   pending assignments), loaded from a local JSON file.

semantic_search() and get_dashboard_data() are written as standalone,
importable "tools" so they can be registered directly with an AI
orchestrator (e.g. OpenAI tool calling) in addition to being used by the
FastAPI routes.
"""

from sentence_transformers import SentenceTransformer
import faiss

from schemas import (
    HandbookChunk,
    AttendanceRecord,
    UpcomingClass,
    Assignment,
    DashboardResponse,
)
from utils import (
    DATA_FILE,
    DASHBOARD_DATA_FILE,
    read_json_file,
    read_json_object,
    validate_chunk,
    is_blank_query,
)
from embeddings import (
    load_embedding_model,
    create_embeddings,
    build_faiss_index,
    embed_query,
    search_index,
)

# Module-level state, populated once via initialize().
_model: SentenceTransformer | None = None
_chunks: list[HandbookChunk] = []
_index: faiss.Index | None = None


def load_handbook_chunks() -> list[HandbookChunk]:
    """
    Load and validate all handbook chunks from the mock data source.

    Returns:
        A list of validated HandbookChunk models.

    Raises:
        FileNotFoundError: if the data file is missing.
        ValueError: if the data file is malformed, empty, or contains
            invalid chunk records.
    """
    raw_records = read_json_file(DATA_FILE)

    valid_records = [record for record in raw_records if validate_chunk(record)]

    if not valid_records:
        raise ValueError(f"No valid handbook chunks found in {DATA_FILE}")

    return [HandbookChunk(**record) for record in valid_records]


def initialize() -> None:
    """
    Build the embedding model, load handbook chunks, and construct the
    FAISS index. Intended to be called once at application startup.

    Subsequent calls are safe but unnecessary; they will rebuild state
    from scratch (useful mainly for testing).
    """
    global _model, _chunks, _index

    _model = load_embedding_model()
    _chunks = load_handbook_chunks()

    embeddings = create_embeddings(_model, _chunks)
    _index = build_faiss_index(embeddings)


def is_initialized() -> bool:
    """Return True if the model, chunks, and index have been built."""
    return _model is not None and _index is not None and len(_chunks) > 0


def semantic_search(query: str, top_k: int = 3) -> list[HandbookChunk]:
    """
    Tool: search_academic_handbook(query)

    Perform a semantic search over the academic handbook using vector
    similarity (cosine similarity via normalized embeddings + FAISS).

    Args:
        query: natural language question, e.g. "What is the attendance policy?"
        top_k: number of top matching chunks to return (default 3).

    Returns:
        List of the top_k most relevant HandbookChunk models, ordered by
        descending similarity. Empty list if the query is blank.

    Raises:
        RuntimeError: if the service has not been initialized yet
            (model/index not built).
    """
    if is_blank_query(query):
        return []

    if not is_initialized() or _model is None or _index is None:
        raise RuntimeError(
            "Academic semantic search service is not initialized. "
            "Ensure initialize() has been called at application startup."
        )

    query_embedding = embed_query(_model, query)
    matches = search_index(_index, query_embedding, top_k=top_k)

    return [_chunks[chunk_idx] for chunk_idx, _score in matches]


# --- Dashboard data ----------------------------------------------------------


def get_dashboard_data() -> DashboardResponse:
    """
    Tool: get_academics_dashboard()

    Load and return the student's academics dashboard data: overall
    attendance, today's upcoming classes, and pending assignments.

    Returns:
        A validated DashboardResponse model.

    Raises:
        FileNotFoundError: if the data file is missing.
        ValueError: if the data file is malformed or fails validation.
    """
    raw = read_json_object(DASHBOARD_DATA_FILE)

    try:
        attendance = AttendanceRecord(**raw["attendance"])
        classes = [UpcomingClass(**cls) for cls in raw.get("classes", [])]
        assignments = [Assignment(**asg) for asg in raw.get("assignments", [])]
    except Exception as exc:
        raise ValueError(f"Invalid academics dashboard data in {DASHBOARD_DATA_FILE}: {exc}") from exc

    return DashboardResponse(attendance=attendance, classes=classes, assignments=assignments)