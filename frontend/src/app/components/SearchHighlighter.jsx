"use client";
import { useEffect } from "react";

// Highlights a table row for a URL picked in the admin search bar.
// Triggered two ways:
//  1) on load, from ?highlight=<text> in the address (coming from another page)
//  2) via the "hc:highlight" window event (picked a result on the SAME page)
const CLASS = "hc-search-highlight";

const SearchHighlighter = () => {
    useEffect(() => {
        let observer;
        let timers = [];

        const clear = () => {
            document.querySelectorAll(`.${CLASS}`).forEach((el) => el.classList.remove(CLASS));
            document.removeEventListener("mousedown", clear);
        };

        const stop = () => {
            observer?.disconnect();
            observer = null;
            timers.forEach(clearTimeout);
            timers = [];
        };

        const run = (term) => {
            stop();
            clear();
            const needle = String(term || "").trim().toLowerCase();
            if (!needle) return;
            let done = false;

            const findRows = () => {
                const rows = Array.from(document.querySelectorAll("tbody tr"));
                const exact = rows.filter((tr) =>
                    Array.from(tr.children).some((td) => td.textContent.trim().toLowerCase() === needle)
                );
                if (exact.length) return exact;
                return rows.filter((tr) => tr.textContent.toLowerCase().includes(needle));
            };

            const tryHighlight = () => {
                if (done) return;
                const rows = findRows();
                if (!rows.length) return;
                done = true;
                observer?.disconnect();
                rows.forEach((tr) => tr.classList.add(CLASS));
                rows[0].scrollIntoView({ behavior: "smooth", block: "center" });
                // small delay so the click that picked the result doesn't clear it
                timers.push(setTimeout(() => document.addEventListener("mousedown", clear), 300));
                timers.push(setTimeout(clear, 15000));
            };

            tryHighlight();
            if (!done) {
                observer = new MutationObserver(tryHighlight);
                observer.observe(document.body, { childList: true, subtree: true });
                timers.push(setTimeout(() => observer?.disconnect(), 10000));
            }
        };

        // 1) arriving from another page
        const initial = new URLSearchParams(window.location.search).get("highlight");
        if (initial) run(initial);

        // 2) picking a result on the page you're already on
        const onEvent = (e) => run(e.detail);
        window.addEventListener("hc:highlight", onEvent);

        return () => {
            window.removeEventListener("hc:highlight", onEvent);
            stop();
            document.removeEventListener("mousedown", clear);
        };
    }, []);

    return (
        <style jsx global>{`
            tr.${CLASS} > td,
            tr.${CLASS} > th {
                background-color: #fff0e0 !important;
                box-shadow: inset 0 0 0 9999px #fff0e0 !important;
                animation: hcPulse 1.2s ease-in-out 3;
            }
            tr.${CLASS} > td:first-child { border-left: 4px solid #ff914d !important; }
            @keyframes hcPulse {
                0%, 100% { filter: none; }
                50% { filter: brightness(0.93); }
            }
        `}</style>
    );
};

export default SearchHighlighter;
