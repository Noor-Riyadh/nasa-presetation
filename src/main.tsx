import { createRoot } from 'react-dom/client'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource/inter-tight/400.css'
import '@fontsource/inter-tight/600.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/ibm-plex-sans-arabic/400.css'
import '@fontsource/ibm-plex-sans-arabic/600.css'
import './styles.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(<App />)
