type MercuriusFiles = string[];

type EventPayloadMapping = {
  subscribeFileList: MercuriusFiles;
  writeMyString: void;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    writeMyString: () => Promise<void>;
    subscribeFileList: (
      callback: (fileList: MercuriusFiles) => void
    ) => UnsubscribeFunction;
  };
}
