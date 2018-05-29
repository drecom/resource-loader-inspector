import LoaderMiddleware from 'mock_interface/LoaderMiddleware';
import Loader from 'mock_interface/Loader';
import Resource from 'mock_interface/Resource';

/**
 * Retrieve content length from xhr and store the value
 * to resource and loader.inspectorSummary<br />
 * This middleware only works for loader that have valid xhr property.
 */
const addXhrContentLength = <LoaderMiddleware>function addXhrContentLength(
  this:     Loader,
  resource: Resource,
  next:     Function
): void {
  if (!this.xhr) {
    next();
    return;
  }

  const contentLength = this.xhr.getResponseHeader('Content-Length');

  // getResponseHeader may return null
  if (!contentLength) {
    next();
    return;
  }

  const contentLengthInt = parseInt(contentLength, 10);

  if (resource.inspector) {
    if (resource.inspector.alreadyLoaded) {
      next();
      return;
    }

    resource.inspector.contentLength = contentLengthInt;
  }

  if (this.inspector) {
    this.inspector.summary.totalContentLength += contentLengthInt;
  }

  next();
};

export { addXhrContentLength };
