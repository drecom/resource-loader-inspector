import Summary from 'interface/Summary';
import Loader from 'mock_interface/Loader';

import * as middlewares from './middleware';

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
  public static attach(loader: Loader, headRequest: boolean = true): void {
    loader.inspector = ResourceLoaderInspector.defaultInspectorProperty;

    ResourceLoaderInspector.registerMiddlewares(loader, headRequest);
  }

  /**
   * It returns object that has exactly same schema with loader.inspector.summary.<br />
   * Resource summary is retrieved from existing resource properties.<br />
   * It means no additional retrieval such as http HEAD request will occur in this method.<br />
   * Note that calcurated summary is not stored to given loader instance.<br />
   */
  public static snapshot(loader: Loader): Summary {
    const summary = {
      totalContentLength: 0,
      resourceCount: 0,
      contentLengthUnknown: 0
    };

    const resourceKeys = Object.keys(loader.resources);

    summary.resourceCount = resourceKeys.length;

    for (let i = 0; i < summary.resourceCount; i++) {
      const resource = loader.resources[resourceKeys[i]];
      if (!resource.inspector) {
        summary.contentLengthUnknown++;
      } else {
        const contentLength = resource.inspector.contentLength;
        if (contentLength !== undefined) {
          summary.totalContentLength += contentLength;
        } else {
          summary.contentLengthUnknown++;
        }
      }
    }

    return summary;
  }

  /**
   * It recollects resource info from resources property of given loader instance.<br />
   * This API is used when resource data is reset
   * or whenever it is suspected not keeping atomicity beteen summary and resource data.<br />
   * Collected info is stored to inspector.summary property of loader instance.
   */
  public static recollect(loader: Loader, headRequest: boolean = true): void {
    const defaultInspector = ResourceLoaderInspector.defaultInspectorProperty;

    if (!loader.inspector) {
      loader.inspector = defaultInspector;
    }

    const summary = defaultInspector.summary;

    const resourceKeys = Object.keys(loader.resources);

    summary.resourceCount = resourceKeys.length;

    for (let i = 0; i < summary.resourceCount; i++) {
      const resource = loader.resources[resourceKeys[i]];

      if (!resource.inspector) {
        summary.contentLengthUnknown++;
        continue;
      }

      const contentLength = resource.inspector.contentLength;
      if (contentLength) {
        summary.totalContentLength += contentLength;
        continue;
      }

      if (headRequest) {
        middlewares.requestResourceSize.call(loader, resource, () => {});
        continue;
      }

      summary.contentLengthUnknown++;
    }

    loader.inspector.summary = summary;
  }

  /**
   * Returns default inspector object for loader instance.
   */
  private static get defaultInspectorProperty(): { summary: Summary, hasMiddleware: boolean } {
    return {
      summary: {
        totalContentLength: 0,
        resourceCount: 0,
        contentLengthUnknown: 0
      },
      hasMiddleware: false
    };
  }

  /**
   * Registeres middlewares for resource-loader.<br />
   */
  private static registerMiddlewares(loader: Loader, headRequest: boolean = true): void {
    if (!loader.inspector) {
      throw new Error('loader is not initialized');
    }
    if (loader.inspector.hasMiddleware) {
      return;
    }

    loader.pre(middlewares.setInspectorProperty);
    loader.pre(middlewares.markLoaded);

    loader.use(middlewares.addXhrContentLength);
    loader.use(middlewares.incrementResourceCount);

    if (headRequest) {
      loader.use(middlewares.requestResourceSize);
    }

    loader.inspector.hasMiddleware = true;
  }
}

export { Summary };
