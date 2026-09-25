import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { BottomTabs } from './components/shared/BottomTabs'
import { TopBar } from './components/shared/TopBar'
import { Editor } from './pages/Editor'
import { Library } from './pages/Library'
import { Roster } from './pages/Roster'

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-surface">
        <TopBar className="hidden md:flex" />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Editor />} />
            <Route path="/roster" element={<Roster />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </main>
        <BottomTabs className="flex md:hidden" />
      </div>
    </BrowserRouter>
  )
}

export default App
