import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Category } from "../../types/category";
import Loader from "../common/Loader";

const FeaturedCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(4); // Initially show 4 items
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleNavigateCategory = (categoryId: string) => {
    window.location.href = `/products/${categoryId}`;
  };

  const handleViewMore = () => {
    setVisibleCount(categories.length); // Show all items
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Waterproofing Solutions for Every Need
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.slice(0, visibleCount).map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div
                onClick={() => handleNavigateCategory(category._id)}
                className="block p-6 bg-gray-50 rounded-lg hover:bg-tertiary transition-colors cursor-pointer"
              >
                <div className="flex flex-row items-center align-middle space-x-2">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white text-xl font-bold rounded-full mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 flex flex-wrap">
                    {category.name}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {category.description || "Explore our products"}
                </p>
                <span className="inline-flex items-center mt-4 text-blue-600 group-hover:translate-x-1 transition-transform">
                  View Products
                  <svg
                    className="w-4 h-4 ml-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {visibleCount < categories.length && (
          <div className="text-center mt-8">
            <button
              onClick={handleViewMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCategories;
