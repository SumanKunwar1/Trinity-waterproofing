import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

interface TabListProps {
  tabs: any[]; // Array of tabs or cores values
  onEdit: (tab: any) => void;
  onDelete: () => void;
  type: "cores" | "tabs";
}

const TabList: React.FC<TabListProps> = ({
  tabs = [],
  onEdit,
  onDelete,
  type,
}) => {
  const [selectedTab, setSelectedTab] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async (itemId: string) => {
    try {
      const response = await fetch(`/api/about/${type}/${itemId}`, {
        // Change from /api/about/${type}/${itemId} to /api/about/${type}s/${itemId}
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Authentication token if needed
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`);
      }

      toast.success(
        `${type === "cores" ? "Core value" : "Tab"} deleted successfully`
      );
      onDelete();
    } catch (error) {
      // console.error(`Error deleting ${type}:`, error);
      toast.error(`Error deleting ${type}`);
    }
  };

  return (
    <div>
      {tabs && tabs.length > 0 ? (
        tabs.map((tab) => (
          <div key={tab._id} className="border p-4 mb-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{tab.title}</h3>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setSelectedTab(tab);
                  setIsDialogOpen(true);
                }}
              >
                <span className="sr-only">Open menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </div>
            <p className="mt-2">{tab.description}</p>
            <img
              src={tab.image}
              alt={tab.title}
              className="mt-2 w-full h-32 object-cover rounded"
            />
          </div>
        ))
      ) : (
        <p>No {type === "cores" ? "Core values" : "tabs"} available.</p>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTab?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>{selectedTab?.description}</p>
            <img
              src={selectedTab?.image}
              alt={selectedTab?.title}
              className="mt-2 w-full h-48 object-cover rounded"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              onClick={() => {
                onEdit(selectedTab!);
                setIsDialogOpen(false);
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete(selectedTab!._id!); // Pass the correct id for deletion
                setIsDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TabList;
