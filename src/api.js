const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY
const LLM_ENDPOINT = import.meta.env.VITE_LLM_ENDPOINT

const withKey = (url) => {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}api_key=${encodeURIComponent(TMDB_KEY)}`
}

export const imgUrl = (path, size = 'w500') =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null

export async function searchTMDB(query, { signal } = {}) {
  if (!TMDB_KEY) throw new Error('Missing TMDB API key');

  const url = withKey(
    `${TMDB_BASE}/search/multi?include_adult=false&language=en-US&query=${encodeURIComponent(query)}`
  );

  console.log("Fetching:", url);

  const res = await fetch(url, { signal });

  if (!res.ok) {
    const errText = await res.text();
    console.error("TMDB error response:", errText);
    throw new Error(`Failed to fetch TMDB search: ${res.status}`);
  }

  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return (data.results || [])
      .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
      .map((r) => ({
        id: r.id,
        media_type: r.media_type,
        title: r.title || r.name,
        name: r.name,
        poster_path: r.poster_path,
        backdrop_path: r.backdrop_path,
        overview: r.overview,
        release_date: r.release_date || r.first_air_date,
        vote_average: r.vote_average ?? null,
      }));
  } catch (e) {
    console.error("Invalid JSON from TMDB:", text);
    throw e;
  }
}


export async function getDetails(mediaType, id, { signal } = {}) {
  if (!TMDB_KEY) throw new Error('Missing TMDB API key')
  const url = withKey(
      `${TMDB_BASE}/${mediaType}/${id}?language=en-US&append_to_response=images,credits,videos`
  )
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error('Failed to fetch details')
  return res.json()
}

export async function getWatchProviders(mediaType, id, { signal } = {}) {
  if (!TMDB_KEY) throw new Error('Missing TMDB API key')
  const url = withKey(`${TMDB_BASE}/${mediaType}/${id}/watch/providers`)
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error('Failed to fetch watch providers')
  return res.json()
}

export async function askLLMAboutTitle(title, { signal } = {}) {
  if (!LLM_ENDPOINT) {
    return {
      answer:
          `No LLM endpoint configured. Configure VITE_LLM_ENDPOINT to enable this feature.\n\nRequested title: ${title}`,
    }
  }
  const res = await fetch(LLM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `What should I know about the title "${title}"? Keep it concise for a quick read.`,
    }),
    signal,
  })
  if (!res.ok) {
    return { answer: `LLM request failed (${res.status}). Try again later.` }
  }
  const data = await res.json()
  // Expecting { answer: string }
  return data
}