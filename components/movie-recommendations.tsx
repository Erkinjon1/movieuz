"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, Heart, Eye, Clock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

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

export function MovieRecommendations() {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [trending, setTrending] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)

  const trendingMovies: Movie[] = [
    {
      id: "trending-1",
      title: "Dune: Part Two",
      translatedTitle: "Qum: Ikkinchi qism",
      year: "2024",
      genre: "Ilmiy-fantastik",
      poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      rating: "8.5",
      plot: "Pol Atreydesning Fremenlar bilan birga Harkonnenlarga qarshi kurashi davom etadi.",
    },
    {
      id: "trending-2",
      title: "Oppenheimer",
      translatedTitle: "Oppengeimer",
      year: "2023",
      genre: "Drama, Tarixiy",
      poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      rating: "8.3",
      plot: "Atom bombasi yaratuvchisi Robert Oppengeimer haqidagi biografik film.",
    },
    {
      id: "trending-3",
      title: "Spider-Man: Across the Spider-Verse",
      translatedTitle: "O'rgimchak-odam: O'rgimchak-olam bo'ylab",
      year: "2023",
      genre: "Animatsiya, Jangari",
      poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      rating: "8.7",
      plot: "Mayls Morales ko'p o'lchamli sayohat qiladi va boshqa O'rgimchak-odamlar bilan uchrashadi.",
    },
  ]

  useEffect(() => {
    setTrending(trendingMovies)
    if (user) {
      generateRecommendations()
    }
  }, [user])

  const generateRecommendations = () => {
    // Bu yerda foydalanuvchi sevimlilariga asoslangan tavsiyalar bo'lishi mumkin
    const personalizedMovies: Movie[] = [
      {
        id: "rec-1",
        title: "Inception",
        translatedTitle: "Boshlanish",
        year: "2010",
        genre: "Ilmiy-fantastik, Triller",
        poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        rating: "8.8",
        plot: "Orzular ichida orzular yaratish san'ati.",
      },
      {
        id: "rec-2",
        title: "Interstellar",
        translatedTitle: "Yulduzlararo",
        year: "2014",
        genre: "Ilmiy-fantastik, Drama",
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        rating: "8.6",
        plot: "Insoniyatni qutqarish uchun kosmosga sayohat.",
      },
    ]
    setRecommendations(personalizedMovies)
  }

  const MovieCard = ({ movie, type }: { movie: Movie; type: "trending" | "recommendation" }) => (
    <Card className="bg-slate-800/50 border-slate-700 overflow-hidden hover:transform hover:scale-105 transition-all duration-300 min-w-[200px]">
      <div className="relative">
        <img src={movie.poster || "/placeholder.svg"} alt={movie.title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-xs text-white">{movie.rating}</span>
        </div>
        {type === "trending" && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-600 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trend
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <h4 className="font-semibold text-sm mb-1 line-clamp-1">{movie.title}</h4>
        {movie.translatedTitle && <p className="text-xs text-slate-400 mb-2">{movie.translatedTitle}</p>}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <span>{movie.year}</span>
          <span>•</span>
          <span>{movie.genre.split(",")[0]}</span>
        </div>
        <p className="text-xs text-slate-300 line-clamp-2">{movie.plot}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Trending filmlar */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-red-500" />
            Trendda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {trending.map((movie) => (
              <MovieCard key={movie.id} movie={movie} type="trending" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shaxsiy tavsiyalar */}
      {user && recommendations.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Heart className="h-5 w-5 text-pink-500" />
              Siz uchun tavsiyalar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recommendations.map((movie) => (
                <MovieCard key={movie.id} movie={movie} type="recommendation" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistika */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500">
          <CardContent className="p-4 text-center">
            <Eye className="h-8 w-8 text-white mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">1,250+</div>
            <div className="text-blue-100 text-sm">Filmlar bazasi</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600 to-green-700 border-green-500">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-white mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">50,000+</div>
            <div className="text-green-100 text-sm">Sevimli filmlar</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-600 to-purple-700 border-purple-500">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-white mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-purple-100 text-sm">Xizmat vaqti</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
