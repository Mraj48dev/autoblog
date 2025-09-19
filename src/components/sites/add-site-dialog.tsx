'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Loader2, HelpCircle, ExternalLink } from 'lucide-react'

const siteSchema = z.object({
  name: z.string().min(1, 'Site name is required'),
  url: z.string().url('Please enter a valid URL'),
  type: z.enum(['WORDPRESS', 'GENERIC']),
  wpUsername: z.string().optional(),
  wpPassword: z.string().optional(),
  wpApiUrl: z.string().optional(),
})

type SiteFormData = z.infer<typeof siteSchema>

interface AddSiteDialogProps {
  onSiteAdded?: () => void
}

export function AddSiteDialog({ onSiteAdded }: AddSiteDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      type: 'GENERIC',
    },
  })

  const siteType = watch('type')
  const siteUrl = watch('url')

  // Auto-generate WordPress API URL when site URL changes
  const generateWpApiUrl = (url: string) => {
    if (!url) return ''
    try {
      const urlObj = new URL(url)
      return `${urlObj.origin}/wp-json/wp/v2`
    } catch {
      return ''
    }
  }

  // Auto-fill WordPress API URL when URL changes and type is WordPress
  useEffect(() => {
    if (siteType === 'WORDPRESS' && siteUrl) {
      const apiUrl = generateWpApiUrl(siteUrl)
      if (apiUrl) {
        setValue('wpApiUrl', apiUrl)
      }
    }
  }, [siteUrl, siteType, setValue])

  const onSubmit = async (data: SiteFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const payload: any = {
        name: data.name,
        url: data.url,
        type: data.type,
      }

      // Solo aggiungere wpConfig per WordPress
      if (data.type === 'WORDPRESS') {
        payload.wpConfig = {
          username: data.wpUsername,
          password: data.wpPassword,
          apiUrl: data.wpApiUrl,
        }
      }
      // Per GENERIC, non aggiungere wpConfig affatto

      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add site')
      }

      reset()
      setOpen(false)
      onSiteAdded?.()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add site')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Site</DialogTitle>
          <DialogDescription>
            Add a WordPress site or generic website to start creating automated content.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Site Name</Label>
            <Input
              id="name"
              placeholder="My Blog"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Site URL</Label>
            <Input
              id="url"
              placeholder="https://myblog.com"
              {...register('url')}
            />
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Site Type</Label>
            <Select
              value={siteType}
              onValueChange={(value) => setValue('type', value as 'WORDPRESS' | 'GENERIC')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select site type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERIC">Generic Website</SelectItem>
                <SelectItem value="WORDPRESS">WordPress Site</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          {siteType === 'WORDPRESS' && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">WordPress Configuration</h4>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Setup necessario:</strong> Crea prima un "Application Password" nel tuo WordPress
                  andando su <strong>Profilo → Password applicazioni</strong>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="wpApiUrl" className="flex items-center gap-2">
                  WordPress API URL
                  <span className="text-xs text-muted-foreground">(Auto-compilato)</span>
                </Label>
                <Input
                  id="wpApiUrl"
                  placeholder="https://myblog.com/wp-json/wp/v2"
                  {...register('wpApiUrl')}
                  className="font-mono text-sm"
                />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• L'URL viene generato automaticamente dal tuo sito</p>
                  <p>• Standard WordPress: <code className="bg-muted px-1 rounded">/wp-json/wp/v2</code></p>
                  <p>• Verifica che il tuo sito abbia le REST API attive</p>
                </div>
                {errors.wpApiUrl && (
                  <p className="text-sm text-red-500">{errors.wpApiUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="wpUsername">Username WordPress</Label>
                <Input
                  id="wpUsername"
                  placeholder="Il tuo username WordPress"
                  {...register('wpUsername')}
                />
                <p className="text-xs text-muted-foreground">
                  Il nome utente del tuo account WordPress con privilegi di pubblicazione
                </p>
                {errors.wpUsername && (
                  <p className="text-sm text-red-500">{errors.wpUsername.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="wpPassword" className="flex items-center gap-2">
                  Application Password
                  <a
                    href="https://wordpress.org/support/article/application-passwords/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Label>
                <Input
                  id="wpPassword"
                  type="password"
                  placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                  {...register('wpPassword')}
                  className="font-mono"
                />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• <strong>NON usare la password normale</strong> dell'account</p>
                  <p>• Vai su <strong>WordPress Admin → Utenti → Profilo → Password applicazioni</strong></p>
                  <p>• Crea una nuova password con nome "AutoBlog"</p>
                  <p>• Copia la password generata (formato: xxxx xxxx xxxx xxxx)</p>
                </div>
                {errors.wpPassword && (
                  <p className="text-sm text-red-500">{errors.wpPassword.message}</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Site
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}