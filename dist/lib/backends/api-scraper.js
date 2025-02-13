"use strict";
// api-scraper.ts
/* Scrapes a Kijiji ad using the mobile API */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeAPI = exports.scrapeAdElement = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var cheerio_1 = __importDefault(require("cheerio"));
var constants_1 = require("../constants");
var helpers_1 = require("../helpers");
var scraper_1 = require("../scraper");
var AD_ID_REGEX = /\/(\d+)$/;
var API_ADS_ENDPOINT = "https://mingle.kijiji.ca/api/ads";
function castAttributeValue(item) {
    var valueElem = item.find("attr\\:value");
    if (valueElem.length === 0) {
        return undefined;
    }
    var type = (item.attr("type") || "").toLowerCase();
    var value = valueElem.text().trim();
    var localizedValue = (valueElem.attr("localized-label") || "").toLowerCase();
    // Kijiji only returns strings for attributes. Convert to appropriate types
    if (localizedValue === "yes") {
        return true;
    }
    else if (localizedValue === "no") {
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
    else if (type === "date") {
        return new Date(value);
    }
    return value;
}
/* Parses the XML of a Kijiji ad for its important information */
function parseResponseXML(xml) {
    var $ = cheerio_1.default.load(xml);
    var apiError = $("api-error > message").text();
    if (apiError) {
        throw new Error("Kijiji returned error: " + apiError);
    }
    var adElement = $("ad\\:ad").get();
    if (adElement.length !== 1) {
        return null;
    }
    return scrapeAdElement(adElement[0]);
}
function scrapeAdElement(elem) {
    var info = new scraper_1.AdInfo();
    var $ = cheerio_1.default.load(elem);
    var adId = $("ad\\:ad").attr("id");
    var titleElem = $("ad\\:title");
    var dateElem = $("ad\\:start-date-time");
    // We can reasonably expect these to be present
    if (adId === undefined || titleElem.length === 0 || dateElem.length === 0) {
        return null;
    }
    info.id = adId;
    info.title = titleElem.text();
    info.description = (0, helpers_1.cleanAdDescription)($("ad\\:description").html() || "");
    info.date = new Date(dateElem.text());
    $("pic\\:picture pic\\:link[rel='normal']").each(function (_i, item) {
        var cheerioItem = $(item);
        var url = cheerioItem.attr("href");
        if (url) {
            info.images.push((0, helpers_1.getLargeImageURL)(url));
        }
    });
    info.image = info.images.length > 0 ? info.images[0] : "";
    $("attr\\:attribute").each(function (_i, item) {
        var cheerioItem = $(item);
        var name = cheerioItem.attr("name");
        var value = castAttributeValue(cheerioItem);
        if (name && value !== undefined) {
            info.attributes[name] = value;
        }
    });
    // Add other attributes of interest
    // TODO: The API response contains much more. Worth a closer look.
    var adPrice = $("ad\\:price types\\:amount").text();
    if ((0, helpers_1.isNumber)(adPrice)) {
        info.attributes["price"] = Number(adPrice);
    }
    else {
        info.attributes["price"] = adPrice;
    }
    var adLocation = $("ad\\:ad-address types\\:full-address").text();
    if (adLocation) {
        info.attributes["location"] = adLocation;
    }
    var adType = $("ad\\:ad-type ad\\:value").text();
    if (adType) {
        info.attributes["type"] = adType;
    }
    var viewCount = $("ad\\:view-ad-count").text();
    if (viewCount) {
        info.attributes["visits"] = Number(viewCount);
    }
    return info;
}
exports.scrapeAdElement = scrapeAdElement;
/* Queries the Kijiji mobile API for the ad at the passed URL */
function scrapeAPI(url) {
    var parsedURL = new URL(url);
    var adIdMatch = parsedURL.pathname.match(AD_ID_REGEX);
    if (adIdMatch === null) {
        throw new Error("Invalid Kijiji ad URL. Ad URLs must end in /some-ad-id.");
    }
    url = API_ADS_ENDPOINT + "/" + adIdMatch[1];
    return (0, node_fetch_1.default)(url, { headers: constants_1.API_REQUEST_HEADERS, compress: true })
        .then(function (res) {
        if (res.status === 403) {
            throw new Error(constants_1.BANNED);
        }
        return res.text();
    })
        .then(function (body) {
        return parseResponseXML(body);
    });
}
exports.scrapeAPI = scrapeAPI;
