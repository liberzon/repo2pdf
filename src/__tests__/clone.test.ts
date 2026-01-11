import { describe, it, expect } from "vitest";
import { getPrettierParser } from "../clone";

describe("clone", () => {
  describe("getPrettierParser", () => {
    describe("JavaScript/TypeScript", () => {
      it("should return babel for js extension", () => {
        expect(getPrettierParser("js")).toBe("babel");
      });

      it("should return babel for jsx extension", () => {
        expect(getPrettierParser("jsx")).toBe("babel");
      });

      it("should return typescript for ts extension", () => {
        expect(getPrettierParser("ts")).toBe("typescript");
      });

      it("should return typescript for tsx extension", () => {
        expect(getPrettierParser("tsx")).toBe("typescript");
      });
    });

    describe("CSS", () => {
      it("should return css for css extension", () => {
        expect(getPrettierParser("css")).toBe("css");
      });

      it("should return scss for scss extension", () => {
        expect(getPrettierParser("scss")).toBe("scss");
      });

      it("should return less for less extension", () => {
        expect(getPrettierParser("less")).toBe("less");
      });
    });

    describe("Markup", () => {
      it("should return html for html extension", () => {
        expect(getPrettierParser("html")).toBe("html");
      });

      it("should return markdown for md extension", () => {
        expect(getPrettierParser("md")).toBe("markdown");
      });

      it("should return xml for xml extension", () => {
        expect(getPrettierParser("xml")).toBe("xml");
      });

      it("should return vue for vue extension", () => {
        expect(getPrettierParser("vue")).toBe("vue");
      });

      it("should return angular for angular extension", () => {
        expect(getPrettierParser("angular")).toBe("angular");
      });
    });

    describe("Data formats", () => {
      it("should return json for json extension", () => {
        expect(getPrettierParser("json")).toBe("json");
      });

      it("should return yaml for yaml extension", () => {
        expect(getPrettierParser("yaml")).toBe("yaml");
      });

      it("should return graphql for graphql extension", () => {
        expect(getPrettierParser("graphql")).toBe("graphql");
      });

      it("should return ini for ini extension", () => {
        expect(getPrettierParser("ini")).toBe("ini");
      });
    });

    describe("Programming languages", () => {
      it("should return java for java extension", () => {
        expect(getPrettierParser("java")).toBe("java");
      });

      it("should return kotlin for kotlin extension", () => {
        expect(getPrettierParser("kotlin")).toBe("kotlin");
      });

      it("should return swift for swift extension", () => {
        expect(getPrettierParser("swift")).toBe("swift");
      });

      it("should return php for php extension", () => {
        expect(getPrettierParser("php")).toBe("php");
      });

      it("should return ruby for ruby extension", () => {
        expect(getPrettierParser("ruby")).toBe("ruby");
      });

      it("should return python for python extension", () => {
        expect(getPrettierParser("python")).toBe("python");
      });

      it("should return perl for perl extension", () => {
        expect(getPrettierParser("perl")).toBe("perl");
      });
    });

    describe("Shell and config", () => {
      it("should return sh for shell extension", () => {
        expect(getPrettierParser("shell")).toBe("sh");
      });

      it("should return dockerfile for dockerfile extension", () => {
        expect(getPrettierParser("dockerfile")).toBe("dockerfile");
      });
    });

    describe("Unknown extensions", () => {
      it("should return null for unknown extension", () => {
        expect(getPrettierParser("unknown")).toBeNull();
      });

      it("should return null for empty string", () => {
        expect(getPrettierParser("")).toBeNull();
      });

      it("should return null for c extension (not in map)", () => {
        expect(getPrettierParser("c")).toBeNull();
      });

      it("should return null for go extension (not in map)", () => {
        expect(getPrettierParser("go")).toBeNull();
      });

      it("should return null for rust extension (not in map)", () => {
        expect(getPrettierParser("rs")).toBeNull();
      });
    });

    describe("case sensitivity", () => {
      it("should be case sensitive - uppercase JS returns null", () => {
        expect(getPrettierParser("JS")).toBeNull();
      });

      it("should be case sensitive - uppercase JSON returns null", () => {
        expect(getPrettierParser("JSON")).toBeNull();
      });
    });
  });
});
