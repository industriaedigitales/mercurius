import { describe, it, expect } from "vitest";
import { isImage, isVideo, isPdf } from "./fileTypes";

describe("fileTypes", () => {
  describe("isImage", () => {
    it("should return true for valid image extensions", () => {
      expect(isImage("photo.jpg")).toBe(true);
      expect(isImage("image.jpeg")).toBe(true);
      expect(isImage("pic.png")).toBe(true);
      expect(isImage("anim.gif")).toBe(true);
      expect(isImage("web.webp")).toBe(true);
      expect(isImage("vector.svg")).toBe(true);
    });

    it("should be case insensitive", () => {
      expect(isImage("PHOTO.JPG")).toBe(true);
      expect(isImage("Image.PnG")).toBe(true);
    });

    it("should return false for non-image extensions", () => {
      expect(isImage("document.pdf")).toBe(false);
      expect(isImage("video.mp4")).toBe(false);
      expect(isImage("script.js")).toBe(false);
    });
  });

  describe("isVideo", () => {
    it("should return true for valid video extensions", () => {
      expect(isVideo("movie.mp4")).toBe(true);
      expect(isVideo("clip.webm")).toBe(true);
      expect(isVideo("rec.ogg")).toBe(true);
      expect(isVideo("film.mov")).toBe(true);
    });

    it("should be case insensitive", () => {
      expect(isVideo("MOVIE.MP4")).toBe(true);
      expect(isVideo("Clip.WebM")).toBe(true);
    });

    it("should return false for non-video extensions", () => {
      expect(isVideo("image.jpg")).toBe(false);
      expect(isVideo("doc.pdf")).toBe(false);
    });
  });

  describe("isPdf", () => {
    it("should return true for pdf extension", () => {
      expect(isPdf("document.pdf")).toBe(true);
    });

    it("should be case insensitive", () => {
      expect(isPdf("DOCUMENT.PDF")).toBe(true);
    });

    it("should return false for non-pdf extensions", () => {
      expect(isPdf("image.jpg")).toBe(false);
      expect(isPdf("text.txt")).toBe(false);
    });
  });
});
