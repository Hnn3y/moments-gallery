import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import UploadPage from './pages/UploadPage'
import GalleryPage from './pages/GalleryPage'

// Page transition wrapper component
function PageTransition({ children }) {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/upload" replace />} />
      <Route 
        path="/upload" 
        element={
          <PageTransition>
            <UploadPage />
          </PageTransition>
        } 
      />
      <Route 
        path="/gallery" 
        element={
          <PageTransition>
            <GalleryPage />
          </PageTransition>
        } 
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  )
}

export default App