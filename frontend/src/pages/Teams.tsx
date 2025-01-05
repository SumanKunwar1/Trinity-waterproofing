import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

interface ITeam {
  name: string;
  role: string;
  image: string;
  bio: string;
  email: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

const TeamPage = () => {
  const teamMembers: ITeam[] = [
    {
      name: "John Doe",
      role: "CEO",
      image: "/assets/success.png",
      bio: "John is a visionary leader with over 20 years of experience in the industry.",
      email: "john@example.com",
      facebook: "https://facebook.com/johndoe",
      twitter: "https://twitter.com/johndoe",
      instagram: "https://instagram.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
    },
    {
      name: "Jane Smith",
      role: "CTO",
      image: "/assets/success.png",
      bio: "Jane is a tech enthusiast and has been driving innovation in our company for the past decade.",
      email: "jane@example.com",
      twitter: "https://twitter.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith",
    },
    {
      name: "Mike Johnson",
      role: "Lead Developer",
      image: "/assets/success.png",
      bio: "Mike is a coding wizard with a passion for creating efficient and scalable solutions.",
      email: "mike@example.com",
      linkedin: "https://linkedin.com/in/mikejohnson",
    },
    {
      name: "Sarah Brown",
      role: "UX Designer",
      image: "/assets/success.png",
      bio: "Sarah has an eye for detail and a knack for creating intuitive user experiences.",
      email: "sarah@example.com",
      instagram: "https://instagram.com/sarahbrown",
      linkedin: "https://linkedin.com/in/sarahbrown",
    },
  ];

  const socialIcons = {
    email: Mail,
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main>
        <div className="min-h-screen ">
          <main className="container mx-auto px-4 py-16">
            <motion.h1
              className="text-5xl font-bold text-center mb-16 text-brand dark:text-blue-200"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Meet Our Team
            </motion.h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl group"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative aspect-square">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <p className="text-white text-sm mb-4">{member.bio}</p>
                      <div className="flex space-x-3">
                        {(
                          Object.keys(socialIcons) as Array<
                            keyof typeof socialIcons
                          >
                        ).map((platform) => {
                          const Icon = socialIcons[platform];
                          const link =
                            platform === "email"
                              ? `mailto:${member.email}`
                              : member[platform];
                          return link ? (
                            <motion.a
                              key={platform}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white hover:text-blue-300 transition-colors duration-200"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Icon size={20} />
                            </motion.a>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {member.name}
                    </h2>
                    <p className="text-sm text-blue-600 font-semibold dark:text-gray-300 mt-1">
                      {member.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeamPage;
