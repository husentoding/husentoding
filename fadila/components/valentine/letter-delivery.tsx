"use client"

import { useState, useEffect } from "react"
import { Heart, MapPin, Calendar, Clock, Sparkles } from "lucide-react"
import { config } from "@/lib/config"
import { Button } from "@/components/ui/button"

interface LetterDeliveryProps {
  isDelivered: boolean
}

type DeliveryPhase = "flying" | "delivered" | "opened"

export function LetterDelivery({ isDelivered }: LetterDeliveryProps) {
  const [phase, setPhase] = useState<DeliveryPhase | null>(null)
  const [isLetterOpen, setIsLetterOpen] = useState(false)
  const overlayHearts = Array.from({ length: 15 }, (_, i) => ({
    left: `${(i * 41 + 7) % 100}%`,
    animationDelay: `${(((i * 19) % 30) / 10).toFixed(1)}s`,
    animationDuration: `${(6 + ((i * 29) % 40) / 10).toFixed(1)}s`,
    transform: `scale(${(0.4 + ((i * 13) % 7) / 10).toFixed(1)})`,
  }))

  useEffect(() => {
    if (isDelivered && phase === null) {
      setPhase("flying")
      // Bird flies across and delivers letter (3s flight + 0.5s buffer)
      setTimeout(() => {
        setPhase("delivered")
      }, 3500)
    }
  }, [isDelivered, phase])

  const handleLetterClick = () => {
    if (phase === "delivered" || phase === "opened") {
      setPhase("opened")
      setTimeout(() => setIsLetterOpen(true), 500)
    }
  }

  const { invitation } = config

  if (!isDelivered && phase === null) return null

  return (
    <>
      {/* Bird flying animation */}
      {phase === "flying" && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {/* Trail sparkles */}
          <div className="bird-trail">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className="absolute w-3 h-3 text-primary/40 animate-trail-heart"
                style={{ animationDelay: `${i * 0.15}s` }}
                fill="currentColor"
              />
            ))}
          </div>
          
          <div className="bird-container">
            {/* Cute cartoon bird */}
            <svg
              viewBox="0 0 120 80"
              className="w-24 h-16 md:w-32 md:h-20 drop-shadow-lg"
            >
              {/* Bird body - round and cute */}
              <ellipse cx="55" cy="45" rx="28" ry="24" fill="#E8B4B8" />
              <ellipse cx="55" cy="48" rx="22" ry="18" fill="#F5D5D8" />
              
              {/* Wing - animated */}
              <g className="bird-wing">
                <ellipse cx="40" cy="42" rx="18" ry="10" fill="#D4979C" />
                <ellipse cx="35" cy="40" rx="12" ry="6" fill="#C78489" />
              </g>
              
              {/* Tail feathers */}
              <ellipse cx="22" cy="50" rx="12" ry="6" fill="#D4979C" transform="rotate(-20 22 50)" />
              <ellipse cx="18" cy="45" rx="10" ry="5" fill="#C78489" transform="rotate(-35 18 45)" />
              <ellipse cx="20" cy="55" rx="10" ry="5" fill="#C78489" transform="rotate(10 20 55)" />
              
              {/* Head */}
              <circle cx="78" cy="32" r="18" fill="#E8B4B8" />
              <circle cx="78" cy="34" r="14" fill="#F5D5D8" />
              
              {/* Blush cheeks */}
              <ellipse cx="70" cy="38" rx="4" ry="3" fill="#F4A4A8" opacity="0.6" />
              <ellipse cx="90" cy="36" rx="4" ry="3" fill="#F4A4A8" opacity="0.6" />
              
              {/* Eyes - big and cute */}
              <circle cx="72" cy="28" r="6" fill="#2D2D2D" />
              <circle cx="86" cy="28" r="6" fill="#2D2D2D" />
              <circle cx="73" cy="26" r="2.5" fill="#FFFFFF" />
              <circle cx="87" cy="26" r="2.5" fill="#FFFFFF" />
              <circle cx="71" cy="29" r="1" fill="#FFFFFF" />
              <circle cx="85" cy="29" r="1" fill="#FFFFFF" />
              
              {/* Beak - cute and small */}
              <path d="M95 34 L108 38 L95 42 Z" fill="#FFB347" />
              <path d="M95 38 L103 38" stroke="#E89B30" strokeWidth="1" />
              
              {/* Head tuft */}
              <ellipse cx="78" cy="14" rx="4" ry="6" fill="#D4979C" />
              <ellipse cx="82" cy="16" rx="3" ry="5" fill="#C78489" />
              
              {/* Letter carried by bird */}
              <g className="bird-letter">
                <rect x="98" y="45" width="20" height="14" rx="2" fill="#FFF9F0" stroke="#E8B4B8" strokeWidth="1.5" />
                <path d="M98 45 L108 53 L118 45" fill="none" stroke="#E8B4B8" strokeWidth="1.5" />
                <circle cx="108" cy="52" r="3" fill="#D4979C" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* Cute mailbox with letter */}
      {(phase === "delivered" || phase === "opened") && !isLetterOpen && (
        <div className="fixed bottom-6 right-6 z-40 mailbox-appear">
          <div
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              phase === "delivered" ? "mailbox-wiggle" : ""
            }`}
            onClick={handleLetterClick}
          >
            <svg viewBox="0 0 120 160" className="w-28 h-40 md:w-36 md:h-48 drop-shadow-xl">
              {/* Ground/grass */}
              <ellipse cx="60" cy="155" rx="45" ry="8" fill="#7CB342" />
              <ellipse cx="60" cy="155" rx="35" ry="5" fill="#8BC34A" />
              
              {/* Mailbox post */}
              <rect x="54" y="85" width="12" height="70" rx="2" fill="#8D6E63" />
              <rect x="56" y="85" width="4" height="70" fill="#A1887F" />
              
              {/* Mailbox body */}
              <rect x="20" y="40" width="80" height="50" rx="8" fill="#E8B4B8" />
              <rect x="20" y="40" width="80" height="25" rx="8" fill="#D4979C" />
              
              {/* Mailbox face details */}
              <rect x="28" y="55" width="64" height="28" rx="4" fill="#F5D5D8" />
              
              {/* Mail slot */}
              <rect x="35" y="65" width="50" height="6" rx="3" fill="#C78489" />
              
              {/* Cute flag */}
              <rect x="95" y="45" width="6" height="30" rx="1" fill="#8D6E63" />
              <path d="M101 45 L101 60 L115 52.5 Z" fill="#EF5350" className="mailbox-flag" />
              
              {/* Hearts decoration on mailbox */}
              <g fill="#D4979C">
                <path d="M30 48 C30 45 34 45 34 48 C34 45 38 45 38 48 C38 52 34 55 34 55 C34 55 30 52 30 48" />
                <path d="M82 48 C82 45 86 45 86 48 C86 45 90 45 90 48 C90 52 86 55 86 55 C86 55 82 52 82 48" />
              </g>
              
              {/* Letter peeking out - animated */}
              <g className="peeking-letter">
                <rect x="35" y="20" width="50" height="35" rx="3" fill="#FFF9F0" stroke="#E8B4B8" strokeWidth="2" />
                <path d="M35 23 L60 40 L85 23" fill="none" stroke="#E8B4B8" strokeWidth="2" />
                {/* Wax seal */}
                <circle cx="60" cy="35" r="8" fill="#D4979C" />
                <path d="M56 35 C56 32 60 32 60 35 C60 32 64 32 64 35 C64 38 60 40 60 40 C60 40 56 38 56 35" fill="#C78489" />
              </g>
              
              {/* Sparkles around letter */}
              <g className="letter-sparkles">
                <circle cx="30" cy="25" r="2" fill="#FFD54F" opacity="0.8" />
                <circle cx="90" cy="30" r="1.5" fill="#FFD54F" opacity="0.8" />
                <circle cx="25" cy="45" r="1.5" fill="#FFD54F" opacity="0.6" />
                <circle cx="95" cy="20" r="2" fill="#FFD54F" opacity="0.7" />
              </g>
            </svg>
            
            {/* Click hint */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-sm font-medium text-foreground bg-card px-4 py-2 rounded-full shadow-lg border border-border flex items-center gap-2 click-hint">
                <Heart className="w-4 h-4 text-primary" fill="currentColor" />
                Tap to open
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Letter opened - full screen */}
      {isLetterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80 backdrop-blur-sm animate-in fade-in duration-500">
          {/* Floating hearts */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {overlayHearts.map((heart, i) => (
              <Heart
                key={i}
                className="absolute text-primary/20 animate-float-up"
                style={{
                  left: heart.left,
                  bottom: `-20px`,
                  animationDelay: heart.animationDelay,
                  animationDuration: heart.animationDuration,
                  transform: heart.transform,
                }}
                fill="currentColor"
              />
            ))}
          </div>

          {/* Letter/Envelope opening animation */}
          <div className="relative max-w-lg w-full animate-in zoom-in-95 duration-500">
            {/* Envelope back */}
            <div className="absolute inset-0 bg-card rounded-3xl shadow-2xl" />
            
            {/* Envelope flap (opened) */}
            <div className="absolute -top-16 left-0 right-0 h-32 overflow-hidden">
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full aspect-square bg-secondary rotate-45 origin-bottom"
                style={{ maxWidth: "100%" }}
              />
            </div>

            {/* Letter content */}
            <div className="relative bg-card rounded-3xl shadow-2xl overflow-hidden border border-border">
              {/* Decorative header */}
              <div className="bg-gradient-to-r from-primary/90 to-accent/90 p-6 text-center relative">
                <Sparkles className="absolute top-4 left-4 w-5 h-5 text-primary-foreground/50" />
                <Sparkles className="absolute top-4 right-4 w-5 h-5 text-primary-foreground/50" />
                
                <Heart className="w-12 h-12 text-primary-foreground mx-auto mb-3" fill="currentColor" />
                <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground font-semibold text-balance">
                  You&apos;re Invited
                </h2>
                <p className="text-primary-foreground/80 mt-1">
                  To a very special evening
                </p>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Personal message */}
                <div className="text-center mb-8">
                  <p className="text-muted-foreground leading-relaxed italic text-pretty">
                    &ldquo;{invitation.message}&rdquo;
                  </p>
                </div>

                {/* Event details */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                    <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Date</p>
                      <p className="text-muted-foreground">{invitation.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                    <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Time</p>
                      <p className="text-muted-foreground">{invitation.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{invitation.venue}</p>
                      <p className="text-muted-foreground">{invitation.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Dress Code</p>
                      <p className="text-muted-foreground">{invitation.dresscode}</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <Button
                    onClick={() => setIsLetterOpen(false)}
                    className="w-full md:w-auto px-8 h-12 text-lg bg-primary hover:bg-primary/90"
                  >
                    <Heart className="w-4 h-4 mr-2" fill="currentColor" />
                    I Can&apos;t Wait!
                  </Button>
                </div>

                {/* Signature */}
                <div className="mt-8 text-center">
                  <p className="font-serif text-lg text-foreground">
                    With all my love,
                  </p>
                  <p className="font-serif text-2xl text-primary mt-1">
                    Your Valentine
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
