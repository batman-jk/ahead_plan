import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AheadPlan from './ahead-b2c'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AheadPlan />
  </StrictMode>,
)
