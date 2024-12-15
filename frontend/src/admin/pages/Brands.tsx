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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const Brands: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      {/* ShadCN Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)} variant="secondary">
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
                <Label
                  htmlFor="brand-name"
                  className="block text-sm font-medium"
                >
                  Brand Name
                </Label>
                <Input
                  type="text"
                  id="brand-name"
                  placeholder="Enter brand name"
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <Button type="submit" variant="secondary" className="mt-4">
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
