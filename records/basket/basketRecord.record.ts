import {pool} from "../../utils/db";
import {ValidationError} from "../../utils/errors";
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";
import {ItemInBasketEntity} from "../../types/itemInBasket";

type BasketRecordResults = [ItemInBasketEntity[], FieldPacket[]]

export class BasketRecord implements ItemInBasketEntity {

    id: string;
    itemId: string;
    userId: string;
    quantity: number;

    constructor(obj: ItemInBasketEntity) {

        if (!obj.itemId) {
            throw new ValidationError('musi byc itemId');
        }

        if (!obj.userId) {
            throw new ValidationError('musi byc userId');
        }

        if (!obj.quantity || obj.quantity <= 0) {
            throw new ValidationError('ilosc zakupionych rzeczy musi byc wieksza nic 0');
        }

        this.id = obj.id;
        this.userId = obj.userId
        this.itemId = obj.itemId
        this.quantity = obj.quantity

    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        await pool.execute("INSERT INTO `basketelements`(`id`, `userId`, `itemId`, `quantity`) VALUES(:id, :userId, :itemId, :quantity)", {
            id: this.id,
            userId: this.userId,
            itemId: this.itemId,
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

    static async listAllItemsForUser(userId: string) : Promise<BasketRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `basketelements` WHERE ` `userId` = :userId", {
            userId,
        }))as BasketRecordResults;
        return results.map(obj => new BasketRecord(obj));
    }

    static async listAllSameShopItems(shopItem: string) : Promise<BasketRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `basketelements` WHERE ` `userId` = :shopItem", {
            shopItem,
        }))as BasketRecordResults;
        return results.map(obj => new BasketRecord(obj));
    }

    static async listAll(): Promise<BasketRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `basketelements`")) as BasketRecordResults;
        return results.map(obj => new BasketRecord(obj));
    }

    static async getOne(id: string): Promise<BasketRecord | null> {
        const [results] = (await pool.execute("SELECT * FROM `basketelements` WHERE `id` = :id", {
            id,
        })) as BasketRecordResults;
        return results.length === 0 ? null : new BasketRecord(results[0]);
    }

}
