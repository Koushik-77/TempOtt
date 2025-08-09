// pages/HomePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchTMDB, imgUrl } from "../api";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    const movies = await searchTMDB(query);
    setResults(movies);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">🎬 Movie Explorer</h1>
      <form onSubmit={handleSearch} className="flex justify-center mb-8">
        <input
          type="text"
          className="w-96 p-3 rounded-l-lg bg-gray-800 text-white focus:outline-none"
          placeholder="Search movies or series..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-r-lg transition"
          type="submit"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-center">
        {results.map((movie) => (
          <div
            key={movie.id}
            onClick={() => navigate(`/details/${movie.media_type}/${movie.id}`)}
            className="cursor-pointer transform hover:scale-105 hover:shadow-lg transition relative border border-gray-700 rounded-lg overflow-hidden"
          >
            <img
              src={imgUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full h-80 object-cover"
            />
            <div className="absolute bottom-0 bg-gradient-to-t from-black via-transparent to-transparent p-3 w-full">
              <h2 className="text-lg font-semibold">{movie.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
