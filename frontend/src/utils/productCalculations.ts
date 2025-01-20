export interface Order {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    role: string;
  };
  address: {
    _id: string;
    street: string;
    city: string;
    province: string;
    district: string;
    postalCode: string;
    country: string;
  };
  products: {
    productId: {
      _id: string;
    };
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  status: string;
  createdAt: string;
  reason: string | null;
  paymentMethod: string | null;
}
export interface Review {
  _id: string;
  name: string;
  fullName: string;
  content: string;
  rating: number;
  image: string[];
  date: string;
  createdAt: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  reviews: Review[];
  // Add any other relevant fields
}

// Calculate total sales for a product
export const calculateTotalSales = (
  product: IProduct,
  orders: Order[]
): number => {
  return orders
    .filter((order) => order.status === "order-delivered")
    .flatMap((order) => order.products)
    .filter((orderProduct) => orderProduct.productId._id === product._id)
    .reduce(
      (total, orderProduct) =>
        total + (orderProduct.price * orderProduct.quantity || 0),
      0
    );
};

// Calculate the average rating of a product based on reviews
export const calculateAverageRating = (product: IProduct): number => {
  if (!product.reviews || product.reviews.length === 0) return 0;
  const totalRating = product.reviews.reduce(
    (total, review) => total + review.rating,
    0
  );
  return totalRating / product.reviews.length;
};

// Sort products by popularity: total sales, then rating
export const sortProductsByPopularity = (
  products: IProduct[],
  orders: Order[]
): IProduct[] => {
  return [...products].sort((a, b) => {
    const aSales = calculateTotalSales(a, orders);
    const bSales = calculateTotalSales(b, orders);

    if (aSales !== bSales) {
      return bSales - aSales; // Sort by total sales descending
    }

    const aRating = calculateAverageRating(a);
    const bRating = calculateAverageRating(b);

    if (aRating !== bRating) {
      return bRating - aRating; // If sales are equal, sort by rating descending
    }

    return 0; // If both sales and ratings are equal, leave as is
  });
};
