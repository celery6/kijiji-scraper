/// <reference types="cheerio" />
import { AdInfo } from "../scraper";
export declare function scrapeAdElement(elem: cheerio.Element): AdInfo | null;
export declare function scrapeAPI(url: string): Promise<AdInfo | null>;
