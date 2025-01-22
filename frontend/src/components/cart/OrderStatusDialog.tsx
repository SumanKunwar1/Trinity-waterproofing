import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie-player";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import successAnimation from "../../animations/success.json";
import failAnimation from "../../animations/fail.json";

interface OrderStatusDialogProps {
  success: boolean;
  orderId?: string;
  error?: string;
}

const OrderStatusDialog: React.FC<OrderStatusDialogProps> = ({
  success,
  orderId,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
      navigate(success ? "/customer/purchase-history" : "/checkout");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, success]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto mb-4 w-32 h-32">
            <Lottie
              loop
              animationData={success ? successAnimation : failAnimation}
              play
              style={{ width: 128, height: 128 }}
            />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {success ? "Order Placed Successfully!" : "Order Placement Failed"}
          </h2>
          <p className="mb-4">
            {success
              ? `Thank you for your order. Your order ID is: ${orderId}`
              : `We're sorry, but there was an error placing your order: ${error}`}
          </p>
          <Button asChild onClick={() => setIsOpen(false)}>
            <a href={success ? "/customer/purchase-history" : "/checkout"}>
              {success ? "View Your Orders" : "Try Again"}
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderStatusDialog;
