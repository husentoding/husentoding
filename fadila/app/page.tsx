"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import { LoginPage } from "@/components/valentine/login-page"
import { PhotoGallery } from "@/components/valentine/photo-gallery"
import { LetterDelivery } from "@/components/valentine/letter-delivery"
import { config } from "@/lib/config"
import { withBasePath } from "@/lib/with-base-path"
import { Button } from "@/components/ui/button"

const galleryImageAssets = [
  withBasePath("/photos/photo-1.jpeg"),
  withBasePath("/photos/photo-2.jpeg"),
  withBasePath("/photos/photo-3.jpeg"),
  withBasePath("/photos/photo-4.jpeg"),
  withBasePath("/photos/photo-5.jpeg"),
  withBasePath("/photos/photo-6.jpeg"),
  withBasePath("/photos/photo-7.jpeg"),
  withBasePath("/photos/photo-8.jpeg"),
  withBasePath("/photos/photo-9.jpeg"),
  withBasePath("/photos/photo-10.jpeg"),
  withBasePath("/photos/photo-11.jpeg"),
  withBasePath("/photos/photo-12.jpeg"),
  withBasePath("/photos/left-1.jpeg"),
  withBasePath("/photos/left-2.jpeg"),
  withBasePath("/photos/right-1.jpeg"),
  withBasePath("/photos/right-2.jpeg"),
]

const galleryVideoAssets = [withBasePath("/photos/video/timelapse.mp4")]
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
const DEFAULT_MUSIC_VIDEO_ID = "rywUS-ohqeE"
const APP_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://husentoding.github.io"

const normalizeYoutubeUrl = (input: string) => {
  if (input.startsWith("http://") || input.startsWith("https://")) {
    return input
  }

  return `https://${input}`
}

const extractYoutubeVideoId = (input: string | undefined) => {
  if (!input) {
    return DEFAULT_MUSIC_VIDEO_ID
  }

  const trimmed = input.trim()

  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed
  }

  try {
    const url = new URL(normalizeYoutubeUrl(trimmed))
    const host = url.hostname.replace(/^www\./, "")

    if (host === "youtu.be") {
      const shortId = url.pathname.split("/").filter(Boolean)[0]
      if (shortId && /^[\w-]{11}$/.test(shortId)) {
        return shortId
      }
    }

    const videoIdFromQuery = url.searchParams.get("v")
    if (videoIdFromQuery && /^[\w-]{11}$/.test(videoIdFromQuery)) {
      return videoIdFromQuery
    }

    const pathSegments = url.pathname.split("/").filter(Boolean)
    const embedIndex = pathSegments.findIndex((segment) => segment === "embed" || segment === "shorts")
    if (embedIndex !== -1) {
      const pathId = pathSegments[embedIndex + 1]
      if (pathId && /^[\w-]{11}$/.test(pathId)) {
        return pathId
      }
    }
  } catch {
    // Fall through to regex fallback.
  }

  const fallback = trimmed.match(/(?:v=|be\/|embed\/|shorts\/)([\w-]{11})/)
  if (fallback?.[1]) {
    return fallback[1]
  }

  return DEFAULT_MUSIC_VIDEO_ID
}

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = src
  })

const preloadVideo = (src: string) =>
  new Promise<void>((resolve) => {
    const video = document.createElement("video")
    const done = () => {
      video.onloadeddata = null
      video.oncanplaythrough = null
      video.onerror = null
      resolve()
    }

    video.preload = "auto"
    video.src = src
    video.onloadeddata = done
    video.oncanplaythrough = done
    video.onerror = done
    video.load()
  })

const preloadGalleryAssets = async (timeoutMs: number) => {
  const preloadTask = Promise.allSettled([
    ...galleryImageAssets.map((src) => preloadImage(src)),
    ...galleryVideoAssets.map((src) => preloadVideo(src)),
  ])

  await Promise.race([
    preloadTask,
    wait(timeoutMs),
  ])
}

