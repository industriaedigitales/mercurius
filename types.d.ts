type MercuriusFiles = string[];

type EventPayloadMapping = {
  subscribeFileList: MercuriusFiles;
  getServerIp: string;
  toggleServer: void;
  selectDirectory: string | null;
  getUploadDirectory: string;
  getFiles: MercuriusFiles;
  deviceConnected: { deviceName: string; deviceType: string; userAgent: string };
  fileUploaded: { count: number; files: string[] };
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeFileList: (
      callback: (fileList: MercuriusFiles) => void
    ) => UnsubscribeFunction;
    getServerIp: () => Promise<string>;
    toggleServer: (enable: boolean) => Promise<void>;
    selectDirectory: () => Promise<string | null>;
    getUploadDirectory: () => Promise<string>;
    getFiles: () => Promise<MercuriusFiles>;
    subscribeDeviceConnected: (
      callback: (deviceInfo: { deviceName: string; deviceType: string; userAgent: string }) => void
    ) => UnsubscribeFunction;
    subscribeFileUploaded: (
      callback: (uploadInfo: { count: number; files: string[] }) => void
    ) => UnsubscribeFunction;
  };
}
