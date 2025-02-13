import { PageResults, ResolvedSearchParameters } from "../search";
/**
 * Searcher implementation
 */
export declare class APISearcher {
    getPageResults(params: ResolvedSearchParameters, pageNum: number): Promise<PageResults>;
}
