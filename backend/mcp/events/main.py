# backend/mcp/events/main.py

"""
Main entrypoint for the Events MCP server.
Initializes the FastAPI app and registers all routes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import router as events_router

app = FastAPI(
    title="Events MCP Server",
    description="Event intelligence layer exposing campus event data to the AI orchestration system.",
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

# Register event routes
app.include_router(events_router, prefix="/events", tags=["Events"])


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Simple health check endpoint to verify the server is running."""
    return {"status": "Events MCP running"}