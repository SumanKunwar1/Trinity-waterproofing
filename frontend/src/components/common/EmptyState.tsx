import Lottie from "react-lottie-player";
import { Button } from "../ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
  animationData: any;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  buttonText,
  buttonAction,
  animationData,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <Lottie
        loop
        animationData={animationData}
        play
        style={{ width: 200, height: 200 }}
      />
      <h2 className="mt-6 text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-gray-600 text-center max-w-md">{description}</p>
      <Button onClick={buttonAction} className="mt-6">
        {buttonText}
      </Button>
    </div>
  );
};

export default EmptyState;
