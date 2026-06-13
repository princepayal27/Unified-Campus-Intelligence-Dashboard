# backend/mcp/academics/main.py

"""
Main entrypoint for the Academic Handbook Semantic Search MCP server.

Initializes the FastAPI app, registers routes, and builds the embedding
model + FAISS index once at startup so that search requests are fast and
do not trigger redundant model loads or index rebuilds.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import router as academics_router
import services


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup hook: load the embedding model, handbook chunks, and build
    the FAISS index once before the server starts accepting requests.
    """
    services.initialize()
    yield
    # No teardown required; in-memory state is released on process exit.


app = FastAPI(
    title="Academic Handbook Semantic Search MCP Server",
    description="Academic knowledge retrieval layer using embeddings + FAISS for the AI orchestration system.",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow the AI orchestrator / frontend to call this service during development.
# Tighten allow_origins in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register academic search routes
app.include_router(academics_router, prefix="/academics", tags=["Academics"])


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Simple health check endpoint to verify the server is running."""
    return {"status": "Academic Semantic Search MCP running"}