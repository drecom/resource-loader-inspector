import LoaderMiddleware from 'mock_interface/LoaderMiddleware';
import Loader from 'mock_interface/Loader';
import Resource from 'mock_interface/Resource';

/**
 * Set default inspector property to proceed rest of middlewares.
 */
const setInspectorProperty = <LoaderMiddleware>function setInspectorProperty(
  this:     Loader,
  resource: Resource,
  next:     Function
): void {
  resource.inspector = {
    contentLength: 0,
    alreadyLoaded: false
  };
  next();
};

export { setInspectorProperty };
