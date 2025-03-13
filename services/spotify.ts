import axios from "axios";
import { encode as base64Encode } from "base-64";

const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET;
const SPOTIFY_API = "https://api.spotify.com/v1";
const TOKEN_API = "https://accounts.spotify.com/api/token";

// Get client credentials token (simpler than user auth for just searching)
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

// Search for albums
export async function searchAlbums(query: string = "jazz") {
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

    if (!response.ok) throw new Error("Failed to fetch albums");

    const data = await response.json();
    return data.albums.items;
  } catch (error) {
    console.error("Error searching albums:", error);
    return [];
  }
}

// Get album details
export const getAlbumDetails = async (token: string, albumId: string) => {
  try {
    const response = await axios.get(`${SPOTIFY_API}/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting album details:", error);
    return null;
  }
};

export async function getArtist(token: string, artistId: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch artist");
  }

  return response.json();
}

export async function getAlbumTracks(token: string, albumId: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch album tracks");
  }

  return response.json();
}

export async function getRandomPreviewTrack(albumId: string) {
  const token = await getSpotifyToken();
  if (!token) return null;

  const tracks = await getAlbumTracks(token, albumId);
  const tracksWithPreviews = tracks.items.filter(
    (track: { preview_url: string | null }) => track.preview_url
  );

  if (tracksWithPreviews.length === 0) return null;

  return tracksWithPreviews[
    Math.floor(Math.random() * tracksWithPreviews.length)
  ];
}
