export enum PokemonType {
  NORMAL = "normal",
  FIRE = "fire",
  WATER = "water",
  ELECTRIC = "electric",
  GRASS = "grass",
  ICE = "ice",
  FIGHTING = "fighting",
  POISON = "poison",
  GROUND = "ground",
  FLYING = "flying",
  PSYCHIC = "psychic",
  BUG = "bug",
  ROCK = "rock",
  GHOST = "ghost",
  DRAGON = "dragon",
  DARK = "dark",
  STEEL = "steel",
  FAIRY = "fairy",
}

export type SelectedPokemon = {
  name: string;
  index: number;
};

export type Team = SelectedPokemon[];

export type User = {
  _id: string;
  username: string;
  team: Team;
  battles: number;
  wins: number;
  losses: number;
};

export type BattlePokemon = {
  name: string;
  index: number;
  id: number;
  currentHp: number;
  totalHp: number;
  moves: string[];
  types: PokemonType[];
  stats: {
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
};

export type FullTeam = BattlePokemon[];

export enum BattleStatus {
  WAITING = "waiting",
  DISCONNECTED = "disconnected",
  CONNECT_ERROR = "connection_error",
  CONNECTED = "connected",
  FINISHED = "finished",
}

export type MoveInfo = {
  power: number;
  accuracy: number;
  type: PokemonType;
  isPhysical?: boolean;
};

export enum TurnType {
  SWITCH = "switch",
  ATTACK = "attack",
}

export type Turn = {
  battleId: string;
  userId: string;
  turnType: TurnType;
};

export type SwitchTurn = Turn & {
  turnType: TurnType.SWITCH;
  pokemonId: number;
};

export type AttackTurn = Turn & {
  turnType: TurnType.ATTACK;
  attacker: BattlePokemon;
  move: string;
};

export type LogEntry = {
  type: "header" | "text";
  text: string;
};

export type BattleState = {
  id: string;
  teams: {
    [userId: string]: FullTeam;
  };
  activePokemon: {
    [userId: string]: BattlePokemon | null;
  };
  usernames: {
    [userId: string]: string;
  };
  queuedTurns: Turn[];
  currentTurn: string[];
  turnType: TurnType;
  playerIds: string[];
  status: BattleStatus;
  turnCount: number;
  text: {
    [userId: string]: string;
  };
  log: LogEntry[];
};
