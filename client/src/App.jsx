import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoutes from './routes/AppRoutes';
import { Toaster } from "./components/ui/toaster";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  )
}

export default App
