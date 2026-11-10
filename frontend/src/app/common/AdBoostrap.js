// "use client";

// import { useEffect } from "react";

// export default function AddBootstrap()
// {
//     useEffect(()=>{
//         import( "bootstrap/dist/js/bootstrap.bundle.js")
//     },[])
//     return <></>
// }



"use client";

import { useEffect } from "react";

// Bootstrap's JS bundle (~80 KB to parse) is not needed for the first paint, but it was
// being imported right after hydration on every page. It now loads once the page has
// finished loading and the browser is idle.
//
// Nothing is lost if a visitor is faster: the moment they press (or tap) a Bootstrap
// control (data-bs-toggle / data-bs-dismiss) loading starts immediately, that click is held,
// and it is replayed as soon as Bootstrap is ready - so the navbar toggler, the FAQ
// accordion, modals etc. behave exactly as before.
const CONTROL_SELECTOR = "[data-bs-toggle],[data-bs-dismiss]";

export default function AddBootstrap() {
  useEffect(() => {
    let started = false;
    let loaded = false;
    let pendingControl = null;
    let idleId = null;
    let timerId = null;

    const findControl = (event) =>
      event.target instanceof Element ? event.target.closest(CONTROL_SELECTOR) : null;

    const removeGuards = () => {
      document.removeEventListener("pointerdown", onEarlyPress, true);
      document.removeEventListener("click", onEarlyClick, true);
    };

    const start = () => {
      if (started) return;
      started = true;
      import("bootstrap/dist/js/bootstrap.bundle.js")
        .then(() => {
          loaded = true;
          removeGuards();
          if (pendingControl) {
            const control = pendingControl;
            pendingControl = null;
            if (control.isConnected) control.click(); // replay the held click
          }
        })
        .catch((error) => {
          console.error("Bootstrap failed to load:", error);
          started = false;
          removeGuards(); // never swallow clicks if the bundle is unavailable
        });
    };

    // Press happens ~100 ms before the click: start downloading right away.
    const onEarlyPress = (event) => {
      if (!loaded && findControl(event)) start();
    };

    const onEarlyClick = (event) => {
      if (loaded) return;
      const control = findControl(event);
      if (!control) return;
      event.preventDefault();
      pendingControl = control;
      start();
    };

    document.addEventListener("pointerdown", onEarlyPress, true);
    document.addEventListener("click", onEarlyClick, true);

    const schedule = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(start, { timeout: 3000 });
      } else {
        timerId = window.setTimeout(start, 2000);
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      removeGuards();
      if (idleId !== null && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      if (timerId !== null) window.clearTimeout(timerId);
    };
  }, []);

  return null;
}