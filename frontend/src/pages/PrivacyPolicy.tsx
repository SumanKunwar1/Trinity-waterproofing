import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

const PrivacyPolicy: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you
            create an account, make a purchase, or contact us for support. This
            may include your name, email address, postal address, phone number,
            and payment information.
          </p>

          <h2 className="text-xl font-semibold mb-2">
            2. How We Use Your Information
          </h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve
            our services, to process your transactions, to send you technical
            notices and support messages, and to communicate with you about
            products, services, offers, and events.
          </p>

          <h2 className="text-xl font-semibold mb-2">
            3. Information Sharing and Disclosure
          </h2>
          <p className="mb-4">
            We do not share your personal information with third parties except
            as described in this policy. We may share your information with
            vendors, consultants, and other service providers who need access to
            such information to carry out work on our behalf.
          </p>

          <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
          <p className="mb-4">
            We take reasonable measures to help protect information about you
            from loss, theft, misuse and unauthorized access, disclosure,
            alteration, and destruction.
          </p>

          <h2 className="text-xl font-semibold mb-2">5. Your Choices</h2>
          <p className="mb-4">
            You may update, correct, or delete information about you at any time
            by logging into your online account or by contacting us. You may
            also opt out of receiving promotional communications from us by
            following the instructions in those messages.
          </p>

          <p>
            This privacy policy is effective as of June 1, 2023, and will remain
            in effect except with respect to any changes in its provisions in
            the future, which will be in effect immediately after being posted
            on this page. We reserve the right to update or change our Privacy
            Policy at any time, and you should check this Privacy Policy
            periodically.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PrivacyPolicy;
