"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, Shield, Heart, Bookmark, Mail, UserCheck, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"

interface User {
  id: string
  user_id: string
  email: string
  full_name?: string
  created_at: string
  email_confirmed_at: string | null
  last_sign_in_at: string | null
}

interface FavoriteUser {
  user_id: string
  movie_count: number
  latest_activity: string
}

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [favoriteUsers, setFavoriteUsers] = useState<FavoriteUser[]>([])
  const [watchlistUsers, setWatchlistUsers] = useState<FavoriteUser[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    confirmedUsers: 0,
    recentUsers: 0,
    totalFavorites: 0,
    totalWatchlist: 0,
    recentActivity: 0,
  })

  // Admin foydalanuvchi emaillarini tekshirish
  const adminEmails = [
    "admin@example.com",
    "your-email@example.com",
    "erkinjonrabbimov1@gmail.com",
    "xayrullayevsherzodthe@gmail.com",
  ]

  const isAdmin = user && adminEmails.includes(user.email || "")

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadUsers()
      loadUserActivity()
      loadStats()
    }
  }, [isOpen, isAdmin])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // user_profiles jadvalidan foydalanuvchilarni olish
      const { data: usersData, error: usersError } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (usersError) {
        console.error("Error loading users:", usersError)

        // Agar user_profiles jadvali bo'lmasa, test ma'lumotlarini ko'rsatamiz
        const testUsers: User[] = [
          {
            id: "1",
            user_id: user?.id || "test-user-1",
            email: user?.email || "current-user@example.com",
            full_name: "Joriy foydalanuvchi",
            created_at: new Date().toISOString(),
            email_confirmed_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
          },
          {
            id: "2",
            user_id: "test-user-2",
            email: "test.user@example.com",
            full_name: "Test foydalanuvchi",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            email_confirmed_at: new Date(Date.now() - 86400000).toISOString(),
            last_sign_in_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "3",
            user_id: "test-user-3",
            email: "demo.user@example.com",
            full_name: "Demo foydalanuvchi",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            email_confirmed_at: null,
            last_sign_in_at: null,
          },
        ]
        setUsers(testUsers)

        toast({
          title: "Ma'lumot",
          description: "Test ma'lumotlari ko'rsatilmoqda. Real ma'lumotlar uchun user_profiles jadvalini yarating.",
          variant: "default",
        })
      } else {
        setUsers(usersData || [])
      }
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Xatolik",
        description: "Foydalanuvchilarni yuklashda xatolik",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadUserActivity = async () => {
    try {
      const supabase = createClient()

      // Sevimlilar bo'yicha foydalanuvchi faolligi
      const { data: favoritesData, error: favoritesError } = await supabase
        .from("favorites")
        .select("user_id, created_at")
        .order("created_at", { ascending: false })

      if (!favoritesError && favoritesData) {
        const userFavorites: Record<string, { count: number; latest: string }> = {}

        favoritesData.forEach((fav) => {
          if (!userFavorites[fav.user_id]) {
            userFavorites[fav.user_id] = { count: 0, latest: fav.created_at }
          }
          userFavorites[fav.user_id].count++
          if (fav.created_at > userFavorites[fav.user_id].latest) {
            userFavorites[fav.user_id].latest = fav.created_at
          }
        })

        const favoriteUsersList = Object.entries(userFavorites)
          .map(([userId, data]) => ({
            user_id: userId,
            movie_count: data.count,
            latest_activity: data.latest,
          }))
          .sort((a, b) => b.movie_count - a.movie_count)

        setFavoriteUsers(favoriteUsersList)
      }

      // Ko'rish ro'yxati bo'yicha foydalanuvchi faolligi
      const { data: watchlistData, error: watchlistError } = await supabase
        .from("watchlist")
        .select("user_id, created_at")
        .order("created_at", { ascending: false })

      if (!watchlistError && watchlistData) {
        const userWatchlist: Record<string, { count: number; latest: string }> = {}

        watchlistData.forEach((watch) => {
          if (!userWatchlist[watch.user_id]) {
            userWatchlist[watch.user_id] = { count: 0, latest: watch.created_at }
          }
          userWatchlist[watch.user_id].count++
          if (watch.created_at > userWatchlist[watch.user_id].latest) {
            userWatchlist[watch.user_id].latest = watch.created_at
          }
        })

        const watchlistUsersList = Object.entries(userWatchlist)
          .map(([userId, data]) => ({
            user_id: userId,
            movie_count: data.count,
            latest_activity: data.latest,
          }))
          .sort((a, b) => b.movie_count - a.movie_count)

        setWatchlistUsers(watchlistUsersList)
      }
    } catch (error) {
      console.error("Error loading user activity:", error)
    }
  }

  const loadStats = async () => {
    try {
      const supabase = createClient()

      // Sevimlilar sonini hisoblash
      const { count: favoritesCount } = await supabase.from("favorites").select("*", { count: "exact", head: true })

      // Ko'rish ro'yxati sonini hisoblash
      const { count: watchlistCount } = await supabase.from("watchlist").select("*", { count: "exact", head: true })

      // So'nggi hafta faolligi
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const { count: recentFavorites } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo)

      const { count: recentWatchlist } = await supabase
        .from("watchlist")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo)

      // Foydalanuvchilar statistikasi
      const confirmedUsers = users.filter((u) => u.email_confirmed_at).length
      const recentUsers = users.filter((u) => {
        const createdDate = new Date(u.created_at)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return createdDate > weekAgo
      }).length

      setStats({
        totalUsers: users.length,
        confirmedUsers,
        recentUsers,
        totalFavorites: favoritesCount || 0,
        totalWatchlist: watchlistCount || 0,
        recentActivity: (recentFavorites || 0) + (recentWatchlist || 0),
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Hech qachon"
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatUserId = (userId: string) => {
    return userId.length > 8 ? `${userId.substring(0, 8)}...` : userId
  }

  const getUserByUserId = (userId: string) => {
    return users.find((u) => u.user_id === userId)
  }

  if (!isOpen) return null

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="bg-slate-800 border-slate-700 text-white max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ruxsat yo'q</h3>
            <p className="text-slate-400 mb-4">Bu bo'limga faqat adminlar kirishi mumkin</p>
            <Button onClick={onClose} variant="outline" className="border-slate-600">
              Yopish
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-800 border-slate-700 text-white max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="h-6 w-6 text-blue-400" />
              Admin Panel
            </CardTitle>
            <Button onClick={onClose} variant="ghost" className="text-slate-300">
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Admin ma'lumotlari */}
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-white" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Admin sifatida kirdingiz</h3>
                  <p className="text-purple-100">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistika */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stats.totalUsers}</div>
                <div className="text-slate-400 text-xs">Jami foydalanuvchilar</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <UserCheck className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stats.confirmedUsers}</div>
                <div className="text-slate-400 text-xs">Tasdiqlangan</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stats.recentUsers}</div>
                <div className="text-slate-400 text-xs">So'nggi hafta</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <Heart className="h-6 w-6 text-red-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stats.totalFavorites}</div>
                <div className="text-slate-400 text-xs">Sevimli filmlar</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <Bookmark className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stats.totalWatchlist}</div>
                <div className="text-slate-400 text-xs">Ko'rish ro'yxati</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stats.recentActivity}</div>
                <div className="text-slate-400 text-xs">Haftalik faollik</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger value="users" className="data-[state=active]:bg-slate-600">
                <Users className="h-4 w-4 mr-2" />
                Foydalanuvchilar ({stats.totalUsers})
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-slate-600">
                <Heart className="h-4 w-4 mr-2" />
                Faollik
              </TabsTrigger>
              <TabsTrigger value="admins" className="data-[state=active]:bg-slate-600">
                <Shield className="h-4 w-4 mr-2" />
                Adminlar
              </TabsTrigger>
            </TabsList>

            {/* Foydalanuvchilar ro'yxati */}
            <TabsContent value="users" className="space-y-4">
              <h3 className="text-lg font-semibold">Ro'yxatdan o'tgan foydalanuvchilar</h3>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-slate-300">Yuklanmoqda...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users.map((userData) => (
                    <Card key={userData.id} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {(userData.full_name || userData.email).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{userData.full_name || "Noma'lum"}</h4>
                              <p className="text-sm text-slate-400">{userData.email}</p>
                              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                <span>Ro'yxatdan o'tgan: {formatDate(userData.created_at)}</span>
                                <span>Oxirgi kirish: {formatDate(userData.last_sign_in_at)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {adminEmails.includes(userData.email) && (
                              <Badge className="bg-purple-600 text-white">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                            {userData.email_confirmed_at ? (
                              <Badge className="bg-green-600 text-white">
                                <Mail className="h-3 w-3 mr-1" />
                                Tasdiqlangan
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-yellow-600 text-yellow-400">
                                <Mail className="h-3 w-3 mr-1" />
                                Tasdiqlanmagan
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {users.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-300">Hech qanday foydalanuvchi topilmadi</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Faollik */}
            <TabsContent value="activity" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sevimlilar bo'yicha faollik */}
                <div>
                  <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-400" />
                    Sevimlilar bo'yicha faollik
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {favoriteUsers.slice(0, 10).map((userActivity) => {
                      const userData = getUserByUserId(userActivity.user_id)
                      return (
                        <Card key={userActivity.user_id} className="bg-slate-700/50 border-slate-600">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                  <Heart className="h-3 w-3 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    {userData?.full_name || userData?.email || formatUserId(userActivity.user_id)}
                                  </p>
                                  <p className="text-xs text-slate-400">{formatDate(userActivity.latest_activity)}</p>
                                </div>
                              </div>
                              <Badge className="bg-red-600 text-white text-xs">{userActivity.movie_count}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                {/* Ko'rish ro'yxati bo'yicha faollik */}
                <div>
                  <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-blue-400" />
                    Ko'rish ro'yxati bo'yicha faollik
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {watchlistUsers.slice(0, 10).map((userActivity) => {
                      const userData = getUserByUserId(userActivity.user_id)
                      return (
                        <Card key={userActivity.user_id} className="bg-slate-700/50 border-slate-600">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                  <Bookmark className="h-3 w-3 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    {userData?.full_name || userData?.email || formatUserId(userActivity.user_id)}
                                  </p>
                                  <p className="text-xs text-slate-400">{formatDate(userActivity.latest_activity)}</p>
                                </div>
                              </div>
                              <Badge className="bg-blue-600 text-white text-xs">{userActivity.movie_count}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Admin ro'yxati */}
            <TabsContent value="admins" className="space-y-4">
              <h3 className="text-lg font-semibold">Admin foydalanuvchilar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {adminEmails.map((email, index) => {
                  const adminUser = users.find((u) => u.email === email)
                  return (
                    <Card key={index} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <Shield className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{adminUser?.full_name || "Admin"}</p>
                            <p className="text-xs text-slate-400">{email}</p>
                            {adminUser && (
                              <p className="text-xs text-slate-500">
                                Ro'yxatdan o'tgan: {formatDate(adminUser.created_at)}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge className="bg-purple-600 text-white text-xs">Admin</Badge>
                            {adminUser ? (
                              <Badge className="bg-green-600 text-white text-xs">Faol</Badge>
                            ) : (
                              <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                Ro'yxatdan o'tmagan
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
