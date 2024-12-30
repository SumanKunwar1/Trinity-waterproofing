export enum OrderStatus {
  ORDER_REQUESTED = "order-requested",
  PAYMENT_COMPLETED = "payment-completed",
  ORDER_CONFIRMED = "order-confirmed",
  ORDER_SHIPPED = "order-shipped",
  SERVICE_COMPLETED = "service-completed",
  ORDER_CANCELLED = "order-cancelled",
  RETURN_REQUESTED = "return-requested",
  RETURN_APPROVED = "return-approved",
  RETURN_DISAPPROVED = "return-disapproved", // <-- Add this status
}
