# backend/mcp/library/main.py

"""
Main entrypoint for the Library MCP server.
Initializes the FastAPI app and registers all routes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import router as library_router

app = FastAPI(
    title="Library MCP Server",
    description="Tool layer exposing library data to the AI orchestration system.",
    version="1.0.0",
)

# Allow the AI orchestrator / frontend to call this service during development.
# Tighten allow_origins in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register library routes
app.include_router(library_router, prefix="/library", tags=["Library"])


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Simple health check endpoint to verify the server is running."""
    return {"status": "ok", "service": "library-mcp"}