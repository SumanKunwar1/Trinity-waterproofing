import mongoose, { Schema, Types } from 'mongoose';

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  retailPrice: { type: Number, required: true },
  wholeSalePrice: { type: Number, required: true },
  review: { type: Types.ObjectId, ref: 'Review' },  
  description: { type: String, default: ''},
  productImage: { type: String, required: true },
  image: [String],  
  features: [String],  
  brand: { type: String, required: true },
  variants: [
    {
      color: { type: String, required: true },
      volume: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  instock: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const subcategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  products: [productSchema], 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const categorySchema: Schema = new Schema({
  name: { type: String, required: true, unique:true },
  description: { type: String, required: true },
  subcategories: [subcategorySchema],  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

interface IVariant {
  color: string;
  volume: string;
  price: number;
}

interface IProduct {
  name: string;
  retailPrice: number;
  wholeSalePrice: number;
  productImage: string;
  image: string[];
  features: string[];
  brand: string;
  variants: IVariant[];
  instock: number;
  description?: string;
  review?: Types.ObjectId; 
  created_at?: Date;
  updated_at?: Date;
}

interface ISubcategory {
  name: string;
  description?: string;
  products?: IProduct[];
  created_at?: Date;
  updated_at?: Date;
}

interface ICategory {
  name: string;
  description: string;
  subcategories?: ISubcategory[];
  created_at?: Date;
  updated_at?: Date;
}


export { Category, ICategory , ISubcategory, IProduct , IVariant };
