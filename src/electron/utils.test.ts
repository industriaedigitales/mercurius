import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import os from "os";

// Mock electron module to avoid runtime errors during test
vi.mock("electron", () => ({
  ipcMain: {
    handle: vi.fn(),
  },
  app: {
    getAppPath: vi.fn(() => "/mock/app/path"),
  },
}));

// Mock pathResolver since utils imports it
vi.mock("./pathResolver.js", () => ({
  getUiPath: vi.fn(() => "/mock/dist-react/index.html"),
}));

import { isDev, getLanIp } from "./utils.js";

describe("electron/utils", () => {
  describe("isDev", () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it("should return true when NODE_ENV is development", () => {
      vi.stubEnv("NODE_ENV", "development");
      expect(isDev()).toBe(true);
    });

    it("should return false when NODE_ENV is not development", () => {
      vi.stubEnv("NODE_ENV", "production");
      expect(isDev()).toBe(false);
    });
  });

  describe("getLanIp", () => {
    it("should return the IPv4 address that is not internal", () => {
      const mockInterfaces = {
        eth0: [
          {
            address: "192.168.1.10",
            family: "IPv4",
            internal: false, 
          },
        ],
        lo: [
          {
            address: "127.0.0.1",
            family: "IPv4",
            internal: true,
          },
        ],
      };

      // @ts-ignore - limited mock for testing
      vi.spyOn(os, "networkInterfaces").mockReturnValue(mockInterfaces);

      const ip = getLanIp();
      expect(ip).toBe("192.168.1.10");
    });

    it("should return N/A if no suitable IP is found", () => {
      const mockInterfaces = {
        lo: [
          {
            address: "127.0.0.1",
            family: "IPv4",
            internal: true,
          },
        ],
      };

      // @ts-ignore
      vi.spyOn(os, "networkInterfaces").mockReturnValue(mockInterfaces);

      const ip = getLanIp();
      expect(ip).toBe("N/A");
    });
    
    it("should ignore IPv6 addresses", () => {
        const mockInterfaces = {
          eth0: [
            {
              address: "fe80::1",
              family: "IPv6",
              internal: false,
            },
          ],
        };
  
        // @ts-ignore
        vi.spyOn(os, "networkInterfaces").mockReturnValue(mockInterfaces);
  
        const ip = getLanIp();
        expect(ip).toBe("N/A");
      });
  });
});
