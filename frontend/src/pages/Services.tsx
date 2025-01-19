import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import FeatureSection from "../components/ui/feature-section";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ImageContentSection from "../components/common/ImageContentSection";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "../components/common/Loader";

interface ICard {
  _id?: string;
  title: string;
  description: string;
  image: string;
}

interface IService {
  _id?: string;
  title: string;
  description: string;
  image: string;
}

const ServicesPage: React.FC = () => {
  const [service, setService] = useState<IService | null>(null);
  const [cards, setCards] = useState<ICard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem("authToken");

  // Fetch service data
  const fetchService = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/service", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setService(response.data || null);
    } catch (error) {
      // console.error("Error fetching service:", error);
      toast.error("Failed to load service");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cards for the service
  const fetchCards = async () => {
    try {
      const response = await axios.get("/api/service/cards", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCards(response.data || []);
    } catch (error) {
      // console.error("Error fetching cards:", error);
      toast.error("Failed to load cards");
    }
  };

  useEffect(() => {
    fetchService();
    fetchCards();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!service) {
    return <div>No service data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Our Services Section */}
          <motion.section
            id="services"
            className="py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl font-bold text-center mb-8">
              Our Services
            </h1>
            <Card className="overflow-hidden mb-12">
              <CardContent className="p-8">
                <ImageContentSection
                  imagePosition="left"
                  imageUrl={service.image}
                  content={
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">
                        {service.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {service.description}
                      </p>
                    </div>
                  }
                />
              </CardContent>
            </Card>

            {/* Feature Section (Cards Section) */}
            <FeatureSection features={cards} className="gap-8" />
          </motion.section>

          {/* Detailed Service Sections (Left-Right pattern) */}
          {cards.map((card, index) => (
            <motion.section
              key={card._id || index}
              className="py-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-center mb-8">
                {card.title}
              </h2>
              <Card>
                <CardContent className="p-6">
                  <ImageContentSection
                    imagePosition={index % 2 === 0 ? "left" : "right"}
                    imageUrl={card.image}
                    content={
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {card.description}
                        </p>
                      </div>
                    }
                  />
                </CardContent>
              </Card>
            </motion.section>
          ))}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
