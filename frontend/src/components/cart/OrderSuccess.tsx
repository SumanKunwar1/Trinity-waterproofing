import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie-player";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import successAnimation from "../../animations/success.json";

const OrderSuccess: React.FC<{ orderId: string }> = ({ orderId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
      navigate("/customer/purchase-history");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto mb-4 w-32 h-32">
            <Lottie
              loop
              animationData={successAnimation}
              play
              style={{ width: 128, height: 128 }}
            />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Order Placed Successfully!
          </h2>
          <p className="mb-4">
            Thank you for your order. Your order ID is: {orderId}
          </p>
          <Button asChild onClick={() => setIsOpen(false)}>
            <a href="/customer/purchase-history">View Your Orders</a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderSuccess;
