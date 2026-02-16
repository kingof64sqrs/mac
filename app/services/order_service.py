import json
import random
import string
from datetime import datetime

from app.core.exceptions import DatabaseException, NotFoundException
from app.core.logging import get_logger
from app.models.order import (
    Order,
    OrderCreate,
    OrderStatistics,
    OrderStatus,
    OrderUpdate,
)

logger = get_logger(__name__)


class OrderService:
    """Service for order operations"""

    def __init__(self, client):
        self.client = client
        self.collection = client.collections.get("Order")

    def _generate_order_number(self) -> str:
        """Generate unique order number"""
        timestamp = datetime.utcnow().strftime("%Y%m%d")
        random_str = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"ORD-{timestamp}-{random_str}"

    def create_order(self, order: OrderCreate) -> Order:
        """Create a new order"""
        try:
            now = datetime.utcnow().isoformat()
            order_dict = order.model_dump()

            # Convert items to dict for storage and serialize to JSON
            items_list = [item.model_dump() for item in order.items]
            order_dict["items_json"] = json.dumps(items_list)
            order_dict.pop("items")

            order_dict["order_number"] = self._generate_order_number()
            order_dict["created_at"] = now
            order_dict["updated_at"] = now

            uuid = self.collection.data.insert(order_dict)

            # Return with items deserialized
            result_dict = order_dict.copy()
            result_dict["items"] = items_list
            result_dict.pop("items_json")
            return Order(id=str(uuid), **result_dict)
        except Exception as e:
            logger.error(f"Error creating order: {e}")
            raise DatabaseException(f"Failed to create order: {e!s}")

    def get_order(self, order_id: str) -> Order:
        """Get order by ID"""
        try:
            obj = self.collection.query.fetch_object_by_id(order_id)

            if not obj:
                raise NotFoundException(f"Order with ID {order_id} not found")

            props = obj.properties
            # Deserialize items_json to items
            if "items_json" in props:
                props["items"] = json.loads(props.pop("items_json"))
            return Order(id=str(obj.uuid), **props)
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error fetching order: {e}")
            raise DatabaseException(f"Failed to fetch order: {e!s}")

    def get_order_by_number(self, order_number: str) -> Order:
        """Get order by order number"""
        try:
            result = self.collection.query.fetch_objects(limit=100)

            for obj in result.objects:
                if obj.properties.get("order_number") == order_number:
                    props = obj.properties
                    # Deserialize items_json to items
                    if "items_json" in props:
                        props["items"] = json.loads(props.pop("items_json"))
                    return Order(id=str(obj.uuid), **props)

            raise NotFoundException(f"Order with number {order_number} not found")
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error fetching order by number: {e}")
            raise DatabaseException(f"Failed to fetch order: {e!s}")

    def list_orders(
        self,
        page: int = 1,
        page_size: int = 20,
        status: OrderStatus | None = None,
        customer_email: str | None = None,
    ) -> tuple:
        """List orders with pagination and filters"""
        try:
            result = self.collection.query.fetch_objects(
                limit=page_size,
                offset=(page - 1) * page_size,
            )

            orders = []
            for obj in result.objects:
                props = obj.properties
                # Apply filters
                if status and props.get("status") != status.value:
                    continue
                if customer_email and props.get("customer_email") != customer_email:
                    continue

                # Deserialize items_json to items
                if "items_json" in props:
                    props["items"] = json.loads(props.pop("items_json"))
                orders.append(Order(id=str(obj.uuid), **props))

            total = len(orders) + (page - 1) * page_size
            if len(result.objects) == page_size:
                total = page * page_size + 1

            return orders, total
        except Exception as e:
            logger.error(f"Error listing orders: {e}")
            raise DatabaseException(f"Failed to list orders: {e!s}")

    def update_order(self, order_id: str, order_update: OrderUpdate) -> Order:
        """Update order"""
        try:
            existing = self.collection.query.fetch_object_by_id(order_id)
            if not existing:
                raise NotFoundException(f"Order with ID {order_id} not found")

            update_data = {k: v for k, v in order_update.model_dump().items() if v is not None}

            if not update_data:
                props = existing.properties
                # Deserialize items_json to items
                if "items_json" in props:
                    props["items"] = json.loads(props.pop("items_json"))
                return Order(id=order_id, **props)

            # Convert status enum to string if present
            if "status" in update_data:
                update_data["status"] = update_data["status"].value

            # Convert items to JSON string if present
            if "items" in update_data:
                update_data["items_json"] = json.dumps([item.model_dump() if hasattr(item, "model_dump") else item for item in update_data["items"]])
                update_data.pop("items")

            update_data["updated_at"] = datetime.utcnow().isoformat()

            self.collection.data.update(
                uuid=order_id,
                properties=update_data,
            )

            updated_obj = self.collection.query.fetch_object_by_id(order_id)

            props = updated_obj.properties
            # Deserialize items_json to items
            if "items_json" in props:
                props["items"] = json.loads(props.pop("items_json"))
            return Order(id=order_id, **props)
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error updating order: {e}")
            raise DatabaseException(f"Failed to update order: {e!s}")

    def delete_order(self, order_id: str) -> bool:
        """Delete order"""
        try:
            existing = self.collection.query.fetch_object_by_id(order_id)
            if not existing:
                raise NotFoundException(f"Order with ID {order_id} not found")

            self.collection.data.delete_by_id(order_id)
            return True
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Error deleting order: {e}")
            raise DatabaseException(f"Failed to delete order: {e!s}")

    def get_statistics(self) -> OrderStatistics:
        """Get order statistics"""
        try:
            result = self.collection.query.fetch_objects(limit=10000)

            stats = {
                "total_orders": 0,
                "pending_orders": 0,
                "processing_orders": 0,
                "shipped_orders": 0,
                "delivered_orders": 0,
                "cancelled_orders": 0,
                "total_revenue": 0.0,
            }

            for obj in result.objects:
                props = obj.properties
                stats["total_orders"] += 1

                status = props.get("status", "")
                if status == OrderStatus.PENDING.value:
                    stats["pending_orders"] += 1
                elif status == OrderStatus.PROCESSING.value:
                    stats["processing_orders"] += 1
                elif status == OrderStatus.SHIPPED.value:
                    stats["shipped_orders"] += 1
                elif status == OrderStatus.DELIVERED.value:
                    stats["delivered_orders"] += 1
                    stats["total_revenue"] += props.get("total", 0)
                elif status == OrderStatus.CANCELLED.value:
                    stats["cancelled_orders"] += 1

            return OrderStatistics(**stats)
        except Exception as e:
            logger.error(f"Error getting order statistics: {e}")
            raise DatabaseException(f"Failed to get order statistics: {e!s}")
