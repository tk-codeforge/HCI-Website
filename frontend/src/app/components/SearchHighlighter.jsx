"use client";
import { useEffect } from "react";

// Reads ?highlight=<text> from the URL (set by the admin search bar), waits for
// the page's table rows to load, then scrolls to the matching row and highlights it.
const CLASS = "hc-search-highlight";

const SearchHighlighter = () => {
    useEffect(() => {
        const term = new URLSearchParams(window.location.search).get("highlight");
        if (!term) return;

        const needle = term.trim().toLowerCase();
        let done = false;
        let observer;
        let timers = [];

        const findRows = () => {
            const rows = Array.from(document.querySelectorAll("tbody tr"));
            // 1) prefer a row that has a cell exactly equal to the URL
            const exact = rows.filter((tr) =>
                Array.from(tr.children).some((td) => td.textContent.trim().toLowerCase() === needle)
            );
            if (exact.length) return exact;
            // 2) otherwise any row containing it
            return rows.filter((tr) => tr.textContent.toLowerCase().includes(needle));
        };

        const clear = () => {
            document.querySelectorAll(`.${CLASS}`).forEach((el) => el.classList.remove(CLASS));
            document.removeEventListener("mousedown", clear);
        };

        const tryHighlight = () => {
            if (done) return;
            const rows = findRows();
            if (!rows.length) return;
            done = true;
            observer?.disconnect();
            rows.forEach((tr) => tr.classList.add(CLASS));
            rows[0].scrollIntoView({ behavior: "smooth", block: "center" });
            document.addEventListener("mousedown", clear);
            timers.push(setTimeout(clear, 15000));
        };

        tryHighlight();
        if (!done) {
            observer = new MutationObserver(tryHighlight);
            observer.observe(document.body, { childList: true, subtree: true });
            timers.push(setTimeout(() => observer?.disconnect(), 10000)); // stop waiting after 10s
        }

        return () => {
            observer?.disconnect();
            timers.forEach(clearTimeout);
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
