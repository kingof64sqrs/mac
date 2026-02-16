from datetime import datetime

from app.core.exceptions import DatabaseException, NotFoundException
from app.core.logging import get_logger
from app.models.category import Category, CategoryCreate, CategoryUpdate

logger = get_logger(__name__)


class CategoryService:
    """Service for category operations"""

    def __init__(self, client):
        self.client = client
        self.collection = client.collections.get("Category")

    def create_category(self, category: CategoryCreate) -> Category:
        """Create a new category"""
        try:
            now = datetime.utcnow().isoformat()
            category_dict = category.model_dump()

            # Generate slug if not provided
            if not category_dict.get("slug"):
                category_dict["slug"] = category_dict["name"].lower().replace(" ", "-")

            category_dict["created_at"] = now
            category_dict["updated_at"] = now

            uuid = self.collection.data.insert(category_dict)

            return Category(id=str(uuid), **category_dict)
        except Exception as e:
            logger.error(f"Error creating category: {e}")
            raise DatabaseException(f"Failed to create category: {e!s}")

    def get_category(self, category_id: str) -> Category:
        """Get category by ID"""
        try:
            obj = self.collection.query.fetch_object_by_id(category_id)

            if not obj:
                raise NotFoundException(f"Category with ID {category_id} not found")

            return Category(id=str(obj.uuid), **obj.properties)
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error fetching category: {e}")
            raise DatabaseException(f"Failed to fetch category: {e!s}")

    def list_categories(self, page: int = 1, page_size: int = 20, parent_id: str | None = None) -> tuple:
        """List all categories with pagination"""
        try:
            result = self.collection.query.fetch_objects(
                limit=page_size,
                offset=(page - 1) * page_size,
            )

            categories = [Category(id=str(obj.uuid), **obj.properties) for obj in result.objects]

            # Filter by parent if specified
            if parent_id is not None:
                categories = [c for c in categories if c.parent_category_id == parent_id]

            total = len(categories) + (page - 1) * page_size
            if len(result.objects) == page_size:
                total = page * page_size + 1

            return categories, total
        except Exception as e:
            logger.error(f"Error listing categories: {e}")
            raise DatabaseException(f"Failed to list categories: {e!s}")

    def update_category(self, category_id: str, category_update: CategoryUpdate) -> Category:
        """Update category"""
        try:
            existing = self.collection.query.fetch_object_by_id(category_id)
            if not existing:
                raise NotFoundException(f"Category with ID {category_id} not found")

            update_data = {k: v for k, v in category_update.model_dump().items() if v is not None}

            if not update_data:
                return Category(id=category_id, **existing.properties)

            update_data["updated_at"] = datetime.utcnow().isoformat()

            self.collection.data.update(
                uuid=category_id,
                properties=update_data,
            )

            updated_obj = self.collection.query.fetch_object_by_id(category_id)

            return Category(id=category_id, **updated_obj.properties)
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error updating category: {e}")
            raise DatabaseException(f"Failed to update category: {e!s}")

    def delete_category(self, category_id: str) -> bool:
        """Delete category"""
        try:
            existing = self.collection.query.fetch_object_by_id(category_id)
            if not existing:
                raise NotFoundException(f"Category with ID {category_id} not found")

            self.collection.data.delete_by_id(category_id)
            return True
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error deleting category: {e}")
            raise DatabaseException(f"Failed to delete category: {e!s}")
