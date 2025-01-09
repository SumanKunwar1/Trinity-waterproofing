import * as yup from "yup";

export const serviceSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  image: yup
    .string()
    .url("Must be a valid URL")
    .required("Image URL is required"),
});

export const cardSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  image: yup
    .string()
    .url("Must be a valid URL")
    .required("Image URL is required"),
});
