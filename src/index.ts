
export { Pager, PagingOptions } from './helpers/pager';
export { Router } from './helpers/router';
export { ArgsModel } from './helpers/args';

import { ArgsModel } from './helpers/args';
import { Message, Client } from 'discord.js';

/**
 * @interface Route
 * @description 
 * Properties of a route. 
 * Ensures we can make decisions based on the properties implemented via this interface.
 * @var {String} name - name of route
 * @var {Function} controller - function to be executed on match
 * @var {Array<String>} alias - Array of alias' to match on
 * @var {iRoute[]} children - Child routes
 * @var {Boolean} default - is this the default child route?
 */
export interface Route {
	name: String,
	controller?: RouteController,
	alias: String[],
    children?: Route[],
    default?: Boolean,
    argOptions?: ArgParseOptions[],
}

/**
 * @interface RouteController
 * 
 * @description
 * RouteController defines arguments taken by controllers
 */
export interface RouteController {
	(Args: String[], MessageRequest: Message, Client: Client, ArgModel? : ArgsModel): void,
}

export interface ArgParseOptions {
    name: string;
    flags: String[];
    exists?: boolean;
    getValue?: boolean;
    value?: string;
}