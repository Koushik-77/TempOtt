// src/pages/MovieDetails.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getDetails, getWatchProviders, askLLMAboutTitle, imgUrl } from '../api'

export default function MovieDetails() {
  const { mediaType, id } = useParams()
  const navigate = useNavigate()

  const [movie, setMovie] = useState(null)
  const [providers, setProviders] = useState([])
  const [llmInfo, setLlmInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abortCtrl = new AbortController()

    async function fetchData() {
      try {
        const details = await getDetails(mediaType, id, { signal: abortCtrl.signal })
        setMovie(details)

        const wp = await getWatchProviders(mediaType, id, { signal: abortCtrl.signal })
        const usProviders = wp.results?.US?.flatrate || []
        setProviders(usProviders)

        const llm = await askLLMAboutTitle(details.title || details.name, { signal: abortCtrl.signal })
        setLlmInfo(llm.answer)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => abortCtrl.abort()
  }, [mediaType, id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black text-white">
        <p>Movie not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
        >
          Back
        </button>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage: movie.backdrop_path
          ? `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.95)), url(${imgUrl(movie.backdrop_path, 'original')})`
          : 'black',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="p-6 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 mb-6 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg transition-all duration-300 hover:scale-105"
        >
          ⬅ Back
        </button>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="shadow-xl rounded-xl overflow-hidden border border-gray-800 hover:scale-105 transition-transform duration-300">
            <img
              src={imgUrl(movie.poster_path, 'w500')}
              alt={movie.title || movie.name}
              className="w-full"
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <h1 className="text-4xl font-bold">{movie.title || movie.name}</h1>
            <p className="text-gray-300 italic">{movie.tagline}</p>
            <p className="text-gray-200">{movie.overview}</p>

            <div className="text-sm text-gray-400 space-y-1">
              <p><strong>Release Date:</strong> {movie.release_date || movie.first_air_date}</p>
              <p><strong>Rating:</strong> ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</p>
              <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(', ')}</p>
            </div>

            {llmInfo && (
              <div className="mt-4 p-4 bg-gray-900 border border-gray-800 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Quick AI Insight</h2>
                <p className="text-gray-300">{llmInfo}</p>
              </div>
            )}

            {providers.length > 0 && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">Streaming on</h2>
                <div className="flex gap-3">
                  {providers.map((p) => (
                    <img
                      key={p.provider_id}
                      src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                      alt={p.provider_name}
                      className="rounded-lg border border-gray-700 p-1 bg-gray-800 hover:scale-110 transition-transform duration-300"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
