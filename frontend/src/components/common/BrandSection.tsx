import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";

interface Brand {
  _id: string;
  name: string;
  image: string;
}

const BrandSection = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brand", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBrands(data);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch brands");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 mx-4 bg-red-50 text-red-600">
        <p>Error: {error}</p>
      </Card>
    );
  }

  // Duplicate brands for infinite scroll
  const duplicatedBrands = [...brands, ...brands];

  return (
    <div className="w-full py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold">Associated Brands</h2>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="w-full overflow-hidden relative">
          <div className="flex animate-[scroll_20s_linear_infinite] hover:pause w-max">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand._id}-${index}`}
                className="w-[280px] flex-shrink-0 px-4"
              >
                <div className="aspect-square relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={brand.image}
                    alt={`${brand.name} logo`}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSection;
