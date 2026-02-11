"use client"

import { useState, useEffect } from "react"
import { Heart, X, ChevronLeft, ChevronRight, Play, Sparkles } from "lucide-react"
import Image from "next/image"
import { withBasePath } from "@/lib/with-base-path"

type GalleryItem = {
  id: number
  src: string
  caption: string
  isAnimated: boolean
  mediaType?: "photo" | "video"
  poster?: string
}

const photos = [
  {
    id: 1,
    src: withBasePath("/photos/photo-2.jpeg"),
    caption: "Foto kamu paling keren, slay bgt queen!",
    isAnimated: true,
  },
  {
    id: 2,
    src: withBasePath("/photos/photo-1.jpeg"),
    caption: "Uculllll, lope lope",
    isAnimated: true,
  },
  {
    id: 3,
    src: withBasePath("/photos/photo-6.jpeg"),
    caption: "Layakny couple jaman now, love u",
    isAnimated: false,
  },
  {
    id: 4,
    src: withBasePath("/photos/photo-4.jpeg"),
    caption: "Salam dari Aunty Anne",
    isAnimated: true,
  },
  {
    id: 5,
    src: withBasePath("/photos/photo-5.jpeg"),
    caption: "Kopinya ga enak, tapi kamu cantik bgt",
    isAnimated: false,
  },
  {
    id: 6,
    src: withBasePath("/photos/photo-3.jpeg"),
    caption: "Debut celana gajah, TUKU ENAK",
    isAnimated: false,
  },
  {
    id: 7,
    src: withBasePath("/photos/photo-7.jpeg"),
    caption: "POV Bayarin ayang pake QRIS",
    isAnimated: true,
  },
  {
    id: 8,
    src: withBasePath("/photos/photo-8.jpeg"),
    caption: "HOT DAMN!",
    isAnimated: false,
  },
  {
    id: 9,
    src: withBasePath("/photos/photo-9.jpeg"),
    caption: "Hehe lucu, langgeng amin",
    isAnimated: false,
  },
  {
    id: 10,
    src: withBasePath("/photos/left-1.jpeg"),
    caption: "QRIS dan upil",
    isAnimated: true,
  },
  {
    id: 11,
    src: withBasePath("/photos/photo-11.jpeg"),
    caption: "Jauh bgt pijet ke PIK",
    isAnimated: false,
  },
  {
    id: 12,
    src: withBasePath("/photos/photo-12.jpeg"),
    caption: "Red fits you so well, menyala sayangkuu",
    isAnimated: false,
  },
] satisfies GalleryItem[]

const timelapse: GalleryItem = {
  id: 13,
  src: withBasePath("/photos/video/timelapse.mp4"),
  caption: "POV Planning the future? xixixixi",
  isAnimated: true,
  mediaType: "video",
  poster: withBasePath("/photos/photo-11.jpeg"),
}

const sideMemoriesLeft: GalleryItem[] = [
  {
    id: 101,
    src: withBasePath("/photos/right-2.jpeg"),
    caption: "KIW KIW! cwk siapa ni",
    isAnimated: false,
  },
  {
    id: 102,
    src: withBasePath("/photos/left-2.jpeg"),
    caption: "Hehehehehehehe, anak siapa tu",
    isAnimated: false,
  },
]

const sideMemoriesRight: GalleryItem[] = [
  {
    id: 103,
    src: withBasePath("/photos/right-1.jpeg"),
    caption: "Waktu rambut masi panjang hehehehe",
    isAnimated: false,
  },
  {
    id: 104,
    src: withBasePath("/photos/photo-10.jpeg"),
    caption: "Merah dan Fore!",
    isAnimated: false,
  },
]

