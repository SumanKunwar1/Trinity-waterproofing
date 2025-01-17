import { Link } from "react-router-dom";
import { FeaturedProductsHeaderProps } from "../../types/featuredHeader";

const FeaturedProductsHeader: React.FC<FeaturedProductsHeaderProps> = ({
  title = "Featured Products",
  link,
}) => {
  return (
    <div className="relative flex items-center w-full mb-10">
      <h2 className="text-2xl font-bold w-full text-center">{title}</h2>
      {link && (
        <Link
          to="/products/"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:underline"
        >
          See All
        </Link>
      )}
    </div>
  );
};

export default FeaturedProductsHeader;
