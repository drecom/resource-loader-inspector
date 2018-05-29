import Summary from 'interface/Summary';
import Loader from 'mock_interface/Loader';
/**
 * ResourceLoaderInspector<br />
 * is an inspector for <a href='https://github.com/englercj/resource-loader/'>resource-loader</a>
 * developed by <a href='https://github.com/englercj'>englercj</a>.<br />
 * ResourceLoaderInspector proveides its inspecting processes as loader middleware
 * and it enables to collect resource data size and resource amount.
 */
export default class ResourceLoaderInspector {
    /**
     * Once loader is passed to this method, on time resource info retrieval is began.<br />
     * The second argument indicates use of HEAD request
     * since resource-loader uses browser api such as Image and Video
     * those don't have data size information on it's instance.<br />
     * Retrieved data is stored to augmented property inspectorSummary of loader instance.
     */
    static attach(loader: Loader, headRequest?: boolean): void;
    /**
     * It returns object that has exactly same schema with loader.inspector.summary.<br />
     * Resource summary is retrieved from existing resource properties.<br />
     * It means no additional retrieval such as http HEAD request will occur in this method.<br />
     * Note that calcurated summary is not stored to given loader instance.<br />
     */
    static snapshot(loader: Loader): Summary;
    /**
     * It recollects resource info from resources property of given loader instance.<br />
     * This API is used when resource data is reset
     * or whenever it is suspected not keeping atomicity beteen summary and resource data.<br />
     * Collected info is stored to inspector.summary property of loader instance.
     */
    static recollect(loader: Loader, headRequest?: boolean): void;
    /**
     * Returns default inspector object for loader instance.
     */
    private static readonly defaultInspectorProperty;
    /**
     * Registeres middlewares for resource-loader.<br />
     */
    private static registerMiddlewares(loader, headRequest?);
}
export { Summary };
