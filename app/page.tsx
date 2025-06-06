"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { MovieSearch } from "@/components/movie-search"
import { AuthModal } from "@/components/auth-modal"
import { UserDashboard } from "@/components/user-dashboard"
import { AdminPanel } from "@/components/admin-panel"
import { DebugPanel } from "@/components/debug-panel"
import { Button } from "@/components/ui/button"
import { Film, User, LogOut, Bug, Shield } from "lucide-react"
import { FavoritesPage } from "@/components/favorites-page"

export default function HomePage() {
  const { user, signOut, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  // Admin emaillarini tekshirish
  const adminEmails = [
    "admin@example.com",
    "your-email@example.com",
    "erkinjonrabbimov1@gmail.com",
    "xayrullayevsherzodthe@gmail.com", // Yangi admin email qo'shildi
  ]
  const isAdmin = user && adminEmails.includes(user.email || "")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold">Kino Qidiruv</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowDebug(!showDebug)}
              className="text-white hover:text-yellow-400"
            >
              <Bug className="h-4 w-4 mr-2" />
              Debug
            </Button>

            {user ? (
              <>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowAdmin(true)}
                    className="text-white hover:text-purple-400"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => setShowFavorites(true)}
                  className="text-white hover:text-blue-400"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sevimlilar
                </Button>
                <Button variant="ghost" onClick={signOut} className="text-white hover:text-red-400">
                  <LogOut className="h-4 w-4 mr-2" />
                  Chiqish
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowAuthModal(true)} className="bg-blue-600 hover:bg-blue-700">
                Kirish / Ro'yxatdan o'tish
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      {!showFavorites && (
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              O'zbek va Xalqaro Kinolarni Qidirish
            </h2>
            <p className="text-slate-300 text-lg">Sevimli filmlaringizni toping va yangi kinolarni kashf eting</p>
          </div>

          {/* Debug Panel */}
          {showDebug && <DebugPanel />}

          <MovieSearch />
        </main>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* User Dashboard */}
      <UserDashboard isOpen={showDashboard} onClose={() => setShowDashboard(false)} />

      {/* Admin Panel */}
      <AdminPanel isOpen={showAdmin} onClose={() => setShowAdmin(false)} />

      {/* Favorites Page */}
      {showFavorites && <FavoritesPage onBack={() => setShowFavorites(false)} />}
    </div>
  )
}
