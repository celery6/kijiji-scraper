"use strict";
// ad.ts
/* Kijiji ad object definition */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ad = void 0;
var scraper_1 = require("./scraper");
/* Nicely formats a date string */
function DateToString(date) {
    var m = ("0" + (date.getMonth() + 1)).slice(-2);
    var d = ("0" + date.getDate()).slice(-2);
    var y = date.getFullYear();
    var hrs = ("0" + date.getHours()).slice(-2);
    var mins = ("0" + date.getMinutes()).slice(-2);
    return m + "/" + d + "/" + y + " @ " + hrs + ":" + mins;
}
/**
 * This class encapsulates a Kijiji ad and its properties. It also
 * handles retrieving this information from Kijiji
 */
var Ad = /** @class */ (function (_super) {
    __extends(Ad, _super);
    /**
     * Manually constructs an `Ad` object
     *
     * You should generally not need to use this save for a few special cases
     * (e.g., storing ad URLs entered by a user for delayed scraping).
     *
     * `Ad.isScraped()` returns `false` for `Ad` objects constructed in this
     * way unless `scraped` is passed as `true`or they are subsequently scraped
     * by calling `Ad.scrape()`, which causes the scraper to replace the ad's
     * information with what is found at its URL.
     *
     * @param url Kijiji ad URL
     * @param info Ad properties to set manually
     * @param scraped Whether or not to consider the ad already scraped
     */
    function Ad(url, info, scraped) {
        if (info === void 0) { info = {}; }
        if (scraped === void 0) { scraped = false; }
        var _this = _super.call(this) || this;
        var isScraped = scraped;
        /* Updates ad properties with specified values */
        var updateInfo = function (info) {
            var e_1, _a;
            try {
                for (var _b = __values(Object.entries(info)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    // Don't trust info - it comes from the user
                    if (_super.prototype.hasOwnProperty.call(_this, key)) {
                        _this[key] = value;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        updateInfo(info);
        _this.url = url;
        _this.scrape = function (options, callback) {
            var promise = (0, scraper_1.scrape)(_this.url, options).then(function (newInfo) {
                updateInfo(newInfo);
                isScraped = true;
            });
            if (callback) {
                promise.then(function () { return callback(null); }, callback);
            }
            return promise;
        };
        _this.isScraped = function () { return isScraped; };
        return _this;
    }
    /**
     * Creates an `Ad` by scraping the passed ad URL
     *
     * @param url Kijiji ad URL
     * @param options Options to pass to the scraper
     * @param callback Called after the ad has been scraped. If an
     *                 error occurs during scraping, `err` will not
     *                 be `null`. If everything is successful, `ad`
     *                 will be an `Ad` object corresponding to `url`.
     * @returns `Promise` which resolves to an `Ad` corresponding to `url`
     */
    Ad.Get = function (url, options, callback) {
        var promise = (0, scraper_1.scrape)(url, options).then(function (info) {
            return new Ad(url, info, true);
        });
        if (callback) {
            promise.then(function (ad) { return callback(null, ad); }, function (err) { return callback(err, new Ad("")); });
        }
        return promise;
    };
    /**
     * Convert the ad to a string
     *
     * This is just meant to be a summary and
     * may omit information for brevity or change format in the future.
     * Access the Ad's properties directly if you need them for comparisons.
     *
     * @returns A string representation of the ad
     */
    Ad.prototype.toString = function () {
        var e_2, _a;
        // Ad may be unscraped and missing some information
        var str = "";
        if (this.date instanceof Date && !Number.isNaN(this.date.getTime())) {
            str += "[" + DateToString(this.date) + "] ";
        }
        if (this.title) {
            str += this.title + "\r\n";
        }
        str += this.url + "\r\n";
        try {
            for (var _b = __values(Object.keys(this.attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var attr = _c.value;
                var val = this.attributes[attr];
                if (attr === "location" && val.mapAddress !== undefined)
                    val = val.mapAddress;
                str += "* " + attr + ": " + val + "\r\n";
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return str;
    };
    return Ad;
}(scraper_1.AdInfo));
exports.Ad = Ad;
;
