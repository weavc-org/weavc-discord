import { Message, Client } from "discord.js";
import { Route } from "..";
import { ParseArgs } from "./args";

export class Router {
	
	Routes: Route[] = [];

	constructor(routes: Route[]) {
		this.Routes = routes;
	}

	async Go(message: Message) {
		return new Promise<any> (async (resolve) => {
			let m = message.content.split(' ');
			let route = await this.findRoute(m, this.Routes, undefined);
			
			if (!route) return resolve();

			if (route.args) {
				let defaultArg = route.args.find(opt => opt.name == '[default]');
				if (defaultArg) {
					defaultArg.flags = route.alias;
				}
	
				let args = ParseArgs(message.content, route.args);
				route.handler(message, message.client, args);
			}
			else {
				route.handler(message, message.client);
			}

			return resolve();
		});
	}

	async findRoute(message: string[], routes: Route[], currentRoute?: Route) : Promise<Route> {
		return new Promise<Route> (async (resolve) => {

			if (message == undefined || message.length <= 0) {
				if (currentRoute  != undefined) {
					return resolve(await this.defaultChild(currentRoute));		
				}
				return resolve(undefined);
			}

			for (let i = 0; i < routes.length; i++) {
				let route = routes[i];
				let match = route.alias.some((alias) => alias.toLowerCase() == message[0].toLowerCase())
				if (match) {
					if (route.children != undefined && route.children.length > 0) {
						message.splice(0, 1)
						return resolve(await this.findRoute(message, route.children, route));
					}
					else {
						return resolve(route);
					}
				}
			}

			if (currentRoute != undefined) {
				return resolve(await this.defaultChild(currentRoute));		
			}

			return resolve(undefined);
		});
	}

	async defaultChild(route: Route) : Promise<Route> {
		return new Promise<Route> ((resolve) => {
			for (let i = 0; i < route.children.length; i++) {
				let child = route.children[i];
				if (child.default == true) { 
					return resolve(child);
				}
			}
			return resolve(route);
		})
	}
}