// "use client";
// import React, { useState } from "react";

// const VideoThumbnail = ({ videoUrl, imageUrl }) => {
//   const [isPlaying, setIsPlaying] = useState(false);

//   const handlePlay = () => {
//     setIsPlaying(true);
//   };

//   return (
//     <div className="video-thumbnail">
//       {isPlaying ? (
//         <iframe
//           src={videoUrl}
//           title="Video"
//           frameBorder="0"
//           allow="autoplay; encrypted-media"
//           allowFullScreen
//           className="video-frame"
//         ></iframe>
//       ) : (
//         <button
//           type="button"
//           onClick={handlePlay}
//           className="thumbnail-button"
//           aria-label="Play video"
//         >
//           <img
//             src={imageUrl || "/images/default-thumbnail.jpg"}
//             alt=""
//             className="thumbnail-image"
//             loading="lazy"
//             decoding="async"
//           />
//           <span className="play-button">
//             <img
//               src="/images/circle_play.png"
//               alt=""
//               className="play-icon"
//               loading="lazy"
//               decoding="async"
//             />
//           </span>
//         </button>
//       )}
//       <style jsx>{`
//         .video-thumbnail {
//           position: relative;
//           width: 100%;
//           margin: 0 auto;
//           aspect-ratio: 16 / 9;
//           min-height: 220px;
//           border-radius: 15px;
//           overflow: hidden;
//           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
//           background-color: #f3f3f3;
//         }

//         .thumbnail-button {
//           position: relative;
//           width: 100%;
//           height: 100%;
//           padding: 0;
//           border: none;
//           background: none;
//           cursor: pointer;
//         }

//         .thumbnail-image {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           display: block;
//         }

//         .play-button {
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%);
//           background: rgba(255, 255, 255, 0.8);
//           border-radius: 50%;
//           width: clamp(56px, 8vw, 72px);
//           height: clamp(56px, 8vw, 72px);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
//         }

//         .play-icon {
//           width: clamp(24px, 3vw, 32px);
//           height: auto;
//           display: block;
//         }

//         .video-frame {
//           width: 100%;
//           height: 100%;
//           border: none;
//           display: block;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default VideoThumbnail;


"use client";
import React, { useState } from "react";
import Image from "next/image";

// Positioning is set with inline styles (not only in the styled-jsx block below). A next/image
// with `fill` is position:absolute; if its parent is not yet `position:relative` (styled-jsx CSS
// can arrive after the first paint) the picture escapes and covers the whole page for a moment.
const WRAP_STYLE = {
  position: "relative",
  width: "100%",
  aspectRatio: "16 / 9",
  minHeight: 220,
  overflow: "hidden",
  borderRadius: 15,
  backgroundColor: "#f3f3f3",
};

const BUTTON_STYLE = {
  position: "relative",
  display: "block",
  width: "100%",
  height: "100%",
  padding: 0,
  border: "none",
  background: "none",
  cursor: "pointer",
};

const PLAY_STYLE = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 1,
};

const VideoThumbnail = ({ videoUrl, imageUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="video-thumbnail" style={WRAP_STYLE}>
      {isPlaying ? (
        <iframe
          src={videoUrl}
          title="Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="video-frame"
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        ></iframe>
      ) : (
        <button
          type="button"
          onClick={handlePlay}
          className="thumbnail-button"
          aria-label="Play video"
          style={BUTTON_STYLE}
        >
          <Image
            src={imageUrl || "/images/default-thumbnail.jpg"}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={70}
            style={{ objectFit: "cover" }}
          />
          <span className="play-button" style={PLAY_STYLE}>
            <img
              src="/images/circle_play.png"
              alt=""
              className="play-icon"
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
            />
          </span>
        </button>
      )}
      <style jsx>{`
        .video-thumbnail {
          margin: 0 auto;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .play-button {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          width: clamp(56px, 8vw, 72px);
          height: clamp(56px, 8vw, 72px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
        }

        .play-icon {
          width: clamp(24px, 3vw, 32px);
          height: auto;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default VideoThumbnail;