const galleryItems = [timelapse, ...photos, ...sideMemoriesLeft, ...sideMemoriesRight]
const mobileGalleryItems = [...photos, ...sideMemoriesLeft, ...sideMemoriesRight]
const timelapseAspectClass = "aspect-[1080/1920]"
const mobileMasonryAspectClasses = [
  "aspect-[4/5]",
  "aspect-[5/4]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/3]",
  "aspect-[5/6]",
]

const animatedPhotoClasses = [
  "animate-photo-drift-a",
  "animate-photo-drift-b",
  "animate-photo-drift-c",
]

const decorativeHearts = [
  { left: "8%", top: "12%", delay: "0s", scale: "0.8" },
  { left: "88%", top: "10%", delay: "0.6s", scale: "1" },
  { left: "15%", top: "42%", delay: "1.1s", scale: "0.7" },
  { left: "90%", top: "48%", delay: "1.7s", scale: "0.9" },
  { left: "10%", top: "78%", delay: "2.1s", scale: "1" },
  { left: "84%", top: "82%", delay: "2.7s", scale: "0.75" },
  { left: "4%", top: "24%", delay: "0.4s", scale: "0.65" },
  { left: "24%", top: "16%", delay: "1.3s", scale: "0.85" },
  { left: "42%", top: "8%", delay: "1.9s", scale: "0.7" },
  { left: "58%", top: "18%", delay: "2.4s", scale: "0.95" },
  { left: "72%", top: "30%", delay: "0.9s", scale: "0.8" },
  { left: "93%", top: "22%", delay: "1.5s", scale: "0.7" },
  { left: "6%", top: "58%", delay: "2.2s", scale: "0.9" },
  { left: "28%", top: "54%", delay: "0.5s", scale: "0.75" },
  { left: "46%", top: "46%", delay: "1.8s", scale: "1.05" },
  { left: "64%", top: "62%", delay: "2.6s", scale: "0.8" },
  { left: "78%", top: "70%", delay: "0.7s", scale: "0.95" },
  { left: "94%", top: "62%", delay: "1.2s", scale: "0.7" },
]

const decorativeSparkles = [
  { left: "20%", top: "8%", delay: "0.2s", size: "h-4 w-4" },
  { left: "74%", top: "16%", delay: "1.1s", size: "h-5 w-5" },
  { left: "6%", top: "38%", delay: "1.9s", size: "h-4 w-4" },
  { left: "91%", top: "34%", delay: "0.7s", size: "h-3 w-3" },
  { left: "26%", top: "74%", delay: "1.4s", size: "h-5 w-5" },
  { left: "78%", top: "82%", delay: "2.2s", size: "h-4 w-4" },
  { left: "12%", top: "20%", delay: "0.4s", size: "h-3 w-3" },
  { left: "36%", top: "12%", delay: "1.6s", size: "h-4 w-4" },
  { left: "58%", top: "10%", delay: "2.3s", size: "h-5 w-5" },
  { left: "84%", top: "24%", delay: "0.9s", size: "h-4 w-4" },
  { left: "14%", top: "48%", delay: "1.2s", size: "h-5 w-5" },
  { left: "38%", top: "40%", delay: "2.1s", size: "h-3 w-3" },
  { left: "62%", top: "50%", delay: "0.5s", size: "h-4 w-4" },
  { left: "86%", top: "44%", delay: "1.7s", size: "h-5 w-5" },
  { left: "18%", top: "88%", delay: "2.5s", size: "h-4 w-4" },
  { left: "42%", top: "82%", delay: "0.8s", size: "h-3 w-3" },
  { left: "66%", top: "90%", delay: "1.5s", size: "h-4 w-4" },
  { left: "92%", top: "76%", delay: "2.2s", size: "h-5 w-5" },
]

