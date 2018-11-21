import { Message, Client } from "discord.js";
import { ResponseModel } from "./response";
import { Help } from '../routes/help';
import { Github } from '../routes/github';
import { Hello } from '../routes/hello';
import { Play } from '../routes/play'; 

/**
 * @name Routes
 * @description 
 * Array of valid class routes.
 * If one of the alias' matches the first index of Message, use matched class.
 * Defaults to index 0.
 * @implements {iRoute}
 * @default [0]
 */
var Routes:Array<iRoute> = [
	{ name:'default', route: Help, alias: [], matchcase: false },
	{ name:'hello', route: Hello, alias: ['hello', 'hi', 'hey', 'hoi'], matchcase: false },
	{ name:'help', route: Help, alias: ['help', '-h'], matchcase: false },
	{ name:'play', route: Play, alias: ['play'], matchcase: false },
	{ name:'github', route: Github, alias: ['git', 'github'], matchcase: false },
]

/**
 * @name Router
 * @description
 * Makes workflow decisions based on the message recived from discord user
 * and the implemented Routing.
 * Will only handle 2 deep routes for the moment (i.e. play stop). I can't think of many instances to use more than this.
 * @param {Array<String>} Message The user message, split on spaces
 * @param {Message} MessageRequest Full message class, recieved from discord server
 * @param {Client} Client Class detailing the bot you are currently logged in as
 * @param {Function} Result Callback result. Takes ResponseModel
 */
export function Router(Message: Array<String>, MessageRequest: Message, Client: Client, Result: Function) {

	var ClassRoute: iRouteClass = undefined;
	var InnerRoute: Function = undefined;

	if (Message[0]) {
		Routes.forEach((r) => {
			let initial_command = Message[0];
			if (!r.matchcase) { r.alias = ArrayToLower(r.alias); initial_command = initial_command.toLowerCase(); }
			if (r.alias.some(x => x === initial_command)) {
				ClassRoute = new r.route(Message, MessageRequest, Client);
			}
		})
	}
	if (ClassRoute == undefined) { ClassRoute = new Routes[0].route(Message, MessageRequest, Client); }

	if (Message[1]) {
		ClassRoute.Routes.forEach((r) => {
			let secondary_command = Message[1];
			if (!r.matchcase) { r.alias = ArrayToLower(r.alias); secondary_command = secondary_command.toLowerCase(); }
			if (r.alias.some(x => x === secondary_command)) {
				InnerRoute = r.route;
			}
		});
	}
	if (InnerRoute == undefined) { InnerRoute = ClassRoute.default }

	InnerRoute(ClassRoute, (response: ResponseModel) => {
		Result(response);
	})
 }

/**
 * @name ArrayToLower
 * @description Converts an array of strings, to lowercase
 * @param {Array<String>} array Array to convert
 * @returns {Array<String>} Converted array 
 */
function ArrayToLower(array: Array<String>) : Array<String> {
	for (var x = 0; x < array.length; x++) {
		array[x] = array[x].toLowerCase();
	}
	return array;
 }


/**
 * @interface iRoute
 * @description 
 * Properties of a route. 
 * Ensures we can make decisions based on the properties implemented via this interface.
 */
export interface iRoute {
	name: String,
	route: any,
	alias: Array<String>,
	matchcase: Boolean,
}

/**
 * @interface iRouteClass
 * @description Properties of a routing class.
 */
export interface iRouteClass {
	default: Function,
	Routes: Array<iRoute>
}