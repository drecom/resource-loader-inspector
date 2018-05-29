# resource-loader-inspector

is an inspector for [resource-loader](https://github.com/englercj/resource-loader/) developed by [englercj](https://github.com/englercj).

resource-loader-inspector proveides its inspecting processes as loader middleware and it enables to collect resource data size and resource amount.

Resource information is summarized as bellow;

```
interface Summary {
  totalContentLength: number;
  resourceCount: number;
  contentLengthUnknown: number;
}
```

and loader instance may be augmented `inspector.summary` property that contains the summary above.

# Usage

## Begin resource info retrieval

Use _attach_ method.

The second argument indicates use of HEAD request since resource-loader uses browser api such as Image and Video those don't have data size information on it's instance.

Retrieved data is stored to augmented property `inspector.summary` of loader instance.

```
ResourceLoaderInspector.attach(loader);
...
console.log(loader.inspector.summary);
```

However, inspector does not care about `reset()` call of loader.

Users may manually recalcurate resource info as described below.

## Retrieving current resource info

Use _snapshot_ method.

It returns object that has exactly same schema with `inspector.summary` .

Resource summary is retrieved from existing resource properties.

It means no additional retrieval such as http HEAD request will occur in this method.

Note that calcurated summary is not stored to given loader instance.

```
const summary = ResourceLoaderInspector.snapshot(loader);
```

## Recollect resource info

Use _recollect_ method.

It recollects resource info from `resources` property of given loader instance.

This API is used when resource data is reset or whenever it is suspected not keeping atomicity beteen summary and resource data.

Collected info is stored to `inspector.summary` property of loader instance.

```
ResourceLoaderInspector.recollect(loader);
...
console.log(loader.inspector.summary);
```

# Remarks

resource-loader-inspector uses HEAD request to retrieve data size for files not downloaded via XHR such as Image, Audio and Video.

And of course this gives an impact to the application performance, so this module should be used only under the development environment.

Otherwise you can turn of the HEAD request feature by giving `false` to the second argument of `attach` and `recollect` method.
