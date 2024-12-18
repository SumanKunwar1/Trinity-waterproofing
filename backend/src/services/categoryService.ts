import { Category, ICategory } from '../models'; 
import { httpMessages } from '../middlewares';

export class CategoryService {
  public async createCategory(categoryData: ICategory) {
    try {
        const { name } = categoryData;
        const isPresent = await Category.findOne({ name });
        if (isPresent) {
            throw httpMessages.ALREADY_PRESENT(`Category ${name}`);
        }
        const category = new Category(categoryData);
        await category.save();
        return category;
    } catch (error) {
      throw error; 
    }
  }
}
