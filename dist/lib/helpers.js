"use strict";
// helpers.ts
/* Common functionality */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScraperOptions = exports.cleanAdDescription = exports.getLargeImageURL = exports.isNumber = exports.sleep = exports.ScraperType = void 0;
var cheerio_1 = __importDefault(require("cheerio"));
var IMG_REGEX = /\/\$_\d+\.(?:JPG|PNG)$/;
/**
 * Kijiji scraping method
 */
var ScraperType;
(function (ScraperType) {
    /**
     * Scrape using the Kijiji mobile API
     */
    ScraperType["API"] = "api";
    /**
     * Scrape by parsing the HTML of Kijiji.ca
     */
    ScraperType["HTML"] = "html";
})(ScraperType = exports.ScraperType || (exports.ScraperType = {}));
;
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
function isNumber(value) {
    value = value.trim();
    return value.length > 0 && !Number.isNaN(Number(value)) && Number.isFinite(Number(value));
}
exports.isNumber = isNumber;
;
function getLargeImageURL(url) {
    // Kijiji/eBay image URLs typically end with "$_dd.JPG", where "dd" is a
    // number between 0 and 140 indicating the desired image size and
    // quality. "57" is up to 1024x1024, the largest I've found.
    return url.replace(IMG_REGEX, "/$_57.JPG");
}
exports.getLargeImageURL = getLargeImageURL;
function cleanAdDescription(text) {
    // Some descriptions contain HTML. Remove it so it is only text
    var $ = cheerio_1.default.load(text);
    $("label").remove(); // Remove kit-ref-id label
    return $.root().text().trim();
}
exports.cleanAdDescription = cleanAdDescription;
function getScraperOptions(options) {
    // Copy options so we don't modify what was passed
    var scraperOptions = __assign({}, options);
    // Option defaults
    if (scraperOptions.scraperType === undefined) {
        scraperOptions.scraperType = ScraperType.API;
    }
    var validScraperTypes = Object.values(ScraperType);
    if (validScraperTypes.find(function (k) { return k === scraperOptions.scraperType; }) === undefined) {
        throw new Error("Invalid value for scraper option 'scraperType'. Valid values are: " +
            validScraperTypes.join(", "));
    }
    return scraperOptions;
}
exports.getScraperOptions = getScraperOptions;
