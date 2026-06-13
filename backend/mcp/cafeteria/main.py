# backend/mcp/cafeteria/main.py

"""
Main entrypoint for the Cafeteria MCP server.
Initializes the FastAPI app and registers all routes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import router as cafeteria_router

app = FastAPI(
    title="Cafeteria MCP Server",
    description="Cafeteria intelligence layer exposing daily menu data to the AI orchestration system.",
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

# Register cafeteria routes
app.include_router(cafeteria_router, prefix="/cafeteria", tags=["Cafeteria"])


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Simple health check endpoint to verify the server is running."""
    return {"status": "Cafeteria MCP running"}