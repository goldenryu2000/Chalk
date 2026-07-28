import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Dashboard } from './routes/Dashboard'
import { Generate } from './routes/Generate'
import { Landing } from './routes/Landing'
import { Play } from './routes/Play'
import { Present } from './routes/Present'
import { Results } from './routes/Results'
import { Review } from './routes/Review'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/review" element={<Review />} />
        <Route path="/present" element={<Present />} />
        <Route path="/play" element={<Play />} />
        <Route path="/results" element={<Results />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
