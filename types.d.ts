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
  deleteFiles: void;
  printFile: void;
  startTunnel: string | null;
  stopTunnel: void;
  getTunnelUrl: string | null;
  getPublicIp: string | null;
  getLanguage: string;
  setLanguage: boolean;
  navigate: string;
  "menu-action": string;
  ipChanged: string;
  getOnboarded: boolean;
  setOnboarded: void;
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
    deleteFiles: (files: string[]) => Promise<void>;
    printFile: (file: string) => Promise<void>;
    startTunnel: () => Promise<string | null>;
    stopTunnel: () => Promise<void>;
    getTunnelUrl: () => Promise<string | null>;
    getPublicIp: () => Promise<string | null>;
    getLanguage: () => Promise<string>;
    setLanguage: (lang: string) => Promise<boolean>;
    getOnboarded: () => Promise<boolean>;
    setOnboarded: (onboarded: boolean) => Promise<void>;
    subscribeDeviceConnected: (
      callback: (deviceInfo: { deviceName: string; deviceType: string; userAgent: string }) => void
    ) => UnsubscribeFunction;
    subscribeFileUploaded: (
      callback: (uploadInfo: { count: number; files: string[] }) => void
    ) => UnsubscribeFunction;
    subscribeNavigate: (
      callback: (path: string) => void
    ) => UnsubscribeFunction;
    subscribeMenuAction: (
      callback: (action: string) => void
    ) => UnsubscribeFunction;
    subscribeIpChanged: (
      callback: (ip: string) => void
    ) => UnsubscribeFunction;
  };
}
