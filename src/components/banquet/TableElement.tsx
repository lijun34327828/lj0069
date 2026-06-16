import React, { useMemo } from 'react'
import { TableItem } from '@/store/banquetStore'

interface Props {
  table: TableItem
  isSelected: boolean
  onMouseDown: (id: string, e: React.MouseEvent) => void
}

function SeatCircle({ cx, cy, color, occupied }: { cx: number; cy: number; color: string; occupied: boolean }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={7}
      fill={occupied ? color : 'rgba(255,255,255,0.1)'}
      stroke={occupied ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)'}
      strokeWidth={1}
    />
  )
}

function RoundTableSvg({ table }: { table: TableItem }) {
  const { seats, color, label } = table
  const r = 60
  const seatR = r + 22

  const seatPositions = useMemo(() => {
    const positions = []
    for (let i = 0; i < seats; i++) {
      const angle = (2 * Math.PI * i) / seats - Math.PI / 2
      positions.push({
        cx: 80 + seatR * Math.cos(angle),
        cy: 80 + seatR * Math.sin(angle),
      })
    }
    return positions
  }, [seats])

  return (
    <svg width="160" height="160" viewBox="0 0 160 160" className="overflow-visible">
      <defs>
        <radialGradient id={`rg-${table.id}`} cx="40%" cy="40%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </radialGradient>
        <filter id={`shadow-${table.id}`}>
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      <circle cx="80" cy="80" r={r} fill={`url(#rg-${table.id})`} filter={`url(#shadow-${table.id})`} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
      <circle cx="80" cy="80" r={r - 4} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      {seatPositions.map((pos, i) => (
        <SeatCircle key={i} cx={pos.cx} cy={pos.cy} color={color} occupied={true} />
      ))}
      <text x="80" y="76" textAnchor="middle" fill="white" fontSize="13" fontWeight="600" style={{ fontFamily: 'Georgia, serif' }}>{label || '圆桌'}</text>
      <text x="80" y="94" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">{seats}人</text>
    </svg>
  )
}

function LongTableSvg({ table }: { table: TableItem }) {
  const { seats, color, label } = table
  const w = 250
  const h = 60
  const halfSeats = Math.ceil(seats / 2)
  const padX = 20

  const topSeats = useMemo(() => {
    const positions = []
    const spacing = (w - padX * 2) / Math.max(halfSeats - 1, 1)
    for (let i = 0; i < halfSeats; i++) {
      positions.push({ cx: padX + i * spacing + 15, cy: 10 })
    }
    return positions
  }, [seats, halfSeats])

  const bottomSeats = useMemo(() => {
    const positions = []
    const spacing = (w - padX * 2) / Math.max(seats - halfSeats - 1, 1)
    for (let i = 0; i < seats - halfSeats; i++) {
      positions.push({ cx: padX + i * spacing + 15, cy: h + 20 })
    }
    return positions
  }, [seats, halfSeats])

  return (
    <svg width="280" height="90" viewBox="0 0 280 90" className="overflow-visible">
      <defs>
        <linearGradient id={`lg-${table.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
        <filter id={`shadow-lt-${table.id}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      <rect x="15" y="15" width={w} height={h} rx="6" fill={`url(#lg-${table.id})`} filter={`url(#shadow-lt-${table.id})`} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
      {topSeats.map((pos, i) => (
        <SeatCircle key={`t${i}`} cx={pos.cx} cy={pos.cy} color={color} occupied={true} />
      ))}
      {bottomSeats.map((pos, i) => (
        <SeatCircle key={`b${i}`} cx={pos.cx} cy={pos.cy} color={color} occupied={true} />
      ))}
      <text x="140" y="50" textAnchor="middle" fill="white" fontSize="12" fontWeight="600" style={{ fontFamily: 'Georgia, serif' }}>{label || '长条桌'}</text>
      <text x="140" y="65" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">{seats}人</text>
    </svg>
  )
}

function PlatformSvg({ table }: { table: TableItem }) {
  const { seats, color, label } = table
  const w = 380
  const h = 80
  const halfSeats = Math.ceil(seats / 2)
  const padX = 30

  const topSeats = useMemo(() => {
    const positions = []
    const spacing = (w - padX * 2) / Math.max(halfSeats - 1, 1)
    for (let i = 0; i < halfSeats; i++) {
      positions.push({ cx: padX + 10 + i * spacing, cy: 6 })
    }
    return positions
  }, [seats, halfSeats])

  const bottomSeats = useMemo(() => {
    const positions = []
    const spacing = (w - padX * 2) / Math.max(seats - halfSeats - 1, 1)
    for (let i = 0; i < seats - halfSeats; i++) {
      positions.push({ cx: padX + 10 + i * spacing, cy: h + 20 })
    }
    return positions
  }, [seats, halfSeats])

  return (
    <svg width="400" height="100" viewBox="0 0 400 100" className="overflow-visible">
      <defs>
        <linearGradient id={`pg-${table.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
        <filter id={`shadow-pl-${table.id}`}>
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      <rect x="10" y="10" width={w} height={h} rx="4" fill={`url(#pg-${table.id})`} filter={`url(#shadow-pl-${table.id})`} stroke="rgba(255,215,0,0.3)" strokeWidth={2} />
      <rect x="14" y="14" width={w - 8} height={h - 8} rx="2" fill="none" stroke="rgba(255,215,0,0.15)" strokeWidth={1} />
      {topSeats.map((pos, i) => (
        <SeatCircle key={`t${i}`} cx={pos.cx} cy={pos.cy} color="#ffd700" occupied={true} />
      ))}
      {bottomSeats.map((pos, i) => (
        <SeatCircle key={`b${i}`} cx={pos.cx} cy={pos.cy} color="#ffd700" occupied={true} />
      ))}
      <text x="200" y="54" textAnchor="middle" fill="#ffd700" fontSize="15" fontWeight="700" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.15em' }}>{label || '主宾台'}</text>
      <text x="200" y="72" textAnchor="middle" fill="rgba(255,215,0,0.6)" fontSize="10">{seats}人</text>
    </svg>
  )
}

export default function TableElement({ table, isSelected, onMouseDown }: Props) {
  const svgContent = useMemo(() => {
    switch (table.type) {
      case 'round':
        return <RoundTableSvg table={table} />
      case 'long':
        return <LongTableSvg table={table} />
      case 'platform':
        return <PlatformSvg table={table} />
    }
  }, [table])

  return (
    <div
      className="absolute cursor-move select-none"
      style={{
        left: table.x,
        top: table.y,
        width: table.width,
        height: table.height,
        transform: `rotate(${table.rotation}deg)`,
        transition: isSelected ? 'none' : 'box-shadow 0.2s',
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={(e) => onMouseDown(table.id, e)}
    >
      {isSelected && (
        <div
          className="absolute -inset-3 rounded-lg pointer-events-none"
          style={{
            border: '2px solid rgba(255,215,0,0.6)',
            boxShadow: '0 0 20px rgba(255,215,0,0.2), inset 0 0 20px rgba(255,215,0,0.05)',
          }}
        />
      )}
      <div className="relative" style={{ width: '100%', height: '100%' }}>
        {svgContent}
      </div>
    </div>
  )
}
