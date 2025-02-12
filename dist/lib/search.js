"use strict";
// search.ts
/* Searches Kijiji for recent ads matching given criteria */
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
var api_searcher_1 = require("./backends/api-searcher");
var html_searcher_1 = require("./backends/html-searcher");
var helpers_1 = require("./helpers");
;
/* Retrieves at least minResults search results from Kijiji using the passed parameters */
function getSearchResults(searcher, params, options) {
    return __awaiter(this, void 0, void 0, function () {
        var results, pageNum, needResults, _a, pageResults, isLastPage, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    results = [];
                    pageNum = 1;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    needResults = options.minResults !== 0;
                    _b.label = 2;
                case 2:
                    if (!needResults) return [3 /*break*/, 6];
                    return [4 /*yield*/, searcher.getPageResults(params, pageNum++)];
                case 3:
                    _a = _b.sent(), pageResults = _a.pageResults, isLastPage = _a.isLastPage;
                    results.push.apply(results, __spreadArray([], __read(pageResults), false));
                    needResults = pageResults.length > 0 &&
                        !isLastPage &&
                        (results.length < options.minResults || options.minResults < 0);
                    if (!needResults) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, helpers_1.sleep)(options.pageDelayMs)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [3 /*break*/, 2];
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_1 = _b.sent();
                    throw new Error("Error parsing Kijiji search results: ERR");
                case 8: return [2 /*return*/, results];
            }
        });
    });
}
/* Validates that obj.propName exists and is an integer */
function ensureIntProp(obj, propName) {
    if (!obj.hasOwnProperty(propName) || !Number.isInteger(obj[propName])) {
        throw new Error("Integer property '" + propName + "' must be specified");
    }
}
/* Parses search parameters, adds default values if required, and then performs validation */
function getSearchParams(params) {
    var getId = function (id) {
        // If id is an id object, return the contained id
        var ret = id;
        if (typeof id === "object" && id.hasOwnProperty("id")) {
            ret = id.id;
        }
        return ret;
    };
    // Copy params so we don't modify what was passed
    var paramsForSearch = __assign({}, params);
    // Parameter defaults
    if (paramsForSearch.locationId === undefined) {
        paramsForSearch.locationId = 0;
    }
    if (paramsForSearch.categoryId === undefined) {
        paramsForSearch.categoryId = 0;
    }
    // Tell Kijiji to redirect us to the URL used in the frontend as
    // this is the only URL I have gotten paging to work with
    paramsForSearch.formSubmit = true;
    // Date scraping relies on the page being in English
    paramsForSearch.siteLocale = "en_CA";
    // If id objects are being used, get the contained ids
    paramsForSearch.locationId = getId(paramsForSearch.locationId);
    paramsForSearch.categoryId = getId(paramsForSearch.categoryId);
    ensureIntProp(paramsForSearch, "locationId");
    ensureIntProp(paramsForSearch, "categoryId");
    return paramsForSearch;
}
/* Parses search options, adds default values if required, and then performs validation */
function getSearchOptions(options) {
    // Copy options so we don't modify what was passed
    var optionsForSearch = __assign({}, options);
    // Option defaults
    if (optionsForSearch.pageDelayMs === undefined) {
        optionsForSearch.pageDelayMs = 1000;
    }
    ensureIntProp(optionsForSearch, "pageDelayMs");
    if (optionsForSearch.scrapeResultDetails === undefined) {
        optionsForSearch.scrapeResultDetails = true;
    }
    if (optionsForSearch.resultDetailsDelayMs === undefined) {
        optionsForSearch.resultDetailsDelayMs = 500;
    }
    ensureIntProp(optionsForSearch, "resultDetailsDelayMs");
    if (optionsForSearch.maxResults === undefined) {
        optionsForSearch.maxResults = -1;
    }
    ensureIntProp(optionsForSearch, "maxResults");
    if (optionsForSearch.minResults === undefined) {
        if (optionsForSearch.maxResults > 0) {
            optionsForSearch.minResults = optionsForSearch.maxResults;
        }
        else {
            optionsForSearch.minResults = 20;
        }
    }
    else if (optionsForSearch.minResults < 0) {
        optionsForSearch.minResults = optionsForSearch.maxResults;
    }
    ensureIntProp(optionsForSearch, "minResults");
    return optionsForSearch;
}
/**
 * Searches Kijiji for ads matching the given criteria
 *
 * @param params Kijiji ad search parameters
 * @param options Search and scraper options
 * @param callback Called after the search results have been scraped. If an error
 *                 occurs during scraping, `err` will not be null. If everything
 *                 is successful, `results` will contain an array of `Ad` objects.
 * @returns `Promise` which resolves to an array of search result `Ad` objects
 */
function search(params, options, callback) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var promise = new Promise(function (resolve, reject) {
        // Configure search
        var paramsForSearch = getSearchParams(params);
        var optionsForSearch = getSearchOptions(options);
        var scraperOptions = (0, helpers_1.getScraperOptions)(options);
        var searcher = scraperOptions.scraperType === helpers_1.ScraperType.HTML
            ? new html_searcher_1.HTMLSearcher()
            : new api_searcher_1.APISearcher();
        // Perform search
        getSearchResults(searcher, paramsForSearch, optionsForSearch).then(function (results) { return __awaiter(_this, void 0, void 0, function () {
            var results_1, results_1_1, ad, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (optionsForSearch.maxResults >= 0) {
                            results = results.slice(0, optionsForSearch.maxResults);
                        }
                        if (!optionsForSearch.scrapeResultDetails) return [3 /*break*/, 12];
                        if (!(optionsForSearch.resultDetailsDelayMs > 0)) return [3 /*break*/, 10];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, 8, 9]);
                        results_1 = __values(results), results_1_1 = results_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!results_1_1.done) return [3 /*break*/, 6];
                        ad = results_1_1.value;
                        if (!!ad.isScraped()) return [3 /*break*/, 5];
                        return [4 /*yield*/, ad.scrape()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, (0, helpers_1.sleep)(optionsForSearch.resultDetailsDelayMs)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        results_1_1 = results_1.next();
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (results_1_1 && !results_1_1.done && (_a = results_1.return)) _a.call(results_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 9: return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, Promise.all(results.map(function (ad) {
                            if (!ad.isScraped()) {
                                ad.scrape();
                            }
                        }))];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12: return [2 /*return*/, results];
                }
            });
        }); }).then(resolve, reject);
    });
    if (callback) {
        promise.then(function (results) { return callback(null, results); }, function (err) { return callback(err, []); });
    }
    return promise;
}
exports.search = search;
