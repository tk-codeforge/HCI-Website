import React from "react";
import { canOptimize, optimizedUrl, optimizedSrcSet } from "@/utils/optimizedImage";

const RoomOfice = (props) => {
  const safeArrowAlt = props.altArrow?.trim() ? props.altArrow : "View design details";
  const safeMainAlt = props.altImage?.trim() ? props.altImage : (props.cardTitle || "Interior Room Design");

  const mainSrc = props.imageRoom_Office;
  const optimizable = mainSrc ? canOptimize(mainSrc) : false;

  return (
    <div>
      <div className={props.cardRoomOffice}>
        <span className={props.badge_circle}>
          <img
            src={props.arrowIcon}
            alt={safeArrowAlt}
            width={props.width}
            loading="eager"
            data-no-lazy="1"
            decoding="async"
          />
        </span>
        <img
          src={optimizable ? optimizedUrl(mainSrc, 1080) : mainSrc}
          srcSet={optimizable ? optimizedSrcSet(mainSrc) : undefined}
          sizes={optimizable ? "(min-width: 992px) 50vw, 100vw" : undefined}
          className={`responsive-media ${props.roomImg || ""}`}
          alt={safeMainAlt}
          width={1200}
          height={800}
          loading="eager"
          data-no-lazy="1"
          decoding="async"
        />
        <div className={props.cardBody}>
          <h5 className="">{props.cardTitle}</h5>
          <p className="text-white me-5 pe-5">{props.cardText}</p>
          <div className="text-end mt-3 mt-lg-5 mb-2">
            <a className={props.btnClass} href={props.btnLink} aria-label={`${props.btnText} - ${props.cardTitle || 'Room Design'}`}>
              {props.btnText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomOfice;
