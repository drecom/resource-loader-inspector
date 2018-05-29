import assert from 'power-assert';
import { spy } from 'sinon';
import { incrementResourceCount } from 'middleware/increment_resource_count';

describe('incrementResourceCount', () => {
  const caller = {
    inspector: {
      summary: {
        resourceCount: 0
      }
    }
  };

  it ('should increment resourceCount propery of caller\'s inspector.summary', () => {
    const originalResourceCount = 100;
    caller.inspector.summary.resourceCount = originalResourceCount;
    incrementResourceCount.call(caller, {}, () => {})
    assert.strictEqual(caller.inspector.summary.resourceCount, originalResourceCount + 1);
  });

  it ('should not increment resourceCount when resource have truthy alreadyLoaded property', () => {
    const originalResourceCount = 100;
    caller.inspector.summary.resourceCount = originalResourceCount;
    incrementResourceCount.call(caller, { inspector: { alreadyLoaded: true } }, () => {})
    assert.strictEqual(caller.inspector.summary.resourceCount, originalResourceCount);
  });
});
