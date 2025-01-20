import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
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

const ServiceCard: React.FC<{ card: ICard }> = ({ card }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
        >
          <Card className="h-full">
            <CardContent className="p-6 space-y-4">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold">{card.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                {card.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-[90vw]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{card.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            {card.description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FeatureGrid: React.FC<{ features: ICard[] }> = ({ features }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <ServiceCard key={feature._id || index} card={feature} />
      ))}
    </div>
  );
};

const ServicesPage: React.FC = () => {
  const [service, setService] = useState<IService | null>(null);
  const [cards, setCards] = useState<ICard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const authToken = localStorage.getItem("authToken");

  const fetchService = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/service", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setService(response.data || null);
    } catch (error) {
      toast.error("Failed to load service");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCards = async () => {
    try {
      const response = await axios.get("/api/service/cards", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCards(response.data || []);
    } catch (error) {
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
          <motion.section
            id="services"
            className="py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl font-bold text-center mb-12">
              Our Services
            </h1>

            <Card className="mb-12">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/2">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <h2 className="text-2xl font-semibold mb-4">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {service.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FeatureGrid features={cards} />
            </motion.div>
          </motion.section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
