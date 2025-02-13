import { Ad } from "./ad";
import { ScraperOptions } from "./helpers";
declare type KijijiIdTreeNode = {
    id: number;
};
/**
 * Kijiji ad search parameters
 */
export declare type SearchParameters = {
    /**
     * Id of the geographical location to search in
     */
    locationId?: number | KijijiIdTreeNode;
    /**
     * Id of the ad category to search in
     */
    categoryId?: number | KijijiIdTreeNode;
    /**
     * The minimum desired price of the results
     */
    minPrice?: number;
    /**
     * The maximum desired price of the results
     */
    maxPrice?: number;
    /**
     * Type of ad to return. Leave undefined for both
     */
    adType?: string;
    /**
     * Other parameters, specific to the category. Use browser developer
     * tools when performing a specific search to find more parameters.
     * After submitting your search on Kijiji or updating the filter being
     * applied, examine the request for https://www.kijiji.ca/b-search.html.
     * Any parameter used in the query string for that request is able to be
     * specified in here.
     */
    [paramName: string]: any;
};
export declare type ResolvedSearchParameters = {
    locationId: number;
    categoryId: number;
    [paramName: string]: any;
};
/**
 * Parameters that control the behavior of the scraper
 */
export declare type SearchOptions = {
    /**
     * Amount of time in milliseconds to wait between scraping each result page.
     * This is useful to avoid detection and bans from Kijiji. Defaults to 1000.
     */
    pageDelayMs?: number;
    /**
     * Minimum number of ads to fetch (if available). Note that Kijiji results
     * are returned in pages of up to `20` ads, so if you set this to something
     * like `29`, up to `40` results may be retrieved. A negative value indicates
     * no limit (retrieve as many ads as possible).
     */
    minResults?: number;
    /**
     * Maximum number of ads to return. This simply removes excess results from
     * the array that is returned (i.e., if `minResults` is `40` and `maxResults`
     * is `7`, `40` results will be fetched from Kijiji and the last `33` will be
     * discarded). A negative value indicates no limit.
     */
    maxResults?: number;
    /**
     * When using the HTML scraper, the details of each query result are scraped in
     * separate, subsequent requests by default. To suppress this behavior and return
     * only the data retrieved by the initial query, set this option to `false`. Note
     * that ads will lack some information if you do this and `Ad.isScraped()` will
     * will return `false` until `Ad.scrape()` is called to retrieve the missing
     * information. This option does nothing when using the API scraper (default)
     */
    scrapeResultDetails?: boolean;
    /**
     * When `scrapeResultDetails` is `true`, the amount of time in milliseconds to
     * wait in between each request for result details. A value of 0 will cause all
     * such requests to be made at the same time. This is useful to avoid detection
     * and bans from Kijiji. Defaults to 500.
     */
    resultDetailsDelayMs?: number;
};
/**
 * The search results for one page
 */
export declare type PageResults = {
    /**
     * Ads from the result page
     */
    pageResults: Ad[];
    /**
     * Whether or not this page is the last page of results
     */
    isLastPage: boolean;
};
/**
 * Generic interface for a Kijiji searcher
 */
export interface Searcher {
    /**
     * Retrieve one page of search results
     * @param params Search parameters
     * @param pageNum Page number to return results for
     * @returns The results for the specified page
     */
    getPageResults(params: ResolvedSearchParameters, pageNum: number): Promise<PageResults>;
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
export declare function search(params: SearchParameters, options?: SearchOptions & ScraperOptions, callback?: (err: Error | null, ads: Ad[]) => void): Promise<Ad[]>;
export {};
