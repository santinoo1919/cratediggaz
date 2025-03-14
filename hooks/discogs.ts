export async function searchDiscogsRelease(
  artistName: string,
  albumName: string
) {
  try {
    // First, search for the release
    const searchResponse = await fetch(
      `https://api.discogs.com/database/search?type=release&artist=${encodeURIComponent(
        artistName
      )}&release_title=${encodeURIComponent(albumName)}`,
      {
        headers: {
          Authorization: `Discogs token=${process.env.EXPO_PUBLIC_DISCOGS_TOKEN}`,
          "User-Agent": "CratediggaApp/1.0",
        },
      }
    );

    const searchData = await searchResponse.json();
    const releaseId = searchData.results?.[0]?.id;
    console.log("Search data:", searchData.results?.[0]);

    if (releaseId) {
      // Get release info
      const releaseResponse = await fetch(
        `https://api.discogs.com/releases/${releaseId}`,
        {
          headers: {
            Authorization: `Discogs token=${process.env.EXPO_PUBLIC_DISCOGS_TOKEN}`,
            "User-Agent": "CratediggaApp/1.0",
          },
        }
      );

      const releaseData = await releaseResponse.json();
      console.log("Release data:", releaseData);

      return {
        url: `https://www.discogs.com/sell/release/${releaseId}`,
        thumbnail: searchData.results[0].thumb,
        // Just return the lowest_price if available
        price: releaseData.lowest_price,
        currency: "USD",
      };
    }
    return null;
  } catch (error) {
    console.error("Error searching Discogs:", error);
    return null;
  }
}
