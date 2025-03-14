import { useState, useEffect } from "react";

export function useWikipediaInfo(artistName: string | undefined) {
  const [wikiInfo, setWikiInfo] = useState<{
    description: string | null;
    url: string | null;
  }>({
    description: null,
    url: null,
  });

  useEffect(() => {
    async function fetchWikiInfo() {
      if (!artistName) return;

      try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          artistName
        )}&format=json&origin=*`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.query.search.length > 0) {
          const pageTitle = searchData.query.search[0].title;
          const contentUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            pageTitle
          )}`;
          const contentResponse = await fetch(contentUrl);
          const contentData = await contentResponse.json();

          setWikiInfo({
            description: contentData.extract,
            url: contentData.content_urls?.desktop?.page || null,
          });
        }
      } catch (error) {
        console.error("Error fetching Wikipedia data:", error);
      }
    }

    fetchWikiInfo();
  }, [artistName]);

  return wikiInfo;
}
