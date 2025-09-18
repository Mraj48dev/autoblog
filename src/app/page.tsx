'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header with Auth */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              🚀 AutoBlog
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Automazione intelligente per la produzione di contenuti
            </p>
          </div>

          <div className="flex gap-2">
            {status === 'loading' ? (
              <Button disabled>Loading...</Button>
            ) : session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Welcome, {session.user?.name || session.user?.email}!
                </span>
                <Button onClick={() => signOut()}>Sign Out</Button>
              </div>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>✨ Generazione AI</CardTitle>
              <CardDescription>
                Contenuti automatici con Perplexity AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Genera articoli di qualità da fonti RSS, Telegram e calendari
                editoriali.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔗 WordPress Integration</CardTitle>
              <CardDescription>
                Pubblicazione automatica su WordPress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Pubblica direttamente sui tuoi siti WordPress o esporta per
                copy/paste.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💎 Sistema Token</CardTitle>
              <CardDescription>Pay-per-use con Stripe</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Paghi solo per quello che usi. Sistema di token flessibile e
                trasparente.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>🧪 Test Componenti Shadcn</CardTitle>
            <CardDescription>
              Verifica che tutto funzioni correttamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-input">Email di test</Label>
              <Input
                id="test-input"
                type="email"
                placeholder="test@autoblog.dev"
              />
            </div>
            <div className="flex gap-2">
              <Button>Primary Button</Button>
              <Button variant="outline">Outline Button</Button>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Tutti i componenti funzionano! ✅
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authenticated User Dashboard */}
        {session && (
          <Card className="max-w-2xl mx-auto mb-12">
            <CardHeader>
              <CardTitle>🎛️ Dashboard</CardTitle>
              <CardDescription>
                Manage your sites and automations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    0
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Sites
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    100
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tokens
                  </p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button disabled>Dashboard (Coming Soon)</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-12">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            🏗️ Step 1.2 completato - Authentication funzionante!
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Next.js 15 + NextAuth.js + Prisma + Shadcn/ui + TypeScript
          </p>
        </div>
      </div>
    </div>
  )
}
