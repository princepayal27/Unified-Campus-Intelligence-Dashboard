# backend/mcp/academics/embeddings.py

"""
Embedding and FAISS index management for the Academic Handbook
Semantic Search MCP server.

The embedding model and FAISS index are built once at startup and kept
in memory (via module-level globals managed by services.py) to avoid
expensive reloading/rebuilding on every request.
"""

import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

from schemas import HandbookChunk
from utils import preprocess_text

EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


def load_embedding_model() -> SentenceTransformer:
    """
    Load the sentence-transformers embedding model.

    Returns:
        A SentenceTransformer instance ready to encode text.
    """
    return SentenceTransformer(EMBEDDING_MODEL_NAME)


def create_embeddings(model: SentenceTransformer, chunks: list[HandbookChunk]) -> np.ndarray:
    """
    Generate normalized embeddings for a list of handbook chunks.

    Embeds the combination of section title + content so that the
    section heading contributes to semantic matching.

    Args:
        model: a loaded SentenceTransformer model.
        chunks: list of HandbookChunk models to embed.

    Returns:
        A 2D numpy array of shape (num_chunks, embedding_dim), L2-normalized
        so that inner-product search is equivalent to cosine similarity.
    """
    texts = [preprocess_text(f"{chunk.section}. {chunk.content}") for chunk in chunks]

    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        show_progress_bar=False,
    )

    embeddings = embeddings.astype("float32")
    faiss.normalize_L2(embeddings)

    return embeddings


def build_faiss_index(embeddings: np.ndarray) -> faiss.Index:
    """
    Build a FAISS index for fast similarity search over chunk embeddings.

    Uses an inner-product index over L2-normalized vectors, which is
    equivalent to cosine similarity search.

    Args:
        embeddings: L2-normalized embeddings of shape (num_chunks, embedding_dim).

    Returns:
        A populated faiss.IndexFlatIP instance.
    """
    if embeddings.ndim != 2:
        raise ValueError(f"Expected 2D embeddings array, got shape {embeddings.shape}")

    embedding_dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(embedding_dim)
    index.add(embeddings)

    return index


def embed_query(model: SentenceTransformer, query: str) -> np.ndarray:
    """
    Generate a normalized embedding for a single user query.

    Args:
        model: a loaded SentenceTransformer model.
        query: the user's natural language query.

    Returns:
        A 2D numpy array of shape (1, embedding_dim), L2-normalized,
        ready to be passed to faiss.Index.search().
    """
    cleaned_query = preprocess_text(query)

    embedding = model.encode(
        [cleaned_query],
        convert_to_numpy=True,
        show_progress_bar=False,
    )

    embedding = embedding.astype("float32")
    faiss.normalize_L2(embedding)

    return embedding


def search_index(
    index: faiss.Index,
    query_embedding: np.ndarray,
    top_k: int = 3,
) -> list[tuple[int, float]]:
    """
    Perform a nearest-neighbor search over the FAISS index.

    Args:
        index: a populated faiss.IndexFlatIP instance.
        query_embedding: a (1, embedding_dim) normalized query embedding.
        top_k: number of nearest neighbors to return.

    Returns:
        List of (chunk_index, similarity_score) tuples, ordered by
        descending similarity. chunk_index of -1 (no match) is filtered out.
    """
    effective_k = min(top_k, index.ntotal)

    if effective_k <= 0:
        return []

    scores, indices = index.search(query_embedding, effective_k)

    results: list[tuple[int, float]] = []
    for idx, score in zip(indices[0], scores[0]):
        if idx == -1:
            continue
        results.append((int(idx), float(score)))

    return results