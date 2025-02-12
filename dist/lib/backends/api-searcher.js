"use strict";
// api-searcher.ts
/* Provides implementation for searcher which retrieves
   results via the Kijiji mobile API */
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
exports.APISearcher = void 0;
var cheerio_1 = __importDefault(require("cheerio"));
var querystring_1 = __importDefault(require("querystring"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var ad_1 = require("../ad");
var api_scraper_1 = require("./api-scraper");
var constants_1 = require("../constants");
var API_SEARCH_ENDPOINT = "https://mingle.kijiji.ca/api/ads";
function parseResultsXML(xml) {
    var adResults = [];
    var $ = cheerio_1.default.load(xml);
    var isLastPage = $("types\\:paging types\\:link[rel='next']").length === 0;
    // Get info for each ad
    $("ad\\:ad").each(function (_i, item) {
        var url = $(item).find("ad\\:link[rel='self-public-website']").attr("href");
        if (!url) {
            // Top and third-party ads have no Kijiji URL
            return;
        }
        var info = (0, api_scraper_1.scrapeAdElement)(item);
        if (info === null) {
            throw new Error("Result ad could not be parsed. " + constants_1.POSSIBLE_BAD_MARKUP);
        }
        adResults.push(new ad_1.Ad(url, info, true));
    });
    return {
        pageResults: adResults,
        isLastPage: isLastPage
    };
}
/**
 * Searcher implementation
 */
var APISearcher = /** @class */ (function () {
    function APISearcher() {
    }
    /* Retrieves one page of Kijiji search results */
    APISearcher.prototype.getPageResults = function (params, pageNum) {
        var url = API_SEARCH_ENDPOINT + "?" + querystring_1.default.stringify(__assign(__assign({}, params), { page: pageNum - 1, size: 20 // Results per page, just like the app
         }));
        // Search Kijiji
        return (0, node_fetch_1.default)(url, { headers: constants_1.API_REQUEST_HEADERS, compress: true })
            .then(function (res) {
            if (res.status === 403) {
                throw new Error(constants_1.BANNED);
            }
            return res.text();
        })
            .then(parseResultsXML);
    };
    return APISearcher;
}());
exports.APISearcher = APISearcher;
