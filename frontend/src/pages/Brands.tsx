import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { FaPlus } from "react-icons/fa";

const Brands: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      {/* ShadCN Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)} variant="default">
            <FaPlus className="mr-2" /> Add New Brand
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
            <DialogDescription>
              Add a new brand to your store.
            </DialogDescription>
          </DialogHeader>

          {/* Content inside the dialog */}
          <div className="space-y-4">
            <form>
              <div>
                <label
                  htmlFor="brand-name"
                  className="block text-sm font-medium"
                >
                  Brand Name
                </label>
                <input
                  type="text"
                  id="brand-name"
                  placeholder="Enter brand name"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <Button type="submit" variant="default">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Brands;
