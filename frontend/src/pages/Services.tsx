"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import FeatureSection from "../components/ui/feature-section";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ImageContentSection from "../components/common/ImageContentSection";

const ServicesPage: React.FC = () => {
  const services = [
    {
      title: "Bathroom",
      description:
        "Our experts know the right techniques to keep your bathroom watertight, preventing leaks and moisture buildup.",
      icon: "🚿",
      imageUrl: "/assets/waterproofing-1.png",
    },
    {
      title: "Terrace",
      description:
        "We apply a waterproofing membrane that ensures your terrace remains dry and long-lasting, protecting it from rain damage.",
      icon: "🏠",
      imageUrl: "/assets/waterproofing-2.jpg",
    },
    {
      title: "Swimming Pool",
      description:
        "Our specialists use high-quality materials to seal pool surfaces and prevent leaks, ensuring your pool remains in perfect condition.",
      icon: "🏊",
      imageUrl: "/assets/waterproofing-3.jpg",
    },
    {
      title: "Pest Control",
      description:
        "We specialize in eliminating termites, controlling cockroaches, and managing mice infestations with safe and effective methods.",
      icon: "🐜",
      imageUrl: "/assets/waterproofing-1.png",
    },
    {
      title: "Anti-Termite Treatment",
      description:
        "Protect your property from termite damage with our specialized treatments.",
      icon: "🪵",
      imageUrl: "/assets/waterproofing-2.jpg",
    },
    {
      title: "Expansion Joints Treatment",
      description:
        "We install flexible materials between structural gaps to accommodate movement and prevent damage & leakage.",
      icon: "🏗️",
      imageUrl: "/assets/waterproofing-3.jpg",
    },
  ];

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
            <h1 className="text-4xl font-bold text-center mb-8">
              Our Services
            </h1>
            <Card className="overflow-hidden mb-12">
              <CardContent className="p-8">
                <ImageContentSection
                  imagePosition="left"
                  imageUrl="/assets/waterproofing-1.png"
                  content={
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">
                        Comprehensive Waterproofing Solutions
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        We provide comprehensive services of building
                        waterproofing covering bathrooms, terraces, basements,
                        underground water tanks, exterior walls, etc., building
                        expansion joint treatment, structure retrofitting by FRP
                        carbon & laminates, epoxy & PU flooring & coating, and
                        pest control. Trinity is a common platform for
                        waterproofing applicators. We offer waterproofing
                        training and a knowledge-sharing program to strengthen
                        and enhance knowledge and awareness in this field.
                      </p>
                    </div>
                  }
                />
              </CardContent>
            </Card>
            <FeatureSection features={services} columns={3} className="gap-8" />
          </motion.section>

          <motion.section
            id="waterproofing"
            className="py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              Waterproofing Services
            </h2>
            <div className="space-y-12">
              {services.map((service, index) => (
                <Card key={service.title}>
                  <CardContent className="p-6">
                    <ImageContentSection
                      imagePosition={index % 2 === 0 ? "left" : "right"}
                      imageUrl={service.imageUrl}
                      content={
                        <div>
                          <h3 className="text-xl font-semibold mb-4">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {service.description}
                          </p>
                        </div>
                      }
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="pest-control"
            className="py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              Pest Control Services
            </h2>
            <Card>
              <CardContent className="p-6">
                <ImageContentSection
                  imagePosition="right"
                  imageUrl="/assets/waterproofing-2.jpg"
                  content={
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Our expert team specializes in eliminating termites,
                        controlling cockroaches, and managing mice infestations
                        with safe and effective methods. We ensure your property
                        remains pest-free, providing peace of mind in both
                        residential and commercial spaces.
                      </p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Anti-Termite Treatment</li>
                        <li>Cockroach Treatment</li>
                        <li>Mice Control Treatment</li>
                      </ul>
                    </div>
                  }
                />
              </CardContent>
            </Card>
          </motion.section>

          <motion.section
            id="trainings"
            className="py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              Training Services
            </h2>
            <Card>
              <CardContent className="p-6">
                <ImageContentSection
                  imagePosition="left"
                  imageUrl="/assets/waterproofing-3.jpg"
                  content={
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Our expert provides specialized training sessions
                        covering basic level of construction chemicals
                        application, and offer different intellectual discussion
                        forums that resolve newly arising construction issues
                        regarding construction chemicals. These sessions are
                        designed to enhance the skills and knowledge of
                        professionals in the field, ensuring they stay
                        up-to-date with the latest industry trends and best
                        practices.
                      </p>
                    </div>
                  }
                />
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
