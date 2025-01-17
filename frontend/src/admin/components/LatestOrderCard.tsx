import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface LatestOrderCardProps {
  order: Order | null;
}

const LatestOrderCard: React.FC<LatestOrderCardProps> = ({ order }) => {
  if (!order) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Order</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Order ID:</strong> {order.id}
        </p>
        <p>
          <strong>Customer:</strong> {order.customerName}
        </p>
        <p>
          <strong>Total:</strong> ${order.total}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default LatestOrderCard;
