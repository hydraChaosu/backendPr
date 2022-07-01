import {pool} from "../../utils/db";
import {ValidationError} from "../../utils/errors";
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";
import {UserEntity} from '../../types'

type UserRecordResults = [UserRecord[], FieldPacket[]]

export class UserRecord implements UserEntity{

    //user validation
    //create personalinfoid

    id: string;
    email: string;
    login: string;
    password: string;

    constructor(obj: UserEntity) {
        if (!obj.login || obj.login.length < 3 || obj.login.length > 25) {
            throw new ValidationError('login should be beetwen 3 and 50 characters.');
        }

        if (!obj.password || obj.password.length < 3 || obj.password.length > 25) {
            throw new ValidationError('password should be beetwen 3 and 50 characters.');
        }

        if (!obj.email || !obj.email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            throw new ValidationError('email is not correct');
        }

        this.id = obj.id;
        this.login = obj.login;
        this.email = obj.email;
        this.password = obj.password;

    }



    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        await pool.execute("INSERT INTO `users`(`id`, `login`, `email`,`password`) VALUES(:id, :name, :email, :password)", {
            id: this.id,
            login: this.login,
            email: this.email,
            password: this.password
        });

        return this.id;
    }

    async update() : Promise<void> {
        await pool.execute("UPDATE `users` SET `login` = :login, `email` = :email, `password` = :password WHERE `id` = :id", {
            id: this.id,
            login: this.login,
            email: this.email,
            password: this.password
        });
    }

    async delete() : Promise<void> {
        await pool.execute("DELETE FROM `users` WHERE `id` = :id", {
            id: this.id
        })
    }

    static async listAll(): Promise<UserEntity[]> {
        const [results] = (await pool.execute("SELECT * FROM `users` ORDER BY `email` ASC")) as UserRecordResults;
        return results.map(obj => new UserRecord(obj));
    }

    static async getOne(id: string): Promise<UserRecord | null> {
        const [results] = (await pool.execute("SELECT * FROM `users` WHERE `id` = :id", {
            id,
        })) as UserRecordResults;
        return results.length === 0 ? null : new UserRecord(results[0]);
    }
}
