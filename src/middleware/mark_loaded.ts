import LoaderMiddleware from 'mock_interface/LoaderMiddleware';
import Loader from 'mock_interface/Loader';
import Resource from 'mock_interface/Resource';

/**
 * Mark resource with loaded status.<br />
 * Usually duplicate resource loading is guarded by resource-loader itself.<br />
 * TODO: consider remove this and let users have responsibility for custom loader.
 */
const markLoaded = <LoaderMiddleware>function markLoaded(
  this:     Loader,
  resource: Resource,
  next:     Function
): void {
  if (resource.inspector) {
    resource.inspector.alreadyLoaded = !!resource.data;
  }
  next();
};

export { markLoaded };
