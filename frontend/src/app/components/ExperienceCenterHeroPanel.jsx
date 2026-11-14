import {
  buildDirectionsHref,
  hoursLines,
  normalizeMapEmbedUrl,
  safeLink,
  safeTag,
  toTelHref,
} from "@/utils/noidaCenterSettings";

// Location block for the experience-center pages (Noida, Gurugram, Faridabad, Noida Extension, New Delhi),
// shown just BELOW the video:
// info card (H1, address, opening hours, CTAs) and map card side by side, same size, same row.
// Everything except the H1 is optional and only renders when it is filled in the CMS.
// All CSS is scoped under .hci-noida-* so no other page is affected.

const css = `
.hci-noida-panel{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:stretch;max-width:1320px;margin:0 auto;padding:24px 16px}
.hci-noida-panel--single{grid-template-columns:1fr}
.hci-noida-card{background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.12);border:1px solid #f0e6df;min-height:340px;display:flex;flex-direction:column;min-width:0}
.hci-noida-card--info{padding:24px;justify-content:center}
.hci-noida-card--map{overflow:hidden}
.hci-noida-card--map iframe{display:block;width:100%;height:100%;flex:1 1 auto;min-height:340px;border:0}
.hci-noida-card .hci-noida-h1{font-size:1.75rem;line-height:1.25;margin:0 0 12px;color:#222}
.hci-noida-addr{margin:0 0 12px;color:#444}
.hci-noida-hours{list-style:none;margin:0 0 16px;padding:0;color:#444;font-size:.95rem}
.hci-noida-hours-title{font-weight:600;margin:0 0 4px;font-size:.95rem;color:#222}
.hci-noida-cta{display:flex;flex-wrap:wrap;gap:10px}
.hci-noida-cta a{display:inline-block;padding:10px 18px;border-radius:50px;font-weight:600;text-decoration:none;font-size:.95rem;border:2px solid #ff914d}
.hci-noida-cta .primary{background:#ff914d;color:#fff}
.hci-noida-cta .ghost{background:#fff;color:#ff914d}
@media (max-width:991px){
  .hci-noida-panel{grid-template-columns:1fr}
  .hci-noida-card{min-height:0}
  .hci-noida-card--map iframe{min-height:300px}
}
`;

export default function ExperienceCenterHeroPanel({ hero, centerName = "" }) {
  const lines = hoursLines(hero?.hours);
  const mapSrc = normalizeMapEmbedUrl(hero?.mapEmbedUrl);
  const tel = toTelHref(hero?.phone);
  const directions = buildDirectionsHref(hero);
  const bookUrl = safeLink(hero?.bookVisitUrl, "/contact");
  const HeadingTag = safeTag(hero?.h1Tag, "h1");

  return (
    <div className={`hci-noida-panel${mapSrc ? "" : " hci-noida-panel--single"}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="hci-noida-card hci-noida-card--info">
        <HeadingTag className="hci-noida-h1">{hero?.h1}</HeadingTag>
        {hero?.address ? (
          <address className="hci-noida-addr" style={{ fontStyle: "normal" }}>
            {hero.address}
          </address>
        ) : null}
        {lines.length > 0 && (
          <>
            <p className="hci-noida-hours-title">Opening Hours</p>
            <ul className="hci-noida-hours">
              {lines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </>
        )}
        <div className="hci-noida-cta">
          {tel && (
            <a className="primary" href={tel}>
              {hero?.callLabel}
            </a>
          )}
          <a className="ghost" href={directions} target="_blank" rel="noopener noreferrer">
            {hero?.directionsLabel}
          </a>
          <a className="primary" href={bookUrl}>
            {hero?.bookVisitLabel}
          </a>
        </div>
      </div>
      {mapSrc && (
        <div className="hci-noida-card hci-noida-card--map">
          <iframe
            src={mapSrc}
            title={`HCI Experience Center ${centerName} location map`.replace(/\s+/g, " ")}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
