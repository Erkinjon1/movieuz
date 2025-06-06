"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Film } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { checkIfFavorite, checkIfInWatchlist, testConnection, ensureTables } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { AdvancedSearch, type SearchFilters } from "./advanced-search"
import { MovieRecommendations } from "./movie-recommendations"
import { MovieCard } from "./movie-card"

interface Movie {
  id: string
  title: string
  translatedTitle?: string
  year: string
  director: string
  genre: string
  actors: string
  plot: string
  poster: string
  rating: string
  duration?: string
  country?: string
  language?: string
}

const uzbekMovies: Movie[] = [
  {
    id: "1",
    title: "The Shawshank Redemption",
    translatedTitle: "Shoushenk qamoqxonasidan qochish",
    year: "1994",
    director: "Frank Darabont",
    genre: "Drama",
    actors: "Tim Robbins, Morgan Freeman",
    plot: "Ikki qamoqxona mahkumi ko'p yillar davomida do'stlashadi va oddiy insoniylik harakatlari orqali tasalli va nihoyat najot topadilar.",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    rating: "9.3",
    duration: "142",
    country: "us",
    language: "en",
  },
  {
    id: "2",
    title: "The Godfather",
    translatedTitle: "Krestnyy otets",
    year: "1972",
    director: "Francis Ford Coppola",
    genre: "Jinoyat, Drama",
    actors: "Marlon Brando, Al Pacino",
    plot: "Uyushgan jinoyat dinastiyasining keksa patriarxi o'zining yashirin imperiyasini istaksiz o'g'liga topshiradi.",
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    rating: "9.2",
    duration: "175",
    country: "us",
    language: "en",
  },
  {
    id: "3",
    title: "The Dark Knight",
    translatedTitle: "Qorong'u ritsar",
    year: "2008",
    director: "Christopher Nolan",
    genre: "Jangari, Jinoyat, Drama",
    actors: "Christian Bale, Heath Ledger",
    plot: "Joker nomi bilan tanilgan tahdid o'zining sirli o'tmishidan paydo bo'lganda, u Gotham aholisiga vayronagarchilik va tartibsizlik olib keladi.",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: "9.0",
    duration: "152",
    country: "us",
    language: "en",
  },
  {
    id: "4",
    title: "Pulp Fiction",
    translatedTitle: "Arzon fantastika",
    year: "1994",
    director: "Quentin Tarantino",
    genre: "Jinoyat, Drama",
    actors: "John Travolta, Uma Thurman, Samuel L. Jackson",
    plot: "Ikki mafiya qotilining, bokschi, gangster xotini va bir juft restoran qaroqchilarining hayoti to'rtta zo'ravonlik va najot hikoyasida kesishadi.",
    poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    rating: "8.9",
    duration: "154",
    country: "us",
    language: "en",
  },
  {
    id: "5",
    title: "Forrest Gump",
    translatedTitle: "Forrest Gamp",
    year: "1994",
    director: "Robert Zemeckis",
    genre: "Drama, Romantik",
    actors: "Tom Hanks, Robin Wright",
    plot: "Kennedi va Jonson prezidentliklari, Vetnam urushi, Uotergeyt mojarosi va boshqa tarixiy voqealar IQ darajasi 75 bo'lgan Alabama erkagining nuqtai nazaridan ochib beriladi.",
    poster: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
    rating: "8.8",
    duration: "142",
    country: "us",
    language: "en",
  },
]

