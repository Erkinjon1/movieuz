"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Calendar, Film } from "lucide-react"
import { MovieActions } from "./movie-actions"

interface Movie {
  id: string
  title: string
  translatedTitle?: string
  year: string
  genre: string
  plot: string
  poster: string
  rating: string
  duration?: string
  [key: string]: any
}

interface MovieCardProps {
  movie: Movie
  isFavorite: boolean
  isInWatchlist: boolean
  onFavoriteChange: (isFavorite: boolean) => void
  onWatchlistChange: (isInWatchlist: boolean) => void
  viewMode: "grid" | "list"
  dbConnected: boolean
}

export function MovieCard({
  movie,
  isFavorite,
  isInWatchlist,
  onFavoriteChange,
  onWatchlistChange,
  viewMode,
  dbConnected,
}: MovieCardProps) {
  return (
    <Card
      className={`bg-slate-800/50 border-slate-700 overflow-hidden hover:transform hover:scale-105 transition-all duration-300 ${
        viewMode === "list" ? "flex" : ""
      }`}
    >
      <div className={`relative ${viewMode === "list" ? "w-32 flex-shrink-0" : ""}`}>
        <img
          src={movie.poster || "/placeholder.svg?height=450&width=300"}
          alt={movie.title}
          className={`object-cover ${viewMode === "list" ? "w-full h-full" : "w-full h-64"}`}
        />
        <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-xs text-white">{movie.rating}</span>
        </div>
      </div>

      <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">
          {movie.title}
          {movie.translatedTitle && movie.translatedTitle !== movie.title && (
            <span className="block text-sm text-slate-400 font-normal">{movie.translatedTitle}</span>
          )}
        </h3>

        <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {movie.year}
          </div>
          <div className="flex items-center gap-1">
            <Film className="h-3 w-3" />
            {movie.genre.split(",")[0]}
          </div>
          {movie.duration && (
            <div className="flex items-center gap-1">
              <span>{movie.duration} daq</span>
            </div>
          )}
        </div>

        <p className="text-sm text-slate-300 line-clamp-3 mb-4">{movie.plot}</p>

        <MovieActions
          movie={movie}
          isFavorite={isFavorite}
          isInWatchlist={isInWatchlist}
          onFavoriteChange={onFavoriteChange}
          onWatchlistChange={onWatchlistChange}
          dbConnected={dbConnected}
        />
      </CardContent>
    </Card>
  )
}
