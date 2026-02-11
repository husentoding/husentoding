"use client"

import { useState, useEffect } from "react"
import { Heart, X, ChevronLeft, ChevronRight, Play } from "lucide-react"
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

interface PhotoGalleryProps {
  onTimeElapsed: () => void
  delaySeconds: number
}

export function PhotoGallery({ onTimeElapsed, delaySeconds }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)
  const selectedItem = selectedPhoto !== null ? galleryItems[selectedPhoto] : null

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-8 md:py-12 px-4 text-center">
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
      <main className="max-w-7xl mx-auto px-4 pb-12">
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
                    photo.isAnimated ? "animate-subtle-zoom" : ""
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
                    className={`object-contain md:object-cover ${selectedItem?.isAnimated ? "animate-subtle-zoom" : ""}`}
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
