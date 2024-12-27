export interface ICartItem {
  _id?: string;
  productId: string;
  name: string;
  description: string;
  inStock: number;
  productImage: string;
  color?: string;
  quantity: number;
  price: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  subtotal: number;
  total: number;
  created_at?: Date;
  updated_at?: Date;
}
