"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter, Star, Clock } from "lucide-react"

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  onClear: () => void
}

export interface SearchFilters {
  query: string
  genre: string
  year: string
  rating: number[]
  duration: number[]
  country: string
  language: string
  sortBy: string
}

export function AdvancedSearch({ onSearch, onClear }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    genre: "all",
    year: "all",
    rating: [0, 10],
    duration: [0, 300],
    country: "all",
    language: "all",
    sortBy: "popularity",
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleClear = () => {
    const defaultFilters: SearchFilters = {
      query: "",
      genre: "all",
      year: "all",
      rating: [0, 10],
      duration: [0, 300],
      country: "all",
      language: "all",
      sortBy: "popularity",
    }
    setFilters(defaultFilters)
    onClear()
  }

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Search className="h-5 w-5" />
            Kengaytirilgan Qidiruv
          </CardTitle>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-300 hover:text-white"
          >
            <Filter className="h-4 w-4 mr-2" />
            {isExpanded ? "Yashirish" : "Filtrlar"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Asosiy qidiruv */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Film nomi, rejissyor, aktyor..."
              value={filters.query}
              onChange={(e) => updateFilter("query", e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
            Qidirish
          </Button>
        </div>

        {/* Kengaytirilgan filtrlar */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t border-slate-600">
            {/* Birinchi qator */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Janr</label>
                <Select value={filters.genre} onValueChange={(value) => updateFilter("genre", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha janrlar</SelectItem>
                    <SelectItem value="action">Jangari</SelectItem>
                    <SelectItem value="comedy">Komediya</SelectItem>
                    <SelectItem value="drama">Drama</SelectItem>
                    <SelectItem value="horror">Qo'rqinchli</SelectItem>
                    <SelectItem value="romance">Romantik</SelectItem>
                    <SelectItem value="sci-fi">Ilmiy-fantastik</SelectItem>
                    <SelectItem value="thriller">Triller</SelectItem>
                    <SelectItem value="animation">Animatsiya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Yil</label>
                <Select value={filters.year} onValueChange={(value) => updateFilter("year", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha yillar</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2020-2022">2020-2022</SelectItem>
                    <SelectItem value="2010-2019">2010-2019</SelectItem>
                    <SelectItem value="2000-2009">2000-2009</SelectItem>
                    <SelectItem value="1990-1999">1990-1999</SelectItem>
                    <SelectItem value="1980-1989">1980-1989</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Mamlakat</label>
                <Select value={filters.country} onValueChange={(value) => updateFilter("country", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha mamlakatlar</SelectItem>
                    <SelectItem value="us">AQSh</SelectItem>
                    <SelectItem value="uk">Buyuk Britaniya</SelectItem>
                    <SelectItem value="fr">Fransiya</SelectItem>
                    <SelectItem value="de">Germaniya</SelectItem>
                    <SelectItem value="jp">Yaponiya</SelectItem>
                    <SelectItem value="kr">Janubiy Koreya</SelectItem>
                    <SelectItem value="in">Hindiston</SelectItem>
                    <SelectItem value="ru">Rossiya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Ikkinchi qator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Star className="inline h-4 w-4 mr-1" />
                  Reyting: {filters.rating[0]} - {filters.rating[1]}
                </label>
                <Slider
                  value={filters.rating}
                  onValueChange={(value) => updateFilter("rating", value)}
                  max={10}
                  min={0}
                  step={0.1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Davomiyligi: {filters.duration[0]} - {filters.duration[1]} daqiqa
                </label>
                <Slider
                  value={filters.duration}
                  onValueChange={(value) => updateFilter("duration", value)}
                  max={300}
                  min={0}
                  step={10}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0 daq</span>
                  <span>300 daq</span>
                </div>
              </div>
            </div>

            {/* Uchinchi qator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Til</label>
                <Select value={filters.language} onValueChange={(value) => updateFilter("language", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha tillar</SelectItem>
                    <SelectItem value="en">Ingliz tili</SelectItem>
                    <SelectItem value="uz">O'zbek tili</SelectItem>
                    <SelectItem value="ru">Rus tili</SelectItem>
                    <SelectItem value="es">Ispan tili</SelectItem>
                    <SelectItem value="fr">Fransuz tili</SelectItem>
                    <SelectItem value="de">Nemis tili</SelectItem>
                    <SelectItem value="ja">Yapon tili</SelectItem>
                    <SelectItem value="ko">Koreys tili</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Saralash</label>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Mashhurlik bo'yicha</SelectItem>
                    <SelectItem value="rating">Reyting bo'yicha</SelectItem>
                    <SelectItem value="year">Yil bo'yicha</SelectItem>
                    <SelectItem value="title">Nom bo'yicha</SelectItem>
                    <SelectItem value="duration">Davomiyligi bo'yicha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tugmalar */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Qidiruv
              </Button>
              <Button onClick={handleClear} variant="outline" className="border-slate-600 text-slate-300">
                <X className="h-4 w-4 mr-2" />
                Tozalash
              </Button>
            </div>

            {/* Faol filtrlar */}
            <div className="flex flex-wrap gap-2">
              {filters.genre !== "all" && (
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  Janr: {filters.genre}
                </Badge>
              )}
              {filters.year !== "all" && (
                <Badge variant="secondary" className="bg-green-600 text-white">
                  Yil: {filters.year}
                </Badge>
              )}
              {filters.country !== "all" && (
                <Badge variant="secondary" className="bg-purple-600 text-white">
                  Mamlakat: {filters.country}
                </Badge>
              )}
              {filters.language !== "all" && (
                <Badge variant="secondary" className="bg-orange-600 text-white">
                  Til: {filters.language}
                </Badge>
              )}
              {(filters.rating[0] > 0 || filters.rating[1] < 10) && (
                <Badge variant="secondary" className="bg-yellow-600 text-white">
                  Reyting: {filters.rating[0]}-{filters.rating[1]}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
