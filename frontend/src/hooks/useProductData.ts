import useSWR from "swr";
import axios from "axios";
import type { IProduct, Category, Brand } from "../types";

// Updated fetcher to accept optional config parameter
const fetcher = (url: string, config = {}) =>
  axios.get(url, config).then((res) => res.data);

export function useProducts(userId: string | null) {
  const isLoggedIn = !!localStorage.getItem("authToken");
  const url =
    userId && isLoggedIn ? `/api/product/user/${userId}` : "/api/product";

  const headers = isLoggedIn
    ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    : {};

  // Pass config object properly to the fetcher
  const { data, error, mutate } = useSWR<IProduct[]>(
    [url, headers],
    ([url, headers]) => fetcher(url, { headers })
  );

  return {
    products: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useCategories() {
  const { data, error, mutate } = useSWR<Category[]>("/api/category", fetcher);

  return {
    categories: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useBrands() {
  const { data, error, mutate } = useSWR<Brand[]>("/api/brand", fetcher);

  return {
    brands: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useProductData(userId: string | null) {
  const {
    products,
    isLoading: productsLoading,
    isError: productsError,
    mutate: mutateProducts,
  } = useProducts(userId);
  const {
    categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    mutate: mutateCategories,
  } = useCategories();
  const {
    brands,
    isLoading: brandsLoading,
    isError: brandsError,
    mutate: mutateBrands,
  } = useBrands();

  const isLoading = productsLoading || categoriesLoading || brandsLoading;
  const isError = productsError || categoriesError || brandsError;

  return {
    products,
    categories,
    brands,
    isLoading,
    isError,
    mutateProducts,
    mutateCategories,
    mutateBrands,
  };
}
