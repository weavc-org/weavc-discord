import { Message, Client } from "discord.js";
import { Route } from "..";
import { ParseArgs } from "./args";


/**
 * @name Router
 * @class
 * @description
 * Handles routing between discord client and given controller routes.
 * 
 * @param {iRoute[]} Routes - Routes to controllers
 * @param {String[]} Prefixes - Array of accepted prefixes for this instance
 */
export class Router {
	
	Routes: Array<Route> = [];

	constructor(Routes: Array<Route>) {
		this.Routes = Routes;
	}

	/**
	 * @name Go
	 * @description
	 * Selects the matching route and passes on request to the matched controller
	 * 
	 * @param {Message} MessageRequest Full message class, recieved from discord server
	 * @param {Client} Client Class detailing the bot you are currently logged in as
	 */
	Go(MessageRequest: Message, Client: Client) {

		var Message = [];
		var split = MessageRequest.content.split(' ');
		if (split) Message = split;

		this.Routes.forEach(Route => {
			if (Route.alias.some((alias) => alias.toLowerCase() == Message[0].toLowerCase())) {
				this.SelectedRoute(Route, Message, 1).then(
					(R: Route) => {
						if (R.argOptions) {
							let Args = ParseArgs(MessageRequest.content, R.argOptions);
							return R.controller(Message, MessageRequest, Client, Args);
						}
						else {
							return R.controller(Message, MessageRequest, Client);
						}
					}, () => {
						return;
					}
				).catch((err) => {
					console.log(err)
				});
			}
		})
	}

	/**
	 * @name SelectedRoute
	 * @description 
	 * Manages child routes, once all matching have been found the last will be sent back to Go for execution
	 * 
	 * @param {iRoute} Route 
	 * @param {String[]} Message 
	 * @param {number} Index 
	 * 
	 * @returns {Promise<iRoute>}
	 */
	private SelectedRoute(Route: Route, Message: String[], Index: number) : Promise<Route> {
		return new Promise<Route> ((resolve, reject)=> {
			if (Message[Index] == undefined) { return resolve(Route); }
			if (Route.children != undefined && Route.children.length > 0) {
				this.GetDefaultChild(Route).then((Selected)=>{
					
					Route.children.forEach(RouteChild => {
						if (RouteChild.alias.some((a) => a.toLowerCase() == Message[Index].toLowerCase())) {
							Selected = RouteChild;
						}
					})
					if (Selected) {
						this.SelectedRoute(Selected, Message, Index+1).then(
							(R: Route) => {
								return resolve(R);
							}, () => {
								return;
							}
						).catch((err) => {
							console.log(err)
						});
					}
					else {
						reject();
					}
				}).catch((err)=> console.log(err));
			}
			else {
				return resolve(Route);
			}
		})
	}

	/**
	 * @name GetDefaultChild
	 * @description Finds the default child and returns it
	 * 
	 * @param {iRoute} Route
	 * @returns {Promeise<iRoute>} 
	 */
	private GetDefaultChild(Route: Route) : Promise<Route> {
		return new Promise<Route> ((resolve, reject) => {
			Route.children.forEach((RouteChild) => {
				if (RouteChild.default == true) return resolve(RouteChild);
			});
			return resolve(undefined);
		})
	}
}