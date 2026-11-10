// "use client"
// import { useState, useEffect } from 'react';

// const Counter = () => {
//     const Counter = ({ start, end, duration }) => {
//         const [count, setCount] = useState(start);
      
//         useEffect(() => {
//           let startTimestamp = null;
//           const step = (timestamp) => {
//             if (!startTimestamp) startTimestamp = timestamp;
//             const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//             setCount(Math.floor(progress * (end - start) + start));
//             if (progress < 1) {
//               window.requestAnimationFrame(step);
//             }
//           };
//           window.requestAnimationFrame(step);
//         }, [start, end, duration]);
      
//   return (
// <div>{count}</div>
//   )
// }
// }
// export default Counter;


"use client";
import { useState, useEffect } from "react";

// The old file declared the real component *inside* an outer component that never returned
// it, so nothing could ever render. This is the intended component, with the animation frame
// cancelled on unmount and state only updated when the number actually changes.
const Counter = ({ start = 0, end = 0, duration = 2000 }) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTimestamp = null;
    let frameId = null;

    const step = (timestamp) => {
      if (startTimestamp === null) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) frameId = window.requestAnimationFrame(step);
    };

    frameId = window.requestAnimationFrame(step);
    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [start, end, duration]);

  return <div>{count}</div>;
};

export default Counter;