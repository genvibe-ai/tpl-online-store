import { create } from 'zustand'
import type { Img } from '../content'

export type Toast = {
  id: number
  title: string
  description?: string
  image?: Img
  action?: { label: string; onClick: () => void }
}

type ToastState = {
  toasts: Toast[]
  push: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: number) => void
}

let nextId = 1

/** Small notifications in the corner (auto-dismiss lives in components/layout/Toaster.tsx). */
export const useToasts = create<ToastState>()((set) => ({
  toasts: [],
  push: (toast) => set((state) => ({ toasts: [...state.toasts.slice(-2), { ...toast, id: nextId++ }] })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

/** Show a toast from anywhere: toast({ title: 'Added to your bag' }). */
export const toast = (t: Omit<Toast, 'id'>) => useToasts.getState().push(t)
