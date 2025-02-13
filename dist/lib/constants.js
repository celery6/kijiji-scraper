"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BANNED = exports.POSSIBLE_BAD_MARKUP = exports.API_REQUEST_HEADERS = exports.HTML_REQUEST_HEADERS = void 0;
var BUGS_URL = "https://github.com/mwpenny/kijiji-scraper/issues";
// I'm not sure how much this helps with getting banned, but it seems to
exports.HTML_REQUEST_HEADERS = {
    "Accept-Language": "en-CA",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0"
};
// Some of these headers are redundant, but I want them in the same order the app sends
exports.API_REQUEST_HEADERS = {
    "User-Agent": "com.ebay.kijiji.ca 6.5.0 (samsung SM-G930U; Android 8.0.0; en_US)",
    "Accept-Language": "en-CA",
    Accept: "application/xml",
    Connection: "close",
    Pragma: "no-cache",
    Authorization: "Basic Y2FfYW5kcm9pZF9hcHA6YXBwQ2xAc3NpRmllZHMh",
    Host: "mingle.kijiji.ca",
    "Accept-Encoding": "gzip, deflate"
};
exports.POSSIBLE_BAD_MARKUP = "It is possible that Kijiji changed their markup. " +
    ("If you believe this to be the case, please open an issue at: " + BUGS_URL);
exports.BANNED = "Kijiji denied access. You are likely temporarily blocked. This can happen if " +
    "you scrape too aggressively. Try scraping again later, and more slowly. If " +
    ("this happens even when scraping reasonably, please open an issue at: " + BUGS_URL);
