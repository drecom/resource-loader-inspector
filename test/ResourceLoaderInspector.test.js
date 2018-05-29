import assert from 'power-assert';
import { spy } from 'sinon';
import ResourceLoaderInspector from 'index';

describe('ResourceLoaderInspector', () => {

  class MockLoader {
    constructor() { this.resources = {}; }
    pre(middleware) { }
    use(middleware) { }
  }

  describe ('inspector.summary', () => {
    let subject = null;

    before(() => {
      const mockLoader = new MockLoader();
      ResourceLoaderInspector.attach(mockLoader);
      subject = mockLoader.inspector.summary;
    });

    it ('should have totalContentLength property', () => {
      assert.notStrictEqual(subject.totalContentLength, undefined);
    });
    it ('should have resourceCount property', () => {
      assert.notStrictEqual(subject.resourceCount, undefined);
    });
    it ('should have contentLengthUnknown property', () => {
      assert.notStrictEqual(subject.contentLengthUnknown, undefined);
    });
  });

  describe ('attach', () => {
    it ('should augment inspector property to loader instance', () => {
      const mockLoader = new MockLoader();

      assert.strictEqual(mockLoader.hasOwnProperty('inspector'), false);

      ResourceLoaderInspector.attach(mockLoader);

      assert.strictEqual(mockLoader.hasOwnProperty('inspector'), true);
    });

    it ('should register middlewares', () => {
      const mockLoader = new MockLoader();

      const preSpy = spy(mockLoader, 'pre');
      const useSpy = spy(mockLoader, 'use');

      ResourceLoaderInspector.attach(mockLoader);

      assert.ok(preSpy.getCalls().length > 0);
      assert.ok(useSpy.getCalls().length > 0);
    });
  });

  describe ('snapshot', () => {
    it ('should return summary', () => {
      const mockLoader = new MockLoader();

      const summary = ResourceLoaderInspector.snapshot(mockLoader);

      assert.notStrictEqual(summary.totalContentLength, undefined);
      assert.notStrictEqual(summary.resourceCount, undefined);
      assert.notStrictEqual(summary.contentLengthUnknown, undefined);
    });

    it ('should not store result to inspector.summary property', () => {
      const mockLoader = new MockLoader();

      mockLoader.inspector = {
        summary: {
          totalContentLength: 100,
          resourceCount: 100,
          contentLengthUnknown: 100
        }
      };

      const summary = ResourceLoaderInspector.snapshot(mockLoader);

      const original = mockLoader.inspector.summary;

      assert.notStrictEqual(summary.totalContentLength, original.totalContentLength);
      assert.notStrictEqual(summary.resourceCount, original.resourceCount);
      assert.notStrictEqual(summary.contentLengthUnknown, original.contentLengthUnknown);
    });
  });

  describe ('recollect', () => {
    it ('should not have return value', () => {
      const mockLoader = new MockLoader();

      const ret = ResourceLoaderInspector.recollect(mockLoader);

      assert.strictEqual(ret, undefined);
    });

    it ('should reset inspector.summary', () => {
      const mockLoader = new MockLoader();

      const originalContentLength = 100;
      const originalResourceCount = 100;
      const originalContentLengthUnknown = 100;

      mockLoader.inspector = {
        summary: {
          totalContentLength: originalContentLength,
          resourceCount: originalResourceCount,
          contentLengthUnknown: originalContentLengthUnknown
        }
      };

      mockLoader.resources = {
        testResource: {
          inspector: { contentLength: 10000 }
        }
      };

      ResourceLoaderInspector.recollect(mockLoader);

      const keys = Object.keys(mockLoader.resources);

      const expected =  {
        contentLength: 0,
        resourceCount: 0,
        contentLengthUnknown: 0
      };

      for (let i = 0; i < keys.length; i++) {
        const resource = mockLoader.resources[keys[i]];
        expected.contentLength += resource.inspector.contentLength;
        expected.resourceCount++;
      }

      const summary = mockLoader.inspector.summary;

      assert.notStrictEqual(summary.totalContentLength, originalContentLength);
      assert.notStrictEqual(summary.resourceCount, originalResourceCount);
      assert.notStrictEqual(summary.contentLengthUnknown, originalContentLengthUnknown);

      assert.strictEqual(summary.totalContentLength, expected.contentLength);
      assert.strictEqual(summary.resourceCount, expected.resourceCount);
      assert.strictEqual(summary.contentLengthUnknown, expected.contentLengthUnknown);
    });
  });
});

export { Summary };
