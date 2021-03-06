/**
 * Mock interface for resource-loader Resource with augmentation.
 */
interface Resource {
  loadType: number;
  url: string;
  data: any;

  // augmentation
  inspector: {
    contentLength: number | undefined;
    alreadyLoaded: boolean | undefined;
  } | undefined;
}

export default Resource;
