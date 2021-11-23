import { Knex } from 'knex';
import { ArmyUnit, CivilianUnit, PlayerClass, PlayerRace } from '../../types/typings';

export interface UserData {
  id: number;
  displayName: string;
  email: string;
  passwordHash: string;
  race: PlayerRace;
  class: PlayerClass;
  units: (ArmyUnit | CivilianUnit)[];
  experience: number;
  gold: number;
  goldInBank: number;
  fortLevel: number;
  fortHitpoints: number;
  attackTurns: number;
}

const mockUserData: UserData[] = [
  {
    id: 1,
    displayName: 'John Doe',
    email: 'moppler@email.com',
    passwordHash: '$2b$10$Zdf/HbQm4.CzYUoj1FoY5O9ng0GxJumavLpgPCqMDaTL4gc7Ntc0S', // password
    race: 'UNDEAD',
    class: 'FIGHTER',
    units: [
      { unitType: 'CITIZEN', quantity: 1 },
      { unitType: 'WORKER',  quantity: 2 },
      { unitType: 'OFFENSE', quantity: 3, unitLevel: 1 },
      { unitType: 'DEFENSE', quantity: 4, unitLevel: 1 },
      { unitType: 'SPY',     quantity: 5, unitLevel: 1 },
      { unitType: 'SENTRY',  quantity: 6, unitLevel: 1 }
    ],
    experience: 150,
    gold: 1000,
    goldInBank: 2000,
    fortLevel: 1,
    fortHitpoints: 90,
    attackTurns: 300
  }
];

class UserDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }
  
  async fetchById(id: number): Promise<UserData> {
    return mockUserData.find(user => user.id === id);
  }

  async fetchByEmail(email: string): Promise<UserData> {
    return mockUserData.find(user => user.email === email);
  }
}

export default UserDao;