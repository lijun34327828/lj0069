import React, { useState, useEffect, useCallback } from 'react'
import { useBanquetStore, TableType, TemplateType } from '@/store/banquetStore'

const TABLE_TOOLS: { type: TableType; label: string; icon: string }[] = [
  { type: 'round', label: '圆桌', icon: '⬤' },
  { type: 'long', label: '长条桌', icon: '▬' },
  { type: 'platform', label: '主宾台', icon: '▭' },
]

type ToastType = 'success' | 'error'

interface ToastState {
  message: string
  type: ToastType
}

export default function Toolbar() {
  const { template, setTemplate, tables, guestGroups, loadLayout } = useBanquetStore()
  const [toast, setToast] = useState<ToastState | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tables, guestGroups, template }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('方案保存成功', 'success')
      } else {
        showToast(data.error || '保存失败', 'error')
      }
    } catch {
      showToast('网络错误，保存失败', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleLoad = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/layout')
      const data = await res.json()
      if (data.success && data.data) {
        loadLayout(data.data)
        showToast('方案读取成功', 'success')
      } else {
        showToast(data.error || '暂无保存的方案', 'error')
      }
    } catch {
      showToast('网络错误，读取失败', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, type: TableType) => {
    e.dataTransfer.setData('tableType', type)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="h-14 flex-shrink-0 flex items-center justify-between px-5 bg-[#16162a] border-b border-white/10 relative">
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

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-300 hover:text-emerald-200 transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          {saving ? '保存中...' : '保存方案'}
        </button>

        <button
          onClick={handleLoad}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/30 hover:border-sky-400/50 text-sky-300 hover:text-sky-200 transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {loading ? '读取中...' : '读取方案'}
        </button>
      </div>

      {toast && (
        <div
          className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 rounded-lg text-xs font-medium shadow-lg z-50 transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-600/90 text-white'
              : 'bg-red-600/90 text-white'
          }`}
        >
          {toast.type === 'success' ? '✓ ' : '✗ '}{toast.message}
        </div>
      )}
    </div>
  )
}
