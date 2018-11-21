
import { RichEmbed, RichEmbedOptions } from 'discord.js';

/**
 * @enum ContentTypes
 * @description 
 * Describes each of the supported content types.
 */
export enum ContentTypes {
	text,
	code,
	embed
}

/**
 * @enum ResponseTypes
 * @description 
 * Describes each of the supported response types.
 * These help the bot make decisions on how to send the message back to the discord channel.
 */
export enum ResponseTypes {
	reply,
	send,
	page
}

/**
 * @name ResponseModel
 * @description 
 * The response model alllows us to make decisions on how to return the message to the channel.
 *
 */
export class ResponseModel {
	message: any;
	responsetype: ResponseTypes;
	contentType: ContentTypes;
	embeds?: Array<RichEmbed>;
	pagingoptions? : any;

	/**
	 * @description
	 * Builds Response model from given args
	 * @param {String} message Message content to send beck to discord channel. If using embeds the is used to store data used by the pager
	 * @param {ContentTypes} contentType Type of content being sent back
	 * @param {ResponseTypes} responseType Method used to respond to the discord channel
	 * @param {Array<RichEmbed>} embeds Array of Embed decriptions. Can be used as a single embed or multiple for paging through
	 */
	constructor(
		message: String, 
		contentType: ContentTypes = ContentTypes.text, 
		responseType: ResponseTypes = ResponseTypes.reply, 
		embeds: Array<RichEmbed> = null) 
	{
		this.message = message;
		this.contentType = contentType;
		this.responsetype = responseType;
		this.embeds = embeds;
	}
}