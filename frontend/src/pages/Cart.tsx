import { useCart } from "../context/CartContext";
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/cart/OrderSummary";
import Button from "../components/common/Button";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/3 md:pr-8">
                {cart.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onRemove={() => removeFromCart(item._id)}
                    onUpdateQuantity={(quantity) =>
                      updateQuantity(item._id, quantity)
                    }
                  />
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
                  to="/checkout"
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
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
