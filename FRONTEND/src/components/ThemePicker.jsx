import React, { useState, useEffect } from 'react'
import { themes, applyTheme, loadSavedTheme } from '../styles/themes'

const PaletteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
)

const ThemePicker = () => {
  const [active, setActive] = useState('ocean')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = loadSavedTheme()
    setActive(saved)
  }, [])

  const handleSelect = (key) => {
    applyTheme(key)
    setActive(key)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        title="Themes"
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 4, padding: '12px', borderRadius: 12, border: 'none',
          cursor: 'pointer', width: '100%',
          background: open ? 'var(--cur-hover)' : 'transparent',
          color: 'var(--cur-muted)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--cur-hover)'}
        onMouseLeave={e => e.currentTarget.style.background = open ? 'var(--cur-hover)' : 'transparent'}
      >
        <PaletteIcon />
      </button>

      {open && (
        <div style={{
          position: 'fixed', left: 88, bottom: 24,
          background: 'var(--cur-card, #1c2333)',
          border: '1px solid var(--cur-border, #30363d)',
          color: 'var(--cur-text, #e6edf3)',
          borderRadius: 16, padding: 16, width: 220,
          zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <p style={{ fontSize: 12, color: 'var(--cur-muted)', marginBottom: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Theme
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, border: 'none',
                  cursor: 'pointer', width: '100%', textAlign: 'left',
                  background: active === key ? 'var(--cur-accent)' : 'transparent',
                  color: active === key ? '#fff' : 'var(--cur-text)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (active !== key) e.currentTarget.style.background = 'var(--cur-hover)' }}
                onMouseLeave={e => { if (active !== key) e.currentTarget.style.background = 'transparent' }}
              >
                {/* Color preview dots */}
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  {[theme.vars['--accent'], theme.vars['--bg-card'], theme.vars['--text-secondary']].map((c, i) => (
                    <div key={i} style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: c, border: '1px solid rgba(255,255,255,0.15)'
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 14 }}>{theme.icon} {theme.name}</span>
                {active === key && (
                  <span style={{ marginLeft: 'auto', fontSize: 16 }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ThemePicker