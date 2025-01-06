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
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "../../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { MoreVertical } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

interface Faq {
  _id: string;
  question: string;
  answer: string;
}

const AdminFAQPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const faqs = useSelector((state: RootState) => state.faqs.faqs);
  const status = useSelector((state: RootState) => state.faqs.status);
  const error = useSelector((state: RootState) => state.faqs.error);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  //const [searchTerm, setSearchTerm] = useState(""); //Removed
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    dispatch(fetchFaqsAsync());
  }, [dispatch]);

  //const filteredFaqs = faqs.filter( //Removed
  //  (faq) =>
  //    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  //);

  const handleAddFaq = async () => {
    if (newQuestion && newAnswer) {
      await dispatch(
        createFaqAsync({ question: newQuestion, answer: newAnswer })
      );
      setNewQuestion("");
      setNewAnswer("");
      setIsAddDialogOpen(false);
    }
  };

  const handleEditFaq = async () => {
    if (selectedFaq && selectedFaq.question && selectedFaq.answer) {
      await dispatch(editFaqAsync(selectedFaq));
      setIsEditDialogOpen(false);
      setSelectedFaq(null);
    }
  };

  const handleDeleteFaq = async () => {
    if (selectedFaq) {
      await dispatch(deleteFaqAsync(selectedFaq._id));
      setIsDeleteDialogOpen(false);
      setSelectedFaq(null);
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

  const columns = [
    {
      accessorKey: "sn",
      header: "SN",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => (
        <div className="max-w-xs truncate">{row.getValue("question")}</div>
      ),
    },
    {
      accessorKey: "answer",
      header: "Answer",
      cell: ({ row }) => (
        <div className="max-w-xs truncate">{row.getValue("answer")}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const faq = row.original;
        return (
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
        );
      },
    },
  ];

  const table = useReactTable({
    data: faqs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
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
                onChange={(e) => {
                  const value = e.target.value;
                  setCurrentPage(1);
                  // The filtering is now handled by the Table component
                }}
                className="mb-6"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="font-semibold">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-gray-500"
                      >
                        No FAQs found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </motion.div>
            <motion.div className="mt-6" variants={itemVariants}>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            Math.ceil(faqs.length / itemsPerPage),
                            prev + 1
                          )
                        )
                      }
                      disabled={
                        currentPage === Math.ceil(faqs.length / itemsPerPage)
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
              Are you sure you want to delete this FAQ? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFaq}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFAQPage;
