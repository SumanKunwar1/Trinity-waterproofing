import mongoose, { Schema} from 'mongoose';

export interface IReview {
    name: string;
    content: string;
    rating: number;
    date: Date;
}

const reviewSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  date: {
    type: Date,
    required: true,
  },
});

export const Review = mongoose.model<IReview>('Review', reviewSchema);

