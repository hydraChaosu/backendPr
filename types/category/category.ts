import {CategoryEntity} from "./category.entity";

export type CreateCategoryReq = Omit<CategoryEntity, 'id'>;

export interface SetCategoryForCategoryReq {
    name: string;
}
