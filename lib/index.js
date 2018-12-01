"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pager_1 = require("./helpers/pager");
exports.Pager = pager_1.Pager;
exports.PagingOptions = pager_1.PagingOptions;
var router_1 = require("./helpers/router");
exports.Router = router_1.Router;
var player_1 = require("./helpers/player");
exports.Player = player_1.Player;
/**
 * @class
 * @name PlayerOptions
 * @description
 * Outlines the options that can be passed into the player.
 * At a later date this will help allow volume and other settings per guild.
 * As of now it just contains the URL of the Youtube video
 */
class PlayerOptions {
}
exports.PlayerOptions = PlayerOptions;
/**
 * @enum
 * @name PlayerAction
 * @description
 * Stores each of the actions the player function can perform with a request
 */
var PlayerAction;
(function (PlayerAction) {
    PlayerAction[PlayerAction["play"] = 0] = "play";
    PlayerAction[PlayerAction["stop"] = 1] = "stop";
    PlayerAction[PlayerAction["add"] = 2] = "add";
    PlayerAction[PlayerAction["skip"] = 3] = "skip";
    PlayerAction[PlayerAction["queue"] = 4] = "queue";
    PlayerAction[PlayerAction["clear"] = 5] = "clear";
})(PlayerAction = exports.PlayerAction || (exports.PlayerAction = {}));
