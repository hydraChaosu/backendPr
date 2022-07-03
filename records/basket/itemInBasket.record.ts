import {pool} from "../../utils/db";
import {ValidationError} from "../../utils/errors";
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";
import {ItemInBasketEntity} from "../../types/itemInBasket";
import {exists, isBetween, isTypeOf} from "../../utils/dataCheck";

type ItemInBasketRecordResults = [ItemInBasketEntity[], FieldPacket[]]

export class ItemInBasketRecord implements ItemInBasketEntity {

    id?: string;
    shopItemId: string;
    userId: string;
    quantity: number;

    constructor(obj: ItemInBasketEntity) {

        exists(obj.shopItemId, 'shop item Id')
        isTypeOf(obj.shopItemId, 'string', 'shop item Id')

        exists(obj.userId, 'user Id')
        isTypeOf(obj.userId, 'string', 'user Id')

        exists(obj.quantity, 'quantity')
        isTypeOf(obj.quantity, 'number', 'quantity')
        isBetween(obj.quantity, 0, 9999, 'shop item quantity')

        this.id = obj.id;
        this.userId = obj.userId
        this.shopItemId = obj.shopItemId
        this.quantity = obj.quantity

    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        await pool.execute("INSERT INTO `basketelements`(`id`, `userId`, `itemId`, `quantity`) VALUES(:id, :userId, :shopItemId, :quantity)", {
            id: this.id,
            userId: this.userId,
            itemId: this.shopItemId,
            quantity: this.quantity,
        });

        return this.id;
    }

    async update() : Promise<void> {
        await pool.execute("UPDATE `basketelements` SET `quantity` = :quantity WHERE `id` = :id", {
            id: this.id,
            quantity: this.quantity,
        });
    }

    async delete() : Promise<void> {
        await pool.execute("DELETE FROM `basketelements` WHERE `id` = :id", {
            id: this.id
        })
    }

    static async listAllItemsForUser(userId: string) : Promise<ItemInBasketRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `basketelements` WHERE  `userId` = :userId", {
            userId,
        }))as ItemInBasketRecordResults;
        return results.map(obj => new ItemInBasketRecord(obj));
    }

    static async listAllSameShopItems(itemId: string) : Promise<ItemInBasketRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `basketelements` WHERE  `itemId` = :itemId", {
            itemId,
        }))as ItemInBasketRecordResults;
        return results.map(obj => new ItemInBasketRecord(obj));
    }

    static async listAll(): Promise<ItemInBasketRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `basketelements`")) as ItemInBasketRecordResults;
        return results.map(obj => new ItemInBasketRecord(obj));
    }

    static async getOne(id: string): Promise<ItemInBasketRecord | null> {
        const [results] = (await pool.execute("SELECT * FROM `basketelements` WHERE `id` = :id", {
            id,
        })) as ItemInBasketRecordResults;
        return results.length === 0 ? null : new ItemInBasketRecord(results[0]);
    }

}
