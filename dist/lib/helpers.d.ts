/**
 * Kijiji scraping method
 */
export declare enum ScraperType {
    /**
     * Scrape using the Kijiji mobile API
     */
    API = "api",
    /**
     * Scrape by parsing the HTML of Kijiji.ca
     */
    HTML = "html"
}
/**
 * Options to pass to the scraper
 */
export declare type ScraperOptions = {
    /**
     * Which scraping method to use. Either "api" (default) or "html"
     */
    scraperType?: ScraperType;
};
export declare function sleep(ms: number): Promise<void>;
export declare function isNumber(value: string): boolean;
export declare function getLargeImageURL(url: string): string;
export declare function cleanAdDescription(text: string): string;
export declare function getScraperOptions(options: ScraperOptions): Required<ScraperOptions>;
