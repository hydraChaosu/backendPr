import { ItemInBasketEntity } from "./itemInBasket.entity";

export type ItemInBasketCreateReq = Omit<ItemInBasketEntity, 'id'>;

export interface SetItemInBasketReq {
    quantity: number;
}
