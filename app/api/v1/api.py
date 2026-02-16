from fastapi import APIRouter

from app.api.v1.endpoints import (
    categories,
    health,
    orders,
    products,
    sections,
    site_config,
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(health.router, prefix="", tags=["Health"])
api_router.include_router(site_config.router, prefix="/site-config", tags=["Admin - Site Config"])
api_router.include_router(sections.router, prefix="/sections", tags=["Admin - Sections"])
api_router.include_router(categories.router, prefix="/categories", tags=["Admin - Categories"])
api_router.include_router(products.router, prefix="/products", tags=["Admin - Products"])
api_router.include_router(orders.router, prefix="/orders", tags=["Admin - Orders"])
