import Resource from 'mock_interface/Resource';
export default interface LoaderMiddleware {
    (resource: Resource, next: Function): void;
}
