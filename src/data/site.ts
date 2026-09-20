/**
 * Everything you are likely to want to change first: the name on the site,
 * the headline copy, and the banner video file it looks for.
 */

export const site = {
  /** Shown in the top-left mark and the browser tab. */
  name: "System & AI Engineer",
  /** Two letters for the monogram. */
  monogram: "SA",
  /** Used for the document title and search results. */
  title: "System & AI Engineer — Portfolio",
  description:
    "Enterprise systems, applications, and applied AI, delivered across 15 industries and kept running in production.",
  /** Change this to your own domain before you deploy. */
  url: "https://example.com",

  banner: {
    /**
     * Drop your banner video at public/media/banner.mp4 and, if you have one,
     * a WebM at public/media/banner.webm. Until a file is present, the banner
     * falls back to a designed still, so nothing looks broken.
     */
    sources: [
      { src: "/media/banner.webm", type: "video/webm" },
      { src: "/media/banner.mp4", type: "video/mp4" },
    ],
    /** Optional first frame, shown while the video loads: public/media/banner-poster.jpg */
    poster: "/media/banner-poster.jpg",
    eyebrow: "Portfolio",
    headline: ["Engineering systems", "that carry the weight", "of the work."],
    lead: "Enterprise systems, applications, and applied AI — designed, built, and kept running across fifteen industries.",
  },
} as const;
