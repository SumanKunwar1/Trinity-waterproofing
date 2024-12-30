import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch wishlist");
  return response.json();
};

export function useWishlistData() {
  const userId = localStorage.getItem("userId");
  const { data, error, mutate } = useSWR(
    userId ? `/api/wishlist/${JSON.parse(userId)}/` : null,
    fetcher
  );

  return {
    wishlist: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
