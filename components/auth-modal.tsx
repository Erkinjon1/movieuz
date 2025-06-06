"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("🔐 Form sign in attempt:", email)

    try {
      await signIn(email, password)
      toast({
        title: "Muvaffaqiyatli!",
        description: "Tizimga muvaffaqiyatli kirdingiz",
      })
      onClose()
    } catch (error: any) {
      console.error("❌ Sign in form error:", error)

      let errorMessage = "Kirish jarayonida xatolik yuz berdi"

      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email yoki parol noto'g'ri. Iltimos, qaytadan urinib ko'ring."
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Email tasdiqlanmagan. Emailingizni tekshiring va tasdiqlash havolasini bosing."
      } else if (error.message?.includes("Too many requests")) {
        errorMessage = "Juda ko'p urinish. Iltimos, biroz kuting."
      }

      toast({
        title: "Kirish xatoligi",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string

    console.log("📝 Form sign up attempt:", email)

    try {
      await signUp(email, password, fullName)
      toast({
        title: "Muvaffaqiyatli!",
        description: "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi. Email orqali tasdiqlang.",
      })
      onClose()
    } catch (error: any) {
      console.error("❌ Sign up form error:", error)

      let errorMessage = "Ro'yxatdan o'tishda xatolik yuz berdi"

      if (error.message?.includes("User already registered")) {
        errorMessage = "Bu email allaqachon ro'yxatdan o'tgan. Kirish sahifasini ishlatib ko'ring."
      } else if (error.message?.includes("Password should be at least")) {
        errorMessage = "Parol kamida 6 ta belgidan iborat bo'lishi kerak."
      } else if (error.message?.includes("Invalid email")) {
        errorMessage = "Email formati noto'g'ri."
      }

      toast({
        title: "Ro'yxatdan o'tish xatoligi",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Kino Qidiruv Tizimiga Xush Kelibsiz</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <TabsTrigger value="signin" className="data-[state=active]:bg-slate-600">
              Kirish
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-slate-600">
              Ro'yxatdan o'tish
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  required
                  className="bg-slate-700 border-slate-600"
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Parol</Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  required
                  className="bg-slate-700 border-slate-600"
                  placeholder="Parolingizni kiriting"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Kuting..." : "Kirish"}
              </Button>
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Akkauntingiz yo'qmi?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      /* Switch to signup tab */
                    }}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Ro'yxatdan o'ting
                  </button>
                </p>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">To'liq ism</Label>
                <Input
                  id="signup-name"
                  name="fullName"
                  type="text"
                  required
                  className="bg-slate-700 border-slate-600"
                  placeholder="Ismingizni kiriting"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  className="bg-slate-700 border-slate-600"
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Parol</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Kamida 6 ta belgi"
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? "Kuting..." : "Ro'yxatdan o'tish"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
