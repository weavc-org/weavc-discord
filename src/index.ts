
export { Pager, PagingOptions } from './helpers/pager';
export { Router } from './helpers/router';
export { ArgsModel, ParseArgs } from './helpers/args';

import { ArgsModel } from './helpers/args';
import { Message, Client } from 'discord.js';

export interface Route {
	name: String,
	handler?: RouteHandler,
	alias: String[],
    children?: Route[],
    default?: Boolean,
    args?: ArgParser[],
}

export interface RouteHandler {
	(message: Message, client: Client, args? : ArgsModel): void,
}

export interface ArgParser {
    name: string;
    flags: String[];
    getValue?: boolean;
}

export interface ArgParserValues extends ArgParser {

    exists?: boolean;
    value?: string;
}