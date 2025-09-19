'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CardSkeleton } from '@/components/ui/skeleton'
import { Globe, Settings, Trash2, ExternalLink } from 'lucide-react'
import { AddSiteDialog } from './add-site-dialog'

interface Site {
  id: string
  name: string
  url: string
  type: 'WORDPRESS' | 'GENERIC'
  status: string
  createdAt: string
  updatedAt: string
  _count: {
    articles: number
    automations: number
  }
}

export function SiteList() {
  const [sites, setSites] = useState<Site[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSites = async () => {
    try {
      setError(null)
      const response = await fetch('/api/sites')

      if (!response.ok) {
        throw new Error('Failed to fetch sites')
      }

      const data = await response.json()
      setSites(data.sites)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load sites')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSite = async (siteId: string) => {
    if (!confirm('Are you sure you want to delete this site? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete site')
      }

      setSites(sites.filter(site => site.id !== siteId))
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete site')
    }
  }

  useEffect(() => {
    fetchSites()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchSites} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (sites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Sites</CardTitle>
          <CardDescription>
            Connect WordPress sites or generic websites to start automating content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Globe className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No sites yet</p>
            <p className="text-sm text-gray-400 mt-2 mb-4">
              Add your first site to start creating automated content. You can connect WordPress sites or any website.
            </p>
            <AddSiteDialog onSiteAdded={fetchSites} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sites.map((site) => (
        <Card key={site.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {site.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 flex items-center gap-1"
                  >
                    {site.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={site.type === 'WORDPRESS' ? 'default' : 'secondary'}>
                  {site.type === 'WORDPRESS' ? 'WordPress' : 'Generic'}
                </Badge>
                <Badge variant={site.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {site.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span>{site._count.articles} articles</span>
                <span>{site._count.automations} automations</span>
                <span>Added {new Date(site.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteSite(site.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}