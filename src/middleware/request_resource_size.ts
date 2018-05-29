import LoaderMiddleware from 'mock_interface/LoaderMiddleware';
import Loader from 'mock_interface/Loader';
import Resource from 'mock_interface/Resource';

/**
 * Requests resource size using HEAD method for resources not retrieved via XHR.
 */
const requestResourceSize = <LoaderMiddleware>function requestResourceSize(
  this:     Loader,
  resource: Resource,
  next:     Function
): void {
  if (resource.inspector && resource.inspector.alreadyLoaded) {
    next();
    return;
  }

  if (this.xhr) {
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open('HEAD', resource.url, true);
  xhr.addEventListener(
    'load',
    () => {
      const contentLength = xhr.getResponseHeader('Content-Length');

      // getResponseHeader may return null
      if (!contentLength) {
        return;
      }

      const contentLengthInt = parseInt(contentLength, 10);

      if (resource.inspector) {
        resource.inspector.contentLength = contentLengthInt;
      }

      if (this.inspector) {
        this.inspector.summary.totalContentLength += contentLengthInt;
      }
    },
    false
  );
  xhr.send();

  // no need to wait xhr procedure
  next();
};

export { requestResourceSize };
