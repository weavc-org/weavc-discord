import { Message, Client } from "discord.js";
import { Route } from "..";


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
	Prefixes: String[] = [];

	constructor(Routes: Array<Route>, Prefixes: String[] = []) {
		this.Routes = Routes;
		this.Prefixes = Prefixes;
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

		var Message = MessageRequest.content.split(' ');

		if (this.Prefixes.length > 0) {
			let Prefix = Message.shift();
			if (!this.Prefixes.some((p:string) => p === Prefix)) return;
		}

		this.Routes.forEach(Route => {
			if (Route.alias.some((alias) => alias.toLowerCase() === Message[0].toLowerCase())) {
				this.SelectedRoute(Route, Message, 1).then(
					(R: Route) => {
						return R.controller(Message, MessageRequest, Client);
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
			if (Route.children != undefined && Route.children.length > 0) {
				this.GetDefaultChild(Route).then((Selected)=>{
					Route.children.forEach(RouteChild => {
						if (RouteChild.alias.some((a) => a.toLowerCase() === Message[Index].toLowerCase())) {
							Selected = RouteChild;
						}
					})
					if (Selected) {
						this.SelectedRoute(Selected, Message, Index++).then(
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
				if (RouteChild.default === true) resolve(RouteChild);
			},()=>{
				resolve(undefined);
			});
		})
	}
}