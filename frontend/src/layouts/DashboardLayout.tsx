import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Sprout,
  Map,
  AlertTriangle,
  Route,
  PlaneTakeoff,
  Flag,
  Brain,
  BarChart3,
  FileText,
  Settings,
  ChevronDown
} from 'lucide-react'
import { cn } from '../utils/cn'
import { useMission } from '../contexts/MissionContext'

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Phase 1: Multispectral', path: '/phase1', icon: Sprout },
  { name: 'Phase 2: Interpolation', path: '/phase2', icon: Map },
  { name: 'Phase 3: Stress Zones', path: '/phase3', icon: AlertTriangle },
  { name: 'Phase 4: Coverage', path: '/phase4', icon: Route },
  { name: 'Phase 5: Spray Output', path: '/phase5', icon: PlaneTakeoff },
  { name: 'Phase 6: Waypoints', path: '/phase6', icon: Flag },
  { name: 'Phase 7: Agronomist', path: '/phase7', icon: Brain },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Reports', path: '/reports', icon: FileText },
]

export default function DashboardLayout() {
  const location = useLocation()
  const currentPath = location.pathname
  const { currentMission, missions, setMission, loading } = useMission()

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-slate-950 text-white flex flex-col border-r border-slate-800 relative z-20 shadow-2xl"
      >
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 text-emerald-400">
            <Sprout className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">Vivature</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Agritech Analytics</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = currentPath === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className="block relative"
              >
                <div className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative z-10",
                  isActive 
                    ? "text-emerald-400" 
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                )}>
                  <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-emerald-400" : "text-slate-500")} />
                  {item.name}
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-lg z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link
            to="/settings"
            className={cn(
              "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              currentPath === '/settings' ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-slate-400 hover:text-white hover:bg-slate-900"
            )}
          >
            <Settings className="mr-3 h-5 w-5 text-slate-500" />
            Settings
          </Link>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Glassmorphism Header */}
        <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-slate-200 shadow-sm px-8 py-4 flex items-center justify-between transition-all">
          <div>
            <h2 className="text-xl font-bold text-slate-900 capitalize tracking-tight">
              {currentPath.substring(1).replace('-', ' ') || 'Overview'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">Real-time agricultural monitoring</p>
          </div>
          <div className="flex items-center space-x-4">
            
            {/* Global Mission Selector */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-1.5 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mission:</span>
              {loading ? (
                <div className="h-4 w-24 bg-slate-100 animate-pulse rounded"></div>
              ) : (
                <select 
                  className="bg-transparent text-sm font-medium text-slate-800 outline-none cursor-pointer appearance-none pr-6 relative"
                  value={currentMission || ''}
                  onChange={(e) => setMission(e.target.value)}
                >
                  {missions.length === 0 ? (
                    <option value="">No Missions Found</option>
                  ) : (
                    missions.map(m => (
                      <option key={m} value={m}>{m.replace('_', ' ')}</option>
                    ))
                  )}
                </select>
              )}
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" style={{ position: 'relative', right: '4px', marginLeft: '-24px' }}/>
            </div>
            
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-600">System Online</span>
            </div>
          </div>
        </header>

        {/* Main Area with Page Transitions */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
