"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Builds Response model
 * @param {String} message
 * @param {ContentTypes} contentType
 * @param {ResponseTypes} responseType
 * @param {RichEmbed} embed
 * @returns {ResponseModel}
 */
function Build(message, contentType = ContentTypes.text, responseType = ResponseTypes.reply, embed = null) {
    var model = {
        message: message,
        contentType: contentType,
        responsetype: responseType,
        embed: embed
    };
    return model;
}
exports.Build = Build;
var ContentTypes;
(function (ContentTypes) {
    ContentTypes[ContentTypes["text"] = 0] = "text";
    ContentTypes[ContentTypes["code"] = 1] = "code";
    ContentTypes[ContentTypes["embed"] = 2] = "embed";
})(ContentTypes = exports.ContentTypes || (exports.ContentTypes = {}));
var ResponseTypes;
(function (ResponseTypes) {
    ResponseTypes[ResponseTypes["reply"] = 0] = "reply";
    ResponseTypes[ResponseTypes["send"] = 1] = "send";
    ResponseTypes[ResponseTypes["page"] = 2] = "page";
})(ResponseTypes = exports.ResponseTypes || (exports.ResponseTypes = {}));
class ResponseModel {
}
exports.ResponseModel = ResponseModel;
