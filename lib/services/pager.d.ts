import { Message, Client, RichEmbed } from "discord.js";
/**
 * @name Pager
 * @description
 * Handles embed paging, allowing the user to control which pages they are viewing via reactions
 * @param {Message} msg - Message Model from users request, content, channel, guild etc
 * @param {Client} Client - Bots client class, contains information about the logged in bot
 * @param {Array<RichEmbed>} Embeds - Embeds to page through
 * @param {PagingOptions} Options - Options to allow control over certain aspects of Paging functionality
 */
export declare function Pager(msg: Message, Client: Client, Embeds: Array<RichEmbed>, Options?: PagingOptions): void;
/**
 * @name PagingOptions
 * @description
 * Allows for custom settings/options to be set for each paging instance
 * @var timeout - Period of time to track reactions for
 * @var timeoutdelete - deletes embed after timeout
 * @var allowallreactions - Allows everyone to control the paging, not just the requesting user
 * @var reactionremoval - Removing a reaction also triggers 'collect' event
 * @var startpage - page that user will start on
 */
export declare class PagingOptions {
    timeout: Number;
    timeoutdelete: Boolean;
    allowallreactions: Boolean;
    reactionremoval: Boolean;
    startpage: Number;
}
