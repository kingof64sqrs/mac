import math

from fastapi import APIRouter, Depends, Query, status

from app.db.weaviate_client import get_weaviate_client
from app.models.common import MessageResponse, PaginatedResponse
from app.models.product import Product, ProductCreate, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter()


def get_service(client=Depends(get_weaviate_client)):
    return ProductService(client)


@router.post("", response_model=Product, status_code=status.HTTP_201_CREATED, tags=["Admin - Products"])
async def create_product(
    product: ProductCreate,
    service: ProductService = Depends(get_service),
):
    """Create a new product"""
    return service.create_product(product)


@router.get("", response_model=PaginatedResponse[Product], tags=["Admin - Products"])
async def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_id: str | None = None,
    section_id: str | None = None,
    is_active: bool | None = None,
    featured: bool | None = None,
    service: ProductService = Depends(get_service),
):
    """List all products with pagination and filters"""
    products, total = service.list_products(
        page, page_size, category_id, section_id, is_active, featured,
    )

    return PaginatedResponse(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total > 0 else 0,
        data=products,
    )


@router.get("/search", response_model=list[Product], tags=["Admin - Products"])
async def search_products(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    service: ProductService = Depends(get_service),
):
    """Search products using semantic search"""
    return service.search_products(q, limit)


@router.get("/{product_id}", response_model=Product, tags=["Admin - Products"])
async def get_product(
    product_id: str,
    service: ProductService = Depends(get_service),
):
    """Get product by ID"""
    return service.get_product(product_id)


@router.put("/{product_id}", response_model=Product, tags=["Admin - Products"])
async def update_product(
    product_id: str,
    product: ProductUpdate,
    service: ProductService = Depends(get_service),
):
    """Update product"""
    return service.update_product(product_id, product)


@router.delete("/{product_id}", response_model=MessageResponse, tags=["Admin - Products"])
async def delete_product(
    product_id: str,
    service: ProductService = Depends(get_service),
):
    """Delete product"""
    service.delete_product(product_id)
    return MessageResponse(message="Product deleted successfully", id=product_id)
