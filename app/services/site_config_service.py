from datetime import datetime

from app.core.exceptions import DatabaseException, NotFoundException
from app.core.logging import get_logger
from app.models.site_config import SiteConfig, SiteConfigCreate, SiteConfigUpdate

logger = get_logger(__name__)


class SiteConfigService:
    """Service for site configuration operations"""

    def __init__(self, client):
        self.client = client
        self.collection = client.collections.get("SiteConfig")

    def get_config(self) -> SiteConfig:
        """Get site configuration (only one should exist)"""
        try:
            result = self.collection.query.fetch_objects(limit=1)

            if len(result.objects) == 0:
                raise NotFoundException("Site configuration not found")

            obj = result.objects[0]
            return SiteConfig(
                id=str(obj.uuid),
                **obj.properties,
            )
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error fetching site config: {e}")
            raise DatabaseException(f"Failed to fetch site configuration: {e!s}")

    def create_config(self, config: SiteConfigCreate) -> SiteConfig:
        """Create site configuration"""
        try:
            # Check if config already exists
            existing = self.collection.query.fetch_objects(limit=1)
            if len(existing.objects) > 0:
                raise DatabaseException("Site configuration already exists. Use update instead.")

            now = datetime.utcnow().isoformat()
            config_dict = config.model_dump()
            config_dict["created_at"] = now
            config_dict["updated_at"] = now

            uuid = self.collection.data.insert(config_dict)

            return SiteConfig(id=str(uuid), **config_dict)
        except Exception as e:
            logger.error(f"Error creating site config: {e}")
            raise DatabaseException(f"Failed to create site configuration: {e!s}")

    def update_config(self, config_update: SiteConfigUpdate) -> SiteConfig:
        """Update site configuration"""
        try:
            # Get existing config
            result = self.collection.query.fetch_objects(limit=1)

            if len(result.objects) == 0:
                raise NotFoundException("Site configuration not found")

            obj = result.objects[0]
            config_id = str(obj.uuid)

            # Prepare update data
            update_data = {k: v for k, v in config_update.model_dump().items() if v is not None}

            if not update_data:
                return SiteConfig(id=config_id, **obj.properties)

            update_data["updated_at"] = datetime.utcnow().isoformat()

            # Update in Weaviate
            self.collection.data.update(
                uuid=config_id,
                properties=update_data,
            )

            # Fetch updated config
            updated_obj = self.collection.query.fetch_object_by_id(config_id)

            return SiteConfig(
                id=config_id,
                **updated_obj.properties,
            )
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error updating site config: {e}")
            raise DatabaseException(f"Failed to update site configuration: {e!s}")
