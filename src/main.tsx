import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted fonts: Playfair (display serif with optical sizes) + Jost (body).
// To swap fonts, change these imports and --font-display / --font-sans in index.css.
import '@fontsource-variable/playfair/opsz.css'
import '@fontsource-variable/playfair/opsz-italic.css'
import '@fontsource-variable/jost/wght.css'
import './index.css'
import App from './App'
import { applyHead, applyTheme } from './lib/site'

// Colors, page titles and meta tags all come from src/content.ts.
applyTheme()
applyHead()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
