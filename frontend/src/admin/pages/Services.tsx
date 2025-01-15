import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { MoreVertical, Plus } from "lucide-react";
import axios from "axios";
// import * as yup from "yup";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// // Validation Schema
// const serviceSchema = yup.object().shape({
//   title: yup.string().required("Title is required"),
//   description: yup.string().required("Description is required"),
//   image: yup.mixed().nullable().optional(),
// });

// const cardSchema = yup.object().shape({
//   title: yup.string().required("Title is required"),
//   description: yup.string().required("Description is required"),
//   image: yup.mixed().nullable().optional(),
// });

// Interfaces
interface IService {
  _id?: string;
  title: string;
  description: string;
  image: string | File | null | undefined;
}

interface ICard {
  _id?: string;
  title: string;
  description: string;
  image: string | File | null | undefined;
}

const authToken = localStorage.getItem("authToken");

// Component
const ServicePage: React.FC = () => {
  const [service, setService] = useState<IService | null>(null);
  const [cards, setCards] = useState<ICard[]>([]);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ICard | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Manual validation function
  // const validateServiceForm = (data: IService) => {
  //   const errors: { [key: string]: string } = {};

  //   // Manual validation
  //   if (!data.title) errors.title = "Title is required";
  //   if (!data.description) errors.description = "Description is required";
  //   if (
  //     data.image &&
  //     !(data.image instanceof File || typeof data.image === "string")
  //   ) {
  //     errors.image = "Invalid image format";
  //   }

  //   return errors;
  // };

  // const validateCardForm = (data: ICard) => {
  //   const errors: { [key: string]: string } = {};

  //   // Manual validation
  //   if (!data.title) errors.title = "Title is required";
  //   if (!data.description) errors.description = "Description is required";
  //   if (
  //     data.image &&
  //     !(data.image instanceof File || typeof data.image === "string")
  //   ) {
  //     errors.image = "Invalid image format";
  //   }

  //   return errors;
  // };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<IService>();

  const {
    register: registerCard,
    handleSubmit: handleSubmitCard,
    formState: { errors: cardErrors },
    reset: resetCard,
    setValue: setCardValue,
    watch: watchCard,
  } = useForm<ICard>();

  const watchServiceImage = watch("image");
  const watchCardImage = watchCard("image");

  useEffect(() => {
    fetchService();
    fetchCards();
  }, []);

  const fetchService = async () => {
    try {
      const response = await axios.get("/api/service", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setService(response.data || null);
      if (response.data) {
        reset(response.data);
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Failed to load service");
    }
  };

  const fetchCards = async () => {
    try {
      const response = await axios.get("/api/service/cards", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCards(response.data || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
      toast.error("Failed to load cards");
    }
  };

  const onSubmit = async (data: IService) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.image instanceof File) formData.append("image", data.image);

      if (service) {
        await axios.patch(`/api/service`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        });
        toast.success("Service updated successfully");
      } else {
        await axios.post("/api/service", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        });
        toast.success("Service created successfully");
      }
      fetchService();
      setIsEditServiceDialogOpen(false);
    } catch (error) {
      console.error("Error submitting service:", error);
      toast.error("Failed to submit service");
    }
  };

  const onAddCard = async (data: ICard) => {
    try {
      const formData = new FormData();
      if (data.image instanceof File) formData.append("image", data.image);
      formData.append("title", data.title);
      formData.append("description", data.description);

      await axios.post(`/api/service/cards`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("Card added successfully");
      setIsAddCardDialogOpen(false);
      fetchCards();
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Failed to add card");
    }
  };

  const onEditCard = async (data: ICard) => {
    if (editingCard) {
      try {
        const formData = new FormData();
        if (data.image instanceof File) formData.append("image", data.image);
        formData.append("title", data.title);
        formData.append("description", data.description);

        await axios.patch(`/api/service/cards/${editingCard._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        });
        toast.success("Card updated successfully");
        setEditingCard(null);
        fetchCards();
      } catch (error) {
        console.error("Error updating card:", error);
        toast.error("Failed to update card");
      }
    }
  };

  const onDeleteCard = async (cardId: string) => {
    try {
      await axios.delete(`/api/service/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Card deleted successfully");
      fetchCards();
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Failed to delete card");
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isCard: boolean
  ) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (isCard) {
        setCardValue("image", file);
      } else {
        setValue("image", file);
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="container mx-auto p-4 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Service Management</h1>

          {service ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {service.image && typeof service.image === "string" && (
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={() => setIsEditServiceDialogOpen(true)}>
                  Edit Service
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Create Service</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input {...register("title")} placeholder="Title" />
                  {errors.title && (
                    <span className="text-red-500">{errors.title.message}</span>
                  )}

                  <Textarea
                    {...register("description")}
                    placeholder="Description"
                  />
                  {errors.description && (
                    <span className="text-red-500">
                      {errors.description.message}
                    </span>
                  )}

                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="mt-2"
                  />
                  {errors.image && (
                    <span className="text-red-500">{errors.image.message}</span>
                  )}

                  {watchServiceImage instanceof File && (
                    <img
                      src={
                        URL.createObjectURL(watchServiceImage) ||
                        "/placeholder.svg"
                      }
                      alt="Service preview"
                      className="w-full h-48 object-cover rounded-md mt-2"
                    />
                  )}

                  <Button type="submit">Create Service</Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <Card key={card._id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{card.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-5 w-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setEditingCard(card)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => card._id && onDeleteCard(card._id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  {card.image && typeof card.image === "string" && (
                    <img
                      src={card.image || "/placeholder.svg"}
                      alt={card.title}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  )}
                  <p>{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button onClick={() => setIsAddCardDialogOpen(true)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Add Card
          </Button>

          <Dialog
            open={isEditServiceDialogOpen}
            onOpenChange={setIsEditServiceDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Service</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input {...register("title")} placeholder="Title" />
                {errors.title && (
                  <span className="text-red-500">{errors.title.message}</span>
                )}

                <Textarea
                  {...register("description")}
                  placeholder="Description"
                />
                {errors.description && (
                  <span className="text-red-500">
                    {errors.description.message}
                  </span>
                )}

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  className="mt-2"
                />
                {errors.image && (
                  <span className="text-red-500">{errors.image.message}</span>
                )}

                {watchServiceImage && (
                  <img
                    src={
                      watchServiceImage instanceof File
                        ? URL.createObjectURL(watchServiceImage)
                        : watchServiceImage
                    }
                    alt="Service preview"
                    className="w-full h-48 object-cover rounded-md mt-2"
                  />
                )}

                <Button type="submit">Update Service</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isAddCardDialogOpen || !!editingCard}
            onOpenChange={(open) => {
              setIsAddCardDialogOpen(open);
              if (!open) {
                setEditingCard(null);
                resetCard();
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCard ? "Edit Card" : "Add New Card"}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmitCard(
                  editingCard ? onEditCard : onAddCard
                )}
                className="space-y-4"
              >
                <Input
                  {...registerCard("title")}
                  placeholder="Title"
                  defaultValue={editingCard?.title}
                />
                {cardErrors.title && (
                  <span className="text-red-500">
                    {cardErrors.title.message}
                  </span>
                )}

                <Textarea
                  {...registerCard("description")}
                  placeholder="Description"
                  defaultValue={editingCard?.description}
                />
                {cardErrors.description && (
                  <span className="text-red-500">
                    {cardErrors.description.message}
                  </span>
                )}

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, true)}
                  className="mt-2"
                />
                {cardErrors.image && (
                  <span className="text-red-500">
                    {cardErrors.image.message}
                  </span>
                )}

                {watchCardImage && (
                  <img
                    src={
                      watchCardImage instanceof File
                        ? URL.createObjectURL(watchCardImage)
                        : watchCardImage
                    }
                    alt="Card preview"
                    className="w-full h-32 object-cover rounded-md mt-2"
                  />
                )}

                <Button type="submit">
                  {editingCard ? "Update Card" : "Add Card"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
