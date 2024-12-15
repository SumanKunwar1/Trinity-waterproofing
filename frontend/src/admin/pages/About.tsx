import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Using ShadCN Card */}
      <Card>
        <CardHeader>
          <CardTitle>About WaterproofStore</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            WaterproofStore is your one-stop shop for all waterproofing needs.
            Founded in 2010, we've been providing high-quality waterproof
            products and solutions to both individual consumers and businesses
            for over a decade.
          </p>
          <p className="mb-4">
            Our mission is to deliver innovative waterproofing solutions that
            protect and preserve. We believe in the power of quality products,
            exceptional customer service, and continuous innovation.
          </p>
          <p className="mb-4">
            With a wide range of products including waterproof paints, sealants,
            membranes, and coatings, we cater to various industries such as
            construction, automotive, marine, and more. Our team of experts is
            always ready to assist you in finding the perfect solution for your
            waterproofing needs.
          </p>
          <p>
            At WaterproofStore, we're not just selling products; we're providing
            peace of mind. Trust us to keep you dry and protected, no matter the
            elements.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default About;
