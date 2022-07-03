import { ItemInBasketEntity } from "./itemInBasket.entity";

export type CreateItemInBasketReq = Omit<ItemInBasketEntity, 'id'>;

export interface SetItemInBasketReq {
    shopItemId: string;
    userId: string;
    quantity: number;
}
