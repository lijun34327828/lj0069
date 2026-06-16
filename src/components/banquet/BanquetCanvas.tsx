import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useBanquetStore } from '@/store/banquetStore'
import TableElement from './TableElement'

const CANVAS_W = 2400
const CANVAS_H = 1600

export default function BanquetCanvas() {
  const { tables, selectedTableId, canvasZoom, canvasOffset, selectTable, moveTable, addTable, setCanvasZoom, setCanvasOffset } = useBanquetStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; tableX: number; tableY: number } | null>(null)
  const [panning, setPanning] = useState<{ startX: number; startY: number; offsetX: number; offsetY: number } | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const screenToCanvas = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: (clientX - rect.left - canvasOffset.x) / canvasZoom,
      y: (clientY - rect.top - canvasOffset.y) / canvasZoom,
    }
  }, [canvasZoom, canvasOffset])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('canvas-grid')) {
      setPanning({ startX: e.clientX, startY: e.clientY, offsetX: canvasOffset.x, offsetY: canvasOffset.y })
      selectTable(null)
    }
  }, [canvasOffset, selectTable])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) {
      const pos = screenToCanvas(e.clientX, e.clientY)
      const dx = pos.x - dragging.startX
      const dy = pos.y - dragging.startY
      moveTable(dragging.id, dragging.tableX + dx, dragging.tableY + dy)
    }
    if (panning) {
      const dx = e.clientX - panning.startX
      const dy = e.clientY - panning.startY
      setCanvasOffset({ x: panning.offsetX + dx, y: panning.offsetY + dy })
    }
  }, [dragging, panning, screenToCanvas, moveTable, setCanvasOffset])

  const handleMouseUp = useCallback(() => {
    setDragging(null)
    setPanning(null)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.05 : 0.05
      setCanvasZoom(canvasZoom + delta)
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [canvasZoom, setCanvasZoom])

  const startDragTable = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const pos = screenToCanvas(e.clientX, e.clientY)
    const table = tables.find((t) => t.id === id)
    if (table) {
      setDragging({ id, startX: pos.x, startY: pos.y, tableX: table.x, tableY: table.y })
      selectTable(id)
    }
  }, [tables, screenToCanvas, selectTable])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const type = e.dataTransfer.getData('tableType') as 'round' | 'long' | 'platform'
    if (!type) return
    const pos = screenToCanvas(e.clientX, e.clientY)
    const w = type === 'round' ? 160 : type === 'long' ? 280 : 400
    const h = type === 'round' ? 160 : type === 'long' ? 90 : 100
    addTable(type, pos.x - w / 2, pos.y - h / 2)
  }, [screenToCanvas, addTable])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative flex-1 overflow-hidden cursor-grab active:cursor-grabbing ${dragOver ? 'ring-2 ring-amber-400/60' : ''}`}
      style={{ background: '#1a1a2e' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div
        className="absolute canvas-grid"
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasZoom})`,
          transformOrigin: '0 0',
          backgroundImage: 'radial-gradient(circle, rgba(201,169,110,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          border: '2px dashed rgba(201,169,110,0.2)',
          borderRadius: '8px',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.06 }}>
          <span className="text-7xl font-bold tracking-[0.3em]" style={{ color: '#c9a96e', fontFamily: 'Georgia, serif' }}>BANQUET HALL</span>
        </div>

        {tables.map((table) => (
          <TableElement
            key={table.id}
            table={table}
            isSelected={table.id === selectedTableId}
            onMouseDown={startDragTable}
          />
        ))}
      </div>

      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-amber-200/70">
        <span>缩放 {Math.round(canvasZoom * 100)}%</span>
        <button onClick={() => setCanvasZoom(1)} className="ml-1 px-2 py-0.5 rounded bg-amber-900/40 hover:bg-amber-900/60 transition-colors">重置</button>
        <span className="mx-2 text-amber-200/30">|</span>
        <span>拖拽空白处平移 · 滚轮缩放</span>
      </div>
    </div>
  )
}
