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
export declare class Router {
    Routes: Array<Route>;
    Prefixes: String[];
    constructor(Routes: Array<Route>, Prefixes?: String[]);
    /**
     * @name Go
     * @description
     * Selects the matching route and passes on request to the matched controller
     *
     * @param {Message} MessageRequest Full message class, recieved from discord server
     * @param {Client} Client Class detailing the bot you are currently logged in as
     */
    Go(MessageRequest: Message, Client: Client): void;
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
    private SelectedRoute;
    /**
     * @name GetDefaultChild
     * @description Finds the default child and returns it
     *
     * @param {iRoute} Route
     * @returns {Promeise<iRoute>}
     */
    private GetDefaultChild;
}
