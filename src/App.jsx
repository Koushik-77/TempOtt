import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MovieDetails from './components/MovieDetails'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:mediaType/:id" element={<MovieDetails />} />
    </Routes>
  )
}
