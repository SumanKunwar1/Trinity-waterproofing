import { useState, useEffect } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaAngleRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import Newsletter from "./Newsletter";
import BackToTopButton from "../../components/common/BackToTopButton";

export interface ICompanyDetail {
  name: string;
  description: string;
  phoneNumber: string;
  location: string;
  email: string;
  twitter?: string;
  facebook?: string;
  google_plus?: string;
  youtube?: string;
  linkedin?: string;
  instagram?: string;
}
const Footer: React.FC = () => {
  const [companyDetails, setCompanyDetails] = useState<ICompanyDetail | null>(
    null
  );
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get<ICompanyDetail>("/api/company-detail");
        setCompanyDetails(response.data);
      } catch (error) {
        // console.error("Error fetching company details:", error);
      }
    };

    fetchCompanyDetails();
  }, []);

  if (!companyDetails) return null;

  return (
    <footer className="bg-brand text-gray-300">
      <div className="container mx-auto px-4">
        <div className="py-12 border-b border-gray-800">
          <Newsletter />
        </div>

        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              {companyDetails.name}
            </h3>
            <p className="mb-4">{companyDetails.description}</p>
            <div className="flex space-x-4">
              {companyDetails.facebook && (
                <a
                  href={companyDetails.facebook}
                  className="hover:text-white transition-colors"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
              )}
              {companyDetails.twitter && (
                <a
                  href={companyDetails.twitter}
                  className="hover:text-white transition-colors"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
              )}
              {companyDetails.instagram && (
                <a
                  href={companyDetails.instagram}
                  className="hover:text-white transition-colors"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              )}
              {companyDetails.linkedin && (
                <a
                  href={companyDetails.linkedin}
                  className="hover:text-white transition-colors"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 ">
              {[
                "products",
                "about",
                "services",
                "teams",
                "gallery",
                "cart",
                "wishlist",
                "contact",
              ].map((link) => (
                <li
                  key={link}
                  className="flex items-center space-x-2  hover:text-secondary hover:tracking-wider transform duration-300"
                >
                  <FaAngleRight className="" />
                  <Link
                    to={`/${link}`}
                    className=" transition-colors text-center"
                  >
                    {link.charAt(0).toUpperCase() + link.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {[
                "faq",
                "shipping-policy",
                "return-policy",
                "privacy-policy",
              ].map((link) => (
                <li
                  key={link}
                  className="flex items-center space-x-2  hover:text-secondary hover:tracking-wider transform duration-300"
                >
                  <FaAngleRight className="" />
                  <Link to={`/${link}`} className=" transition-colors">
                    {link
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li>{companyDetails.location}</li>
              <li>Phone: {companyDetails.phoneNumber}</li>
              <li>Email: {companyDetails.email}</li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-gray-800 text-center">
          <p>
            © {currentYear} {companyDetails.name}. All rights reserved.
          </p>
        </div>
      </div>
      <BackToTopButton />
    </footer>
  );
};

export default Footer;
