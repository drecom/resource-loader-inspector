import assert from 'power-assert';
import * as sinon from 'sinon';
import { requestResourceSize } from 'middleware/request_resource_size';

describe('requestResourceSize', () => {
  let StubXHR;

  beforeEach(() => {
    StubXHR = sinon.stub(window, "XMLHttpRequest");
    StubXHR.prototype.addEventListener = () => {};
    StubXHR.prototype.open = () => {};
    StubXHR.prototype.send = () => {};
  });

  afterEach(() => {
    window.XMLHttpRequest.restore();
  });

  it ('should send request to resource url with XMLHttpRequest', () => {
    const spyOpen = sinon.spy(StubXHR.prototype, 'open');
    const spySend = sinon.spy(StubXHR.prototype, 'send');

    const testUrl = 'https://test.com/resource/image.png';

    requestResourceSize.call({}, { url: testUrl }, () => {})

    assert.strictEqual(spyOpen.calledOnce, true);
    assert.strictEqual(spySend.calledOnce, true);
    assert.strictEqual(spyOpen.getCalls()[0].args[1], testUrl);
  });

  it ('should send request with HEAD method', () => {
    const spyOpen = sinon.spy(StubXHR.prototype, 'open');

    requestResourceSize.call({}, {}, () => {})

    assert.strictEqual(spyOpen.calledOnce, true);
    assert.strictEqual(spyOpen.getCalls()[0].args[0], 'HEAD');
  });

  it ('should not send request if resource has truthy inspector.alreadyLoaded property', () => {
    const spyOpen = sinon.spy(StubXHR.prototype, 'open');

    requestResourceSize.call({}, { inspector: { alreadyLoaded: true } }, () => {})

    assert.strictEqual(spyOpen.getCalls().length, 0);
  });

  it ('should not send request if caller has xhr property', () => {
    const spyOpen = sinon.spy(StubXHR.prototype, 'open');

    requestResourceSize.call({ xhr: true }, {}, () => {})

    assert.strictEqual(spyOpen.getCalls().length, 0);
  });

  it ('should add event listner with load event', () => {
    const spyAddEventListener = sinon.spy(StubXHR.prototype, 'addEventListener');

    requestResourceSize.call({}, {}, () => {})

    assert.strictEqual(spyAddEventListener.calledOnce, true);
    assert.strictEqual(spyAddEventListener.getCalls()[0].args[0], 'load');
  });

  describe('event listener callback', () => {
    const caller = {};

    beforeEach(() => {
      StubXHR.prototype.addEventListener = (_, fn) => fn();
      StubXHR.prototype.getResponseHeader = () => { return '1'; };
      caller.inspector = {
        summary: {}
      };
    });

    it ('should use getResponseHeader to get conrtent length', () => {
      const xhrSpy = sinon.spy(StubXHR.prototype, 'getResponseHeader');
      requestResourceSize.call(caller, {}, () => {})
      assert.strictEqual(xhrSpy.calledOnce, true);

    });
    it ('should set number-converted contentLength property of resource with xhr getResponseHeader return value', () => {
      const resource = { inspector: {} };
      requestResourceSize.call(caller, resource, () => {})
      assert.strictEqual(resource.inspector.contentLength, parseInt(StubXHR.prototype.getResponseHeader()));
    });
    it ('should not set contentLength property of resource if getResponseHeader returns null', () => {
      StubXHR.prototype.getResponseHeader = () => { return null; };

      const resource = {};
      requestResourceSize.call(caller, resource, () => {})
      assert.strictEqual(resource.contentLength, undefined);
    });
    it ('should add totalContentLength property of caller\'s inspector.summary', () => {
      const originalContentLength = 1000;
      caller.inspector.summary.totalContentLength = originalContentLength;
      requestResourceSize.call(caller, {}, () => {})
      assert.strictEqual(caller.inspector.summary.totalContentLength, originalContentLength + parseInt(StubXHR.prototype.getResponseHeader()));
    });
    it ('should not add totalContentLength property if caller does not have inspector property', () => {
      caller.inspector = undefined;
      requestResourceSize.call(caller, {}, () => {})
      assert.strictEqual(caller.inspector, undefined);
    });
  });
});
