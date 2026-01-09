import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import loadIgnoreConfig, { IgnoreConfig } from "../loadIgnoreConfig";

// Mock the fs module
vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof fs>("fs");
  return {
    ...actual,
    promises: {
      ...actual.promises,
      readFile: vi.fn(),
    },
  };
});

describe("loadIgnoreConfig", () => {
  const mockReadFile = vi.mocked(fs.promises.readFile);
  const originalCwd = process.cwd();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock process.cwd to return a predictable path
    vi.spyOn(process, "cwd").mockReturnValue("/mock/cwd");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const validConfig: IgnoreConfig = {
    ignoredFiles: ["dist", "node_modules"],
    ignoredExtensions: [".log", ".tmp"],
  };

  describe("config found in current working directory", () => {
    it("should load config from cwd when it exists", async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify(validConfig));

      const result = await loadIgnoreConfig("/target/dir");

      expect(result).toEqual(validConfig);
      expect(mockReadFile).toHaveBeenCalledWith(
        path.join("/mock/cwd", "repo2pdf.ignore"),
        "utf8"
      );
      expect(mockReadFile).toHaveBeenCalledTimes(1);
    });

    it("should return config with only ignoredFiles", async () => {
      const partialConfig = { ignoredFiles: ["dist"] };
      mockReadFile.mockResolvedValueOnce(JSON.stringify(partialConfig));

      const result = await loadIgnoreConfig("/target/dir");

      expect(result).toEqual(partialConfig);
    });

    it("should return config with only ignoredExtensions", async () => {
      const partialConfig = { ignoredExtensions: [".log"] };
      mockReadFile.mockResolvedValueOnce(JSON.stringify(partialConfig));

      const result = await loadIgnoreConfig("/target/dir");

      expect(result).toEqual(partialConfig);
    });
  });

  describe("config found in target directory", () => {
    it("should fall back to target directory when cwd config not found", async () => {
      const enoentError = new Error("ENOENT") as NodeJS.ErrnoException;
      enoentError.code = "ENOENT";

      mockReadFile
        .mockRejectedValueOnce(enoentError) // cwd fails
        .mockResolvedValueOnce(JSON.stringify(validConfig)); // target succeeds

      const result = await loadIgnoreConfig("/target/dir");

      expect(result).toEqual(validConfig);
      expect(mockReadFile).toHaveBeenCalledTimes(2);
      expect(mockReadFile).toHaveBeenNthCalledWith(
        2,
        path.join("/target/dir", "repo2pdf.ignore"),
        "utf8"
      );
    });
  });

  describe("config found in package directory", () => {
    it("should fall back to package directory when cwd and target config not found", async () => {
      const enoentError = new Error("ENOENT") as NodeJS.ErrnoException;
      enoentError.code = "ENOENT";

      mockReadFile
        .mockRejectedValueOnce(enoentError) // cwd fails
        .mockRejectedValueOnce(enoentError) // target fails
        .mockResolvedValueOnce(JSON.stringify(validConfig)); // package succeeds

      const result = await loadIgnoreConfig("/target/dir", "/package/dir");

      expect(result).toEqual(validConfig);
      expect(mockReadFile).toHaveBeenCalledTimes(3);
      expect(mockReadFile).toHaveBeenNthCalledWith(
        3,
        path.join("/package/dir", "repo2pdf.ignore"),
        "utf8"
      );
    });

    it("should not check package directory if packageDir is not provided", async () => {
      const enoentError = new Error("ENOENT") as NodeJS.ErrnoException;
      enoentError.code = "ENOENT";

      mockReadFile
        .mockRejectedValueOnce(enoentError) // cwd fails
        .mockRejectedValueOnce(enoentError); // target fails

      const result = await loadIgnoreConfig("/target/dir");

      expect(result).toBeNull();
      expect(mockReadFile).toHaveBeenCalledTimes(2);
    });
  });

  describe("no config found", () => {
    it("should return null when no config exists in any location", async () => {
      const enoentError = new Error("ENOENT") as NodeJS.ErrnoException;
      enoentError.code = "ENOENT";

      mockReadFile
        .mockRejectedValueOnce(enoentError)
        .mockRejectedValueOnce(enoentError)
        .mockRejectedValueOnce(enoentError);

      const result = await loadIgnoreConfig("/target/dir", "/package/dir");

      expect(result).toBeNull();
    });
  });

  describe("error handling", () => {
    it("should throw non-ENOENT errors from cwd", async () => {
      const permissionError = new Error("EACCES") as NodeJS.ErrnoException;
      permissionError.code = "EACCES";

      mockReadFile.mockRejectedValueOnce(permissionError);

      await expect(loadIgnoreConfig("/target/dir")).rejects.toThrow("EACCES");
    });

    it("should throw non-ENOENT errors from target directory", async () => {
      const enoentError = new Error("ENOENT") as NodeJS.ErrnoException;
      enoentError.code = "ENOENT";
      const permissionError = new Error("EACCES") as NodeJS.ErrnoException;
      permissionError.code = "EACCES";

      mockReadFile
        .mockRejectedValueOnce(enoentError)
        .mockRejectedValueOnce(permissionError);

      await expect(loadIgnoreConfig("/target/dir")).rejects.toThrow("EACCES");
    });

    it("should throw non-ENOENT errors from package directory", async () => {
      const enoentError = new Error("ENOENT") as NodeJS.ErrnoException;
      enoentError.code = "ENOENT";
      const permissionError = new Error("EACCES") as NodeJS.ErrnoException;
      permissionError.code = "EACCES";

      mockReadFile
        .mockRejectedValueOnce(enoentError)
        .mockRejectedValueOnce(enoentError)
        .mockRejectedValueOnce(permissionError);

      await expect(loadIgnoreConfig("/target/dir", "/package/dir")).rejects.toThrow(
        "EACCES"
      );
    });

    it("should throw on invalid JSON", async () => {
      mockReadFile.mockResolvedValueOnce("not valid json");

      await expect(loadIgnoreConfig("/target/dir")).rejects.toThrow();
    });
  });

  describe("config validation", () => {
    it("should accept empty arrays", async () => {
      const emptyConfig = { ignoredFiles: [], ignoredExtensions: [] };
      mockReadFile.mockResolvedValueOnce(JSON.stringify(emptyConfig));

      const result = await loadIgnoreConfig("/target/dir");

      expect(result).toEqual(emptyConfig);
    });

    it("should accept empty object", async () => {
      mockReadFile.mockResolvedValueOnce("{}");

      const result = await loadIgnoreConfig("/target/dir");

      expect(result).toEqual({});
    });
  });
});
