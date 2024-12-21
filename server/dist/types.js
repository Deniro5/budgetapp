"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnType = exports.BattleStatus = exports.PokemonType = void 0;
var PokemonType;
(function (PokemonType) {
    PokemonType["NORMAL"] = "normal";
    PokemonType["FIRE"] = "fire";
    PokemonType["WATER"] = "water";
    PokemonType["ELECTRIC"] = "electric";
    PokemonType["GRASS"] = "grass";
    PokemonType["ICE"] = "ice";
    PokemonType["FIGHTING"] = "fighting";
    PokemonType["POISON"] = "poison";
    PokemonType["GROUND"] = "ground";
    PokemonType["FLYING"] = "flying";
    PokemonType["PSYCHIC"] = "psychic";
    PokemonType["BUG"] = "bug";
    PokemonType["ROCK"] = "rock";
    PokemonType["GHOST"] = "ghost";
    PokemonType["DRAGON"] = "dragon";
    PokemonType["DARK"] = "dark";
    PokemonType["STEEL"] = "steel";
    PokemonType["FAIRY"] = "fairy";
})(PokemonType || (exports.PokemonType = PokemonType = {}));
var BattleStatus;
(function (BattleStatus) {
    BattleStatus["WAITING"] = "waiting";
    BattleStatus["DISCONNECTED"] = "disconnected";
    BattleStatus["CONNECT_ERROR"] = "connection_error";
    BattleStatus["CONNECTED"] = "connected";
    BattleStatus["FINISHED"] = "finished";
})(BattleStatus || (exports.BattleStatus = BattleStatus = {}));
var TurnType;
(function (TurnType) {
    TurnType["SWITCH"] = "switch";
    TurnType["ATTACK"] = "attack";
})(TurnType || (exports.TurnType = TurnType = {}));
