import assert from 'power-assert';
import { spy } from 'sinon';
import { markLoaded } from 'middleware/mark_loaded';

describe('markLoaded', () => {
  it ('should set alreadyLoaded property as true if resource has truthy data', () => {
    const resource = { data: true, inspector: {} };
    markLoaded.call({}, resource, () => {})
    assert.strictEqual(resource.inspector.alreadyLoaded, true);
  });

  it ('should set alreadyLoaded property as false if resource has no data', () => {
    const resource = { inspector: {} };
    markLoaded.call({}, resource, () => {})
    assert.strictEqual(resource.inspector.alreadyLoaded, false);
  });
});
