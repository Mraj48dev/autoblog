'use client'

import { RequireAuth } from '@/components/auth/require-auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Breadcrumb } from '@/components/dashboard/breadcrumb'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, Plus } from 'lucide-react'

function AutomationsContent() {
  return (
    <DashboardLayout>
      <Breadcrumb items={[{ label: 'Automations' }]} />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automations</h1>
          <p className="text-gray-600 mt-2">Set up automated content generation rules</p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Create Automation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Running automations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Pending setup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Articles Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Automations</CardTitle>
          <CardDescription>
            Create automated workflows to generate and publish content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Bot}
            title="No automations yet"
            description="Create your first automation to start generating content automatically from RSS feeds, Telegram channels, or editorial calendars."
            actionLabel="Create Your First Automation"
            onAction={() => console.log('Create automation')}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

export default function AutomationsPage() {
  return (
    <RequireAuth>
      <AutomationsContent />
    </RequireAuth>
  )
}