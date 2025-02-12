import { AdInfo } from "./scraper";
import { ScraperOptions } from "./helpers";
/**
 * This class encapsulates a Kijiji ad and its properties. It also
 * handles retrieving this information from Kijiji
 */
export declare class Ad extends AdInfo {
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
    constructor(url: string, info?: Partial<AdInfo>, scraped?: boolean);
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
    static Get(url: string, options?: ScraperOptions, callback?: (err: Error | null, ad: Ad) => void): Promise<Ad>;
    /**
     * Whether or not the ad's information has been retrieved from Kijiji.
     *
     * @returns `false` if the ad was created in a way that does not scrape
     * automatically, such as using the constructor or performing a search
     * with the `scrapeResultDetails` option set to `false`. Otherwise `true`.
     */
    isScraped: () => boolean;
    /**
     * Manually retrieves the ad's information from its URL
     *
     * Useful if the ad was created in a way that does not do this
     * automatically, such as using the constructor or performing a
     * search with the `scrapeResultDetails` option set to `false`.
     *
     * @param options Options to pass to the scraper
     * @param callback Called after the ad has been scraped. If an error
     *                 occurs during scraping, `err` will not be `null`.
     * @returns `Promise` that resolves once scraping has completed
     */
    scrape: (options?: ScraperOptions, callback?: (err: Error | null) => void) => Promise<void>;
    /**
     * Convert the ad to a string
     *
     * This is just meant to be a summary and
     * may omit information for brevity or change format in the future.
     * Access the Ad's properties directly if you need them for comparisons.
     *
     * @returns A string representation of the ad
     */
    toString(): string;
}
