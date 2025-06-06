"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Bookmark, ExternalLink, Check } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { addToFavorites, addToWatchlist } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

interface Movie {
  id: string
  title: string
  [key: string]: any
}

interface MovieActionsProps {
  movie: Movie
  isFavorite: boolean
  isInWatchlist: boolean
  onFavoriteChange: (isFavorite: boolean) => void
  onWatchlistChange: (isInWatchlist: boolean) => void
  dbConnected: boolean
}

export function MovieActions({
  movie,
  isFavorite,
  isInWatchlist,
  onFavoriteChange,
  onWatchlistChange,
  dbConnected,
}: MovieActionsProps) {
  const { user } = useAuth()
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [watchlistLoading, setWatchlistLoading] = useState(false)

  const handleAddToFavorites = async () => {
    if (!user) {
      toast({
        title: "Kirish talab qilinadi",
        description: "Sevimlilar ro'yxatiga qo'shish uchun tizimga kiring",
        variant: "destructive",
      })
      return
    }

    if (!dbConnected) {
      toast({
        title: "Xatolik",
        description: "Ma'lumotlar bazasiga ulanishda xatolik",
        variant: "destructive",
      })
      return
    }

    setFavoriteLoading(true)

    try {
      await addToFavorites(user.id, movie)
      onFavoriteChange(true)
      toast({
        title: "Muvaffaqiyatli!",
        description: "Film sevimlilar ro'yxatiga qo'shildi",
      })
    } catch (error: any) {
      console.error("Error adding to favorites:", error)
      toast({
        title: "Xatolik",
        description: error.message || "Film qo'shishda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleAddToWatchlist = async () => {
    if (!user) {
      toast({
        title: "Kirish talab qilinadi",
        description: "Ko'rish ro'yxatiga qo'shish uchun tizimga kiring",
        variant: "destructive",
      })
      return
    }

    if (!dbConnected) {
      toast({
        title: "Xatolik",
        description: "Ma'lumotlar bazasiga ulanishda xatolik",
        variant: "destructive",
      })
      return
    }

    setWatchlistLoading(true)

    try {
      await addToWatchlist(user.id, movie)
      onWatchlistChange(true)
      toast({
        title: "Muvaffaqiyatli!",
        description: "Film ko'rish ro'yxatiga qo'shildi",
      })
    } catch (error: any) {
      console.error("Error adding to watchlist:", error)
      toast({
        title: "Xatolik",
        description: error.message || "Film qo'shishda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setWatchlistLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      {user && dbConnected && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddToFavorites}
            disabled={isFavorite || favoriteLoading}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-red-600 hover:border-red-600"
          >
            {favoriteLoading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
            ) : isFavorite ? (
              <Check className="h-3 w-3 mr-1" />
            ) : (
              <Heart className="h-3 w-3 mr-1" />
            )}
            {favoriteLoading ? "Yuklanmoqda..." : isFavorite ? "Qo'shildi" : "Sevimli"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddToWatchlist}
            disabled={isInWatchlist || watchlistLoading}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-blue-600 hover:border-blue-600"
          >
            {watchlistLoading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
            ) : isInWatchlist ? (
              <Check className="h-3 w-3 mr-1" />
            ) : (
              <Bookmark className="h-3 w-3 mr-1" />
            )}
            {watchlistLoading ? "Yuklanmoqda..." : isInWatchlist ? "Qo'shildi" : "Ko'rish"}
          </Button>
        </>
      )}
      <Button size="sm" variant="outline" asChild className="border-slate-600 text-slate-300 hover:bg-slate-700">
        <a
          href={`https://asilmedia.org/index.php?do=search&subaction=search&story=${encodeURIComponent(movie.title)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Ko'rish
        </a>
      </Button>
    </div>
  )
}
