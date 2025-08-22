import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RoomProvider } from './context/RoomContext.tsx'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import { Home } from './pages/Home.tsx'
import { Room } from './pages/Room.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <RoomProvider>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/room/:roomId" element={<Room/>}/>
     
    </Routes>
    </RoomProvider>
    </BrowserRouter>
  </StrictMode>,
)
