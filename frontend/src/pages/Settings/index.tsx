import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function Settings() {
  return (
    <div className="space-y-6 pb-10">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-slate-500 mt-1">Application configuration and environment details.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Core backend and frontend configuration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500">Backend URL</label>
              <div className="mt-1 p-2 bg-slate-50 border rounded-md text-sm">http://localhost:8000/api</div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Current Dataset</label>
              <div className="mt-1 p-2 bg-slate-50 border rounded-md text-sm">/backend/data</div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Theme</label>
              <div className="mt-1 p-2 bg-slate-50 border rounded-md text-sm">Light (Default)</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Vivature</CardTitle>
            <CardDescription>Software and versioning information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500">Application Version</label>
              <div className="mt-1 text-sm font-semibold">1.0.0</div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Description</label>
              <div className="mt-1 text-sm text-slate-700 leading-relaxed">
                A UAV-assisted Precision Agriculture Dashboard for visualizing outputs from six completed image-processing phases.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer Information</CardTitle>
            <CardDescription>Maintainers and contact details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500">Author</label>
              <div className="mt-1 text-sm">Vivature Engineering Team</div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">License</label>
              <div className="mt-1 text-sm">MIT License</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
