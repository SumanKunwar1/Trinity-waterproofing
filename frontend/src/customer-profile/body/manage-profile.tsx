import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { FaPen } from "react-icons/fa"; // If you want an edit icon from react-icons
import { motion } from "framer-motion"; // Importing Framer Motion

// Define CustomerInfo constant
const CustomerInfo = {
  profileImage: "/assets/logo.png", // Replace with the actual image URL or path
  customerName: "John Doe",
  dob: "1990-01-01", // Date of Birth
  email: "john.doe@example.com",
  ph_no: "+1234567890",
  gender: "male", // Default gender value
};

export const ManageProfile = () => {
  return (
    <motion.div
      className="ml-6 w-full h-screen bg-black-100 p-4 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Label className="tracking-wide text-2xl font-semibold">
        Manage Profile
      </Label>

      {/* Profile Image and Edit Section */}
      <motion.div
        className="bg-white mt-5 p-4 rounded-lg shadow-md"
        initial={{ x: "-100vw" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center pb-4">
          <div className="relative w-[120px] h-[120px]">
            <img
              src={CustomerInfo.profileImage} // Assume the profile image URL is in the `CustomerInfo` object
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute top-[50%] right-[-10%] transform -translate-y-1/2 cursor-pointer">
              <FaPen fontSize={25} className="text-black-300" />
            </div>
          </div>
          <div>
            <Button variant="secondary">Update Profile</Button>
          </div>
        </div>
      </motion.div>

      {/* Profile Info Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5"
        style={{ backgroundColor: "#fbfbfb" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Full Name */}
        <motion.div
          className="shadow-md w-full p-4 bg-white rounded-md"
          initial={{ y: "-100vh" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Label className="text-gray-700">Full Name</Label>
          <div className="bg-white p-2 mt-3 rounded-md shadow-sm">
            <Label className="text-gray-700">{CustomerInfo.customerName}</Label>
          </div>
        </motion.div>

        {/* Date of Birth */}
        <motion.div
          className="shadow-md w-full p-4 bg-white rounded-md"
          initial={{ y: "-100vh" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Label className="text-gray-700">Date of Birth</Label>
          <div className="bg-white p-2 mt-3 rounded-md shadow-sm">
            <Label className="text-gray-700">{CustomerInfo.dob}</Label>
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          className="shadow-md w-full p-4 bg-white rounded-md"
          initial={{ y: "-100vh" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Label className="text-gray-700">Email</Label>
          <div className="bg-white p-2 mt-3 rounded-md shadow-sm">
            <Label className="text-gray-700">{CustomerInfo.email}</Label>
          </div>
        </motion.div>

        {/* Phone Number */}
        <motion.div
          className="shadow-md w-full p-4 bg-white rounded-md"
          initial={{ y: "-100vh" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Label className="text-gray-700">Phone Number</Label>
          <div className="bg-white p-2 mt-3 rounded-md shadow-sm">
            <Label className="text-gray-700">{CustomerInfo.ph_no}</Label>
          </div>
        </motion.div>

        {/* Gender Selection */}
        <motion.div
          className="shadow-md w-full sm:w-[50%] lg:w-full p-4 bg-white rounded-md"
          initial={{ y: "100vh" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Label className="text-gray-700">Gender</Label>
          <div className="bg-white p-2 mt-3 rounded-md shadow-sm">
            <div className="flex items-center space-x-4">
              {/* Male Radio Button */}
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  className="form-radio text-dark-blue"
                  checked={CustomerInfo.gender === "male"}
                  onChange={() => console.log("Male selected")} // Handle selection
                />
                <Label htmlFor="male" className="text-gray-700">
                  Male
                </Label>
              </div>

              {/* Female Radio Button */}
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  className="form-radio text-dark-blue"
                  checked={CustomerInfo.gender === "female"}
                  onChange={() => console.log("Female selected")} // Handle selection
                />
                <Label htmlFor="female" className="text-gray-700">
                  Female
                </Label>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
