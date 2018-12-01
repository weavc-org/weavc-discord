import { Message, Client } from "discord.js";
import { PlayerResult, QueueEntry, PlayerOptions } from '../';
export declare class Player {
    constructor();
    /**
     * @name Add
     * @description Manages adding to guild queue
     */
    Add(MessageRequest: Message, Client: Client, Options: PlayerOptions): Promise<PlayerResult>;
    /**
     * @name Queue
     * @description Sends queue in list format back to guild channel
     */
    Queue(MessageRequest: Message, Client: Client, Options: PlayerOptions): Promise<PlayerResult>;
    /**
     * @name Play
     * @description Joins requesting users voice channel and starts playback of guild queue
     */
    Play(MessageRequest: Message, Client: Client, Options: PlayerOptions): Promise<PlayerResult>;
    /**
     * @name Stop
     * @description Stops playback for guild, leaves voiceChannel
     */
    Stop(MessageRequest: Message, Client: Client, Options: PlayerOptions): Promise<PlayerResult>;
    /**
     * @name Skip
     * @description Skips playback currently in progress or about to be played
     */
    Skip(MessageRequest: Message, Client: Client, Options: PlayerOptions): Promise<PlayerResult>;
    /**
     * @name Clear
     * @description Clears guild Queue
     */
    Clear(MessageRequest: Message, Client: Client, Options: PlayerOptions): Promise<PlayerResult>;
    /**
     * @name Playback
     * @description
     * Handles to audio playback to given voice channel
     * Also manages the queue whilst the guild has an active dispatcher
     */
    private Playback;
    /**
     * @name GetQueueForGuild
     * @description
     * Finds guild in this instance of the Queue class and returns The Queue entry for that guild
     * @param {String} ID
     *
     * @returns {Promise<QueueEntry>}
     */
    GetQueueForGuild(ID: String): Promise<QueueEntry>;
}
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
