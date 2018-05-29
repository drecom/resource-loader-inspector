import Resource from 'mock_interface/Resource';

/**
 * Mock interface for resource-loader middleware function.
 */
export default interface LoaderMiddleware {
  (resource: Resource, next: Function): void;
}
