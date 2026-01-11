import { describe, it, expect } from "vitest";
import { htmlToJson } from "../syntax";

describe("htmlToJson", () => {
  describe("basic parsing", () => {
    it("should return empty array for empty input", () => {
      const result = htmlToJson("", false);
      expect(result).toEqual([]);
    });

    it("should handle plain text without spans", () => {
      const result = htmlToJson("hello world", false);
      expect(result).toEqual([{ text: "hello world", color: undefined }]);
    });

    it("should handle multiple lines of plain text", () => {
      const result = htmlToJson("line1\nline2\nline3", false);
      expect(result).toEqual([
        { text: "line1", color: undefined },
        { text: "\n" },
        { text: "line2", color: undefined },
        { text: "\n" },
        { text: "line3", color: undefined },
      ]);
    });
  });

  describe("color mapping", () => {
    it("should apply keyword color", () => {
      const result = htmlToJson('<span class="hljs-keyword">const</span>', false);
      expect(result).toEqual([{ text: "const", color: "#000080" }]);
    });

    it("should apply string color", () => {
      const result = htmlToJson('<span class="hljs-string">"hello"</span>', false);
      expect(result).toEqual([{ text: '"hello"', color: "#006400" }]);
    });

    it("should apply comment color", () => {
      const result = htmlToJson('<span class="hljs-comment">// comment</span>', false);
      expect(result).toEqual([{ text: "// comment", color: "#708090" }]);
    });

    it("should apply number color", () => {
      const result = htmlToJson('<span class="hljs-number">42</span>', false);
      expect(result).toEqual([{ text: "42", color: "#FF4500" }]);
    });

    it("should apply operator color", () => {
      const result = htmlToJson('<span class="hljs-operator">=</span>', false);
      expect(result).toEqual([{ text: "=", color: "#A52A2A" }]);
    });

    it("should apply built_in color", () => {
      const result = htmlToJson('<span class="hljs-built_in">console</span>', false);
      expect(result).toEqual([{ text: "console", color: "#ADFF2F" }]);
    });

    it("should apply variable color", () => {
      const result = htmlToJson('<span class="hljs-variable">myVar</span>', false);
      expect(result).toEqual([{ text: "myVar", color: "#FFD700" }]);
    });

    it("should apply title color", () => {
      const result = htmlToJson('<span class="hljs-title">functionName</span>', false);
      expect(result).toEqual([{ text: "functionName", color: "#9370DB" }]);
    });

    it("should apply punctuation color", () => {
      const result = htmlToJson('<span class="hljs-punctuation">{}</span>', false);
      expect(result).toEqual([{ text: "{}", color: "#2F4F4F" }]);
    });

    it("should apply tag color", () => {
      const result = htmlToJson('<span class="hljs-tag">div</span>', false);
      expect(result).toEqual([{ text: "div", color: "#008080" }]);
    });

    it("should apply attribute color", () => {
      const result = htmlToJson('<span class="hljs-attribute">class</span>', false);
      expect(result).toEqual([{ text: "class", color: "#2E8B57" }]);
    });

    it("should apply regexp color", () => {
      const result = htmlToJson('<span class="hljs-regexp">/test/g</span>', false);
      expect(result).toEqual([{ text: "/test/g", color: "#B22222" }]);
    });

    it("should apply literal color", () => {
      const result = htmlToJson('<span class="hljs-literal">true</span>', false);
      expect(result).toEqual([{ text: "true", color: "#32CD32" }]);
    });

    it("should return undefined color for unknown class", () => {
      const result = htmlToJson('<span class="hljs-unknown">text</span>', false);
      expect(result).toEqual([{ text: "text", color: undefined }]);
    });

    it("should return undefined color for non-hljs class", () => {
      const result = htmlToJson('<span class="other-class">text</span>', false);
      expect(result).toEqual([{ text: "text", color: undefined }]);
    });
  });

  describe("nested spans", () => {
    it("should handle nested spans with different colors", () => {
      const html = '<span class="hljs-keyword">const</span> x <span class="hljs-operator">=</span> <span class="hljs-number">5</span>';
      const result = htmlToJson(html, false);
      expect(result).toEqual([
        { text: "const", color: "#000080" },
        { text: " x ", color: undefined },
        { text: "=", color: "#A52A2A" },
        { text: " ", color: undefined },
        { text: "5", color: "#FF4500" },
      ]);
    });

    it("should handle deeply nested spans", () => {
      const html = '<span class="hljs-keyword"><span class="hljs-built_in">inner</span></span>';
      const result = htmlToJson(html, false);
      expect(result).toEqual([{ text: "inner", color: "#ADFF2F" }]);
    });

    it("should maintain color stack correctly", () => {
      const html = '<span class="hljs-keyword">a<span class="hljs-string">b</span>c</span>';
      const result = htmlToJson(html, false);
      expect(result).toEqual([
        { text: "a", color: "#000080" },
        { text: "b", color: "#006400" },
        { text: "c", color: "#000080" },
      ]);
    });
  });

  describe("HTML entity decoding", () => {
    it("should decode &lt; to <", () => {
      const result = htmlToJson("a &lt; b", false);
      expect(result).toEqual([{ text: "a < b", color: undefined }]);
    });

    it("should decode &gt; to >", () => {
      const result = htmlToJson("a &gt; b", false);
      expect(result).toEqual([{ text: "a > b", color: undefined }]);
    });

    it("should decode &amp; to &", () => {
      const result = htmlToJson("a &amp; b", false);
      expect(result).toEqual([{ text: "a & b", color: undefined }]);
    });

    it("should decode &quot; to \"", () => {
      const result = htmlToJson("&quot;hello&quot;", false);
      expect(result).toEqual([{ text: '"hello"', color: undefined }]);
    });

    it("should decode &#39; to '", () => {
      const result = htmlToJson("it&#39;s", false);
      expect(result).toEqual([{ text: "it's", color: undefined }]);
    });

    it("should decode multiple entities in one string", () => {
      const result = htmlToJson("&lt;div&gt;&amp;&lt;/div&gt;", false);
      expect(result).toEqual([{ text: "<div>&</div>", color: undefined }]);
    });
  });

  describe("empty line removal", () => {
    it("should keep empty lines when removeEmptyLines is false", () => {
      const result = htmlToJson("line1\n\nline2", false);
      expect(result).toEqual([
        { text: "line1", color: undefined },
        { text: "\n" },
        { text: "", color: undefined },
        { text: "\n" },
        { text: "line2", color: undefined },
      ]);
    });

    it("should remove empty lines when removeEmptyLines is true", () => {
      const result = htmlToJson("line1\n\nline2", true);
      expect(result).toEqual([
        { text: "line1", color: undefined },
        { text: "\n" },
        { text: "line2", color: undefined },
      ]);
    });

    it("should remove lines with only whitespace when removeEmptyLines is true", () => {
      const result = htmlToJson("line1\n   \nline2", true);
      expect(result).toEqual([
        { text: "line1", color: undefined },
        { text: "\n" },
        { text: "line2", color: undefined },
      ]);
    });

    it("should handle multiple consecutive empty lines", () => {
      const result = htmlToJson("a\n\n\n\nb", true);
      expect(result).toEqual([
        { text: "a", color: undefined },
        { text: "\n" },
        { text: "b", color: undefined },
      ]);
    });
  });

  describe("edge cases", () => {
    it("should handle span with no class attribute", () => {
      const result = htmlToJson("<span>text</span>", false);
      expect(result).toEqual([{ text: "text", color: undefined }]);
    });

    it("should handle span with empty class", () => {
      const result = htmlToJson('<span class="">text</span>', false);
      expect(result).toEqual([{ text: "text", color: undefined }]);
    });

    it("should handle whitespace in span tag", () => {
      const result = htmlToJson('<span  class="hljs-keyword" >const</span>', false);
      expect(result).toEqual([{ text: "const", color: "#000080" }]);
    });

    it("should handle mixed content with spans and plain text", () => {
      const html = 'prefix <span class="hljs-keyword">keyword</span> suffix';
      const result = htmlToJson(html, false);
      expect(result).toEqual([
        { text: "prefix ", color: undefined },
        { text: "keyword", color: "#000080" },
        { text: " suffix", color: undefined },
      ]);
    });

    it("should handle newlines inside spans", () => {
      const html = '<span class="hljs-comment">// line1\n// line2</span>';
      const result = htmlToJson(html, false);
      expect(result).toEqual([
        { text: "// line1", color: "#708090" },
        { text: "\n" },
        { text: "// line2", color: "#708090" },
      ]);
    });

    it("should handle case insensitivity for hljs class names", () => {
      const result = htmlToJson('<span class="hljs-KEYWORD">const</span>', false);
      expect(result).toEqual([{ text: "const", color: "#000080" }]);
    });
  });
});
