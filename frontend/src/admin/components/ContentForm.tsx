import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

// Schema for validation
const schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed().required("Image is required"),
});

interface ContentFormProps {
  onClose: () => void;
  onSubmit: () => void;
  type: "about" | "cores" | "tab";
  content: any | null;
}

const ContentForm: React.FC<ContentFormProps> = ({
  onClose,
  onSubmit,
  type,
  content,
}) => {
  const [aboutContent, setAboutContent] = useState<any | null>(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch("/api/about", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAboutContent(data);
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      }
    };

    if (type === "about") {
      fetchAboutContent();
    }
  }, [type]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: content || {},
  });

  const onSubmitForm = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.image instanceof FileList) {
        formData.append("image", data.image[0]);
      }

      let url = "/api/about";
      let method = "POST";

      if (type === "cores") {
        url = content ? `/api/about/cores/${content._id}` : "/api/about/cores";
        method = content ? "PATCH" : "POST";
      } else if (type === "tab") {
        url = content ? `/api/about/tabs/${content._id}` : "/api/about/tabs";
        method = content ? "PATCH" : "POST";
      } else if (aboutContent) {
        method = "PATCH";
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to save ${type}`);
      }

      toast.success(
        content
          ? `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } updated successfully`
          : `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } created successfully`
      );
      onSubmit();
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      toast.error(`Error saving ${type}`);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {content
              ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`
              : `Create New ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <Input
              {...register("title")}
              placeholder="Title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <Textarea
              {...register("description")}
              placeholder="Description"
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <Input
              type="file"
              {...register("image")}
              className={errors.image ? "border-red-500" : ""}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{content ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContentForm;
