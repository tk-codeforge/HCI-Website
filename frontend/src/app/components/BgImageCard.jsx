import { FaStar } from "react-icons/fa6";

const BgImageCard = ({
  cardLinkTag,
  designerCardBgDiv,
  style, 
  titleBgImage,
  descriptionBg,
  ratingBg,
  buttonShareBg,
  buttonCommentBg,
}) => {
  return (
    <>
   {/* 🌟 SEO FIX: Added aria-label to wrapper link */}
   <a href={cardLinkTag} aria-label={titleBgImage ? `View design details for ${titleBgImage}` : "View design details"}>
   <div 
      style={{ 
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat", 
        ...style 
      }} 
      className={designerCardBgDiv}
    >
      <div>
        <h5 className="text-light-force">{titleBgImage}</h5>
        <p className="text-white mb-0">{descriptionBg}</p>
      </div>

      <div>
        <p className="mb-0 text-white">
          {ratingBg}
        </p>
        <div className="d-flex">
          {/* 🌟 SEO FIX: Added descriptive aria-labels for utility links */}
          <span className="pe-3" aria-label="Share this design">
            {buttonShareBg}
          </span>
          <span aria-label="Comment on this design">{buttonCommentBg}</span>
        </div>
      </div>
    </div>
   </a>
    </>
  );
};

export default BgImageCard;