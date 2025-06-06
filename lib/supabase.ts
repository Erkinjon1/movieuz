import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Environment variables with fallback values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kydthhrvdnkzelpxtibl.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZHRoaHJ2ZG5remVscHh0aWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMzg3MjYsImV4cCI6MjA2NDcxNDcyNn0.swB9US5Cc-wTRR0h8JnHvpaByeGN7XsVPeH0uT-_uY4"

// Singleton pattern for client-side Supabase client
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (supabaseInstance) return supabaseInstance

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "supabase.auth.token",
    },
  })

  return supabaseInstance
}

// Database functions with better error handling
export async function addToFavorites(userId: string, movie: any) {
  try {
    console.log("Adding to favorites:", { userId, movieId: movie.id })

    const supabase = createClient()

    // First check if the movie already exists in favorites
    const { data: existing, error: checkError } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("movie_id", movie.id)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing favorite:", checkError)
      throw new Error(`Tekshirishda xatolik: ${checkError.message}`)
    }

    if (existing) {
      console.log("Movie already in favorites")
      throw new Error("Film allaqachon sevimlilar ro'yxatida")
    }

    // Insert the movie into favorites
    const { error: insertError } = await supabase.from("favorites").insert({
      user_id: userId,
      movie_id: movie.id,
      movie_data: movie,
    })

    if (insertError) {
      console.error("Error inserting favorite:", insertError)
      throw new Error(`Qo'shishda xatolik: ${insertError.message}`)
    }

    console.log("Successfully added to favorites")
    return true
  } catch (error) {
    console.error("addToFavorites error:", error)
    throw error
  }
}

export async function addToWatchlist(userId: string, movie: any) {
  try {
    console.log("Adding to watchlist:", { userId, movieId: movie.id })

    const supabase = createClient()

    // First check if the movie already exists in watchlist
    const { data: existing, error: checkError } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", userId)
      .eq("movie_id", movie.id)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing watchlist:", checkError)
      throw new Error(`Tekshirishda xatolik: ${checkError.message}`)
    }

    if (existing) {
      console.log("Movie already in watchlist")
      throw new Error("Film allaqachon ko'rish ro'yxatida")
    }

    // Insert the movie into watchlist
    const { error: insertError } = await supabase.from("watchlist").insert({
      user_id: userId,
      movie_id: movie.id,
      movie_data: movie,
    })

    if (insertError) {
      console.error("Error inserting watchlist:", insertError)
      throw new Error(`Qo'shishda xatolik: ${insertError.message}`)
    }

    console.log("Successfully added to watchlist")
    return true
  } catch (error) {
    console.error("addToWatchlist error:", error)
    throw error
  }
}

export async function getUserFavorites(userId: string) {
  try {
    console.log("Getting user favorites for:", userId)

    const supabase = createClient()

    const { data, error } = await supabase
      .from("favorites")
      .select("movie_data")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error getting favorites:", error)
      throw error
    }

    console.log(`Found ${data?.length || 0} favorites`)
    return data?.map((item) => item.movie_data) || []
  } catch (error) {
    console.error("getUserFavorites error:", error)
    throw error
  }
}

export async function getUserWatchlist(userId: string) {
  try {
    console.log("Getting user watchlist for:", userId)

    const supabase = createClient()

    const { data, error } = await supabase
      .from("watchlist")
      .select("movie_data")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error getting watchlist:", error)
      throw error
    }

    console.log(`Found ${data?.length || 0} watchlist items`)
    return data?.map((item) => item.movie_data) || []
  } catch (error) {
    console.error("getUserWatchlist error:", error)
    throw error
  }
}

export async function removeFromFavorites(userId: string, movieId: string) {
  try {
    console.log("Removing from favorites:", { userId, movieId })

    const supabase = createClient()

    const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("movie_id", movieId)

    if (error) {
      console.error("Error removing from favorites:", error)
      throw error
    }

    console.log("Successfully removed from favorites")
    return true
  } catch (error) {
    console.error("removeFromFavorites error:", error)
    throw error
  }
}

export async function removeFromWatchlist(userId: string, movieId: string) {
  try {
    console.log("Removing from watchlist:", { userId, movieId })

    const supabase = createClient()

    const { error } = await supabase.from("watchlist").delete().eq("user_id", userId).eq("movie_id", movieId)

    if (error) {
      console.error("Error removing from watchlist:", error)
      throw error
    }

    console.log("Successfully removed from watchlist")
    return true
  } catch (error) {
    console.error("removeFromWatchlist error:", error)
    throw error
  }
}

export async function checkIfFavorite(userId: string, movieId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("movie_id", movieId)
      .maybeSingle()

    if (error && error.code !== "PGRST116") {
      console.error("Error checking favorite:", error)
      throw error
    }

    return !!data
  } catch (error) {
    console.error("checkIfFavorite error:", error)
    return false
  }
}

export async function checkIfInWatchlist(userId: string, movieId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", userId)
      .eq("movie_id", movieId)
      .maybeSingle()

    if (error && error.code !== "PGRST116") {
      console.error("Error checking watchlist:", error)
      throw error
    }

    return !!data
  } catch (error) {
    console.error("checkIfInWatchlist error:", error)
    return false
  }
}

// Test database connection
export async function testConnection() {
  try {
    console.log("Testing database connection...")

    const supabase = createClient()

    // Simple query to test connection
    const { data, error } = await supabase.from("favorites").select("id").limit(1)

    if (error) {
      console.error("Database connection test failed:", error)
      return false
    }

    console.log("Database connection successful")
    return true
  } catch (error) {
    console.error("Database connection test error:", error)
    return false
  }
}

// Create tables if they don't exist
export async function ensureTables() {
  try {
    console.log("Ensuring tables exist...")

    const supabase = createClient()

    // Check if favorites table exists
    const { data: favoritesData, error: favoritesError } = await supabase
      .from("favorites")
      .select("count", { count: "exact", head: true })

    if (favoritesError) {
      console.error("Error checking favorites table:", favoritesError)

      // Try to create the table
      const { error: createError } = await supabase.rpc("create_favorites_table")

      if (createError) {
        console.error("Error creating favorites table:", createError)
        return false
      }
    }

    // Check if watchlist table exists
    const { data: watchlistData, error: watchlistError } = await supabase
      .from("watchlist")
      .select("count", { count: "exact", head: true })

    if (watchlistError) {
      console.error("Error checking watchlist table:", watchlistError)

      // Try to create the table
      const { error: createError } = await supabase.rpc("create_watchlist_table")

      if (createError) {
        console.error("Error creating watchlist table:", createError)
        return false
      }
    }

    console.log("Tables exist or were created successfully")
    return true
  } catch (error) {
    console.error("ensureTables error:", error)
    return false
  }
}
