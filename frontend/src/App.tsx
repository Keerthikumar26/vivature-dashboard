import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import { AlertCircle } from 'lucide-react'

// Direct imports — no lazy loading, avoids lazyInitializer crashes
import Dashboard from './pages/Dashboard'
import Phase1    from './pages/Phase1'
import Phase2    from './pages/Phase2'
import Phase3    from './pages/Phase3'
import Phase4    from './pages/Phase4'
import Phase5    from './pages/Phase5'
import Phase6    from './pages/Phase6'
import Phase7    from './pages/Phase7'
import Analytics from './pages/Analytics'
import Reports   from './pages/Reports'
import Settings  from './pages/Settings'

// ── Error Boundary ────────────────────────────────────────────────────────────
interface EBState { hasError: boolean; message: string }

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, EBState> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: unknown): EBState {
    let message = 'An unknown error occurred.'
    if (error instanceof Error) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    } else {
      try { message = JSON.stringify(error) } catch { /* noop */ }
    }
    return { hasError: true, message }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Safe logging — never call String() on the raw error object
    console.warn('[ErrorBoundary]', error?.message ?? 'Component error', info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Application Error</h1>
          <p className="text-slate-500 mb-4">An unexpected error occurred in the React component tree.</p>
          <pre className="bg-white p-4 rounded shadow border text-sm text-red-600 max-w-2xl overflow-auto whitespace-pre-wrap">
            {this.state.message}
          </pre>
          <button
            className="mt-6 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="phase1"    element={<Phase1 />} />
          <Route path="phase2"    element={<Phase2 />} />
          <Route path="phase3"    element={<Phase3 />} />
          <Route path="phase4"    element={<Phase4 />} />
          <Route path="phase5"    element={<Phase5 />} />
          <Route path="phase6"    element={<Phase6 />} />
          <Route path="phase7"    element={<Phase7 />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports"   element={<Reports />} />
          <Route path="settings"  element={<Settings />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default App
