"use strict";
// html-scraper.ts
/* Scrapes a Kijiji ad using the public-facing website */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeHTML = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var cheerio_1 = __importDefault(require("cheerio"));
var constants_1 = require("../constants");
var helpers_1 = require("../helpers");
var scraper_1 = require("../scraper");
function castAttributeValue(attr) {
    var _a, _b;
    var value = attr.machineValue;
    if (typeof value !== "string") {
        return undefined;
    }
    value = value.trim();
    var localizedValue = (((_b = (_a = attr.localeSpecificValues) === null || _a === void 0 ? void 0 : _a.en) === null || _b === void 0 ? void 0 : _b.value) || "").toLowerCase();
    // Kijiji only returns strings. Convert to appropriate types
    if (value.toLowerCase() === "true") {
        return true;
    }
    else if (value.toLowerCase() === "false") {
        return false;
    }
    else if ((0, helpers_1.isNumber)(value)) {
        // Numeric values are sometimes inaccurate. For example, numberbathrooms
        // is multipled by 10. Prefer localized version if it is also a number.
        if ((0, helpers_1.isNumber)(localizedValue)) {
            return Number(localizedValue);
        }
        return Number(value);
    }
    else if (!isNaN(Date.parse(value)) && (0, helpers_1.isNumber)(value[0])) {
        return new Date(value);
    }
    else {
        return value;
    }
}
/* Parses the HTML of a Kijiji ad for its important information */
function parseResponseHTML(html) {
    var info = new scraper_1.AdInfo();
    // Kijiji is nice and gives us an object containing ad info
    var $ = cheerio_1.default.load(html);
    var adData = {};
    var json = $("#FesLoader > script").text().replace("window.__data=", "");
    json = json.substring(0, json.length - 1); // Remove trailing semicolon
    if (json.length === 0 || Object.keys(adData = JSON.parse(json)).length === 0 ||
        !adData.hasOwnProperty("config") || !adData.config.hasOwnProperty("adInfo") ||
        !adData.config.hasOwnProperty("VIP")) {
        return null;
    }
    adData = adData.config;
    var adId = adData.VIP.adId;
    var adTitle = adData.adInfo.title;
    var adDateMs = adData.VIP.sortingDate;
    // We can reasonably expect these to be present
    if (adId === undefined || adTitle === undefined || adDateMs === undefined) {
        return null;
    }
    info.id = adId.toString();
    info.title = adTitle;
    info.description = (0, helpers_1.cleanAdDescription)(adData.VIP.description || "");
    info.date = new Date(adDateMs);
    info.image = (0, helpers_1.getLargeImageURL)(adData.adInfo.sharingImageUrl || "");
    (adData.VIP.media || []).forEach(function (m) {
        if (m.type === "image" && m.href && typeof m.href === "string") {
            info.images.push((0, helpers_1.getLargeImageURL)(m.href));
        }
    });
    (adData.VIP.adAttributes || []).forEach(function (a) {
        var name = a.machineKey;
        var value = castAttributeValue(a);
        if (typeof name === "string" && value !== undefined) {
            info.attributes[name] = value;
        }
    });
    // Add other attributes of interest
    // TODO: This VIP object contains much more. Worth a closer look.
    if (adData.VIP.price && typeof adData.VIP.price.amount === "number") {
        info.attributes["price"] = adData.VIP.price.amount / 100.0;
    }
    if (adData.VIP.adLocation) {
        info.attributes["location"] = adData.VIP.adLocation;
    }
    if (adData.VIP.adType) {
        info.attributes["type"] = adData.VIP.adType;
    }
    if (adData.VIP.visitCounter) {
        info.attributes["visits"] = adData.VIP.visitCounter;
    }
    return info;
}
/* Scrapes the page at the passed Kijiji ad URL */
function scrapeHTML(url) {
    return (0, node_fetch_1.default)(url, { headers: constants_1.HTML_REQUEST_HEADERS })
        .then(function (res) {
        if (res.status === 403) {
            throw new Error(constants_1.BANNED);
        }
        return res.text();
    })
        .then(function (body) {
        return parseResponseHTML(body);
    });
}
exports.scrapeHTML = scrapeHTML;
