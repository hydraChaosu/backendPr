export interface AdminAllItemsInBasketUserRequest {
    userId: string,
}

export interface AdminAllItemsInBasketByTypeRequest {
    shopItemId: string;
}

export interface AdminGetOneItemInBasketRequest {
    itemId: string;
}

export interface AdminAddItemToUserItemInBasketRequest {
    shopItemId: string;
    userId: string
}

export interface AdminEditItemInBasketRequest {
    shopItemId?: string;
    userId?: string;
    id: string;
    quantity: number;
}

export interface AdminDeleteItemInBasketRequest {
    id: string;
}
