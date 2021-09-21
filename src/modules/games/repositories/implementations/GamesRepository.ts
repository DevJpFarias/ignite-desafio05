import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("LOWER(games.title) LIKE LOWER(:title)", { title: `%${param}%` })
      .getMany()
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(` SELECT COUNT(title) FROM games; `)
    
    // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
    .createQueryBuilder("games")
    //.where("games.id = :id", { id: id })
    //.leftJoinAndSelect('users_games_games', 'usersId')
    .relation(Game, "users")
    .of(id)
    .loadMany()

      // SELECT * FROM games game WHERE games.id = id
      // Complete usando query builder
  }
}
