from datetime import datetime

from app.core.exceptions import DatabaseException, NotFoundException
from app.core.logging import get_logger
from app.models.section import Section, SectionCreate, SectionUpdate

logger = get_logger(__name__)


class SectionService:
    """Service for section operations"""

    def __init__(self, client):
        self.client = client
        self.collection = client.collections.get("Section")

    def create_section(self, section: SectionCreate) -> Section:
        """Create a new section"""
        try:
            now = datetime.utcnow().isoformat()
            section_dict = section.model_dump()
            section_dict["created_at"] = now
            section_dict["updated_at"] = now

            uuid = self.collection.data.insert(section_dict)

            return Section(id=str(uuid), **section_dict)
        except Exception as e:
            logger.error(f"Error creating section: {e}")
            raise DatabaseException(f"Failed to create section: {e!s}")

    def get_section(self, section_id: str) -> Section:
        """Get section by ID"""
        try:
            obj = self.collection.query.fetch_object_by_id(section_id)

            if not obj:
                raise NotFoundException(f"Section with ID {section_id} not found")

            return Section(id=str(obj.uuid), **obj.properties)
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error fetching section: {e}")
            raise DatabaseException(f"Failed to fetch section: {e!s}")

    def list_sections(self, page: int = 1, page_size: int = 20, parent_id: str | None = None) -> tuple:
        """List all sections with pagination"""
        try:
            if parent_id:
                # Filter by parent section
                result = self.collection.query.fetch_objects(
                    limit=page_size,
                    offset=(page - 1) * page_size,
                    filters={"parent_section_id": parent_id},
                )
            else:
                result = self.collection.query.fetch_objects(
                    limit=page_size,
                    offset=(page - 1) * page_size,
                )

            sections = [Section(id=str(obj.uuid), **obj.properties) for obj in result.objects]

            # Get total count (approximate)
            total = len(result.objects) + (page - 1) * page_size
            if len(result.objects) == page_size:
                total = page * page_size + 1  # Estimate more exist

            return sections, total
        except Exception as e:
            logger.error(f"Error listing sections: {e}")
            raise DatabaseException(f"Failed to list sections: {e!s}")

    def update_section(self, section_id: str, section_update: SectionUpdate) -> Section:
        """Update section"""
        try:
            # Check if exists
            existing = self.collection.query.fetch_object_by_id(section_id)
            if not existing:
                raise NotFoundException(f"Section with ID {section_id} not found")

            # Prepare update data
            update_data = {k: v for k, v in section_update.model_dump().items() if v is not None}

            if not update_data:
                return Section(id=section_id, **existing.properties)

            update_data["updated_at"] = datetime.utcnow().isoformat()

            # Update
            self.collection.data.update(
                uuid=section_id,
                properties=update_data,
            )

            # Fetch updated
            updated_obj = self.collection.query.fetch_object_by_id(section_id)

            return Section(id=section_id, **updated_obj.properties)
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error updating section: {e}")
            raise DatabaseException(f"Failed to update section: {e!s}")

    def delete_section(self, section_id: str) -> bool:
        """Delete section"""
        try:
            # Check if exists
            existing = self.collection.query.fetch_object_by_id(section_id)
            if not existing:
                raise NotFoundException(f"Section with ID {section_id} not found")

            self.collection.data.delete_by_id(section_id)
            return True
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error deleting section: {e}")
            raise DatabaseException(f"Failed to delete section: {e!s}")
