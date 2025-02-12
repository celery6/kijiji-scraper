import { PageResults, ResolvedSearchParameters } from "../search";
/**
 * Searcher implementation
 */
export declare class HTMLSearcher {
    private firstResultPageURL;
    private getFirstResultPageURL;
    getPageResults(params: ResolvedSearchParameters, pageNum: number): Promise<PageResults>;
}
