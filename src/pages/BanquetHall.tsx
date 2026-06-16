import React from 'react'
import BanquetCanvas from '@/components/banquet/BanquetCanvas'
import RightPanel from '@/components/banquet/RightPanel'
import Toolbar from '@/components/banquet/Toolbar'

export default function BanquetHall() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0f0f23]">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <BanquetCanvas />
        <RightPanel />
      </div>
    </div>
  )
}
