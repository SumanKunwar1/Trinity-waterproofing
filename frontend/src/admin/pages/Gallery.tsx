import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Folder, Image, Trash2, Edit, Plus } from "lucide-react";
import {
  getFolders,
  getFiles,
  createFolder,
  uploadImage,
  renameFolder,
  deleteFolder,
  deleteFiles,
} from "../utils/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

interface FolderItem {
  name: string;
  type: string;
  file: string | null;
}

const AdminGallery: React.FC = () => {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] =
    useState(false);
  const [isRenameFolderDialogOpen, setIsRenameFolderDialogOpen] =
    useState(false);
  const [newFolderNameForRename, setNewFolderNameForRename] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<{
    type: string;
    paths: string[];
  } | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchFolders();
    console.log("folders fetched are ", folders);
  }, []);

  const fetchFolders = async () => {
    try {
      const data = await getFolders();
      if (data) {
        setFolders(data);
      } else {
        throw new Error(data.message || "Failed to fetch folders");
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to fetch folders");
    }
  };

  const fetchFiles = async (folderName: string) => {
    try {
      const data = await getFiles(folderName);
      if (data) {
        setFiles(data);
        setSelectedFolder(folderName);
        setSelectedImages(new Set());
      } else {
        throw new Error(data.message || "Failed to fetch files");
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to fetch files");
    }
  };

  const handleCreateFolder = async () => {
    setIsSubmitting(true);
    try {
      await Yup.string()
        .required("Folder name is required")
        .min(3, "Folder name must be at least 3 characters")
        .validate(newFolderName);

      const data = await createFolder(newFolderName);
      if (data) {
        setNewFolderName("");
        setIsCreateFolderDialogOpen(false);
        fetchFolders();
        toast.success("Folder created successfully");
      } else {
        throw new Error(data.message || "Failed to create folder");
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to create folder");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFilesToUpload(files);
  };
  const handleUploadImages = async () => {
    // Check if there are files selected and a folder is chosen
    if (!filesToUpload.length || !selectedFolder) return;

    setIsSubmitting(true);

    try {
      const data = await uploadImage(selectedFolder, filesToUpload);
      if (data) {
        // After upload, fetch files for the selected folder to update the UI
        fetchFiles(selectedFolder);
        setFilesToUpload([]); // Reset the file input
        toast.success("Images uploaded successfully");
      } else {
        throw new Error(data.message || "Failed to upload images");
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to upload images");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelection = useCallback((imagePath: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imagePath)) {
        newSet.delete(imagePath);
      } else {
        newSet.add(imagePath);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedImages(new Set(files));
      } else {
        setSelectedImages(new Set());
      }
    },
    [files]
  );

  const handleDeleteSelected = () => {
    setItemsToDelete({ type: "files", paths: Array.from(selectedImages) });
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemsToDelete) return;
    setIsSubmitting(true);

    try {
      let data;
      if (itemsToDelete.type === "folder") {
        data = await deleteFolder(itemsToDelete.paths[0]);
        if (data) {
          fetchFolders();
          setSelectedFolder(null);
          setFiles([]);
          toast.success("Folder deleted successfully");
        } else {
          throw new Error(data.message || "Failed to delete folder");
        }
      } else {
        data = await deleteFiles(selectedFolder!, itemsToDelete.paths);
        if (data) {
          fetchFiles(selectedFolder!);
          setSelectedImages(new Set());
          toast.success("Files deleted successfully");
        } else {
          throw new Error(data.message || "Failed to delete files");
        }
      }
    } catch (error) {
      toast.error(
        (error as Error).message || `Failed to delete ${itemsToDelete.type}`
      );
    } finally {
      setIsSubmitting(false);
      setIsDeleteConfirmOpen(false);
      setItemsToDelete(null);
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
        <div className="container mx-auto p-4 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Gallery Management</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Folders</h2>
                  <Button onClick={() => setIsCreateFolderDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Folder
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {folders &&
                    folders.map((folder) => (
                      <Card key={folder.name} className="hover:bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Folder className="w-5 h-5" />
                              <span className="font-medium">{folder.name}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchFiles(folder.name)}
                              >
                                <Image className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedFolder(folder.name);
                                  setNewFolderNameForRename(folder.name);
                                  setIsRenameFolderDialogOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setItemsToDelete({
                                    type: "folder",
                                    paths: [folder.name],
                                  });
                                  setIsDeleteConfirmOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Upload Images</h2>
                <div className="space-y-4">
                  <div>
                    <Label>Select Folder</Label>
                    <select
                      value={selectedFolder || ""}
                      onChange={(e) => setSelectedFolder(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Choose a folder</option>
                      {folders &&
                        folders.map((folder) => (
                          <option key={folder.name} value={folder.name}>
                            {folder.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <Label>Select Images</Label>
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileSelection}
                      accept="image/*"
                      disabled={!selectedFolder || isSubmitting}
                    />
                  </div>
                  <Button
                    onClick={handleUploadImages}
                    disabled={
                      !selectedFolder || !filesToUpload.length || isSubmitting
                    }
                    className="w-full"
                  >
                    Upload Images
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedFolder && files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Images in {selectedFolder}</span>
                  {selectedImages.size > 0 && (
                    <Button
                      variant="outline"
                      className="flex border-red-700 items-center space-x-2 hover:bg-red-600 hover:text-white"
                      onClick={handleDeleteSelected}
                      disabled={isSubmitting}
                    >
                      Delete Selected ({selectedImages.size})
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedImages.size === files.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span>Select All</span>
                  </Label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer"
                      onClick={() => handleImageSelection(file)}
                    >
                      <img
                        src={file}
                        alt={`File ${index}`}
                        className="w-full h-48 object-cover rounded"
                      />
                      {selectedImages.has(file) && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center rounded border-2 border-blue-500">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Dialog
            open={isCreateFolderDialogOpen}
            onOpenChange={setIsCreateFolderDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
              <DialogFooter>
                <Button onClick={handleCreateFolder} disabled={isSubmitting}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isRenameFolderDialogOpen}
            onOpenChange={setIsRenameFolderDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename Folder</DialogTitle>
              </DialogHeader>
              <Input
                value={newFolderNameForRename}
                onChange={(e) => setNewFolderNameForRename(e.target.value)}
                placeholder="Enter new folder name"
              />
              <DialogFooter>
                <Button
                  onClick={async () => {
                    try {
                      const data = await renameFolder(
                        selectedFolder!,
                        newFolderNameForRename
                      );
                      if (data && data.success) {
                        setIsRenameFolderDialogOpen(false);
                        fetchFolders();
                        toast.success("Folder renamed successfully");
                      } else {
                        throw new Error(
                          data.message || "Failed to rename folder"
                        );
                      }
                    } catch (error) {
                      toast.error(
                        (error as Error).message || "Failed to rename folder"
                      );
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Rename
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isDeleteConfirmOpen}
            onOpenChange={setIsDeleteConfirmOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete{" "}
                {itemsToDelete?.type === "folder"
                  ? "this folder"
                  : "these files"}
                ? This action cannot be undone.
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
