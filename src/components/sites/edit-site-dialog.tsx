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
import { Settings, Loader2, HelpCircle, ExternalLink } from 'lucide-react'

const siteSchema = z.object({
  name: z.string().min(1, 'Site name is required'),
  url: z.string().url('Please enter a valid URL'),
  type: z.enum(['WORDPRESS', 'GENERIC']),
  status: z.string().optional(),
  wpUsername: z.string().optional(),
  wpPassword: z.string().optional(),
  wpApiUrl: z.string().optional(),
})

type SiteFormData = z.infer<typeof siteSchema>

interface Site {
  id: string
  name: string
  url: string
  type: 'WORDPRESS' | 'GENERIC'
  status: string
  wpConfig?: {
    username?: string
    password?: string
    apiUrl?: string
  }
}

interface EditSiteDialogProps {
  site: Site
  open: boolean
  onOpenChange: (open: boolean) => void
  onSiteUpdated?: () => void
}

export function EditSiteDialog({ site, open, onOpenChange, onSiteUpdated }: EditSiteDialogProps) {
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
      name: site.name,
      url: site.url,
      type: site.type,
      status: site.status,
      wpUsername: site.wpConfig?.username || '',
      wpPassword: site.wpConfig?.password || '',
      wpApiUrl: site.wpConfig?.apiUrl || '',
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
      if (apiUrl && !watch('wpApiUrl')) {
        setValue('wpApiUrl', apiUrl)
      }
    }
  }, [siteUrl, siteType, setValue, watch])

  // Reset form when site changes
  useEffect(() => {
    reset({
      name: site.name,
      url: site.url,
      type: site.type,
      status: site.status,
      wpUsername: site.wpConfig?.username || '',
      wpPassword: site.wpConfig?.password || '',
      wpApiUrl: site.wpConfig?.apiUrl || '',
    })
  }, [site, reset])

  const onSubmit = async (data: SiteFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const wpConfig = data.type === 'WORDPRESS'
        ? {
            username: data.wpUsername,
            password: data.wpPassword,
            apiUrl: data.wpApiUrl,
          }
        : null

      const response = await fetch(`/api/sites/${site.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          url: data.url,
          type: data.type,
          status: data.status,
          wpConfig,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update site')
      }

      onOpenChange(false)
      onSiteUpdated?.()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update site')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configure Site
          </DialogTitle>
          <DialogDescription>
            Update your site configuration and WordPress settings.
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

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {siteType === 'WORDPRESS' && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">WordPress Configuration</h4>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Nota:</strong> Modifica solo se hai cambiato le credenziali WordPress
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="wpApiUrl" className="flex items-center gap-2">
                  WordPress API URL
                  <span className="text-xs text-muted-foreground">(Auto-aggiornato)</span>
                </Label>
                <Input
                  id="wpApiUrl"
                  placeholder="https://myblog.com/wp-json/wp/v2"
                  {...register('wpApiUrl')}
                  className="font-mono text-sm"
                />
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
                <p className="text-xs text-muted-foreground">
                  Lascia vuoto per mantenere la password esistente
                </p>
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
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Site
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}