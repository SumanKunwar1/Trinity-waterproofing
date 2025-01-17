import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getFolders, getFiles } from "../admin/utils/api";
import { Folder, ArrowLeft, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { toast } from "react-toastify";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

interface Folder {
  name: string;
  previewImage?: string;
}

const UserGallery: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setIsLoading(true);
    try {
      const folderData = await getFolders();
      const folderWithRandomImage = await Promise.all(
        folderData.map(async (folder: any) => {
          let randomImage = localStorage.getItem(`previewImage-${folder.name}`);

          // If random image is not saved in localStorage, select one
          if (!randomImage) {
            const files = await getFiles(folder.name);
            randomImage =
              files.length > 0
                ? files[Math.floor(Math.random() * files.length)]
                : "";
            localStorage.setItem(
              `previewImage-${folder.name}`,
              randomImage as string
            );
          }

          return {
            ...folder,
            previewImage: randomImage,
          };
        })
      );
      setFolders(folderWithRandomImage);
    } catch (error) {
      console.error("Error fetching folders:", error);
      toast.error("Failed to fetch galleries");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImages = async (folderName: string) => {
    setIsLoading(true);
    try {
      const data = await getFiles(folderName);
      setImages(data || []);
      setSelectedFolder(folderName);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to fetch images");
    } finally {
      setIsLoading(false);
    }
  };

  const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      rootMargin: "200px 0px",
    });

    return (
      <div ref={ref} className="w-full h-48 bg-gray-200">
        {inView && (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Image Galleries</h1>
          <AnimatePresence mode="wait">
            {!selectedFolder ? (
              <motion.div
                key="folders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {isLoading
                  ? Array.from({ length: 8 }).map((_, index) => (
                      <Skeleton key={index} className="w-full h-64" />
                    ))
                  : folders.map((folder) => (
                      <motion.div
                        key={folder.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card
                          className="cursor-pointer h-full"
                          onClick={() => fetchImages(folder.name)}
                        >
                          <CardContent className="p-0">
                            {folder.previewImage ? (
                              <LazyImage
                                src={folder.previewImage}
                                alt={folder.name}
                              />
                            ) : (
                              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <Folder className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                            <div className="p-4">
                              <h2 className="text-xl font-semibold">
                                {folder.name}
                              </h2>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
              </motion.div>
            ) : (
              <motion.div
                key="images"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  variant="outline"
                  className="mb-4"
                  onClick={() => setSelectedFolder(null)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Galleries
                </Button>
                <h2 className="text-2xl font-bold mb-4">{selectedFolder}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {isLoading
                    ? Array.from({ length: 12 }).map((_, index) => (
                        <Skeleton key={index} className="w-full h-48" />
                      ))
                    : images.map((image, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Card
                            className="cursor-pointer overflow-hidden"
                            onClick={() => setLightboxImage(image)}
                          >
                            <CardContent className="p-0">
                              <LazyImage
                                src={image}
                                alt={`Image ${index + 1}`}
                              />
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {lightboxImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                onClick={() => setLightboxImage(null)}
              >
                <motion.img
                  src={lightboxImage}
                  alt="Fullscreen"
                  className="max-w-full max-h-full object-contain"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white"
                  onClick={() => setLightboxImage(null)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserGallery;
