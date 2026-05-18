export const themes = {
  ocean: {
    name: 'Ocean Blue', icon: '🌊',
    vars: {
      '--cur-bg': '#0d1117',
      '--cur-card': '#1c2333',
      '--cur-hover': '#21262d',
      '--cur-text': '#e6edf3',
      '--cur-muted': '#8b949e',
      '--cur-accent': '#388bfd',
      '--cur-border': '#30363d',
      '--cur-sidebar': '#0d1117',
    }
  },
  sunset: {
    name: 'Sunset', icon: '🌅',
    vars: {
      '--cur-bg': '#1a0a00',
      '--cur-card': '#3d1f00',
      '--cur-hover': '#4a2800',
      '--cur-text': '#fde8d0',
      '--cur-muted': '#c9956a',
      '--cur-accent': '#ff6b35',
      '--cur-border': '#5a3010',
      '--cur-sidebar': '#1a0a00',
    }
  },
  forest: {
    name: 'Forest', icon: '🌿',
    vars: {
      '--cur-bg': '#0a1a0a',
      '--cur-card': '#163516',
      '--cur-hover': '#1a3d1a',
      '--cur-text': '#d4edda',
      '--cur-muted': '#7ab87a',
      '--cur-accent': '#3fb950',
      '--cur-border': '#2a5a2a',
      '--cur-sidebar': '#0a1a0a',
    }
  },
  lavender: {
    name: 'Lavender', icon: '💜',
    vars: {
      '--cur-bg': '#0e0a1a',
      '--cur-card': '#231545',
      '--cur-hover': '#2a1a52',
      '--cur-text': '#e8deff',
      '--cur-muted': '#9b8ec4',
      '--cur-accent': '#8957e5',
      '--cur-border': '#3d2a7a',
      '--cur-sidebar': '#0e0a1a',
    }
  },
  light: {
    name: 'Light', icon: '☀️',
    vars: {
      '--cur-bg': '#f6f8fa',
      '--cur-card': '#ffffff',
      '--cur-hover': '#f0f2f5',
      '--cur-text': '#1a1a2e',
      '--cur-muted': '#57606a',
      '--cur-accent': '#0969da',
      '--cur-border': '#d0d7de',
      '--cur-sidebar': '#f6f8fa',
    }
  },
  rose: {
    name: 'Rose', icon: '🌸',
    vars: {
      '--cur-bg': '#1a0a10',
      '--cur-card': '#3d1525',
      '--cur-hover': '#4a1a2e',
      '--cur-text': '#fde0ec',
      '--cur-muted': '#c47a95',
      '--cur-accent': '#e5537a',
      '--cur-border': '#6b1f3a',
      '--cur-sidebar': '#1a0a10',
    }
  },
}

export const applyTheme = (themeKey) => {
  const theme = themes[themeKey]
  if (!theme) return
  Object.entries(theme.vars).forEach(([key, val]) => {
    document.documentElement.style.setProperty(key, val)
  })
  localStorage.setItem('app-theme', themeKey)
}

export const loadSavedTheme = () => {
  const saved = localStorage.getItem('app-theme') || 'light'
  applyTheme(saved)
  return saved
}