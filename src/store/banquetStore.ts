import { create } from 'zustand'

export type TableType = 'round' | 'long' | 'platform'
export type TemplateType = 'dinner' | 'cocktail'
export type GuestGroup = {
  id: string
  name: string
  color: string
  count: number
}

export interface TableItem {
  id: string
  type: TableType
  x: number
  y: number
  seats: number
  rotation: number
  color: string
  label: string
  groupId: string | null
  width: number
  height: number
}

interface BanquetState {
  tables: TableItem[]
  guestGroups: GuestGroup[]
  template: TemplateType
  selectedTableId: string | null
  canvasZoom: number
  canvasOffset: { x: number; y: number }

  addTable: (type: TableType, x: number, y: number) => void
  removeTable: (id: string) => void
  moveTable: (id: string, x: number, y: number) => void
  updateTable: (id: string, updates: Partial<TableItem>) => void
  selectTable: (id: string | null) => void
  setTemplate: (template: TemplateType) => void
  addGuestGroup: (group: GuestGroup) => void
  removeGuestGroup: (id: string) => void
  updateGuestGroup: (id: string, updates: Partial<GuestGroup>) => void
  setCanvasZoom: (zoom: number) => void
  setCanvasOffset: (offset: { x: number; y: number }) => void
  loadDinnerTemplate: () => void
  loadCocktailTemplate: () => void
  loadLayout: (payload: { tables: TableItem[]; guestGroups: GuestGroup[]; template: TemplateType }) => void
}

let nextId = 1
function genId() {
  return `table-${nextId++}-${Date.now()}`
}

function createRoundTable(x: number, y: number, seats: number = 10, label: string = '', color: string = '#c9a96e', groupId: string | null = null): TableItem {
  return {
    id: genId(),
    type: 'round',
    x,
    y,
    seats,
    rotation: 0,
    color,
    label,
    groupId,
    width: 160,
    height: 160,
  }
}

function createLongTable(x: number, y: number, seats: number = 12, label: string = '', color: string = '#c9a96e', groupId: string | null = null): TableItem {
  return {
    id: genId(),
    type: 'long',
    x,
    y,
    seats,
    rotation: 0,
    color,
    label,
    groupId,
    width: 280,
    height: 90,
  }
}

function createPlatform(x: number, y: number, label: string = '主宾台', color: string = '#8b1a1a', groupId: string | null = null): TableItem {
  return {
    id: genId(),
    type: 'platform',
    x,
    y,
    seats: 8,
    rotation: 0,
    color,
    label,
    groupId,
    width: 400,
    height: 100,
  }
}

const defaultGuestGroups: GuestGroup[] = [
  { id: 'g1', name: '新郎家人', color: '#e74c3c', count: 30 },
  { id: 'g2', name: '新娘家人', color: '#3498db', count: 30 },
  { id: 'g3', name: '同事', color: '#2ecc71', count: 20 },
  { id: 'g4', name: '朋友', color: '#f39c12', count: 20 },
]

function buildDinnerTables(): TableItem[] {
  const tables: TableItem[] = []
  tables.push(createPlatform(500, 80, '主宾台', '#8b1a1a'))
  const positions = [
    [200, 320], [500, 320], [800, 320],
    [200, 540], [500, 540], [800, 540],
    [200, 760], [500, 760], [800, 760],
    [350, 980], [650, 980],
  ]
  const groupIds = ['g1', 'g1', 'g2', 'g2', 'g3', 'g3', 'g4', 'g4', 'g1', 'g2', 'g3']
  positions.forEach(([x, y], i) => {
    tables.push(createRoundTable(x, y, 10, `${i + 1}号桌`, '#c9a96e', groupIds[i] || null))
  })
  return tables
}

function buildCocktailTables(): TableItem[] {
  const tables: TableItem[] = []
  const roundPositions = [
    [250, 250], [550, 250], [850, 250],
    [150, 500], [450, 500], [750, 500],
  ]
  roundPositions.forEach(([x, y], i) => {
    tables.push(createRoundTable(x, y, 6, `${i + 1}号桌`, '#7b68ee', 'g' + ((i % 4) + 1)))
  })
  const longPositions = [
    [300, 700], [650, 700],
    [300, 900], [650, 900],
  ]
  longPositions.forEach(([x, y], i) => {
    tables.push(createLongTable(x, y, 8, `长桌${i + 1}`, '#5f9ea0', 'g' + ((i % 4) + 1)))
  })
  return tables
}

export const useBanquetStore = create<BanquetState>((set, get) => ({
  tables: buildDinnerTables(),
  guestGroups: defaultGuestGroups,
  template: 'dinner',
  selectedTableId: null,
  canvasZoom: 1,
  canvasOffset: { x: 0, y: 0 },

  addTable: (type, x, y) => {
    let table: TableItem
    switch (type) {
      case 'round':
        table = createRoundTable(x, y)
        break
      case 'long':
        table = createLongTable(x, y)
        break
      case 'platform':
        table = createPlatform(x, y)
        break
    }
    set((state) => ({ tables: [...state.tables, table] }))
  },

  removeTable: (id) => {
    set((state) => ({
      tables: state.tables.filter((t) => t.id !== id),
      selectedTableId: state.selectedTableId === id ? null : state.selectedTableId,
    }))
  },

  moveTable: (id, x, y) => {
    set((state) => ({
      tables: state.tables.map((t) => (t.id === id ? { ...t, x, y } : t)),
    }))
  },

  updateTable: (id, updates) => {
    set((state) => ({
      tables: state.tables.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))
  },

  selectTable: (id) => {
    set({ selectedTableId: id })
  },

  setTemplate: (template) => {
    if (template === get().template) return
    if (template === 'dinner') {
      get().loadDinnerTemplate()
    } else {
      get().loadCocktailTemplate()
    }
  },

  addGuestGroup: (group) => {
    set((state) => ({ guestGroups: [...state.guestGroups, group] }))
  },

  removeGuestGroup: (id) => {
    set((state) => ({
      guestGroups: state.guestGroups.filter((g) => g.id !== id),
      tables: state.tables.map((t) => (t.groupId === id ? { ...t, groupId: null } : t)),
    }))
  },

  updateGuestGroup: (id, updates) => {
    set((state) => ({
      guestGroups: state.guestGroups.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }))
  },

  setCanvasZoom: (zoom) => {
    set({ canvasZoom: Math.max(0.3, Math.min(2, zoom)) })
  },

  setCanvasOffset: (offset) => {
    set({ canvasOffset: offset })
  },

  loadDinnerTemplate: () => {
    nextId = 1
    set({
      tables: buildDinnerTables(),
      template: 'dinner',
      selectedTableId: null,
      canvasOffset: { x: 0, y: 0 },
      canvasZoom: 1,
    })
  },

  loadCocktailTemplate: () => {
    nextId = 1
    set({
      tables: buildCocktailTables(),
      template: 'cocktail',
      selectedTableId: null,
      canvasOffset: { x: 0, y: 0 },
      canvasZoom: 1,
    })
  },

  loadLayout: (payload) => {
    set({
      tables: payload.tables,
      guestGroups: payload.guestGroups,
      template: payload.template,
      selectedTableId: null,
    })
  },
}))
