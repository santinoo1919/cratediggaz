import axios from "axios";
import { encode as base64Encode } from "base-64";
import { showNotification } from "@/hooks/notifications";

const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET;
const SPOTIFY_API = "https://api.spotify.com/v1";
const TOKEN_API = "https://accounts.spotify.com/api/token";
const MAX_RETRIES = 3;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ensureHttps = (url: string) => {
  return url ? url.replace("http://", "https://") : url;
};

export const processAlbumData = (album: any) => {
  return {
    ...album,
    images: album.images.map((img: any) => ({
      ...img,
      url: ensureHttps(img.url),
    })),
  };
};

// Get client credentials token
export const getSpotifyToken = async () => {
  try {
    const auth = base64Encode(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
    const response = await axios.post(
      TOKEN_API,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting Spotify token:", error);
    return null;
  }
};

// Search for albums with retry logic
export async function searchAlbums(query: string = "genre:funk") {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const token = await getSpotifyToken();
      if (!token) return [];

      const response = await fetch(
        `${SPOTIFY_API}/search?q=${encodeURIComponent(
          query
        )}&type=album&market=US&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After") || "1";
        showNotification.rateLimitHit(retryAfter, retries, MAX_RETRIES);
        await delay(parseInt(retryAfter) * 1000);
        retries++;
        continue;
      }

      if (!response.ok) {
        showNotification.error("Failed to fetch albums");
        throw new Error("Failed to fetch albums");
      }

      const data = await response.json();
      return data.albums.items.map((album: any) => ({
        id: album.id,
        images: album.images,
        name: album.name,
        release_date: album.release_date, // Make sure this is included
        popularity: album.popularity,
        artists: album.artists.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
        })),
      }));
    } catch (error) {
      retries++;
      if (retries === MAX_RETRIES) {
        showNotification.error(
          "Could not fetch albums after multiple attempts"
        );
        return [];
      }
      await delay(1000 * retries);
    }
  }
  return [];
}

// Get artist with retry logic
export async function getArtist(token: string, artistId: string) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch(`${SPOTIFY_API}/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After") || "1";
        showNotification.rateLimitHit(retryAfter, retries, MAX_RETRIES);
        await delay(parseInt(retryAfter) * 1000);
        retries++;
        continue;
      }

      if (!response.ok) {
        showNotification.error("Failed to fetch artist");
        throw new Error("Failed to fetch artist");
      }

      return response.json();
    } catch (error) {
      retries++;
      if (retries === MAX_RETRIES) {
        showNotification.error(
          "Could not fetch artist after multiple attempts"
        );
        throw error;
      }
      await delay(1000 * retries);
    }
  }
}

// Get album tracks with retry logic
export async function getAlbumTracks(token: string, albumId: string) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch(`${SPOTIFY_API}/albums/${albumId}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After") || "1";
        showNotification.rateLimitHit(retryAfter, retries, MAX_RETRIES);
        await delay(parseInt(retryAfter) * 1000);
        retries++;
        continue;
      }

      if (!response.ok) {
        showNotification.error("Failed to fetch tracks");
        throw new Error("Failed to fetch tracks");
      }

      return response.json();
    } catch (error) {
      retries++;
      if (retries === MAX_RETRIES) {
        showNotification.error(
          "Could not fetch tracks after multiple attempts"
        );
        throw error;
      }
      await delay(1000 * retries);
    }
  }
}

export async function getRandomPreviewTrack(albumId: string) {
  const token = await getSpotifyToken();
  if (!token) return null;

  const tracks = await getAlbumTracks(token, albumId);
  if (!tracks?.items) return null;

  const tracksWithPreviews = tracks.items.filter(
    (track: { preview_url: string | null }) => track.preview_url
  );

  if (tracksWithPreviews.length === 0) return null;

  return tracksWithPreviews[
    Math.floor(Math.random() * tracksWithPreviews.length)
  ];
}
