import { useState, useEffect, useCallback } from "react";
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
  CardDescription,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Folder, Image, Trash2, Edit, Plus, Upload } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setIsLoading(true);
    try {
      const data = await getFolders();
      if (data) {
        setFolders(data);
      } else {
        throw new Error("Failed to fetch folders");
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to fetch folders");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFiles = async (folderName: string) => {
    setIsLoading(true);
    try {
      const data = await getFiles(folderName);
      if (data) {
        setFiles(data);
        setSelectedFolder(folderName);
        setSelectedImages(new Set());
      } else {
        throw new Error("Failed to fetch files");
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to fetch files");
    } finally {
      setIsLoading(false);
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
        throw new Error("Failed to create folder");
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
    if (!filesToUpload.length || !selectedFolder) return;
    setIsSubmitting(true);

    try {
      const data = await uploadImage(selectedFolder, filesToUpload);
      if (data) {
        fetchFiles(selectedFolder);
        setFilesToUpload([]);
        toast.success("Images uploaded successfully");
      } else {
        throw new Error("Failed to upload images");
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
      setSelectedImages(checked ? new Set(files) : new Set());
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
      if (itemsToDelete.type === "folder") {
        const data = await deleteFolder(itemsToDelete.paths[0]);
        if (data) {
          fetchFolders();
          setSelectedFolder(null);
          setFiles([]);
          toast.success("Folder deleted successfully");
        }
      } else {
        const data = await deleteFiles(selectedFolder!, itemsToDelete.paths);
        if (data) {
          fetchFiles(selectedFolder!);
          setSelectedImages(new Set());
          toast.success("Files deleted successfully");
        }
      }
    } catch (error) {
      toast.error(`Failed to delete ${itemsToDelete.type}`);
    } finally {
      setIsSubmitting(false);
      setIsDeleteConfirmOpen(false);
      setItemsToDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex-1 flex flex-col">
        <Topbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        <div className="container mx-auto p-4 space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">
                Gallery Management
              </CardTitle>
              <CardDescription>Manage your folders and images</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Folders Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-semibold">Folders</h2>
                  <Button
                    onClick={() => setIsCreateFolderDialogOpen(true)}
                    className="flex items-center space-x-2"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Folder</span>
                  </Button>
                </div>

                <div className="grid gap-4">
                  {isLoading ? (
                    <div className="text-center py-8">Loading folders...</div>
                  ) : folders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No folders found. Create one to get started.
                    </div>
                  ) : (
                    folders.map((folder) => (
                      <Card
                        key={folder.name}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 truncate">
                              <Folder className="w-5 h-5 flex-shrink-0" />
                              <span className="font-medium truncate">
                                {folder.name}
                              </span>
                            </div>
                            <div className="flex space-x-2 flex-shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchFiles(folder.name)}
                                className="hidden sm:flex"
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
                    ))
                  )}
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-semibold">
                  Upload Images
                </h2>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label>Select Folder</Label>
                      <select
                        value={selectedFolder || ""}
                        onChange={(e) => setSelectedFolder(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                      >
                        <option value="">Choose a folder</option>
                        {folders.map((folder) => (
                          <option key={folder.name} value={folder.name}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Select Images</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          multiple
                          onChange={handleFileSelection}
                          accept="image/*"
                          disabled={!selectedFolder || isSubmitting}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleUploadImages}
                      disabled={
                        !selectedFolder || !filesToUpload.length || isSubmitting
                      }
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Images
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Images Grid */}
          {selectedFolder && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <CardTitle>
                    Images in {selectedFolder} ({files.length})
                  </CardTitle>
                  {selectedImages.size > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteSelected}
                      disabled={isSubmitting}
                      className="flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Selected ({selectedImages.size})</span>
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading images...</div>
                ) : files.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No images found in this folder.
                  </div>
                ) : (
                  <>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="relative group cursor-pointer aspect-square"
                          onClick={() => handleImageSelection(file)}
                        >
                          <img
                            src={file}
                            alt={`File ${index}`}
                            className="w-full h-full object-cover rounded-lg transition-transform hover:scale-105"
                          />
                          <div
                            className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                              selectedImages.has(file)
                                ? "bg-blue-500/20 border-2 border-blue-500"
                                : "bg-black/0 group-hover:bg-black/10"
                            }`}
                          >
                            {selectedImages.has(file) && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
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
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Create Folder Dialog */}
          <Dialog
            open={isCreateFolderDialogOpen}
            onOpenChange={setIsCreateFolderDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateFolderDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateFolder} disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Rename Folder Dialog */}
          <Dialog
            open={isRenameFolderDialogOpen}
            onOpenChange={setIsRenameFolderDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Rename Folder</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="newFolderName">New Folder Name</Label>
                  <Input
                    id="newFolderName"
                    value={newFolderNameForRename}
                    onChange={(e) => setNewFolderNameForRename(e.target.value)}
                    placeholder="Enter new folder name"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsRenameFolderDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    setIsSubmitting(true);
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
                        throw new Error("Failed to rename folder");
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
                  {isSubmitting ? "Renaming..." : "Rename"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={isDeleteConfirmOpen}
            onOpenChange={setIsDeleteConfirmOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-gray-600">
                  Are you sure you want to delete{" "}
                  {itemsToDelete?.type === "folder" ? (
                    <span className="font-medium">
                      this folder and all its contents
                    </span>
                  ) : (
                    <span className="font-medium">
                      {itemsToDelete?.paths.length} selected{" "}
                      {itemsToDelete?.paths.length === 1 ? "image" : "images"}
                    </span>
                  )}
                  ? This action cannot be undone.
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
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
