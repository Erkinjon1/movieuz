"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Trash2, Star, ExternalLink, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getUserFavorites, removeFromFavorites } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

interface Movie {
  id: string
  title: string
  translatedTitle?: string
  year: string
  genre: string
  poster: string
  rating: string
  plot: string
}

interface FavoritesPageProps {
  onBack: () => void
}

export function FavoritesPage({ onBack }: FavoritesPageProps) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadFavorites()
    }
  }, [user])

  const loadFavorites = async () => {
    if (!user) return

    setLoading(true)
    try {
      const favoritesData = await getUserFavorites(user.id)
      setFavorites(favoritesData)
    } catch (error) {
      console.error("Sevimlilarni yuklashda xatolik:", error)
      toast({
        title: "Xatolik",
        description: "Sevimli filmlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromFavorites = async (movieId: string) => {
    if (!user) return

    try {
      await removeFromFavorites(user.id, movieId)
      setFavorites((prev) => prev.filter((movie) => movie.id !== movieId))
      toast({
        title: "Muvaffaqiyatli!",
        description: "Film sevimlilar ro'yxatidan olib tashlandi",
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Film olib tashlanmadi",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="text-white hover:text-red-400">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Orqaga
          </Button>
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold">Sevimli Filmlar</h1>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {favorites.length}
            </Badge>
          </div>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-20 w-20 text-slate-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4 text-slate-300">Sevimli filmlar yo'q</h2>
            <p className="text-slate-400 mb-6">
              Filmlarni sevimlilar ro'yxatiga qo'shish uchun qidiruv sahifasiga o'ting
            </p>
            <Button onClick={onBack} className="bg-red-600 hover:bg-red-700">
              Filmlarni qidirish
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((movie) => (
              <Card
                key={movie.id}
                className="bg-slate-800/50 border-slate-700 overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={movie.poster || "/placeholder.svg?height=450&width=300"}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-white">{movie.rating}</span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Heart className="h-6 w-6 text-red-500 fill-current" />
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {movie.title}
                    {movie.translatedTitle && movie.translatedTitle !== movie.title && (
                      <span className="block text-sm text-slate-400 font-normal">{movie.translatedTitle}</span>
                    )}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {movie.year}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {movie.genre.split(",")[0]}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-300 line-clamp-3 mb-4">{movie.plot}</p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveFromFavorites(movie.id)}
                      className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Olib tashlash
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
