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
