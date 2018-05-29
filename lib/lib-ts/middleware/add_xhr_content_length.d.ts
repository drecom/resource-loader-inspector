import LoaderMiddleware from 'mock_interface/LoaderMiddleware';
/**
 * Retrieve content length from xhr and store the value
 * to resource and loader.inspectorSummary<br />
 * This middleware only works for loader that have valid xhr property.
 */
declare const addXhrContentLength: LoaderMiddleware;
export { addXhrContentLength };
