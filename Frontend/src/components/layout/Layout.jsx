import { useState } from 'react'
import { Outlet }   from 'react-router-dom'
import Sidebar      from './Sidebar'
import Topbar       from './Topbar'
import MobileNav    from './MobileNav'

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-3 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav — only on mobile */}
      <div className="md:hidden">
        <MobileNav />
      </div>

    </div>
  )
}