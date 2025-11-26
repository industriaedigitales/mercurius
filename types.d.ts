type MercuriusFiles = string[];

type EventPayloadMapping = {
  subscribeFileList: MercuriusFiles;
  writeMyString: void;
  getServerIp: string;
  toggleServer: void;
  selectDirectory: string | null;
  getUploadDirectory: string;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    writeMyString: () => Promise<void>;
    subscribeFileList: (
      callback: (fileList: MercuriusFiles) => void
    ) => UnsubscribeFunction;
    getServerIp: () => Promise<string>;
    toggleServer: (enable: boolean) => Promise<void>;
    selectDirectory: () => Promise<string | null>;
    getUploadDirectory: () => Promise<string>;
  };
}
