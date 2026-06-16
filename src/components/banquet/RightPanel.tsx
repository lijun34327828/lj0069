import React, { useState } from 'react'
import { useBanquetStore, GuestGroup } from '@/store/banquetStore'

const PRESET_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
  '#9b59b6', '#1abc9c', '#e67e22', '#34495e',
]

function GuestGroupItem({ group }: { group: GuestGroup }) {
  const { updateGuestGroup, removeGuestGroup, tables } = useBanquetStore()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(group.name)
  const [count, setCount] = useState(group.count)
  const assignedCount = tables.filter((t) => t.groupId === group.id).reduce((s, t) => s + t.seats, 0)

  const handleSave = () => {
    updateGuestGroup(group.id, { name, count })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
        <input
          className="bg-white/10 border border-white/10 rounded px-2 py-1 text-sm text-white outline-none focus:border-amber-400/50"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="分组名称"
        />
        <input
          className="bg-white/10 border border-white/10 rounded px-2 py-1 text-sm text-white outline-none focus:border-amber-400/50"
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          min={1}
        />
        <div className="flex gap-2">
          <button onClick={handleSave} className="flex-1 py-1 rounded text-xs bg-amber-600/80 hover:bg-amber-600 text-white transition-colors">保存</button>
          <button onClick={() => setEditing(false)} className="flex-1 py-1 rounded text-xs bg-white/10 hover:bg-white/20 text-white/70 transition-colors">取消</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5 group hover:bg-white/8 transition-colors">
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: group.color }} />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white/90 truncate">{group.name}</div>
        <div className="text-[10px] text-white/40">{group.count}人 · 已安排{assignedCount}人</div>
      </div>
      <button onClick={() => setEditing(true)} className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-amber-400 transition-all text-xs">编辑</button>
      <button onClick={() => removeGuestGroup(group.id)} className="opacity-0 group-hover:opacity-100 text-red-400/60 hover:text-red-400 transition-all text-xs">删除</button>
    </div>
  )
}

export default function RightPanel() {
  const {
    tables, guestGroups, selectedTableId,
    updateTable, removeTable, addGuestGroup,
  } = useBanquetStore()

  const selectedTable = tables.find((t) => t.id === selectedTableId)

  const handleAddGroup = () => {
    const id = `g-${Date.now()}`
    addGuestGroup({
      id,
      name: `分组${guestGroups.length + 1}`,
      color: PRESET_COLORS[guestGroups.length % PRESET_COLORS.length],
      count: 10,
    })
  }

  return (
    <div className="w-[300px] flex-shrink-0 flex flex-col bg-[#16162a] border-l border-white/10 overflow-y-auto">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-semibold text-amber-300/90 tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>桌台属性</h3>
      </div>

      {selectedTable ? (
        <div className="p-4 flex flex-col gap-3 border-b border-white/10">
          <div>
            <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">桌牌名称</label>
            <input
              className="w-full bg-white/8 border border-white/10 rounded px-3 py-1.5 text-sm text-white outline-none focus:border-amber-400/50 transition-colors"
              value={selectedTable.label}
              onChange={(e) => updateTable(selectedTable.id, { label: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">座位数</label>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 text-white/70 transition-colors flex items-center justify-center"
                onClick={() => updateTable(selectedTable.id, { seats: Math.max(2, selectedTable.seats - 2) })}
              >−</button>
              <span className="flex-1 text-center text-lg text-white font-medium">{selectedTable.seats}</span>
              <button
                className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 text-white/70 transition-colors flex items-center justify-center"
                onClick={() => updateTable(selectedTable.id, { seats: selectedTable.seats + 2 })}
              >+</button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">桌牌配色</label>
            <div className="flex flex-wrap gap-2">
              {['#c9a96e', '#7b68ee', '#5f9ea0', '#8b1a1a', '#2e8b57', '#cd853f', '#4169e1', '#dc143c'].map((c) => (
                <button
                  key={c}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${selectedTable.color === c ? 'border-amber-400 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => updateTable(selectedTable.id, { color: c })}
                />
              ))}
              <label className="w-7 h-7 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors overflow-hidden">
                <span className="text-white/40 text-xs">+</span>
                <input
                  type="color"
                  className="absolute opacity-0 w-0 h-0"
                  value={selectedTable.color}
                  onChange={(e) => updateTable(selectedTable.id, { color: e.target.value })}
                />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">所属分组</label>
            <select
              className="w-full bg-white/8 border border-white/10 rounded px-3 py-1.5 text-sm text-white outline-none focus:border-amber-400/50 transition-colors"
              value={selectedTable.groupId || ''}
              onChange={(e) => updateTable(selectedTable.id, { groupId: e.target.value || null })}
            >
              <option value="">未分组</option>
              {guestGroups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">旋转角度</label>
            <input
              type="range"
              min="0"
              max="360"
              value={selectedTable.rotation}
              onChange={(e) => updateTable(selectedTable.id, { rotation: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
            <div className="text-[10px] text-white/40 text-right">{selectedTable.rotation}°</div>
          </div>
          <button
            onClick={() => removeTable(selectedTable.id)}
            className="mt-2 py-2 rounded-lg text-sm text-red-400/80 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
          >
            删除此桌
          </button>
        </div>
      ) : (
        <div className="p-4 border-b border-white/10">
          <div className="text-xs text-white/30 text-center py-4">点击画布上的桌台以编辑属性</div>
        </div>
      )}

      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-amber-300/90 tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>宾客分组</h3>
          <button
            onClick={handleAddGroup}
            className="text-xs px-2 py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 transition-colors"
          >+ 新增</button>
        </div>
        <div className="flex flex-col gap-2">
          {guestGroups.map((g) => (
            <GuestGroupItem key={g.id} group={g} />
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-amber-300/90 tracking-wider mb-3" style={{ fontFamily: 'Georgia, serif' }}>统计</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{tables.length}</div>
            <div className="text-[10px] text-white/40">桌台总数</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{tables.reduce((s, t) => s + t.seats, 0)}</div>
            <div className="text-[10px] text-white/40">座位总数</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-amber-400">{tables.filter((t) => t.type === 'round').length}</div>
            <div className="text-[10px] text-white/40">圆桌</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-amber-400">{tables.filter((t) => t.type === 'long').length}</div>
            <div className="text-[10px] text-white/40">长条桌</div>
          </div>
        </div>
      </div>
    </div>
  )
}
