"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import { site } from "@/data/site";

import styles from "./VideoBanner.module.css";

type MediaState = "loading" | "playing" | "unavailable";

export type BannerSource = { src: string; type: string };

type VideoBannerProps = {
  /** Only the files that were found in /public — often none, at first. */
  sources: BannerSource[];
  poster?: string;
};

const { banner } = site;

export function VideoBanner({ sources, poster }: VideoBannerProps) {
  const hasVideo = sources.length > 0;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<MediaState>(
    hasVideo ? "loading" : "unavailable",
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  /* Anyone who prefers reduced motion gets a still frame, not a moving one. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      video.pause();
      setIsPaused(true);
    }
  }, []);

  const handleReady = useCallback(() => {
    setState((current) => (current === "unavailable" ? current : "playing"));
  }, []);

  const handleError = useCallback(() => setState("unavailable"), []);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play().catch(() => setState("unavailable"));
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  }, []);

  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  return (
    <section className={styles.banner} aria-labelledby="banner-headline">
      <div className={styles.media} data-state={state}>
        {/* Shown until the video is ready, and left in place if none is found. */}
        <div className={styles.still} aria-hidden="true" />

        {hasVideo ? (
          <video
            ref={videoRef}
            className={styles.video}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            tabIndex={-1}
            aria-hidden="true"
            onCanPlay={handleReady}
            onPlaying={handleReady}
            onError={handleError}
          >
            {sources.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        ) : null}

        <div className={styles.scrim} aria-hidden="true" />
      </div>

      <div className={`shell ${styles.content}`}>
        <p className={`mono ${styles.eyebrow}`}>
          <span className={styles.tick} aria-hidden="true" />
          {banner.eyebrow}
          <span className={styles.slash} aria-hidden="true">
            /
          </span>
          {site.name}
        </p>

        <h1 id="banner-headline" className={`display ${styles.headline}`}>
          {banner.headline.map((line, index) => (
            <span key={line} className={styles.line}>
              <span
                className={styles.lineInner}
                style={{ "--i": index } as CSSProperties}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className={`lead ${styles.lead}`}>{banner.lead}</p>
      </div>

      <div className={`shell ${styles.foot}`}>
        <a className={styles.scroll} href="#project-records">
          <span className={styles.scrollRail} aria-hidden="true">
            <span className={styles.scrollDot} />
          </span>
          <span className="mono">Project records</span>
        </a>

        {hasVideo && state !== "unavailable" ? (
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.control}
              onClick={togglePlayback}
              aria-label={isPaused ? "Play the banner video" : "Pause the banner video"}
            >
              <span className={styles.controlIcon} aria-hidden="true">
                {isPaused ? <PlayIcon /> : <PauseIcon />}
              </span>
              <span className="mono">{isPaused ? "Play" : "Pause"}</span>
            </button>

            <button
              type="button"
              className={styles.control}
              onClick={toggleSound}
              aria-label={isMuted ? "Unmute the banner video" : "Mute the banner video"}
            >
              <span className={styles.controlIcon} aria-hidden="true">
                {isMuted ? <MutedIcon /> : <SoundIcon />}
              </span>
              <span className="mono">{isMuted ? "Sound off" : "Sound on"}</span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* Icons ------------------------------------------------------------------ */

function PlayIcon() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="currentColor">
      <path d="M3 1.5v9l7-4.5-7-4.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="currentColor">
      <path d="M3 1.5h2.2v9H3zM6.8 1.5H9v9H6.8z" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg
      viewBox="0 0 14 12"
      width="13"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      <path d="M1 4.3h2.2L6.2 1.8v8.4L3.2 7.7H1z" fill="currentColor" stroke="none" />
      <path d="M9 4.4 12.4 7.8M12.4 4.4 9 7.8" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg
      viewBox="0 0 14 12"
      width="13"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      <path d="M1 4.3h2.2L6.2 1.8v8.4L3.2 7.7H1z" fill="currentColor" stroke="none" />
      <path d="M8.7 4.2a2.8 2.8 0 0 1 0 3.6M10.7 2.6a5.2 5.2 0 0 1 0 6.8" />
    </svg>
  );
}
