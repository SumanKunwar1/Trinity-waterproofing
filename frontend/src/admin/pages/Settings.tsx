import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaPlus } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Textarea } from "../components/ui/textarea";

interface CompanyDetails {
  name: string;
  phoneNumber: string;
  description: string;
  location: string;
  email: string;
  twitter?: string;
  facebook?: string;
  google_plus?: string;
  youtube?: string;
  linkedin?: string;
  instagram?: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Company name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  description: Yup.string().required("Description is required"),
  location: Yup.string().required("Location is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  twitter: Yup.string().url("Invalid URL").nullable(),
  facebook: Yup.string().url("Invalid URL").nullable(),
  google_plus: Yup.string().url("Invalid URL").nullable(),
  youtube: Yup.string().url("Invalid URL").nullable(),
  linkedin: Yup.string().url("Invalid URL").nullable(),
  instagram: Yup.string().url("Invalid URL").nullable(),
});

const initialValues: CompanyDetails = {
  name: "",
  phoneNumber: "",
  description: "",
  location: "",
  email: "",
  twitter: "",
  facebook: "",
  google_plus: "",
  youtube: "",
  linkedin: "",
  instagram: "",
};

const Settings: React.FC = () => {
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(
    null
  );
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const fetchCompanyDetails = async () => {
    try {
      const response = await fetch("/api/company-detail");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch company details");
      }
      const data = await response.json();
      setCompanyDetails(data);
    } catch (error: any) {
      toast.info(error.message || "No Company details available at the moment");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const handleSubmit = async (values: CompanyDetails) => {
    try {
      console.log("Values:", values);
      const method = "PUT";
      const response = await fetch("/api/company-detail", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update company details");
      }

      const data = await response.json();
      console.log("Data:", data);
      setCompanyDetails(data.data);
      setIsDialogOpen(false);
      toast.success(
        `Company details ${isEditing ? "updated" : "added"} successfully`
      );
    } catch (error: any) {
      toast.error(
        `${error.message} || Error ${
          isEditing ? "updating" : "adding"
        } company details`
      );
      console.error(error);
    }
  };
  console.log("Company Details:", companyDetails);

  const openDialog = (editing: boolean) => {
    setIsEditing(editing);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="p-6">
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Company Details</CardTitle>
              {companyDetails ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openDialog(true)}
                >
                  <FaEdit className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" onClick={() => openDialog(false)}>
                  <FaPlus className="h-4 w-4 mr-2" />
                  Add Details
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogTitle>
                    {isEditing ? "Edit" : "Add"} Company Details
                  </DialogTitle>
                  <Formik
                    initialValues={companyDetails || initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched }) => (
                      <Form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Company Name</Label>
                            <Field as={Input} id="name" name="name" required />
                            {errors.name && touched.name && (
                              <div className="text-red-500">{errors.name}</div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Field
                              as={Input}
                              id="email"
                              name="email"
                              type="email"
                              required
                            />
                            {errors.email && touched.email && (
                              <div className="text-red-500">{errors.email}</div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Field
                              as={Input}
                              id="phoneNumber"
                              name="phoneNumber"
                              required
                            />
                            {errors.phoneNumber && touched.phoneNumber && (
                              <div className="text-red-500">
                                {errors.phoneNumber}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Field
                              as={Input}
                              id="location"
                              name="location"
                              required
                            />
                            {errors.location && touched.location && (
                              <div className="text-red-500">
                                {errors.location}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Field
                            as={Textarea}
                            id="description"
                            name="description"
                            required
                            className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                          />
                          {errors.description && touched.description && (
                            <div className="text-red-500">
                              {errors.description}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="facebook">Facebook</Label>
                            <Field
                              as={Input}
                              id="facebook"
                              type="url"
                              name="facebook"
                            />
                            {errors.facebook && touched.facebook && (
                              <div className="text-red-500">
                                {errors.facebook}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter</Label>
                            <Field
                              as={Input}
                              id="twitter"
                              type="url"
                              name="twitter"
                            />
                            {errors.twitter && touched.twitter && (
                              <div className="text-red-500">
                                {errors.twitter}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Field
                              as={Input}
                              id="instagram"
                              type="url"
                              name="instagram"
                            />
                            {errors.instagram && touched.instagram && (
                              <div className="text-red-500">
                                {errors.instagram}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Field
                              as={Input}
                              id="linkedin"
                              type="url"
                              name="linkedin"
                            />
                            {errors.linkedin && touched.linkedin && (
                              <div className="text-red-500">
                                {errors.linkedin}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="youtube">YouTube</Label>
                            <Field
                              as={Input}
                              id="youtube"
                              name="youtube"
                              type="url"
                            />
                            {errors.youtube && touched.youtube && (
                              <div className="text-red-500">
                                {errors.youtube}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="google_plus">Google Plus</Label>
                            <Field
                              as={Input}
                              id="google_plus"
                              type="url"
                              name="google_plus"
                            />
                            {errors.google_plus && touched.google_plus && (
                              <div className="text-red-500">
                                {errors.google_plus}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            {isEditing ? "Save Changes" : "Add Details"}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </DialogContent>
              </Dialog>

              {companyDetails ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-medium">Company Name</Label>
                      <p className="mt-1">{companyDetails.name}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Email</Label>
                      <p className="mt-1">{companyDetails.email}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Phone Number</Label>
                      <p className="mt-1">{companyDetails.phoneNumber}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Location</Label>
                      <p className="mt-1">{companyDetails.location}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium">Description</Label>
                    <p className="mt-1">{companyDetails.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {companyDetails.facebook && (
                      <div>
                        <Label className="font-medium">Facebook</Label>
                        <p className="mt-1">{companyDetails.facebook}</p>
                      </div>
                    )}
                    {companyDetails.twitter && (
                      <div>
                        <Label className="font-medium">Twitter</Label>
                        <p className="mt-1">{companyDetails.twitter}</p>
                      </div>
                    )}
                    {companyDetails.instagram && (
                      <div>
                        <Label className="font-medium">Instagram</Label>
                        <p className="mt-1">{companyDetails.instagram}</p>
                      </div>
                    )}
                    {companyDetails.linkedin && (
                      <div>
                        <Label className="font-medium">LinkedIn</Label>
                        <p className="mt-1">{companyDetails.linkedin}</p>
                      </div>
                    )}
                    {companyDetails.youtube && (
                      <div>
                        <Label className="font-medium">YouTube</Label>
                        <p className="mt-1">{companyDetails.youtube}</p>
                      </div>
                    )}
                    {companyDetails.google_plus && (
                      <div>
                        <Label className="font-medium">Google Plus</Label>
                        <p className="mt-1">{companyDetails.google_plus}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p>
                  No company details available. Click "Add Details" to get
                  started.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Settings;
