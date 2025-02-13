"use strict";
// html-searcher.ts
/* Provides implementation for searcher which retrieves
   results via the public-facing website */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLSearcher = void 0;
var cheerio_1 = __importDefault(require("cheerio"));
var querystring_1 = __importDefault(require("querystring"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var ad_1 = require("../ad");
var constants_1 = require("../constants");
var KIJIJI_BASE_URL = "https://www.kijiji.ca";
var KIJIJI_SEARCH_URL = KIJIJI_BASE_URL + "/b-search.html";
var IMG_REGEX = /\/s\-l\d+\.jpg$/;
var LOCATION_REGEX = /(.+)(\/.*)$/;
/* Converts a date from a Kijiji ad result into a date object
   (e.g., "< x hours ago", "yesterday", "dd/mm/yyyy") */
function dateFromRelativeDateString(dateString) {
    if (dateString) {
        dateString = dateString.toLowerCase().replace(/\//g, " ");
        var split = dateString.split(" ");
        var d = new Date();
        if (split.length === 3) {
            // dd/mm/yyyy format
            d.setHours(0, 0, 0, 0);
            d.setDate(parseInt(split[0]));
            d.setMonth(parseInt(split[1]) - 1);
            d.setFullYear(parseInt(split[2]));
            return d;
        }
        else if (split.length === 4) {
            // "< x hours/minutes ago" format
            var num = parseInt(split[1]);
            var timeUnit = split[2];
            if (timeUnit === "minutes") {
                d.setMinutes(d.getMinutes() - num);
                d.setSeconds(0, 0);
            }
            else if (timeUnit === "hours") {
                d.setHours(d.getHours() - num, 0, 0, 0);
            }
            return d;
        }
        else if (dateString == "yesterday") {
            d.setDate(d.getDate() - 1);
            d.setHours(0, 0, 0, 0);
            return d;
        }
    }
    return new Date(NaN);
}
/* Extracts ad information from the HTML of a Kijiji ad results page */
function parseResultsHTML(html) {
    var adResults = [];
    var $ = cheerio_1.default.load(html);
    // Get info for each ad
    var allAdElements = $(".regular-ad");
    var filteredAdElements = allAdElements.not(".third-party");
    filteredAdElements.each(function (_i, item) {
        var _a;
        var path = $(item).find("a.title").attr("href");
        var url = KIJIJI_BASE_URL + path;
        var info = {
            id: ((_a = $(item).data("listing-id")) === null || _a === void 0 ? void 0 : _a.toString()) || "",
            title: $(item).find("a.title").text().trim(),
            image: (
            // `data-src` contains the URL of the image to lazy load
            //
            // `src` starts off with a placeholder image and will
            // remain if the ad has no image
            $(item).find(".image img").data("src") || $(item).find(".image img").attr("src") || "").replace(IMG_REGEX, "/s-l2000.jpg"),
            date: dateFromRelativeDateString(
            // For some reason, some categories (like anything under
            // SERVICES) use different markup than usual
            //
            // The string split is needed to handle:
            //
            // <td class="posted">
            //    Some date
            //    <br>
            //    Some location
            // </td>
            //
            // AKA "Some date\nSome location"
            ($(item).find(".date-posted").text() || $(item).find(".posted").text()).trim().split("\n")[0]),
            // Pick a format, Kijiji
            description: ($(item).find(".description > p").text() || $(item).find(".description").text()).trim()
        };
        if (!path) {
            throw new Error("Result ad has no URL. " + constants_1.POSSIBLE_BAD_MARKUP);
        }
        adResults.push(new ad_1.Ad(url, info));
    });
    return adResults;
}
/**
 * Searcher implementation
 */
var HTMLSearcher = /** @class */ (function () {
    function HTMLSearcher() {
        this.firstResultPageURL = undefined;
    }
    /* Retrieves the URL of the first page of search results */
    HTMLSearcher.prototype.getFirstResultPageURL = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.firstResultPageURL === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, node_fetch_1.default)(KIJIJI_SEARCH_URL + "?" + querystring_1.default.stringify(params), { headers: constants_1.HTML_REQUEST_HEADERS })];
                    case 1:
                        res = _a.sent();
                        // Kijiji will redirect to the rendered results
                        // Grab the destination path so that it can be modified for pagination
                        if (res.status === 403) {
                            throw new Error(constants_1.BANNED);
                        }
                        else if (res.status !== 200 || !res.url) {
                            throw new Error("Kijiji failed to redirect to results page. " + constants_1.POSSIBLE_BAD_MARKUP);
                        }
                        this.firstResultPageURL = res.url;
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.firstResultPageURL];
                }
            });
        });
    };
    /* Retrieves one page of Kijiji search results */
    HTMLSearcher.prototype.getPageResults = function (params, pageNum) {
        return __awaiter(this, void 0, void 0, function () {
            var firstResultPageURL, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFirstResultPageURL(params)];
                    case 1:
                        firstResultPageURL = _a.sent();
                        url = firstResultPageURL.replace(LOCATION_REGEX, "$1/page-" + pageNum + "$2");
                        // Search Kijiji
                        return [2 /*return*/, (0, node_fetch_1.default)(url, { headers: constants_1.HTML_REQUEST_HEADERS })
                                .then(function (res) {
                                if (res.status === 403) {
                                    throw new Error(constants_1.BANNED);
                                }
                                return res.text();
                            })
                                .then(function (body) { return ({
                                pageResults: parseResultsHTML(body),
                                isLastPage: body.indexOf('"isLastPage":true') !== -1
                            }); })];
                }
            });
        });
    };
    return HTMLSearcher;
}());
exports.HTMLSearcher = HTMLSearcher;
