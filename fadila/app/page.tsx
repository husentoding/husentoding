"use client"

import { useState, useCallback, useRef } from "react"
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
  const musicVideoId = "rywUS-ohqeE"
  const musicFrameRef = useRef<HTMLIFrameElement>(null)

  const sendMusicCommand = useCallback((func: string) => {
    musicFrameRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func,
        args: [],
      }),
      "*",
    )
  }, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handlePrepareGallery = useCallback(async () => {
    const minLoadingMs = Math.max(0, config.minLoadingSeconds * 1000)
    const preloadTimeoutMs = Math.max(1000, config.assetPreloadTimeoutSeconds * 1000)

    await Promise.all([
      preloadGalleryAssets(preloadTimeoutMs),
      wait(minLoadingMs),
    ])
  }, [])

  const handleTimeElapsed = useCallback(() => {
    setShowInvitation(true)
  }, [])

  const handleTogglePlay = () => {
    if (isMusicPlaying) {
      sendMusicCommand("pauseVideo")
    } else {
      sendMusicCommand("playVideo")
    }
    setIsMusicPlaying((prev) => !prev)
  }

  const handleToggleMute = () => {
    if (isMusicMuted) {
      sendMusicCommand("unMute")
    } else {
      sendMusicCommand("mute")
    }
    setIsMusicMuted((prev) => !prev)
  }

  if (!isAuthenticated) {
    return <LoginPage onSuccess={handleLoginSuccess} onPrepare={handlePrepareGallery} />
  }

  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
        <iframe
          ref={musicFrameRef}
          src={`https://www.youtube-nocookie.com/embed/${musicVideoId}?autoplay=1&loop=1&playlist=${musicVideoId}&controls=0&disablekb=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1`}
          title="Background music"
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <div className="fixed left-4 top-4 z-[60] flex items-center gap-2 rounded-full border border-border bg-card/90 p-1.5 shadow-lg backdrop-blur-sm">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-full"
          onClick={handleTogglePlay}
          aria-label={isMusicPlaying ? "Pause background music" : "Play background music"}
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
  )
}
