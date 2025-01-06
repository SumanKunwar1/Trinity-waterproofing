import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  fetchFaqsAsync,
  createFaqAsync,
  editFaqAsync,
  deleteFaqAsync,
} from "../store/faqSlice";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; // Import toast for notifications
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { MoreVertical } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

interface Faq {
  _id: string;
  question: string;
  answer: string;
}

const AdminFAQPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const faqs = useSelector((state: RootState) => state.faqs.faqs);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    dispatch(fetchFaqsAsync());
  }, [dispatch]);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFaqs = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddFaq = async () => {
    try {
      if (newQuestion && newAnswer) {
        const response = await dispatch(
          createFaqAsync({ question: newQuestion, answer: newAnswer })
        );
        if (response.payload) {
          toast.success("FAQ added successfully!"); // Success toast
        } else {
          toast.error("Failed to add FAQ.");
        }
        setNewQuestion("");
        setNewAnswer("");
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      toast.error("Error adding FAQ: " + error.message); // Error toast
    }
  };

  const handleEditFaq = async () => {
    try {
      if (selectedFaq && selectedFaq.question && selectedFaq.answer) {
        const response = await dispatch(editFaqAsync(selectedFaq));
        if (response.payload) {
          toast.success("FAQ updated successfully!"); // Success toast
        } else {
          toast.error("Failed to update FAQ.");
        }
        setIsEditDialogOpen(false);
        setSelectedFaq(null);
      }
    } catch (error) {
      toast.error("Error updating FAQ: " + error.message); // Error toast
    }
  };

  const handleDeleteFaq = async () => {
    try {
      if (selectedFaq) {
        const response = await dispatch(deleteFaqAsync(selectedFaq._id));
        if (response.payload) {
          toast.success("FAQ deleted successfully!"); // Success toast
        } else {
          toast.error("Failed to delete FAQ.");
        }
        setIsDeleteDialogOpen(false);
        setSelectedFaq(null);
      }
    } catch (error) {
      toast.error("Error deleting FAQ: " + error.message); // Error toast
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <motion.div
            className="container mx-auto px-6 py-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              className="flex justify-between items-center mb-6"
              variants={itemVariants}
            >
              <h1 className="text-3xl font-semibold text-gray-800">
                FAQ Management
              </h1>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">Add New FAQ</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New FAQ</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to add a new FAQ.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="question" className="text-right">
                        Question
                      </Label>
                      <Input
                        id="question"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="answer" className="text-right">
                        Answer
                      </Label>
                      <Input
                        id="answer"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddFaq}>Add FAQ</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                placeholder="Search FAQs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentFaqs.map((faq) => (
                    <TableRow key={faq._id}>
                      <TableCell className="font-medium">
                        {faq.question}
                      </TableCell>
                      <TableCell>{faq.answer}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedFaq(faq);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedFaq(faq);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
            <motion.div className="mt-6" variants={itemVariants}>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({
                    length: Math.ceil(filteredFaqs.length / itemsPerPage),
                  }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => paginate(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => paginate(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(filteredFaqs.length / itemsPerPage)
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          </motion.div>
        </main>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>
              Make changes to the FAQ below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-question" className="text-right">
                Question
              </Label>
              <Input
                id="edit-question"
                value={selectedFaq?.question || ""}
                onChange={(e) =>
                  setSelectedFaq(
                    selectedFaq
                      ? { ...selectedFaq, question: e.target.value }
                      : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-answer" className="text-right">
                Answer
              </Label>
              <Input
                id="edit-answer"
                value={selectedFaq?.answer || ""}
                onChange={(e) =>
                  setSelectedFaq(
                    selectedFaq
                      ? { ...selectedFaq, answer: e.target.value }
                      : null
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditFaq}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete FAQ</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this FAQ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDeleteFaq} className="bg-red-600 text-white">
              Yes, delete
            </Button>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFAQPage;
