import React from 'react'
import { useBanquetStore, TableType, TemplateType } from '@/store/banquetStore'

const TABLE_TOOLS: { type: TableType; label: string; icon: string }[] = [
  { type: 'round', label: '圆桌', icon: '⬤' },
  { type: 'long', label: '长条桌', icon: '▬' },
  { type: 'platform', label: '主宾台', icon: '▭' },
]

export default function Toolbar() {
  const { template, setTemplate } = useBanquetStore()

  const handleDragStart = (e: React.DragEvent, type: TableType) => {
    e.dataTransfer.setData('tableType', type)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="h-14 flex-shrink-0 flex items-center justify-between px-5 bg-[#16162a] border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-sm font-semibold text-amber-300/90 tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>BANQUET LAYOUT</span>
        </div>
        <div className="w-px h-6 bg-white/10 mx-2" />
        <span className="text-xs text-white/40">拖拽添加桌台</span>
        <div className="flex items-center gap-1.5 ml-2">
          {TABLE_TOOLS.map((tool) => (
            <button
              key={tool.type}
              draggable
              onDragStart={(e) => handleDragStart(e, tool.type)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/30 text-white/70 hover:text-amber-300 transition-all cursor-grab active:cursor-grabbing text-xs"
            >
              <span className="text-base" style={{ color: tool.type === 'platform' ? '#ffd700' : '#c9a96e' }}>{tool.icon}</span>
              {tool.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
          {(['dinner', 'cocktail'] as TemplateType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                template === t
                  ? 'bg-amber-600/80 text-white shadow-lg shadow-amber-600/20'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {t === 'dinner' ? '晚宴模式' : '酒会模式'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
