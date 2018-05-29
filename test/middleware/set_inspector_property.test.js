import assert from 'power-assert';
import { setInspectorProperty } from 'middleware/set_inspector_property';

describe('setInspectorProperty', () => {
  it ('should set inspector property to resource', () => {
    const resource = {};
    assert.strictEqual(resource.inspector, undefined);
    setInspectorProperty.call({}, resource, () => {});
    assert.notStrictEqual(resource.inspector, undefined);
  });
});
