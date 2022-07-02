import {ShopItemEntity} from "./shopItem.entity";

export type ShopItemCreateReq = Omit<ShopItemEntity, 'id'>;

export interface SetShopItemCategoryReq {
    name: string;
    quantity: number;
    price: number;
    img?: string;
    categoryId: string;
}
