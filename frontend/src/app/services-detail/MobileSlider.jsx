"use client";
// Wraps a horizontally scrolling mobile slider and adds small dot indicators (mobile only).
// Put next to the city page, e.g. src/app/services-detail/MobileSlider.jsx
// (the CSS module goes in the same folder).
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MobileSlider.module.css";

export default function MobileSlider({ className = "", children, label = "Slider", ...rest }) {
    const ref = useRef(null);
    const frame = useRef(0);
    const [count, setCount] = useState(0);
    const [active, setActive] = useState(0);

    const measure = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        const slides = Array.from(el.children);
        setCount(slides.length);
        const max = el.scrollWidth - el.clientWidth;
        if (max <= 2) { setActive(0); return; }
        if (el.scrollLeft >= max - 2) { setActive(slides.length - 1); return; }
        const box = el.getBoundingClientRect();
        const middle = box.left + box.width / 2;
        let best = 0;
        let bestDistance = Infinity;
        slides.forEach((slide, index) => {
            const rect = slide.getBoundingClientRect();
            const distance = Math.abs(rect.left + rect.width / 2 - middle);
            if (distance < bestDistance) { bestDistance = distance; best = index; }
        });
        setActive(best);
    }, []);

    const onScroll = () => {
        if (frame.current) cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(measure);
    };

    useEffect(() => {
        measure();
        const el = ref.current;
        let observer;
        if (el && typeof ResizeObserver !== "undefined") {
            observer = new ResizeObserver(measure);
            observer.observe(el);
        }
        window.addEventListener("resize", measure);
        return () => {
            if (observer) observer.disconnect();
            window.removeEventListener("resize", measure);
            if (frame.current) cancelAnimationFrame(frame.current);
        };
    }, [measure, children]);

    const goTo = (index) => {
        const el = ref.current;
        const slide = el && el.children[index];
        if (!slide) return;
        const left = slide.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft - (el.clientWidth - slide.clientWidth) / 2;
        el.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    };

    return (
        <div className={styles.shell}>
            <div ref={ref} className={className} onScroll={onScroll} {...rest}>{children}</div>
            {count > 1 && (
                <div className={styles.dots} role="group" aria-label={`${label} slides`}>
                    {Array.from({ length: count }, (_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`${styles.dot} ${index === active ? styles.active : ""}`}
                            aria-label={`Go to slide ${index + 1} of ${count}`}
                            aria-current={index === active ? "true" : undefined}
                            onClick={() => goTo(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
