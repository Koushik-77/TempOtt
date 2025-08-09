import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    const title = movie.title || movie.name || "Untitled";
    const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/no-movie.png";
    const language = movie.original_language
        ? movie.original_language.toUpperCase()
        : "N/A";
    const year = movie.release_date
        ? movie.release_date.split("-")[0]
        : movie.first_air_date
        ? movie.first_air_date.split("-")[0]
        : "N/A";
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

    return (
        <div
            className="
                movie-card relative overflow-hidden
                transition-all duration-300 ease-out
                hover:scale-105 hover:shadow-xl
                hover:shadow-purple-500/20
                border border-gray-700
                hover:border-purple-400/70
                rounded-2xl group
                mx-auto
                w-[200px]
            "
        >
            <Link to={`/movie/${movie.id}`} target="_blank" rel="noopener noreferrer">
                <div className="overflow-hidden rounded-lg">
                    <img
                        src={poster}
                        alt={title}
                        className="
                            rounded-lg w-full h-auto
                            transition-transform duration-500 ease-out
                            group-hover:scale-110
                        "
                    />
                </div>
            </Link>

            <div className="mt-4 text-center">
                <h3 className="transition-colors duration-300 group-hover:text-purple-300 line-clamp-1">
                    {title}
                </h3>
                <div className="content flex justify-center gap-2">
                    <div className="rating flex items-center gap-1">
                        <img src="star.svg" alt="Star Icon" className="w-4 h-4" />
                        <p>{rating}</p>
                    </div>
                    <span>•</span>
                    <p className="lang">{language}</p>
                    <span>•</span>
                    <p className="year">{year}</p>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
