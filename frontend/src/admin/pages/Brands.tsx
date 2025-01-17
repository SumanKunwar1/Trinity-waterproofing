import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Table from "../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface Brand {
  _id: string;
  name: string;
  image: string;
}

const Brands: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandImage, setBrandImage] = useState<File | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 10;

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brand", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Brands:", data);
        setBrands(data);
      } else {
        // Parsing API error response
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to fetch brands";
        console.error(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Error fetching brands";
      console.error("Error fetching brands:", error);
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", brandName);
    if (brandImage) {
      formData.append("image", brandImage);
    }

    try {
      const url = isEditing ? `/api/brand/${selectedBrand?._id}` : "/api/brand";
      const method = isEditing ? "PATCH" : "POST";
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        setIsAddEditDialogOpen(false);
        setBrandName("");
        setBrandImage(null);
        setIsEditing(false);
        setSelectedBrand(null);
        fetchBrands();
        toast.success(
          isEditing
            ? "Brand updated successfully"
            : "Brand created successfully"
        );
      } else {
        // Parsing API error response
        const errorData = await response.json();
        const errorMessage =
          errorData.error ||
          `Failed to ${isEditing ? "update" : "create"} brand`;
        console.error(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        `Error ${isEditing ? "updating" : "creating"} brand`;
      console.error(
        `Error ${isEditing ? "updating" : "creating"} brand:`,
        error
      );
      toast.error(errorMessage);
    }
  };

  const handleView = (e: React.MouseEvent, brand: Brand) => {
    e.stopPropagation();
    setSelectedBrand(brand);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (e: React.MouseEvent, brand: Brand) => {
    e.stopPropagation();
    setSelectedBrand(brand);
    setBrandName(brand.name);
    setIsEditing(true);
    setIsAddEditDialogOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, brand: Brand) => {
    e.stopPropagation();
    setSelectedBrand(brand);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    console.log("Deleting brand:", selectedBrand);
    if (!selectedBrand) return;
    try {
      const response = await fetch(`/api/brand/${selectedBrand._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        await fetchBrands();
        setIsDeleteDialogOpen(false);
        setSelectedBrand(null);
        toast.success("Brand deleted successfully");
      } else {
        // Parsing API error response
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to delete brand";
        console.error(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Error deleting brand";
      console.error("Error deleting brand:", error);
      toast.error(errorMessage);
    }
  };

  const columns = [
    { header: "Brand Name", accessor: "name", filterable: true },
    {
      header: "Brand Image",
      accessor: "image",
      cell: (item: Brand) => (
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (item: Brand) => (
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleView(e, item)}
          >
            <FaEye className="mr-1" /> View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleEdit(e, item)}
          >
            <FaEdit className="mr-1" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleDelete(e, item)}
          >
            <FaTrash className="mr-1" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(brands.length / itemsPerPage);

  return (
    <div>
      <div className="flex bg-gray-100">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Brands</h1>
              <Dialog
                open={isAddEditDialogOpen}
                onOpenChange={setIsAddEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedBrand(null);
                      setBrandName("");
                      setBrandImage(null);
                      setIsAddEditDialogOpen(true);
                    }}
                    variant="default"
                  >
                    <FaPlus className="mr-2" /> Add New Brand
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditing ? "Edit Brand" : "Add New Brand"}
                    </DialogTitle>
                    <DialogDescription>
                      {isEditing
                        ? "Edit the brand details."
                        : "Add a new brand to your store."}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="brand-name"
                          className="block text-sm font-medium"
                        >
                          Brand Name
                        </Label>
                        <Input
                          type="text"
                          id="brand-name"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          placeholder="Enter brand name"
                          className="mt-1 w-full"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="brand-image"
                          className="block text-sm font-medium"
                        >
                          Brand Image
                        </Label>
                        <Input
                          type="file"
                          id="brand-image"
                          onChange={(e) =>
                            setBrandImage(e.target.files?.[0] || null)
                          }
                          className="mt-1 w-full"
                        />
                      </div>
                      <Button type="submit" variant="default" className="mt-4">
                        {isEditing ? "Update" : "Save"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Table
              columns={columns}
              data={brands}
              itemsPerPage={itemsPerPage}
              onRowClick={(item) =>
                handleView(new MouseEvent("click") as any, item)
              }
            />

            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </main>
        </div>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Brand Details</DialogTitle>
          </DialogHeader>
          {selectedBrand && (
            <div className="mt-4">
              <img
                src={selectedBrand.image}
                alt={selectedBrand.name}
                className="w-32 h-32 object-cover rounded mx-auto mb-4"
              />
              <p className="text-center font-semibold text-lg">
                {selectedBrand.name}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this brand? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={confirmDelete} variant="destructive">
              Delete
            </Button>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Brands;
