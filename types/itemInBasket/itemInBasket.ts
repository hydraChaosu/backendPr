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

export interface AllItemsInBasketUserRequest {
    userId: string,
}

export interface AllItemsInBasketByTypeRequest {
    shopItemId: string;
}

export interface GetOneItemInBasketRequest {
    itemId: string;
}

export interface AddItemToUserItemInBasketRequest {
    shopItemId: string;
    userId: string
}

export interface EditItemInBasketRequest {
    shopItemId?: string;
    userId?: string;
    id: string;
    quantity: number;
}
