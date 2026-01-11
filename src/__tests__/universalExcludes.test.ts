import { describe, it, expect } from "vitest";
import {
  universalExcludedNames,
  universalExcludedExtensions,
} from "../universalExcludes";

describe("universalExcludes", () => {
  describe("universalExcludedNames", () => {
    it("should be a non-empty array", () => {
      expect(Array.isArray(universalExcludedNames)).toBe(true);
      expect(universalExcludedNames.length).toBeGreaterThan(0);
    });

    it("should contain .git directory", () => {
      expect(universalExcludedNames).toContain(".git");
    });

    it("should contain node_modules", () => {
      expect(universalExcludedNames).toContain("node_modules");
    });

    it("should contain package-lock.json", () => {
      expect(universalExcludedNames).toContain("package-lock.json");
    });

    it("should contain yarn.lock", () => {
      expect(universalExcludedNames).toContain("yarn.lock");
    });

    it("should contain .gitignore", () => {
      expect(universalExcludedNames).toContain(".gitignore");
    });

    it("should contain repo2pdf.ignore", () => {
      expect(universalExcludedNames).toContain("repo2pdf.ignore");
    });

    it("should contain IDE directories", () => {
      expect(universalExcludedNames).toContain(".vscode");
      expect(universalExcludedNames).toContain(".idea");
      expect(universalExcludedNames).toContain(".vs");
    });

    it("should only contain strings", () => {
      universalExcludedNames.forEach((name) => {
        expect(typeof name).toBe("string");
      });
    });
  });

  describe("universalExcludedExtensions", () => {
    it("should be a non-empty array", () => {
      expect(Array.isArray(universalExcludedExtensions)).toBe(true);
      expect(universalExcludedExtensions.length).toBeGreaterThan(0);
    });

    it("should contain common image extensions", () => {
      expect(universalExcludedExtensions).toContain(".png");
      expect(universalExcludedExtensions).toContain(".jpg");
      expect(universalExcludedExtensions).toContain(".jpeg");
      expect(universalExcludedExtensions).toContain(".gif");
      expect(universalExcludedExtensions).toContain(".svg");
      expect(universalExcludedExtensions).toContain(".bmp");
      expect(universalExcludedExtensions).toContain(".webp");
      expect(universalExcludedExtensions).toContain(".ico");
    });

    it("should contain common video extensions", () => {
      expect(universalExcludedExtensions).toContain(".mp4");
      expect(universalExcludedExtensions).toContain(".mov");
      expect(universalExcludedExtensions).toContain(".avi");
      expect(universalExcludedExtensions).toContain(".wmv");
    });

    it("should contain .pdf extension", () => {
      expect(universalExcludedExtensions).toContain(".pdf");
    });

    it("should contain .yml extension", () => {
      expect(universalExcludedExtensions).toContain(".yml");
    });

    it("should only contain strings starting with dot", () => {
      universalExcludedExtensions.forEach((ext) => {
        expect(typeof ext).toBe("string");
        expect(ext.startsWith(".")).toBe(true);
      });
    });
  });
});
