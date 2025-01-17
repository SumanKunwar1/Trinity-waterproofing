import { useLocation, Link } from "react-router-dom";
import { Button } from "../ui/button";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import failureImage from "/assets/fail.png"; // Add the failure image to your assets folder

const OrderFailure: React.FC = () => {
  const location = useLocation();
  const error = location.state?.error || "An unknown error occurred";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center">
          <img
            src={failureImage}
            alt="Failure"
            className="mx-auto mb-4 w-32 h-32 object-cover"
          />
          <h1 className="text-3xl font-bold mb-4">Order Placement Failed</h1>
          <p className="mb-4">
            We're sorry, but there was an error placing your order: {error}
          </p>
          <Button asChild>
            <Link to="/checkout">Try Again</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderFailure;
