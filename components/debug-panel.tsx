"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { createClient, ensureTables } from "@/lib/supabase"

export function DebugPanel() {
  const { user } = useAuth()
  const [results, setResults] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResults("Testing connection...\n")

    try {
      const supabase = createClient()

      // Test 1: Basic connection
      const { data: authData, error: authError } = await supabase.auth.getUser()
      setResults((prev) => prev + `Auth test: ${authError ? "FAILED - " + authError.message : "SUCCESS"}\n`)
      setResults((prev) => prev + `User: ${authData.user ? authData.user.email : "Not logged in"}\n`)

      // Test 2: Check if tables exist
      const { data: tablesData, error: tablesError } = await supabase
        .from("favorites")
        .select("count", { count: "exact", head: true })

      setResults((prev) => prev + `Favorites table: ${tablesError ? "FAILED - " + tablesError.message : "SUCCESS"}\n`)

      // Test 3: Try to insert a test record (only if user is logged in)
      if (user) {
        const testMovie = {
          id: "test-123",
          title: "Test Movie",
          year: "2024",
          genre: "Test",
          plot: "Test plot",
          poster: "",
          rating: "5.0",
        }

        setResults((prev) => prev + `Attempting insert with user: ${user.id}\n`)

        const { data: insertData, error: insertError } = await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            movie_id: testMovie.id,
            movie_data: testMovie,
          })
          .select()

        setResults((prev) => prev + `Insert test: ${insertError ? "FAILED - " + insertError.message : "SUCCESS"}\n`)

        if (!insertError) {
          setResults((prev) => prev + `Inserted data: ${JSON.stringify(insertData)}\n`)

          // Clean up test data
          await supabase.from("favorites").delete().eq("user_id", user.id).eq("movie_id", testMovie.id)
          setResults((prev) => prev + `Cleanup: SUCCESS\n`)
        }
      } else {
        setResults((prev) => prev + `Insert test: SKIPPED - No user logged in\n`)
      }
    } catch (error: any) {
      setResults((prev) => prev + `Error: ${error.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  const checkUserAuth = async () => {
    setLoading(true)
    setResults("Checking user authentication...\n")

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        setResults((prev) => prev + `Auth Error: ${error.message}\n`)
      } else if (data.user) {
        setResults((prev) => prev + `✅ User authenticated!\n`)
        setResults((prev) => prev + `User ID: ${data.user.id}\n`)
        setResults((prev) => prev + `Email: ${data.user.email}\n`)
        setResults((prev) => prev + `Created: ${data.user.created_at}\n`)
      } else {
        setResults((prev) => prev + "❌ No user logged in\n")
      }

      // Also check the context
      setResults((prev) => prev + `Context user: ${user ? user.email : "No user in context"}\n`)
    } catch (error: any) {
      setResults((prev) => prev + `Error: ${error.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  const createTables = async () => {
    setLoading(true)
    setResults("Creating tables...\n")

    try {
      const result = await ensureTables()
      setResults((prev) => prev + `Tables created: ${result ? "SUCCESS" : "FAILED"}\n`)
    } catch (error: any) {
      setResults((prev) => prev + `Error: ${error.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  const testSignUp = async () => {
    setLoading(true)
    setResults("Testing sign up with demo account...\n")

    try {
      const supabase = createClient()
      const testEmail = `test-${Date.now()}@example.com`
      const testPassword = "test123456"

      setResults((prev) => prev + `Creating account: ${testEmail}\n`)

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: "Test User",
          },
        },
      })

      if (error) {
        setResults((prev) => prev + `❌ Sign up failed: ${error.message}\n`)
      } else {
        setResults((prev) => prev + `✅ Sign up successful!\n`)
        setResults((prev) => prev + `User ID: ${data.user?.id}\n`)
        setResults((prev) => prev + `Email: ${data.user?.email}\n`)
        setResults((prev) => prev + `Confirmation required: ${!data.user?.email_confirmed_at}\n`)
      }
    } catch (error: any) {
      setResults((prev) => prev + `Error: ${error.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  const testExistingUser = async () => {
    setLoading(true)
    setResults("Testing existing user login...\n")

    try {
      const supabase = createClient()

      // Check if the admin email exists
      const { data: users, error } = await supabase.auth.admin.listUsers()

      if (error) {
        setResults((prev) => prev + `❌ Cannot check users: ${error.message}\n`)
      } else {
        const adminUser = users.users.find((u) => u.email === "erkinjonrabbimov1@gmail.com")

        if (adminUser) {
          setResults((prev) => prev + `✅ Admin user exists!\n`)
          setResults((prev) => prev + `Email: ${adminUser.email}\n`)
          setResults((prev) => prev + `Confirmed: ${adminUser.email_confirmed_at ? "Yes" : "No"}\n`)
          setResults((prev) => prev + `Created: ${adminUser.created_at}\n`)
        } else {
          setResults((prev) => prev + `❌ Admin user not found. Please sign up first.\n`)
        }
      }
    } catch (error: any) {
      setResults((prev) => prev + `Error: ${error.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 mb-6">
      <CardHeader>
        <CardTitle className="text-white">🔧 Debug Panel</CardTitle>
        <p className="text-slate-400 text-sm">Current user: {user ? `✅ ${user.email}` : "❌ Not logged in"}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={testConnection} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            Test Database
          </Button>
          <Button onClick={checkUserAuth} disabled={loading} className="bg-green-600 hover:bg-green-700">
            Check Auth
          </Button>
          <Button onClick={createTables} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
            Create Tables
          </Button>
          <Button onClick={testSignUp} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
            Test Sign Up
          </Button>
          <Button onClick={testExistingUser} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
            Check Admin User
          </Button>
          <Button onClick={() => setResults("")} variant="outline" className="border-slate-600 text-slate-300">
            Clear
          </Button>
        </div>

        {results && (
          <div className="bg-slate-900 p-4 rounded-lg">
            <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">{results}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
