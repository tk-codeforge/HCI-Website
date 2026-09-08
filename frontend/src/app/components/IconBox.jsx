import Image from "next/image";

const IconBox = (props) => {
  return (
    <div>
      <div className="box d-flex me-2">
        <div className="align-self-center"> 
          <Image
            src={props.iconUrl || "/images/default-icon.png"}
            alt={props.iconAlt || props.iconDescription || "Feature Icon"} // 🌟 SEO FIX
            width={props.iconWidth || 70}
            height={props.iconWidth || 70}
            className="me-2"
          />
        </div>
        <div className="align-self-center"> 
          <p className={props.descr}>{props.iconDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default IconBox;