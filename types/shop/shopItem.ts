import { ShopItemEntity } from "./shopItem.entity";

export type ShopItemCreateReq = Omit<ShopItemEntity, "id">;

export interface SetShopItemCategoryReq {
  id: string;
  name: string;
  quantity: number;
  price: number;
  img?: string;
  categoryId: string;
}

export interface GetByCategoryShopItemReq {
  categoryId: string;
}

export interface GetByNameShopItemReq {
  name: string;
}

export interface GetOneShopItemReq {
  id: string;
}

export interface DeleteOneShopItemReq {
  id: string;
}
