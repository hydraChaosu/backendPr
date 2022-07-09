import { ItemInBasketEntity } from "./itemInBasket.entity";

export type ItemInBasketCreateReq = Omit<ItemInBasketEntity, 'id'>;

export interface SetItemInBasketReq {
    quantity: number;
    id: string;
}

export interface GetItemInBasketRequest {
    id: string,
}

export interface DeleteItemInBasketRequest {
    id: string,
}
