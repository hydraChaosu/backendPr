import { CategoryEntity } from "./category.entity";

export type CreateCategoryReq = Omit<CategoryEntity, "id">;

export interface SetCategoryForCategoryReq {
  name: string;
}

export interface UpdateCategoryForCategoryReq {
  name: string;
  id: string;
}

export interface GetOneCategoryReq {
  id: string;
}

export interface DeleteOneCategoryReq {
  id: string;
}