const bottomDecorativeHearts = [
  { left: "14%", bottom: "12%", delay: "0.3s", scale: "1" },
  { left: "48%", bottom: "8%", delay: "1.4s", scale: "0.85" },
  { left: "82%", bottom: "14%", delay: "2.1s", scale: "1.1" },
  { left: "30%", bottom: "24%", delay: "0.9s", scale: "0.7" },
  { left: "68%", bottom: "26%", delay: "1.8s", scale: "0.9" },
  { left: "6%", bottom: "18%", delay: "2.4s", scale: "0.8" },
  { left: "22%", bottom: "10%", delay: "0.6s", scale: "0.95" },
  { left: "38%", bottom: "32%", delay: "1.1s", scale: "0.75" },
  { left: "54%", bottom: "16%", delay: "1.6s", scale: "1" },
  { left: "72%", bottom: "34%", delay: "2.7s", scale: "0.7" },
  { left: "90%", bottom: "20%", delay: "0.8s", scale: "0.9" },
  { left: "12%", bottom: "38%", delay: "1.9s", scale: "0.65" },
  { left: "44%", bottom: "40%", delay: "2.2s", scale: "0.8" },
  { left: "62%", bottom: "44%", delay: "0.5s", scale: "0.95" },
  { left: "80%", bottom: "42%", delay: "1.3s", scale: "0.85" },
]

const bottomDecorativeSparkles = [
  { left: "8%", bottom: "30%", delay: "0.5s", size: "h-4 w-4" },
  { left: "56%", bottom: "20%", delay: "1.2s", size: "h-5 w-5" },
  { left: "90%", bottom: "34%", delay: "2.4s", size: "h-4 w-4" },
  { left: "18%", bottom: "18%", delay: "0.9s", size: "h-3 w-3" },
  { left: "34%", bottom: "26%", delay: "1.6s", size: "h-4 w-4" },
  { left: "48%", bottom: "14%", delay: "2.2s", size: "h-5 w-5" },
  { left: "66%", bottom: "30%", delay: "0.7s", size: "h-4 w-4" },
  { left: "78%", bottom: "22%", delay: "1.4s", size: "h-3 w-3" },
  { left: "94%", bottom: "12%", delay: "2.1s", size: "h-4 w-4" },
]

const decorativeBlobs = [
  { left: "-8%", top: "-6%", size: "h-56 w-56", color: "bg-primary/25" },
  { left: "72%", top: "-10%", size: "h-64 w-64", color: "bg-accent/20" },
  { left: "-12%", top: "58%", size: "h-64 w-64", color: "bg-primary/20" },
  { left: "70%", top: "62%", size: "h-72 w-72", color: "bg-accent/20" },
  { left: "20%", top: "-14%", size: "h-52 w-52", color: "bg-primary/20" },
  { left: "46%", top: "-12%", size: "h-48 w-48", color: "bg-accent/20" },
  { left: "88%", top: "6%", size: "h-44 w-44", color: "bg-primary/18" },
  { left: "-10%", top: "30%", size: "h-52 w-52", color: "bg-accent/18" },
  { left: "42%", top: "34%", size: "h-56 w-56", color: "bg-primary/16" },
  { left: "86%", top: "40%", size: "h-52 w-52", color: "bg-accent/18" },
  { left: "8%", top: "82%", size: "h-56 w-56", color: "bg-primary/20" },
  { left: "44%", top: "78%", size: "h-60 w-60", color: "bg-accent/18" },
]

const decorativeRings = [
  { left: "12%", top: "22%", size: "h-44 w-44", color: "border-primary/25" },
  { left: "74%", top: "18%", size: "h-36 w-36", color: "border-accent/30" },
  { left: "42%", top: "14%", size: "h-28 w-28", color: "border-primary/20" },
  { left: "4%", top: "50%", size: "h-40 w-40", color: "border-accent/20" },
  { left: "86%", top: "56%", size: "h-52 w-52", color: "border-accent/25" },
  { left: "34%", top: "58%", size: "h-30 w-30", color: "border-primary/25" },
  { left: "58%", top: "68%", size: "h-34 w-34", color: "border-primary/20" },
  { left: "18%", top: "76%", size: "h-28 w-28", color: "border-accent/25" },
  { left: "78%", top: "84%", size: "h-42 w-42", color: "border-primary/25" },
]

