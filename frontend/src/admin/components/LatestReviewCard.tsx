import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

interface Review {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface LatestReviewCardProps {
  review: Review | null;
}

const LatestReviewCard: React.FC<LatestReviewCardProps> = ({ review }) => {
  if (!review) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Review</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Product:</strong> {review.productName}
        </p>
        <p>
          <strong>Customer:</strong> {review.customerName}
        </p>
        <p>
          <strong>Rating:</strong> {review.rating} / 5
        </p>
        <p>
          <strong>Comment:</strong> {review.comment}
        </p>
        <p>
          <strong>Date:</strong> {new Date(review.createdAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default LatestReviewCard;
