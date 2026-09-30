// Tipografías locales, solo alfabeto latino y los pesos que usa el sitio. Antes
// venían de Google Fonts, que recibe la IP de cada visita (Ley 21.719).
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/sora/latin-600.css";
import "@fontsource/sora/latin-700.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@fontsource/jetbrains-mono/latin-600.css";
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Tras cada deploy los chunks cambian de nombre; si una pestaña vieja intenta
// cargar un módulo que ya no existe, recargamos para tomar la versión nueva
// (evita el error "Failed to fetch dynamically imported module").
window.addEventListener('vite:preloadError', (e) => {
  e.preventDefault()
  window.location.reload()
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