interface PhotoGalleryProps {
  onTimeElapsed: () => void
  delaySeconds: number
}

export function PhotoGallery({ onTimeElapsed, delaySeconds }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)
  const selectedItem = selectedPhoto !== null ? galleryItems[selectedPhoto] : null

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeElapsed()
    }, delaySeconds * 1000)

    return () => clearTimeout(timer)
  }, [onTimeElapsed, delaySeconds])

  const handlePrevious = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto(selectedPhoto === 0 ? galleryItems.length - 1 : selectedPhoto - 1)
    }
  }

  const handleNext = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto(selectedPhoto === galleryItems.length - 1 ? 0 : selectedPhoto + 1)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 10%, hsl(var(--primary) / 0.24) 0%, transparent 32%), radial-gradient(circle at 84% 18%, hsl(var(--accent) / 0.2) 0%, transparent 30%), radial-gradient(circle at 50% 92%, hsl(var(--primary) / 0.2) 0%, transparent 46%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--secondary) / 0.45) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(120deg, transparent 0%, transparent 48%, hsl(var(--primary) / 0.12) 49%, transparent 52%, transparent 100%), linear-gradient(20deg, transparent 0%, transparent 42%, hsl(var(--accent) / 0.1) 43%, transparent 46%, transparent 100%), radial-gradient(circle, hsl(var(--primary) / 0.08) 1px, transparent 1px)",
          backgroundSize: "42px 42px, 56px 56px, 24px 24px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[42vh]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 0%, hsl(var(--primary) / 0.24) 0%, transparent 48%), radial-gradient(circle at 78% 8%, hsl(var(--accent) / 0.2) 0%, transparent 42%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[52vh]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 92%, hsl(var(--primary) / 0.28) 0%, transparent 44%), radial-gradient(circle at 82% 88%, hsl(var(--accent) / 0.24) 0%, transparent 44%), linear-gradient(0deg, hsl(var(--secondary) / 0.3) 0%, transparent 80%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0">
        {decorativeBlobs.map((blob, index) => (
          <div
            key={`decor-blob-${index}`}
            className={`absolute rounded-full blur-3xl ${blob.size} ${blob.color}`}
            style={{ left: blob.left, top: blob.top }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0">
        {decorativeRings.map((ring, index) => (
          <div
            key={`decor-ring-${index}`}
            className={`absolute rounded-full border ${ring.size} ${ring.color}`}
            style={{ left: ring.left, top: ring.top }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0">
        {decorativeHearts.map((heart, index) => (
          <Heart
            key={`decor-heart-${index}`}
            className="absolute text-primary/20 animate-pulse"
            style={{
              left: heart.left,
              top: heart.top,
              animationDelay: heart.delay,
              transform: `scale(${heart.scale})`,
            }}
            fill="currentColor"
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0">
        {decorativeSparkles.map((sparkle, index) => (
          <Sparkles
            key={`decor-sparkle-${index}`}
            className={`absolute ${sparkle.size} text-accent/60 animate-pulse`}
            style={{
              left: sparkle.left,
              top: sparkle.top,
              animationDelay: sparkle.delay,
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0">
        {bottomDecorativeHearts.map((heart, index) => (
          <Heart
            key={`bottom-heart-${index}`}
            className="absolute text-primary/25 animate-pulse"
            style={{
              left: heart.left,
              bottom: heart.bottom,
              animationDelay: heart.delay,
              transform: `scale(${heart.scale})`,
            }}
            fill="currentColor"
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0">
        {bottomDecorativeSparkles.map((sparkle, index) => (
          <Sparkles
            key={`bottom-sparkle-${index}`}
            className={`absolute ${sparkle.size} text-accent/65 animate-pulse`}
            style={{
              left: sparkle.left,
              bottom: sparkle.bottom,
              animationDelay: sparkle.delay,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-8 text-center md:py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-primary" fill="currentColor" />
          <h1 className="font-serif text-3xl md:text-5xl font-semibold text-foreground">
            Our Memories
          </h1>
          <Heart className="w-6 h-6 text-primary" fill="currentColor" />
        </div>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          We have known each other for only 3 months, but it feels i have known you a lot longer than that.
        </p>
        <p className="mt-3 text-sm text-muted-foreground/80 max-w-md mx-auto">
          Bonus for you, sayang: this gallery has a different feel on your phone and on your computer.
        </p>
      </header>

      {/* Gallery Grid */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-12">
        <section className="mb-8 md:mb-10">
          <div className="mx-auto grid max-w-5xl items-stretch gap-3 md:grid-cols-[minmax(0,180px)_minmax(0,420px)_minmax(0,180px)] lg:grid-cols-[minmax(0,220px)_minmax(0,460px)_minmax(0,220px)]">
            <div className="hidden md:grid grid-rows-2 gap-3">
              {sideMemoriesLeft.map((memory) => {
                const memoryIndex = galleryItems.findIndex((item) => item.id === memory.id)

                return (
                  <button
                    key={memory.id}
                    type="button"
                    className="group relative h-full min-h-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/70"
                    onClick={() => setSelectedPhoto(memoryIndex)}
                    onMouseEnter={() => setHoveredPhoto(memoryIndex)}
                    onMouseLeave={() => setHoveredPhoto(null)}
                  >
                    <div className="relative h-full w-full">
                      <Image src={memory.src} alt={memory.caption} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className={`absolute inset-0 bg-foreground/45 transition-opacity duration-300 ${hoveredPhoto === memoryIndex ? "opacity-100" : "opacity-0"}`} />
                    </div>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              className={`group relative mx-auto block w-full max-w-sm overflow-hidden rounded-2xl bg-transparent p-0 shadow-lg ring-1 ring-primary/20 ${timelapseAspectClass}`}
              onClick={() => setSelectedPhoto(0)}
              onMouseEnter={() => setHoveredPhoto(0)}
              onMouseLeave={() => setHoveredPhoto(null)}
            >
              <video
                src={timelapse.src}
                poster={timelapse.poster}
                className="absolute inset-0 block h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute left-3 top-3 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                TIMELAPSE
              </div>
              <div className="absolute right-3 top-3 rounded-full bg-card/90 p-1.5 text-foreground shadow-sm">
                <Play className="h-4 w-4 fill-primary text-primary" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 text-left text-primary-foreground">
                <p className="font-serif text-lg md:text-xl">Our Quality Time in 9:16</p>
                <p className="text-sm text-primary-foreground/85">I Love You ♥️</p>
              </div>
              <div
                className={`absolute inset-0 bg-foreground/25 transition-opacity duration-300 ${
                  hoveredPhoto === 0 ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>

            <div className="hidden md:grid grid-rows-2 gap-3">
              {sideMemoriesRight.map((memory) => {
                const memoryIndex = galleryItems.findIndex((item) => item.id === memory.id)

                return (
                  <button
                    key={memory.id}
                    type="button"
                    className="group relative h-full min-h-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/70"
                    onClick={() => setSelectedPhoto(memoryIndex)}
                    onMouseEnter={() => setHoveredPhoto(memoryIndex)}
                    onMouseLeave={() => setHoveredPhoto(null)}
                  >
                    <div className="relative h-full w-full">
                      <Image src={memory.src} alt={memory.caption} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className={`absolute inset-0 bg-foreground/45 transition-opacity duration-300 ${hoveredPhoto === memoryIndex ? "opacity-100" : "opacity-0"}`} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

        </section>

        <div className="columns-2 gap-3 space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0 lg:grid-cols-4">
          {mobileGalleryItems.map((photo, photoIndex) => {
            const index = galleryItems.findIndex((item) => item.id === photo.id)
            const isSideMemory = photo.id >= 100
            const isVideo = false
            const mobileAspectClass = mobileMasonryAspectClasses[photoIndex % mobileMasonryAspectClasses.length]
            const animatedClass = photo.isAnimated
              ? `animate-subtle-zoom ${animatedPhotoClasses[photoIndex % animatedPhotoClasses.length]}`
              : ""

            return (
            <div
              key={photo.id}
              className={`relative group cursor-pointer overflow-hidden rounded-xl bg-muted break-inside-avoid mb-3 md:mb-0 ${mobileAspectClass} md:aspect-square ${
                !isSideMemory && (index === 1 || index === 6) ? "md:col-span-2 md:row-span-2" : ""
              } ${
                isSideMemory ? "md:hidden" : ""
              }`}
              onClick={() => setSelectedPhoto(index)}
              onMouseEnter={() => setHoveredPhoto(index)}
              onMouseLeave={() => setHoveredPhoto(null)}
            >
              {isVideo ? (
                <video
                  src={photo.src}
                  poster={photo.poster}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <Image
                  src={photo.src || withBasePath("/placeholder.svg")}
                  alt={photo.caption}
                  fill
                  className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                    animatedClass
                  }`}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}

              {/* Animated border for moving photos */}
              {photo.isAnimated && (
                <div className="absolute inset-0 border-2 border-primary/50 rounded-xl animate-pulse" />
              )}

              {isVideo && (
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-foreground/45 to-transparent" />
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-foreground/60 to-transparent md:hidden" />
              <p className="pointer-events-none absolute inset-x-0 bottom-2 px-2 text-center text-xs text-primary-foreground md:hidden">
                {photo.caption}
              </p>

              {/* Hover overlay */}
              <div
                className={`absolute inset-0 bg-foreground/60 flex items-center justify-center transition-opacity duration-300 ${
                  hoveredPhoto === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="text-center text-primary-foreground p-4">
                  <Heart className="w-8 h-8 mx-auto mb-2" fill="currentColor" />
                  <p className="font-serif text-sm md:text-base">{photo.caption}</p>
                </div>
              </div>

               {/* Play indicator for animated photos */}
               {photo.isAnimated && (
                 <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                   {isVideo ? "VIDEO" : "GIF"}
                </div>
              )}

              {isVideo && (
                <div className="absolute left-3 bottom-3 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-foreground shadow-md">
                  <Play className="h-3.5 w-3.5 fill-primary text-primary" />
                  Timelapse
                </div>
              )}
            </div>
            )
          })}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-2 md:p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrevious()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Photo display */}
          <div
            className="max-w-5xl max-h-[92vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card rounded-2xl overflow-hidden shadow-2xl max-h-[90vh]">
              <div className={selectedItem?.mediaType === "video" ? `${timelapseAspectClass} relative mx-auto w-full max-w-[480px] bg-black/20` : "relative h-[68vh] sm:h-[74vh] md:aspect-video md:h-auto bg-muted"}>
                {selectedItem?.mediaType === "video" ? (
                  <video
                    src={selectedItem.src}
                    poster={selectedItem.poster}
                    className="h-full w-full object-cover"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={selectedItem?.src || withBasePath("/placeholder.svg")}
                    alt={selectedItem?.caption || "Memory"}
                    fill
                    className={`object-contain md:object-cover ${selectedItem?.isAnimated ? "animate-subtle-zoom animate-photo-drift-a" : ""}`}
                    sizes="(max-width: 1024px) 100vw, 80vw"
                    priority
                  />
                )}
              </div>
              <div className="p-4 md:p-6 text-center">
                <p className="font-serif text-lg md:text-xl text-foreground">
                  {selectedItem?.caption}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Memory {selectedPhoto + 1} of {galleryItems.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