export function MovieSearch() {
  const { user } = useAuth()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>({})
  const [watchlistStates, setWatchlistStates] = useState<Record<string, boolean>>({})
  const [dbConnected, setDbConnected] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const resultsPerPage = 12

  useEffect(() => {
    const initializeApp = async () => {
      // Test database connection
      const isConnected = await testConnection()
      setDbConnected(isConnected)

      if (isConnected) {
        // Ensure tables exist
        await ensureTables()
      }

      // Set initial movies
      setMovies(uzbekMovies)
    }

    initializeApp()
  }, [])

  useEffect(() => {
    if (user && movies.length > 0 && dbConnected) {
      checkMovieStates()
    }
  }, [user, movies, dbConnected])

  const checkMovieStates = async () => {
    if (!user || !dbConnected) return

    try {
      console.log("Checking movie states for user:", user.id)

      const favoriteChecks = movies.map(async (movie) => {
        try {
          const isFavorite = await checkIfFavorite(user.id, movie.id)
          const inWatchlist = await checkIfInWatchlist(user.id, movie.id)
          return { movieId: movie.id, isFavorite, inWatchlist }
        } catch (error) {
          console.error("Error checking movie state:", error)
          return { movieId: movie.id, isFavorite: false, inWatchlist: false }
        }
      })

      const results = await Promise.all(favoriteChecks)
      const newFavoriteStates: Record<string, boolean> = {}
      const newWatchlistStates: Record<string, boolean> = {}

      results.forEach(({ movieId, isFavorite, inWatchlist }) => {
        newFavoriteStates[movieId] = isFavorite
        newWatchlistStates[movieId] = inWatchlist
      })

      console.log("Movie states updated:", { newFavoriteStates, newWatchlistStates })
      setFavoriteStates(newFavoriteStates)
      setWatchlistStates(newWatchlistStates)
    } catch (error) {
      console.error("Error checking movie states:", error)
    }
  }

  const handleAdvancedSearch = async (filters: SearchFilters) => {
    setLoading(true)
    setCurrentFilters(filters)

    try {
      let filteredMovies = uzbekMovies.filter((movie) => {
        const matchesQuery =
          !filters.query ||
          movie.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          movie.translatedTitle?.toLowerCase().includes(filters.query.toLowerCase()) ||
          movie.director.toLowerCase().includes(filters.query.toLowerCase()) ||
          movie.actors.toLowerCase().includes(filters.query.toLowerCase())

        const matchesGenre = filters.genre === "all" || movie.genre.toLowerCase().includes(filters.genre)

        const matchesYear = filters.year === "all" || movie.year.startsWith(filters.year.split("-")[0])

        const movieRating = Number.parseFloat(movie.rating)
        const matchesRating = movieRating >= filters.rating[0] && movieRating <= filters.rating[1]

        const movieDuration = Number.parseInt(movie.duration || "120")
        const matchesDuration = movieDuration >= filters.duration[0] && movieDuration <= filters.duration[1]

        const matchesCountry = filters.country === "all" || movie.country === filters.country

        const matchesLanguage = filters.language === "all" || movie.language === filters.language

        return (
          matchesQuery &&
          matchesGenre &&
          matchesYear &&
          matchesRating &&
          matchesDuration &&
          matchesCountry &&
          matchesLanguage
        )
      })

      // Saralash
      filteredMovies.sort((a, b) => {
        switch (filters.sortBy) {
          case "rating":
            return Number.parseFloat(b.rating) - Number.parseFloat(a.rating)
          case "year":
            return Number.parseInt(b.year) - Number.parseInt(a.year)
          case "title":
            return a.title.localeCompare(b.title)
          case "duration":
            return Number.parseInt(b.duration || "120") - Number.parseInt(a.duration || "120")
          default:
            return 0
        }
      })

      // TMDb API qidiruvi (agar mahalliy natijalar bo'lmasa)
      if (filteredMovies.length === 0 && filters.query) {
        const apiKey = "a25f430cd9f39d7e8627f022724312d4"
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(filters.query)}&language=ru`,
        )
        const data = await response.json()

        if (data.results && data.results.length > 0) {
          const tmdbMovies = data.results.slice(0, 10).map((movie: any) => ({
            id: `tmdb_${movie.id}`,
            title: movie.title,
            translatedTitle: movie.title,
            year: movie.release_date?.split("-")[0] || "N/A",
            director: "Ma'lumot yo'q",
            genre: "Turli janrlar",
            actors: "Ma'lumot yo'q",
            plot: movie.overview || "Ta'rif yo'q",
            poster: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/placeholder.svg?height=450&width=300",
            rating: (movie.vote_average / 2).toFixed(1),
            duration: "120",
            country: "us",
            language: "en",
          }))
          filteredMovies = tmdbMovies
        }
      }

      setMovies(filteredMovies)
      setCurrentPage(1)
    } catch (error) {
      console.error("Qidirishda xatolik:", error)
      toast({
        title: "Xatolik",
        description: "Qidirishda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClearSearch = () => {
    setCurrentFilters(null)
    setMovies(uzbekMovies)
    setCurrentPage(1)
  }

  const handleFavoriteChange = (movieId: string, isFavorite: boolean) => {
    setFavoriteStates((prev) => ({ ...prev, [movieId]: isFavorite }))
  }

  const handleWatchlistChange = (movieId: string, isInWatchlist: boolean) => {
    setWatchlistStates((prev) => ({ ...prev, [movieId]: isInWatchlist }))
  }

  const paginatedMovies = movies.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)
  const totalPages = Math.ceil(movies.length / resultsPerPage)

  return (
    <div className="space-y-6">
      {/* Database connection status */}
      {!dbConnected && (
        <div className="bg-yellow-900/20 border border-yellow-600 text-yellow-200 p-4 rounded-lg">
          <p className="text-sm">⚠️ Ma'lumotlar bazasiga ulanishda muammo. Sevimlilar funksiyasi ishlamasligi mumkin.</p>
        </div>
      )}

      {/* Tavsiyalar va trendlar */}
      <MovieRecommendations />

      {/* Kengaytirilgan qidiruv */}
      <AdvancedSearch onSearch={handleAdvancedSearch} onClear={handleClearSearch} />

      {/* Natijalar */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Kinolar qidirilmoqda...</p>
        </div>
      ) : (
        <>
          {/* Natijalar soni va ko'rinish rejimi */}
          <div className="flex justify-between items-center">
            <p className="text-slate-300">
              {movies.length} ta film topildi
              {currentFilters && " (filtr qo'llanilgan)"}
            </p>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="border-slate-600"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="border-slate-600"
              >
                List
              </Button>
            </div>
          </div>

          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {paginatedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={!!favoriteStates[movie.id]}
                isInWatchlist={!!watchlistStates[movie.id]}
                onFavoriteChange={(isFavorite) => handleFavoriteChange(movie.id, isFavorite)}
                onWatchlistChange={(isInWatchlist) => handleWatchlistChange(movie.id, isInWatchlist)}
                viewMode={viewMode}
                dbConnected={dbConnected}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-slate-600 text-slate-300"
              >
                Oldingi
              </Button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600 text-slate-300"
                    }
                  >
                    {page}
                  </Button>
                )
              })}

              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-slate-600 text-slate-300"
              >
                Keyingi
              </Button>
            </div>
          )}
        </>
      )}

      {movies.length === 0 && !loading && (
        <div className="text-center py-12">
          <Film className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <p className="text-xl text-slate-300 mb-2">Hech qanday kino topilmadi</p>
          <p className="text-slate-400">Boshqa kalit so'zlar bilan qidiring yoki filtrlarni o'zgartiring</p>
        </div>
      )}
    </div>
  )
}
