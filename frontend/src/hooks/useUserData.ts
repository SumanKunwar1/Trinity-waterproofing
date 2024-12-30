import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  if (!response.ok)
    throw new Error("An error occurred while fetching the data.");
  return response.json();
};

export function useUserData() {
  const userId = JSON.parse(localStorage.getItem("userId") || "");

  const { data: cartData, error: cartError } = useSWR(
    `/api/cart/${userId}`,
    fetcher
  );
  const { data: wishlistData, error: wishlistError } = useSWR(
    `/api/wishlist/${userId}`,
    fetcher
  );
  const { data: orderData, error: orderError } = useSWR(
    `/api/order/user/${userId}`,
    fetcher
  );
  const { data: addressData, error: addressError } = useSWR(
    `/api/users/addressBook/${userId}`,
    fetcher
  );

  const isLoading =
    !cartData &&
    !cartError &&
    !wishlistData &&
    !wishlistError &&
    !orderData &&
    !orderError &&
    !addressData &&
    !addressError;

  return {
    cart: cartData?.items || [],
    wishlist: wishlistData?.items || [],
    orders: orderData || [],
    addresses: addressData?.addressBook || [],
    isLoading,
    isError: cartError || wishlistError || orderError || addressError,
  };
}
