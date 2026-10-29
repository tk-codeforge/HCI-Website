"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Video with a permanent visual fallback.
 *
 * - Does not add the media URL to the <video> until the component is near the
 *   viewport (desktop) or the visitor explicitly presses Play (mobile).
 * - Keeps the poster visible until a decoded video frame is actually ready.
 * - If the source stalls or errors, the poster/gradient remains instead of a
 *   black or empty rectangle.
 * - Decorative autoplay is disabled on mobile, Save-Data and reduced-motion.
 */
export default function DeferredMediaVideo({
  src,
  poster = "",
  alt = "",
  className = "",
  videoClassName = "",
  style = {},
  videoStyle = {},
  posterStyle = {},
  autoPlayDesktop = true,
  active = true,
  showPlayButtonOnMobile = true,
  posterLoading = "lazy",
  posterFetchPriority = "auto",
  playButtonStyle = {},
  controlsOnManualPlay = true,
}) {
  const shellRef = useRef(null);
  const videoRef = useRef(null);
  const stallTimerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [mediaQueryReady, setMediaQueryReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const updatePreferences = () => {
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      setSaveData(Boolean(navigator.connection?.saveData));
      setMediaQueryReady(true);
    };

    updatePreferences();
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mobileQuery.addEventListener?.("change", updatePreferences);
    motionQuery.addEventListener?.("change", updatePreferences);
    window.addEventListener("resize", updatePreferences, { passive: true });

    return () => {
      mobileQuery.removeEventListener?.("change", updatePreferences);
      motionQuery.removeEventListener?.("change", updatePreferences);
      window.removeEventListener("resize", updatePreferences);
    };
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "200px 0px", threshold: 0.01 }
    );
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  const attachAndPlay = useCallback((fromUser = false) => {
    const video = videoRef.current;
    if (!video || !src || !active) return;

    setVideoFailed(false);
    if (video.getAttribute("src") !== src) {
      setVideoReady(false);
      video.setAttribute("src", src);
      video.load();
    }

    if (stallTimerRef.current) window.clearTimeout(stallTimerRef.current);
    // If the server stalls, expose a manual retry while keeping the poster on-screen.
    stallTimerRef.current = window.setTimeout(() => {
      const currentVideo = videoRef.current;
      if (currentVideo && currentVideo.readyState < 2) setVideoFailed(true);
    }, 8000);

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // The poster stays visible if autoplay is blocked or decoding fails.
        if (!fromUser) setVideoFailed(true);
      });
    }
  }, [src, active]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const shouldAutoplay =
      mediaQueryReady &&
      !isMobile &&
      !saveData &&
      !reducedMotion &&
      autoPlayDesktop &&
      active &&
      inView;
    const shouldPlay = active && inView && (manualPlay || shouldAutoplay);

    if (shouldPlay) {
      attachAndPlay(manualPlay);
    } else {
      video.pause();
    }
  }, [
    active,
    attachAndPlay,
    autoPlayDesktop,
    inView,
    isMobile,
    manualPlay,
    mediaQueryReady,
    reducedMotion,
    saveData,
  ]);

  const handleManualPlay = useCallback(() => {
    setManualPlay(true);
    setVideoFailed(false);
    setVideoReady(false);
    setInView(true);

    // Start in the click handler so browsers retain the user's playback gesture.
    const video = videoRef.current;
    if (!video || !src || !active) return;
    if (videoFailed || video.error || video.getAttribute("src") !== src) {
      video.setAttribute("src", src);
      video.load();
    }
    if (stallTimerRef.current) window.clearTimeout(stallTimerRef.current);
    stallTimerRef.current = window.setTimeout(() => {
      const currentVideo = videoRef.current;
      if (currentVideo && currentVideo.readyState < 2) setVideoFailed(true);
    }, 8000);

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => setVideoFailed(true));
    }
  }, [active, src, videoFailed]);

  const handleVideoReady = useCallback(() => {
    if (stallTimerRef.current) window.clearTimeout(stallTimerRef.current);
    stallTimerRef.current = null;
    setVideoFailed(false);
    setVideoReady(true);
  }, []);

  const handleVideoError = useCallback(() => {
    if (stallTimerRef.current) window.clearTimeout(stallTimerRef.current);
    stallTimerRef.current = null;
    setVideoReady(false);
    setVideoFailed(true);
  }, []);

  useEffect(() => () => {
    if (stallTimerRef.current) window.clearTimeout(stallTimerRef.current);
  }, []);

  const shouldShowPlayButton =
    Boolean(src) &&
    active &&
    !videoReady &&
    ((mediaQueryReady && ((isMobile && showPlayButtonOnMobile) || saveData || reducedMotion)) || videoFailed);

  return (
    <div
      ref={shellRef}
      className={`deferred-media-video ${className}`.trim()}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #f4f4f4 0%, #e4e4e4 100%)",
        ...style,
      }}
      data-video-state={videoFailed ? "fallback" : videoReady ? "ready" : "poster"}
    >
      {poster ? (
        <img
          className="deferred-media-video-poster"
          src={poster}
          alt={alt}
          loading={posterLoading}
          fetchPriority={posterFetchPriority}
          decoding="async"
          onError={(event) => {
            // Reveal the gradient background instead of a broken-image icon.
            event.currentTarget.style.display = "none";
          }}
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            ...posterStyle,
          }}
        />
      ) : null}

      <video
        ref={videoRef}
        className={`deferred-media-video-element ${videoClassName}`.trim()}
        muted
        loop
        playsInline
        preload="none"
        controls={Boolean(manualPlay && controlsOnManualPlay)}
        aria-label={alt || undefined}
        aria-hidden={manualPlay ? undefined : "true"}
        onLoadedData={handleVideoReady}
        onCanPlay={handleVideoReady}
        onPlaying={handleVideoReady}
        onError={handleVideoError}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: videoReady && !videoFailed ? 1 : 0,
          transition: "opacity 180ms ease-out",
          pointerEvents: manualPlay ? "auto" : "none",
          ...videoStyle,
        }}
      />

      {shouldShowPlayButton ? (
        <button
          type="button"
          onClick={handleManualPlay}
          aria-label={`Play video${alt ? `: ${alt}` : ""}`}
          title="Play video"
          style={{
            position: "absolute",
            zIndex: 3,
            right: 16,
            bottom: 16,
            width: 48,
            height: 48,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,.8)",
            borderRadius: "50%",
            background: "rgba(24, 24, 24, .72)",
            color: "#fff",
            boxShadow: "0 3px 12px rgba(0,0,0,.2)",
            cursor: "pointer",
            ...playButtonStyle,
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 19, lineHeight: 1, marginLeft: 3 }}>▶</span>
        </button>
      ) : null}
    </div>
  );
}