export default function ValentinePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showInvitation, setShowInvitation] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(true)
  const [isMusicMuted, setIsMusicMuted] = useState(false)
  const [isMusicFrameLoaded, setIsMusicFrameLoaded] = useState(false)
  const [isMusicPlayerReady, setIsMusicPlayerReady] = useState(false)
  const [musicAppOrigin, setMusicAppOrigin] = useState(APP_ORIGIN)
  const musicVideoId = extractYoutubeVideoId(config.backgroundMusicUrl)
  const musicEmbedOrigin = "https://www.youtube.com"
  const musicEmbedSrc = `${musicEmbedOrigin}/embed/${musicVideoId}?autoplay=0&loop=1&playlist=${musicVideoId}&controls=0&disablekb=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1&playsinline=1&origin=${encodeURIComponent(musicAppOrigin)}`
  const musicFrameRef = useRef<HTMLIFrameElement>(null)
  const isMusicFrameLoadedRef = useRef(false)
  const isMusicPlayerReadyRef = useRef(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMusicAppOrigin(window.location.origin)
    }
  }, [])

  useEffect(() => {
    isMusicFrameLoadedRef.current = isMusicFrameLoaded
  }, [isMusicFrameLoaded])

  useEffect(() => {
    isMusicPlayerReadyRef.current = isMusicPlayerReady
  }, [isMusicPlayerReady])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== musicEmbedOrigin || typeof event.data !== "string") {
        return
      }

      let payload: { event?: string } | null = null
      try {
        payload = JSON.parse(event.data)
      } catch {
        return
      }

      if (payload?.event === "onReady") {
        setIsMusicPlayerReady(true)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [musicEmbedOrigin])

  const sendMusicCommand = useCallback((func: string) => {
    musicFrameRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func,
        args: [],
      }),
      musicEmbedOrigin,
    )
  }, [musicEmbedOrigin])

  const canControlMusic = isMusicPlayerReady || isMusicFrameLoaded

  useEffect(() => {
    if (!canControlMusic) {
      return
    }

    if (!isAuthenticated) {
      sendMusicCommand("pauseVideo")
      return
    }

    sendMusicCommand(isMusicPlaying ? "playVideo" : "pauseVideo")
    sendMusicCommand(isMusicMuted ? "mute" : "unMute")
  }, [canControlMusic, isAuthenticated, isMusicMuted, isMusicPlaying, sendMusicCommand])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const waitForMusicReady = useCallback(async (timeoutMs: number) => {
    const start = Date.now()
    while (Date.now() - start < timeoutMs) {
      if (isMusicPlayerReadyRef.current) {
        return
      }

      if (isMusicFrameLoadedRef.current && Date.now() - start > 1200) {
        return
      }

      await wait(120)
    }
  }, [])

  const handlePrepareGallery = useCallback(async () => {
    const minLoadingMs = Math.max(0, config.minLoadingSeconds * 1000)
    const preloadTimeoutMs = Math.max(1000, config.assetPreloadTimeoutSeconds * 1000)
    const musicReadyTimeoutMs = Math.max(2000, Math.min(preloadTimeoutMs, 9000))

    await Promise.all([
      preloadGalleryAssets(preloadTimeoutMs),
      waitForMusicReady(musicReadyTimeoutMs),
      wait(minLoadingMs),
    ])
  }, [waitForMusicReady])

  const handleTimeElapsed = useCallback(() => {
    setShowInvitation(true)
  }, [])

  const handleTogglePlay = () => {
    setIsMusicPlaying((prev) => !prev)
  }

  const handleToggleMute = () => {
    setIsMusicMuted((prev) => !prev)
  }

  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
        <iframe
          ref={musicFrameRef}
          src={musicEmbedSrc}
          title="Background music"
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setIsMusicFrameLoaded(true)}
        />
      </div>

      {!isAuthenticated ? (
        <LoginPage onSuccess={handleLoginSuccess} onPrepare={handlePrepareGallery} />
      ) : (
        <>
          <div className="fixed left-4 top-4 z-[60] flex items-center gap-2 rounded-full border border-border bg-card/90 p-1.5 shadow-lg backdrop-blur-sm">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full"
              onClick={handleTogglePlay}
              aria-label={isMusicPlaying ? "Pause background music" : "Play background music"}
              disabled={!canControlMusic}
            >
              {isMusicPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full"
              onClick={handleToggleMute}
              aria-label={isMusicMuted ? "Unmute background music" : "Mute background music"}
              disabled={!canControlMusic}
            >
              {isMusicMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>

          <PhotoGallery
            onTimeElapsed={handleTimeElapsed}
            delaySeconds={config.invitationDelay}
          />
          <LetterDelivery isDelivered={showInvitation} />
        </>
      )}
    </>
  )
}
