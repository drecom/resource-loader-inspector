import assert from 'power-assert';
import { spy } from 'sinon';
import { addXhrContentLength } from 'middleware/add_xhr_content_length';

describe('addXhrContentLength', () => {
  const caller = {
    xhr: {
      getResponseHeader: () => { return 1; }
    }
  };

  it ('should call getResponseHeader of caller xhr property', () => {
    const xhrSpy = spy(caller.xhr, 'getResponseHeader');
    addXhrContentLength.call(caller, {}, () => {})
    assert.strictEqual(xhrSpy.calledOnce, true);
    caller.xhr.getResponseHeader.restore();
  });

  it ('should not set contentLength when resource have truthy inspector.alreadyLoaded property', () => {
    const originalContentLength = 100;
    const resource = {
      inspector: {
        alreadyLoaded: true,
        contentLength: originalContentLength
      }
    };
    addXhrContentLength.call(caller, resource, () => {})
    assert.strictEqual(resource.inspector.contentLength, originalContentLength);
  });
  it ('should set getResponseHeader return value as contentLength property of resource', () => {
    const resource = { inspector: {} };
    addXhrContentLength.call(caller, resource, () => {})
    assert.strictEqual(resource.inspector.contentLength, caller.xhr.getResponseHeader());
  });
  it ('should set totalContentLength property of caller\'s inspector.summary if inspector.summary exists', () => {
    const origialTotalContentLength = 100;
    caller.inspector = {
      summary: {
        totalContentLength: origialTotalContentLength
      }
    };
    addXhrContentLength.call(caller, {}, () => {})
    assert.strictEqual(caller.inspector.summary.totalContentLength, origialTotalContentLength + caller.xhr.getResponseHeader());
  });
});
