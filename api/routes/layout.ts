import { Router, type Request, type Response } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, '..', 'data')
const LAYOUT_FILE = path.join(DATA_DIR, 'layout.json')

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

const router = Router()

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tables, guestGroups, template } = req.body
    if (!tables || !guestGroups || !template) {
      res.status(400).json({ success: false, error: 'Missing required fields: tables, guestGroups, template' })
      return
    }
    await ensureDataDir()
    await fs.writeFile(LAYOUT_FILE, JSON.stringify({ tables, guestGroups, template }, null, 2), 'utf-8')
    res.json({ success: true, message: 'Layout saved' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save layout' })
  }
})

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const content = await fs.readFile(LAYOUT_FILE, 'utf-8')
    const data = JSON.parse(content)
    res.json({ success: true, data })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      res.json({ success: false, error: 'No saved layout found' })
      return
    }
    res.status(500).json({ success: false, error: 'Failed to load layout' })
  }
})

export default router
