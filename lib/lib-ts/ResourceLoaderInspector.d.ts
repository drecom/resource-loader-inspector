import Summary from 'interface/Summary';
import Loader from 'mock_interface/Loader';
declare type Option = {
    headRequest: boolean;
};
declare class ResourceLoaderInspector {
    /**
     * attatches middlewares to loader instance
     */
    static attach(loader: Loader, option?: Option): void;
    /**
     * get snapshot of current resource statistics
     */
    static snapshot(loader: Loader): Summary;
}
export { ResourceLoaderInspector, Option };
