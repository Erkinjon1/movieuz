"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Bookmark, Star, Trash2, User, BarChart3 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getUserFavorites, getUserWatchlist, removeFromFavorites, removeFromWatchlist } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

interface UserDashboardProps {
  isOpen: boolean
  onClose: () => void
}

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

export function UserDashboard({ isOpen, onClose }: UserDashboardProps) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [watchlist, setWatchlist] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      loadUserData()
    }
  }, [isOpen, user])

  const loadUserData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [favoritesData, watchlistData] = await Promise.all([getUserFavorites(user.id), getUserWatchlist(user.id)])

      setFavorites(favoritesData)
      setWatchlist(watchlistData)
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error)
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
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

  const handleRemoveFromWatchlist = async (movieId: string) => {
    if (!user) return

    try {
      await removeFromWatchlist(user.id, movieId)
      setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId))
      toast({
        title: "Muvaffaqiyatli!",
        description: "Film ko'rish ro'yxatidan olib tashlandi",
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Film olib tashlanmadi",
        variant: "destructive",
      })
    }
  }

  const MovieCard = ({
    movie,
    onRemove,
    type,
  }: { movie: Movie; onRemove: (id: string) => void; type: "favorite" | "watchlist" }) => (
    <Card className="bg-slate-700/50 border-slate-600">
      <div className="flex">
        <img
          src={movie.poster || "/placeholder.svg"}
          alt={movie.title}
          className="w-20 h-28 object-cover rounded-l-lg"
        />
        <CardContent className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-white line-clamp-1">{movie.title}</h4>
              {movie.translatedTitle && <p className="text-sm text-slate-400">{movie.translatedTitle}</p>}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(movie.id)}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {movie.year}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs text-slate-300">{movie.rating}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2">{movie.plot}</p>
        </CardContent>
      </div>
    </Card>
  )

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6 text-blue-400" />
            Foydalanuvchi Paneli
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700">
            <TabsTrigger value="stats" className="data-[state=active]:bg-slate-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistika
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-slate-600">
              <Heart className="h-4 w-4 mr-2" />
              Sevimlilar ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="data-[state=active]:bg-slate-600">
              <Bookmark className="h-4 w-4 mr-2" />
              Ko'rish ro'yxati ({watchlist.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Sevimli Filmlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">{favorites.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Ko'rish Ro'yxati</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{watchlist.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Jami Saqlangan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{favorites.length + watchlist.length}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg">Profil Ma'lumotlari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <span className="text-slate-400">Email:</span> {user.email}
                </p>
                <p>
                  <span className="text-slate-400">Ro'yxatdan o'tgan sana:</span>{" "}
                  {new Date(user.created_at).toLocaleDateString("uz-UZ")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                <p className="mt-2 text-slate-300">Yuklanmoqda...</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300">Sevimli filmlar yo'q</p>
                <p className="text-slate-400 text-sm">Filmlarni sevimlilar ro'yxatiga qo'shing</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onRemove={handleRemoveFromFavorites} type="favorite" />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-slate-300">Yuklanmoqda...</p>
              </div>
            ) : watchlist.length === 0 ? (
              <div className="text-center py-8">
                <Bookmark className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300">Ko'rish ro'yxati bo'sh</p>
                <p className="text-slate-400 text-sm">Filmlarni ko'rish ro'yxatiga qo'shing</p>
              </div>
            ) : (
              <div className="space-y-3">
                {watchlist.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onRemove={handleRemoveFromWatchlist} type="watchlist" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
