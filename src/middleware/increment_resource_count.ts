import LoaderMiddleware from 'mock_interface/LoaderMiddleware';
import Loader from 'mock_interface/Loader';
import Resource from 'mock_interface/Resource';

/**
 * Increments resource count.
 */
const incrementResourceCount = <LoaderMiddleware>function incrementResourceCount(
  this:     Loader,
  resource: Resource,
  next:     Function
): void {
  if (resource.inspector && resource.inspector.alreadyLoaded) {
    next();
    return;
  }

  if (this.inspector) {
    this.inspector.summary.resourceCount++;
  }
  next();
};

export { incrementResourceCount };
