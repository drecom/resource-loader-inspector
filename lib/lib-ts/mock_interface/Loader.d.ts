import LoaderMiddleware from 'mock_interface/LoaderMiddleware';
import Summary from 'interface/Summary';
import Resource from 'mock_interface/Resource';
/**
 * Mock interface for resource-loader Loader with augmentation.
 */
export default interface Loader {
    resources: {
        [key: string]: Resource;
    };
    xhr: XMLHttpRequest;
    pre: (fn: LoaderMiddleware) => void;
    use: (fn: LoaderMiddleware) => void;
    inspector: {
        summary: Summary;
        hasMiddleware: boolean;
    } | undefined;
}
