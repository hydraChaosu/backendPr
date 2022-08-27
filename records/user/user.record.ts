import { pool } from "../../utils/db";
import { ValidationError } from "../../utils/errors";
import { v4 as uuid } from "uuid";
import { FieldPacket } from "mysql2";
import { UserEntity } from "../../types";
import { exists, isBetween, isTypeOf } from "../../utils/dataCheck";

type UserRecordResults = [UserRecord[], FieldPacket[]];

export class UserRecord implements UserEntity {
  id?: string;
  email: string;
  login: string;
  password: string;
  token?: string;
  //TODO activateToken?: string;
  //TODO isActive: 0 | 1;

  constructor(obj: UserEntity) {
    exists(obj.password, "password");
    isTypeOf(obj.password, "string", "password");
    isBetween(obj.password.length, 3, 60, "password length");

    exists(obj.login, "login");
    isTypeOf(obj.login, "string", "login");
    isBetween(obj.login.length, 3, 20, "login length");

    exists(obj.email, "email");
    isTypeOf(obj.email, "string", "email");
    if (!obj.email.match(/@/)) {
      throw new ValidationError("email is not correct");
    }
    isBetween(obj.email.length, 3, 40, "email length");

    if (obj.token) {
      isTypeOf(obj.token, "string", "token");
    }

    // if (obj.activateToken) {
    //   isTypeOf(obj.activateToken, "string", "activate token");
    // }
    //
    // if (obj.isActive) {
    //   isTypeOf(obj.isActive, "number", "is active");
    // }

    this.id = obj.id;
    this.login = obj.login;
    this.email = obj.email;
    this.password = obj.password;
    this.token = obj.token;
    // this.activateToken = obj.activateToken;
    // this.isActive = obj.isActive ? obj.isActive : 0;
  }

  async insert(): Promise<string> {
    if (!this.id) {
      this.id = uuid();
    }

    //create activate token
    //and send this to an email

    console.log(this);
    await pool.execute(
      "INSERT INTO `users`(`id`, `login`, `email`,`password`) VALUES(:id, :login, :email, :password)",
      {
        id: this.id,
        login: this.login,
        email: this.email,
        password: this.password,
      }
    );

    return this.id;
  }

  async update(): Promise<void> {
    await pool.execute(
      "UPDATE `users` SET `login` = :login, `email` = :email, `password` = :password, `token` = :token WHERE `id` = :id",
      {
        id: this.id,
        login: this.login,
        email: this.email,
        password: this.password,
        token: this.token,
        // activateToken: this.activateToken,
        // isActive: this.isActive,
      }
    );
  }

  async delete(): Promise<void> {
    await pool.execute("DELETE FROM `users` WHERE `id` = :id", {
      id: this.id,
    });
  }

  static async listAll(): Promise<UserEntity[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `users` ORDER BY `email`"
    )) as UserRecordResults;
    return results.map((obj) => new UserRecord(obj));
  }

  static async getOne(id: string): Promise<UserRecord | null> {
    const [results] = (await pool.execute(
      "SELECT * FROM `users` WHERE `id` = :id",
      {
        id,
      }
    )) as UserRecordResults;
    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  static async getOneByToken(token: string): Promise<UserRecord | null> {
    const [results] = (await pool.execute(
      "SELECT * FROM `users` WHERE `token` = :token",
      {
        token,
      }
    )) as UserRecordResults;
    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  static async getOneByLogin(login: string): Promise<UserRecord | null> {
    const [results] = (await pool.execute(
      "SELECT * FROM `users` WHERE `login` = :login",
      {
        login,
      }
    )) as UserRecordResults;
    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  static async isLoginUsed(login: string): Promise<Boolean> {
    const [results] = (await pool.execute(
      "SELECT * FROM `users` WHERE `login` = :login",
      {
        login,
      }
    )) as UserRecordResults;
    return results.length !== 0;
  }

  static async isEmailUsed(email: string): Promise<Boolean> {
    const [results] = (await pool.execute(
      "SELECT * FROM `users` WHERE `email` = :email",
      {
        email,
      }
    )) as UserRecordResults;
    return results.length !== 0;
  }

  static async isAuthTokenUsed(token: string): Promise<Boolean> {
    const [results] = (await pool.execute(
      "SELECT * FROM `users` WHERE `token` = :token",
      {
        token,
      }
    )) as UserRecordResults;
    return results.length !== 0;
  }
}
