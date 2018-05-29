import LoaderMiddleware from 'mock_interface/LoaderMiddleware';
/**
 * Mark resource with loaded status.<br />
 * Usually duplicate resource loading is guarded by resource-loader itself.<br />
 * TODO: consider remove this and let users have responsibility for custom loader.
 */
declare const markLoaded: LoaderMiddleware;
export { markLoaded };
