'use client'

import { RequireAuth } from '@/components/auth/require-auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Breadcrumb } from '@/components/dashboard/breadcrumb'
import { AddSiteDialog } from '@/components/sites/add-site-dialog'
import { SiteList } from '@/components/sites/site-list'
import { Plus } from 'lucide-react'

function SitesContent() {
  return (
    <DashboardLayout>
      <Breadcrumb items={[{ label: 'Sites' }]} />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sites</h1>
          <p className="text-gray-600 mt-2">Manage your connected websites and blogs</p>
        </div>
        <AddSiteDialog />
      </div>

      <SiteList />
    </DashboardLayout>
  )
}

export default function SitesPage() {
  return (
    <RequireAuth>
      <SitesContent />
    </RequireAuth>
  )
}