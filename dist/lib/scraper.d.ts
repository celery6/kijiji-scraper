import { ScraperOptions } from "./helpers";
/**
 * Information about an ad from Kijiji
 */
export declare class AdInfo {
    /**
     * Title of the ad
     */
    title: string;
    /**
     * Description of the ad
     */
    description: string;
    /**
     * Date the ad was posted
     */
    date: Date;
    /**
     * URL of the ad's primary (featured) image
     */
    image: string;
    /**
     * URLs of all images associated with the ad
     */
    images: string[];
    /**
     * Properties specific to the category of the scraped ad
     */
    attributes: {
        [attributeName: string]: any;
    };
    /**
     * The ad's URL
     */
    url: string;
    /**
     * Unique identifier of the ad
     */
    id: string;
}
export declare function scrape(url: string, options?: ScraperOptions): Promise<AdInfo>;
