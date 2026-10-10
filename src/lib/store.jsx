import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { drawingById } from '../drawings/index.js'

// What the visitor has chosen: the drawings in their book, their own pictures, and how
// they like to print. A drawing is known by its reference: an id such as "cat", a made page
// such as "mandala-41-2", or "pic-3" for one of the visitor's own pictures. The book and the settings are remembered on this device. Pictures
// are kept only while the page is open, and never leave the device.

const BOOK_KEY = 'moon-talween:book'
const OPTIONS_KEY = 'moon-talween:options'

export const defaultOptions = { mode: 'book', sides: 'both', paper: 'a4', fit: 'fill', tool: 'pencil', line: 'medium', childName: '', nameLine: false }

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value ?? fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Private windows may refuse storage; the choice then lasts only while the page is open.
  }
}

/** A drawing or made page that may sit in a book. Whole-sheet pages, such as a certificate, may not. */
const inBook = (ref) => {
  const item = typeof ref === 'string' ? drawingById(ref) : undefined
  return Boolean(item) && !item.sheetOnly
}

const StoreContext = createContext(null)

let pictureCount = 0

function loadPicture(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => resolve({ url, image })
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('unreadable'))
    }
    image.src = url
  })
}

export function StoreProvider({ children }) {
  const [book, setBook] = useState(() => {
    const saved = read(BOOK_KEY, [])
    return Array.isArray(saved) ? saved.filter(inBook) : []
  })
  const [options, setOptions] = useState(() => ({ ...defaultOptions, ...read(OPTIONS_KEY, {}) }))
  const [pictures, setPictures] = useState([])

  // Pictures cannot be saved, so only the site's own drawings are written down.
  useEffect(() => write(BOOK_KEY, book.filter(inBook)), [book])
  useEffect(() => write(OPTIONS_KEY, options), [options])

  /** A reference is a drawing's id, or "pic-3" for one of the visitor's pictures. */
  const resolve = useCallback(
    (ref) => {
      const drawing = drawingById(ref)
      if (drawing) return { ...drawing, kind: 'drawing', ref }
      const picture = pictures.find((item) => item.ref === ref)
      return picture ? { ...picture, kind: 'picture' } : undefined
    },
    [pictures],
  )

  const value = useMemo(() => {
    const toggle = (ref) => setBook((list) => (list.includes(ref) ? list.filter((item) => item !== ref) : [...list, ref]))
    const remove = (ref) => setBook((list) => list.filter((item) => item !== ref))
    const move = (ref, by) =>
      setBook((list) => {
        const from = list.indexOf(ref)
        const to = from + by
        if (from < 0 || to < 0 || to >= list.length) return list
        const next = [...list]
        next.splice(from, 1)
        next.splice(to, 0, ref)
        return next
      })
    const clear = () => setBook([])
    /** Replaces the book, and optionally some settings: used by ready-made books and shared links. */
    const load = (refs, settings) => {
      setBook([...new Set(refs)].filter(inBook).slice(0, 60))
      if (settings) setOptions((current) => ({ ...current, ...settings }))
    }
    const setOption = (key, choice) => setOptions((current) => ({ ...current, [key]: choice }))

    /** Reads picture files. Returns how many were added and how many could not be read. */
    const addPictures = async (files) => {
      const added = []
      let failed = 0
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          failed += 1
          continue
        }
        try {
          const { url, image } = await loadPicture(file)
          pictureCount += 1
          added.push({ ref: `pic-${pictureCount}`, name: file.name.replace(/\.[^.]+$/, ''), url, image })
        } catch {
          failed += 1
        }
      }
      if (added.length > 0) setPictures((list) => [...list, ...added])
      return { added: added.map((item) => item.ref), failed }
    }

    return { book, options, pictures, resolve, toggle, remove, move, clear, load, setOption, addPictures }
  }, [book, options, pictures, resolve])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}
