import json
from datetime import datetime

from app.core.exceptions import DatabaseException, NotFoundException
from app.core.logging import get_logger
from app.models.product import Product, ProductCreate, ProductUpdate

logger = get_logger(__name__)


class ProductService:
    """Service for product operations"""

    def __init__(self, client):
        self.client = client
        self.collection = client.collections.get("Product")

    def create_product(self, product: ProductCreate) -> Product:
        """Create a new product"""
        try:
            now = datetime.utcnow().isoformat()
            product_dict = product.model_dump()

            # Generate slug if not provided
            if not product_dict.get("slug"):
                product_dict["slug"] = product_dict["name"].lower().replace(" ", "-")

            # Convert attributes dict to JSON string
            if "attributes" in product_dict:
                product_dict["attributes_json"] = json.dumps(product_dict.pop("attributes"))

            product_dict["created_at"] = now
            product_dict["updated_at"] = now

            uuid = self.collection.data.insert(product_dict)

            # Return with attributes as dict
            result_dict = product_dict.copy()
            if "attributes_json" in result_dict:
                result_dict["attributes"] = json.loads(result_dict.pop("attributes_json"))

            return Product(id=str(uuid), **result_dict)
        except Exception as e:
            logger.error(f"Error creating product: {e}")
            raise DatabaseException(f"Failed to create product: {e!s}")

    def get_product(self, product_id: str) -> Product:
        """Get product by ID"""
        try:
            obj = self.collection.query.fetch_object_by_id(product_id)

            if not obj:
                raise NotFoundException(f"Product with ID {product_id} not found")

            props = {k: str(v) if hasattr(v, "hex") else v for k, v in obj.properties.items()}
            # Deserialize attributes_json to attributes
            if "attributes_json" in props:
                props["attributes"] = json.loads(props.pop("attributes_json"))
            return Product(id=str(obj.uuid), **props)
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error fetching product: {e}")
            raise DatabaseException(f"Failed to fetch product: {e!s}")

    def list_products(
        self,
        page: int = 1,
        page_size: int = 20,
        category_id: str | None = None,
        section_id: str | None = None,
        is_active: bool | None = None,
        featured: bool | None = None,
    ) -> tuple:
        """List products with pagination and filters"""
        try:
            result = self.collection.query.fetch_objects(
                limit=page_size,
                offset=(page - 1) * page_size,
            )

            products = []
            for obj in result.objects:
                props = obj.properties
                # Apply filters
                if category_id and props.get("category_id") != category_id:
                    continue
                if section_id and props.get("section_id") != section_id:
                    continue
                if is_active is not None and props.get("is_active") != is_active:
                    continue
                if featured is not None and props.get("featured") != featured:
                    continue

                # Convert UUID fields to strings
                props = {k: str(v) if hasattr(v, "hex") else v for k, v in props.items()}
                # Deserialize attributes_json to attributes
                if "attributes_json" in props:
                    props["attributes"] = json.loads(props.pop("attributes_json"))
                products.append(Product(id=str(obj.uuid), **props))

            total = len(products) + (page - 1) * page_size
            if len(result.objects) == page_size:
                total = page * page_size + 1

            return products, total
        except Exception as e:
            logger.error(f"Error listing products: {e}")
            raise DatabaseException(f"Failed to list products: {e!s}")

    def update_product(self, product_id: str, product_update: ProductUpdate) -> Product:
        """Update product"""
        try:
            existing = self.collection.query.fetch_object_by_id(product_id)
            if not existing:
                raise NotFoundException(f"Product with ID {product_id} not found")

            update_data = {k: v for k, v in product_update.model_dump().items() if v is not None}

            if not update_data:
                props = {k: str(v) if hasattr(v, "hex") else v for k, v in existing.properties.items()}
                # Deserialize attributes_json to attributes
                if "attributes_json" in props:
                    props["attributes"] = json.loads(props.pop("attributes_json"))
                return Product(id=product_id, **props)

            # Convert attributes dict to JSON string if present
            if "attributes" in update_data:
                update_data["attributes_json"] = json.dumps(update_data.pop("attributes"))

            update_data["updated_at"] = datetime.utcnow().isoformat()

            self.collection.data.update(
                uuid=product_id,
                properties=update_data,
            )

            updated_obj = self.collection.query.fetch_object_by_id(product_id)

            props = {k: str(v) if hasattr(v, "hex") else v for k, v in updated_obj.properties.items()}
            # Deserialize attributes_json to attributes
            if "attributes_json" in props:
                props["attributes"] = json.loads(props.pop("attributes_json"))
            return Product(id=product_id, **props)
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error updating product: {e}")
            raise DatabaseException(f"Failed to update product: {e!s}")

    def delete_product(self, product_id: str) -> bool:
        """Delete product"""
        try:
            existing = self.collection.query.fetch_object_by_id(product_id)
            if not existing:
                raise NotFoundException(f"Product with ID {product_id} not found")

            self.collection.data.delete_by_id(product_id)
            return True
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error deleting product: {e}")
            raise DatabaseException(f"Failed to delete product: {e!s}")

    def search_products(self, query: str, limit: int = 10) -> list[Product]:
        """Search products using vector search"""
        try:
            result = self.collection.query.near_text(
                query=query,
                limit=limit,
            )

            products = []
            for obj in result.objects:
                props = {k: str(v) if hasattr(v, "hex") else v for k, v in obj.properties.items()}
                # Deserialize attributes_json to attributes
                if "attributes_json" in props:
                    props["attributes"] = json.loads(props.pop("attributes_json"))
                products.append(Product(id=str(obj.uuid), **props))
            return products
        except Exception as e:
            logger.error(f"Error searching products: {e}")
            raise DatabaseException(f"Failed to search products: {e!s}")
