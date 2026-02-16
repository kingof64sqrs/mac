from fastapi import APIRouter

from app.core.config import get_settings
from app.db.schema import check_schema
from app.db.weaviate_client import get_weaviate_client
from app.models.common import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    settings = get_settings()

    try:
        client = get_weaviate_client()
        weaviate_connected = check_schema(client)
    except:
        weaviate_connected = False

    return HealthResponse(
        status="healthy" if weaviate_connected else "degraded",
        version=settings.APP_VERSION,
        weaviate_connected=weaviate_connected,
    )
