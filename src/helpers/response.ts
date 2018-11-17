
import { RichEmbed, RichEmbedOptions } from 'discord.js';

/**
 * Builds Response model
 * @param {String} message 
 * @param {ContentTypes} contentType 
 * @param {ResponseTypes} responseType 
 * @param {RichEmbed} embed 
 * @returns {ResponseModel}
 */
export function Build(message: String, contentType: ContentTypes = ContentTypes.text, responseType: ResponseTypes = ResponseTypes.reply, embed: RichEmbed = null) {
	var model: ResponseModel = {
		message: message,
		contentType: contentType,
		responsetype: responseType,
		embed: embed
	};
	return model;
}

export enum ContentTypes {
	text,
	code,
	embed
}

export enum ResponseTypes {
	reply,
	send,
	page
}

export class ResponseModel {
	message: any;
	responsetype: ResponseTypes;
	contentType: ContentTypes;
	embed?: RichEmbed;
}