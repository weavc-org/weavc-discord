import { Message, Client } from "discord.js";
import { ResponseModel } from "./response";
import { Help } from '../routes/help';
import { Github } from '../routes/github';
import { Hello } from '../routes/hello';
import { Play } from '../routes/play'; 

export interface iRoute {
	name: String,
	route: any,
	alias: Array<String>,
	matchcase: Boolean,
}

export interface iRouteClass {
	default: Function,
	Routes: Array<iRoute>
}

var Routes:Array<iRoute> = [
	{ name:'default', route: Help, alias: [], matchcase: false },
	{ name:'hello', route: Hello, alias: ['hello', 'hi', 'hey', 'hoi'], matchcase: false },
	{ name:'help', route: Help, alias: ['help', '-h'], matchcase: false },
	{ name:'play', route: Play, alias: ['play'], matchcase: false },
	{ name:'github', route: Github, alias: ['git', 'github'], matchcase: false },
]


export function Router(message: Array<String>, req: Message, client: Client, res: Function) {

	var ClassRoute: iRouteClass = undefined;
	var InnerRoute: Function = undefined;

	/**
	 * initial command
	 * cycles through the routes defined at top of this document.
	 * matches first arg of user message to an alias of the route.
	 * defaults to first index of routes (routes[0])
	 */
	if (message[0]) {
		Routes.forEach((r) => {
			let initial_command = message[0];
			if (!r.matchcase) { r.alias = matchcase_false(r.alias); initial_command = initial_command.toLowerCase(); }
			if (r.alias.some(x => x === initial_command)) {
				ClassRoute = new r.route(message, req, client);
			}
		})
	}
	if (ClassRoute == undefined) { ClassRoute = new Routes[0].route(message, req, client); }

	/**
	 * secondary command
	 * cycles through routes in matched route class
	 * matches second arg of user message to an alias in class routes
	 * defaults to route.default function
	 */
	if (message[1]) {
		ClassRoute.Routes.forEach((r) => {
			let secondary_command = message[1];
			if (!r.matchcase) { r.alias = matchcase_false(r.alias); secondary_command = secondary_command.toLowerCase(); }
			if (r.alias.some(x => x === secondary_command)) {
				InnerRoute = r.route;
			}
		});
	}
	if (InnerRoute == undefined) { InnerRoute = ClassRoute.default }

	//execute matched route, wait for response
	InnerRoute(ClassRoute, (response: ResponseModel) => {
		res(response);
	})
 }

 function matchcase_false(array: Array<String>) : Array<String> {
	for (var x = 0; x < array.length; x++) {
		array[x] = array[x].toLowerCase();
	}
	return array;
 }
