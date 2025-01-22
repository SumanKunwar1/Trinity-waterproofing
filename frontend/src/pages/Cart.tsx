import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/cart/OrderSummary";
import { Button } from "../components/ui/button";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import emptyCartAnimation from "../animations/cart.json";

const Cart: React.FC = () => {
  const { cart, isLoading, clearCart } = useCart();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    const checkoutData = cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      selectedColor: item.color || null,
    }));
    navigate("/checkout", { state: { checkoutData } });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <Loader />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          {cart.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Looks like you haven't added any items to your cart yet. Start shopping and discover amazing products!"
              buttonText="Start Shopping"
              buttonAction={() => navigate("/products")}
              animationData={emptyCartAnimation}
            />
          ) : (
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/3 md:pr-8">
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
                <Button
                  onClick={clearCart}
                  className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Clear Cart
                </Button>
              </div>
              <div className="w-full md:w-1/3 mt-8 md:mt-0">
                <OrderSummary cartItems={cart} />
                <Button
                  onClick={handleProceedToCheckout}
                  variant="secondary"
                  className="mt-4 w-full"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
