'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Delete, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NumericKeypadProps {
  isOpen: boolean
  onClose: () => void
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  allowDecimal?: boolean
  label?: string
  prefix?: string
}

export function NumericKeypad({
  isOpen,
  onClose,
  value,
  onChange,
  onSubmit,
  allowDecimal = true,
  label,
  prefix = ''
}: NumericKeypadProps) {
  const keypadRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (keypadRef.current && !keypadRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      onChange(value.slice(0, -1))
    } else if (key === 'clear') {
      onChange('')
    } else if (key === '.') {
      if (allowDecimal && !value.includes('.')) {
        onChange(value + '.')
      }
    } else {
      // Don't allow leading zeros except for decimals
      if (value === '0' && key !== '.') {
        onChange(key)
      } else {
        onChange(value + key)
      }
    }
  }

  const handleDone = () => {
    if (onSubmit) {
      onSubmit()
    }
    onClose()
  }

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [allowDecimal ? '.' : 'clear', '0', 'backspace']
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Keypad Modal */}
          <motion.div
            ref={keypadRef}
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[101] w-full sm:w-[360px] sm:max-w-[90vw]"
          >
            <div className="bg-card border border-border rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div>
                  {label && <p className="text-sm text-muted-foreground">{label}</p>}
                  <p className="text-3xl font-bold text-foreground">
                    {prefix}{value || '0'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Keypad Grid */}
              <div className="p-4 grid grid-cols-3 gap-2">
                {keys.map((row, rowIndex) => (
                  row.map((key, keyIndex) => (
                    <button
                      key={`${rowIndex}-${keyIndex}`}
                      onClick={() => handleKeyPress(key)}
                      className={cn(
                        "h-16 sm:h-14 rounded-2xl text-2xl font-semibold transition-all active:scale-95",
                        key === 'backspace' || key === 'clear'
                          ? "bg-foreground/10 text-foreground/70 hover:bg-foreground/20 active:bg-foreground/30"
                          : "bg-foreground/5 text-foreground hover:bg-foreground/10 active:bg-foreground/20"
                      )}
                    >
                      {key === 'backspace' ? (
                        <Delete className="w-6 h-6 mx-auto" />
                      ) : key === 'clear' ? (
                        <span className="text-base">C</span>
                      ) : (
                        key
                      )}
                    </button>
                  ))
                ))}
              </div>

              {/* Done Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={handleDone}
                  className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-semibold flex items-center justify-center gap-2 hover:bg-card/90 active:bg-foreground/80 transition-all active:scale-[0.98]"
                >
                  <Check className="w-5 h-5" />
                  Done
                </button>
              </div>

              {/* Safe area for mobile */}
              <div className="h-6 sm:hidden" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

