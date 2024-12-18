import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-xl mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Button to="/" size="lg">
            Return to Home
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
