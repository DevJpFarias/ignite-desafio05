import { createQueryBuilder, getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository
    .createQueryBuilder("users")
    .leftJoinAndSelect("users.games", "game")
    .where("users.id = :id", { id: user_id })
    .getOne();

    return user!
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository
    .createQueryBuilder("users")
    .orderBy("users.first_name", "ASC")
    .getMany();
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository
    .createQueryBuilder("users")
    .where("LOWER(users.first_name) = LOWER(:first_Name)", { first_Name: first_name })
    .andWhere("LOWER(users.last_name) = LOWER(:last_Name)", {last_Name: last_name })
    .getMany();
  }
}
