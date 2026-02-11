"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Heart, Lock } from "lucide-react"
import { config } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LoginPageProps {
  onSuccess: () => void | Promise<void>
  onPrepare: () => Promise<void>
}

export function LoginPage({ onSuccess, onPrepare }: LoginPageProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)
  const waitingMessages = [
    "Bentar sayang, aku masih malu... poquito.",
    "Nyiapin masa depan, bentar... mi amor.",
    "Lagi pilih foto terbaik kita... muy bonito.",
    "Musiknya lagi aku siapin dulu ya... despacito.",
  ]
  const floatingHearts = Array.from({ length: 15 }, (_, i) => ({
    left: `${(i * 37 + 11) % 100}%`,
    top: `${(i * 53 + 29) % 100}%`,
    animationDelay: `${(((i * 17) % 20) / 10).toFixed(1)}s`,
    transform: `scale(${(0.5 + ((i * 23) % 15) / 10).toFixed(1)})`,
  }))
  const waitingHearts = [
    { left: "12%", top: "20%", delay: "0s", scale: "0.8" },
    { left: "82%", top: "24%", delay: "0.2s", scale: "1" },
    { left: "24%", top: "72%", delay: "0.4s", scale: "1.1" },
    { left: "76%", top: "68%", delay: "0.6s", scale: "0.9" },
    { left: "50%", top: "14%", delay: "0.8s", scale: "1" },
    { left: "50%", top: "86%", delay: "1s", scale: "1.1" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.toLowerCase() === config.secretPassword.toLowerCase()) {
      setError(false)
      setIsUnlocking(true)
      setIsReady(false)
      try {
        await onPrepare()
        setIsReady(true)
      } catch {
        setIsUnlocking(false)
        setError(true)
      }
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  useEffect(() => {
    if (!isUnlocking) {
      setStatusIndex(0)
      return
    }

    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % waitingMessages.length)
    }, 1600)

    return () => clearInterval(interval)
  }, [isUnlocking, waitingMessages.length])

  if (isUnlocking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {waitingHearts.map((heart, i) => (
            <Heart
              key={`waiting-heart-${i}`}
              className="absolute text-primary/20 animate-wait-float"
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

        <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card/95 p-8 text-center shadow-xl backdrop-blur-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <Heart className="h-8 w-8 text-primary animate-pulse" fill="currentColor" />
          </div>
          <h2 className="font-serif text-3xl text-foreground">Sedikit lagi, mi amor...</h2>
          <p className="mt-2 text-muted-foreground">
            Sekejap ya sayang, aku lagi siapin sesuatu yang manis buat kamu. Besito dulu. Chotto a moment.
          </p>
          <img
            src="https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif"
            alt="Cute love animation"
            className="mx-auto mt-4 h-20 w-20 rounded-full object-cover ring-2 ring-primary/20"
            loading="lazy"
          />
          {!isReady ? (
            <>
              <p className="mt-3 min-h-6 text-sm font-medium text-primary animate-in fade-in duration-300">
                {waitingMessages[statusIndex]}
              </p>

              <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-primary to-accent animate-loading-bar" />
              </div>
            </>
          ) : (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium text-primary">Siyappp. Buka kalo kamu berani... vamos.</p>
              <Button
                type="button"
                onClick={() => {
                  void Promise.resolve(onSuccess())
                }}
                className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90"
              >
                <Heart className="w-4 h-4 mr-2" fill="currentColor" />
                Gaskeun, amor
              </Button>
            </div>
          )}
        </div>

        <style jsx global>{`
          @keyframes wait-float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes loading-bar {
            0% {
              transform: translateX(-120%);
            }
            100% {
              transform: translateX(250%);
            }
          }

          .animate-wait-float {
            animation: wait-float 2s ease-in-out infinite;
          }

          .animate-loading-bar {
            animation: loading-bar 1.6s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingHearts.map((heart, i) => (
          <Heart
            key={i}
            className="absolute text-primary/10 animate-pulse"
            style={{
              left: heart.left,
              top: heart.top,
              animationDelay: heart.animationDelay,
              transform: heart.transform,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      <div className={`relative z-10 max-w-md w-full ${shake ? "animate-shake" : ""}`}>
        {/* Main card */}
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-12 text-center">
          {/* Heart icon */}
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
            <Heart className="w-10 h-10 text-primary" fill="currentColor" />
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Is it really you?
          </h1>
          
          {/* Playful question */}
          <p className="text-muted-foreground mb-2 text-lg">
            Are you <span className="text-primary font-medium">{config.partnerName}</span>?
          </p>
          <p className="text-muted-foreground/80 text-sm mb-8">
            If yes, you should know the password...
          </p>

          {/* Password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter our secret..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(false)
                }}
                disabled={isUnlocking}
                className={`pl-11 h-12 text-center text-lg ${
                  error ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
            </div>

            {error && (
              <p className="text-destructive text-sm animate-in fade-in">
                Hmm, that&apos;s not it. Try again, my love!
              </p>
            )}

            <Button
              type="submit"
              disabled={isUnlocking}
              className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90"
            >
              <Heart className="w-4 h-4 mr-2" />
              Let me in
            </Button>
          </form>

          {/* Hint */}
          <p className="mt-6 text-xs text-muted-foreground/60 italic">
            Hint: First date at?
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
