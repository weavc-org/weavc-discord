import { Message, Client, StreamDispatcher } from "discord.js";
/**
 * @name Player
 * @description
 * Player utility. Manages audio playback from youtube.
 *
 * @param {Message} MessageRequest
 * @param {Client} Client
 * @param {PlayerAction} Action
 * @param {PlayerOptions} Options
 */
export declare function Player(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions): void;
/**
 * @name GetQueueForGuild
 * @description
 * Finds guild in this instance of the Queue class and returns The Queue entry for that guild
 * @param {String} ID
 *
 * @returns {Promise<QueueEntry>}
 */
export declare function GetQueueForGuild(ID: String): Promise<QueueEntry>;
/**
 * @class
 * @name PlayerOptions
 * @description
 * Outlines the options that can be passed into the player.
 * At a later date this will help allow volume and other settings per guild.
 * As of now it just contains the URL of the Youtube video
 */
export declare class PlayerOptions {
    url: string;
}
/**
 * @interface
 * @name QueueEntry
 * @description
 * Stores playback details needed per guild
 * Will also contain settings in the future
 */
interface QueueEntry {
    guild: String;
    queue: VideoLink[];
    dispatcher?: StreamDispatcher;
}
/**
 * @interface
 * @name VideoLink
 * @description
 * Stores details about the linked youtube video
 * Again I plan to expand this at a later date.
 */
interface VideoLink {
    url: String;
    title: String;
}
/**
 * @enum
 * @name PlayerAction
 * @description
 * Stores each of the actions the player function can perform with a request
 */
export declare enum PlayerAction {
    play = 0,
    stop = 1,
    add = 2,
    skip = 3,
    queue = 4,
    clear = 5
}
export {};
