'use client'

import { RequireAuth } from '@/components/auth/require-auth'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Breadcrumb } from '@/components/dashboard/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, CreditCard, Download } from 'lucide-react'

function BillingContent() {
  return (
    <DashboardLayout>
      <Breadcrumb items={[{ label: 'Billing' }]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Billing & Usage</h1>
        <p className="text-gray-600 mt-2">Manage your tokens and billing information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                Token Balance
              </CardTitle>
              <CardDescription>
                Your current token balance and usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-green-600 mb-2">100</div>
                <p className="text-gray-600 mb-4">Tokens Available</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">0</div>
                    <div className="text-sm text-gray-500">Used This Month</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">100</div>
                    <div className="text-sm text-gray-500">Welcome Bonus</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">0</div>
                    <div className="text-sm text-gray-500">Purchased</div>
                  </div>
                </div>
              </div>
              <Button className="w-full" disabled>
                <CreditCard className="mr-2 h-4 w-4" />
                Buy More Tokens
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage History</CardTitle>
              <CardDescription>
                Track your token usage and billing history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Download className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No usage history yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Your token usage will appear here once you start generating content
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Packages</CardTitle>
              <CardDescription>
                Choose the right package for your needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Starter</span>
                  <span className="text-lg font-bold">$10</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">1,000 tokens</p>
                <Button size="sm" variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Pro</span>
                  <span className="text-lg font-bold">$25</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">3,000 tokens</p>
                <Button size="sm" variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Business</span>
                  <span className="text-lg font-bold">$50</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">7,000 tokens</p>
                <Button size="sm" variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function BillingPage() {
  return (
    <RequireAuth>
      <BillingContent />
    </RequireAuth>
  )
}