"use client";
import React, { useEffect, useState } from "react";
import { GetListByKeyword } from "youtube-search-api";

const YouTubeEmbed = ({ songTitle, artistName }) => {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const query = `${songTitle} ${artistName} official`;
        const results = await GetListByKeyword(query, false, 1);
        const id = results.items[0]?.id;
        if (id) {
          setVideoId(id);
        } else {
          setError("No video found.");
        }
      } catch (err) {
        setError("Error fetching video.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [songTitle, artistName]);

  if (loading) return <p>Loading video...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="youtube-embed">
      <iframe
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
