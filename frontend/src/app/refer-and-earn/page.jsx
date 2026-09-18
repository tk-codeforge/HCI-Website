import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";
import MainLayout from "../layouts/MainLayout";
import BoxIcon from "../components/BoxIcon";

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

async function getBannerData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-gallery-design/manage-banner?key=refer_and_earn`, {
      cache: "no-store",
      headers: { Connection: "close" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Banner Fetch Error:", err);
    return null;
  }
}

async function getPageContent() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/refer_and_earn`, {
      cache: "no-store",
      headers: { Connection: "close" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Page Content Fetch Error:", err);
    return null;
  }
}

export const metadata = {
  title: "Refer & Earn - High Creation Interior",
  description:
    "Refer & Earn - High Creation Interior",
};
// const ReferEarn = () => {
export default async function ReferEarn() {
  const bannerRecord = await getBannerData();
  const pageRecord = await getPageContent();
  const bgHeading = bannerRecord?.banner_heading || "Refer & Earn";
const bgDescription = bannerRecord?.banner_description || "Get all the information you need";

const contentData = pageRecord?.json_content || {};

  const HeadingTag = contentData.main_heading_tag || "h2";
  const mainHeading = contentData.main_heading || "High Creation Interior";
  const mainDescription = contentData.main_description || "";
  const mainDescriptionFontSize = contentData.main_description_font_size || 16;

  // Handle both the legacy root array and the new wrapped object layout
  const iconItems = Array.isArray(contentData.cards) && contentData.cards.length > 0 
    ? contentData.cards 
    : Array.isArray(contentData) && contentData.length > 0 
        ? contentData
        : [
            { image: "/images/referral.svg", title: "Refer Your Friends", description: "Refer your friend and unlock amazing rewards!", description_font_size: 16 },
            { image: "/images/book.svg", title: "They Book With Us", description: "When your friend books with us, both of you enjoy exclusive benefits.", description_font_size: 16 },
            { image: "/images/reward.svg", title: "And Get Exciting Rewards", description: "Earn exciting rewards together and make unforgettable memories!", description_font_size: 16 },
          ];
const formHeading = contentData.form_heading || "Refer and Earn";
  const formBgColor = contentData.form_bg_color || "#ff914d";
  const formHeadingColor = contentData.form_heading_color || "#000000";
  const formImage = contentData.form_image || "/images/refer-and-earn.jpg";

  const submitButtonText = contentData.submit_button_text || "Submit Now";
  const submitButtonBgColor = contentData.submit_button_bg_color || "#ff914d";
  const submitButtonColor = contentData.submit_button_color || "#ffffff";

  const defaultFields = {
    friend_name: { label: "Your Friend's Name", placeholder: "Your Friend's Name", shown: true, required: true },
    friend_number: { label: "Your Friend's Number", placeholder: "Your Friend's Number", shown: true, required: true },
    friend_email: { label: "Your Friend's Email", placeholder: "Your Friend's Email", shown: true, required: true },
    place: { label: "Place", placeholder: "Place", shown: true, required: true },
    other_place: { label: "Other Place", placeholder: "Other Place", shown: true, required: false },
    phone_no: { label: "Phone No.", placeholder: "your Phone No.", shown: true, required: true },
  };
  
  let formFields = defaultFields;
  if (contentData.form_fields) {
    const parsed = typeof contentData.form_fields === "string"
      ? JSON.parse(contentData.form_fields)
      : contentData.form_fields;
    formFields = { ...defaultFields, ...parsed };
  }

  return (
    <div>
       {/* <head>
        <title>Refer & Earn - High Creation Interior	 </title>
        <meta
          name="description"
          content="Refer & Earn - High Creation Interior	"
        />
        <link rel="canonical" href="https://hcinterior.in/refer-and-earn" />	
      </head> */}
      
        {/* <BackgroundImageWithHeading
          sectionBgImages={"  refer-and-earn refer_and_earn_banner  "}
          sectionBgHeading="Refer & Earn"
          secBgHeadingClass="sec_bgheading_lass"
          sectionBgDescription="Get all the information you need"
          secBgDesClass={"text-center text-white"}
        /> */}
        <MainLayout>
        <BackgroundImageWithHeading
  sectionBgImages={"contact_wrapper refer_and_earn_banner"}
  sectionBgHeading={bgHeading}
  secBgHeadingClass="sec_bgheading_lass force-white-heading"
  sectionBgDescription={bgDescription}
  secBgDesClass={"text-center bg-transparent text-white"}
  bgImageUrl={bannerRecord?.banner_image}
  headingTag={bannerRecord?.banner_heading_tag || "h1"}
  descriptionFontSize={bannerRecord?.banner_description_font_size || 16}
  sectionBgHeadingStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
  sectionBgDescriptionStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
/>
        <section className="privacy my-5">
          <div className="container">
            <div className="text-center">
              {/* <h2>High Creation Interior</h2>
              <h3>
                <span className="font_stylish" style={{ color: "#ff914d" }}>
                  Refer & Earn
                </span>
              </h3> */}
              <HeadingTag>{mainHeading}</HeadingTag>
{mainDescription && (
  <p style={{ fontSize: `${mainDescriptionFontSize}px` }}>{mainDescription}</p>
)}
<h3>
  {/* <span className="font_stylish" style={{ color: "#ff914d" }}>
    Refer & Earn
  </span> */}
</h3>
              {/* <div className="row g-4 py-4 mx-0">
                <div className="col-12 col-lg-4 col-md-4">
                  <BoxIcon
                    iconImage="/images/referral.svg"
                    iconAlt=""
                    iconWidth=""
                    IconBoxHeading="Refer Your Friends"
                    IconBoxDescription="Refer your friend and unlock amazing rewards!"
                  />
                </div>
                <div className="col-12 col-lg-4 col-md-4">
                  <BoxIcon
                    iconImage="/images/book.svg"
                    iconAlt=""
                    iconWidth=""
                    IconBoxHeading="They Book With Us"
                    IconBoxDescription="When your friend books with us, both of you enjoy exclusive benefits."
                  />
                </div>
                <div className="col-12 col-lg-4 col-md-4">
                  <BoxIcon
                    iconImage="/images/reward.svg"
                    iconAlt=""
                    iconWidth=""
                    IconBoxHeading="And Get Exciting Rewards"
                    IconBoxDescription="Earn exciting rewards together and make unforgettable memories!"
                  />
                </div>
               
              </div> */}

              <div className="row g-4 py-4 mx-0">
  {iconItems.map((item, idx) => (
    <div className="col-12 col-lg-4 col-md-4" key={idx}>
      <BoxIcon
        iconImage={item.image}
        iconAlt=""
        iconWidth=""
        IconBoxHeading={item.title}
        IconBoxDescription={item.description}
        descriptionFontSize={item.description_font_size || 16}
      />
    </div>
  ))}
</div>

              <div className="pt-4 table">
             <div className="row justify-content-center mx-0">
                <div className="col-lg-10">
                <div className="row justify-content-center">
                  <div className="col-lg-5 pe-lg-0">
                  <div
  className="bg-image"
  style={{
    // backgroundImage: "url('/images/refer-and-earn.jpg')",
    backgroundImage: `url('${formImage}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    height: "100%",
  }}
></div>
                  </div>
                  <div className="col-lg-7 ps-lg-0">
                    {/* <div className="refer_form " style={{ }}>
                      <h4 className="text-black form_heading mb-3">
                        Refer and Earn
                      </h4> */}
                      <div
  className="refer_form"
  style={{
    backgroundColor: formBgColor,
    "--form-heading-color": formHeadingColor,
    "--submit-btn-bg-color": submitButtonBgColor,
    "--submit-btn-text-color": submitButtonColor,
  }}
>
  <h4 className="form_heading mb-3">
    {formHeading}
  </h4>
                      {/* <form className="row">
                        <div className="col-md-6 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="validationCustom01"
                            placeholder="Your Friend's Name"
                            required=""
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="validationCustom05"
                            placeholder="Your Friend's Number"
                            required=""
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <input
                            type="email"
                            className="form-control"
                            id="validationCustom03"
                            placeholder="Your Friend's Email"
                            required=""
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <select
                            className="form-select form-control"
                            aria-label="Default select example"
                            defaultValue=""
                          >
                            <option value="" hidden>
                              Place
                            </option>
                            <option value="1">Noida</option>
                            <option value="2">New delhi</option>
                            <option value="3">Agra</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="validationCustom06"
                            placeholder="Other Place"
                            required=""
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="validationCustom06"
                            placeholder="your Phone No."
                            required=""
                          />
                        </div>

                        <div className="col-12 mt-3 d-flex m-auto justify-content-center">
                          <button
                            className="btn know_more px-5 py-2"
                            type="submit"
                          >
                            Submit Now
                          </button>
                        </div>
                      </form> */}
         <form className="row">             
{formFields.friend_name.shown && (
  <div className="col-md-6 mb-3">
    <input
      type="text"
      className="form-control"
      id="validationCustom01"
      placeholder={formFields.friend_name.placeholder}
      required={formFields.friend_name.required}
    />
  </div>
)}

{formFields.friend_number.shown && (
  <div className="col-md-6 mb-3">
    <input
      type="text"
      className="form-control"
      id="validationCustom05"
      placeholder={formFields.friend_number.placeholder}
      required={formFields.friend_number.required}
    />
  </div>
)}


{formFields.friend_email.shown && (
  <div className="col-md-6 mb-3">
    <input
      type="email"
      className="form-control"
      id="validationCustom03"
      placeholder={formFields.friend_email.placeholder}
      required={formFields.friend_email.required}
    />
  </div>
)}


{formFields.place.shown && (
  <div className="col-md-6 mb-3">
    <select
      className="form-select form-control"
      aria-label="Default select example"
      defaultValue=""
      required={formFields.place.required}
    >
      <option value="" hidden>{formFields.place.placeholder}</option>
      <option value="1">Noida</option>
      <option value="2">New delhi</option>
      <option value="3">Agra</option>
    </select>
  </div>
)}


{formFields.other_place.shown && (
  <div className="col-md-6 mb-3">
    <input
      type="text"
      className="form-control"
      id="validationCustom06"
      placeholder={formFields.other_place.placeholder}
      required={formFields.other_place.required}
    />
  </div>
)}


{formFields.phone_no.shown && (
  <div className="col-md-6 mb-3">
    <input
      type="text"
      className="form-control"
      id="validationCustom07"
      placeholder={formFields.phone_no.placeholder}
      required={formFields.phone_no.required}
    />
  </div>
)}
<style>{`
  .refer_form .form_heading {
    color: var(--form-heading-color) !important;
  }
  .refer_form .know_more {
    background-color: var(--submit-btn-bg-color) !important;
    color: var(--submit-btn-text-color) !important;
    border-color: var(--submit-btn-bg-color) !important;
  }
`}</style>
<div className="col-12 mt-3 d-flex m-auto justify-content-center">
      <button 
        className="btn know_more px-5 py-2" 
        type="submit"
        style={{ 
          backgroundColor: submitButtonBgColor, 
          color: submitButtonColor,
          borderColor: submitButtonBgColor 
        }}
      >
        {submitButtonText}
      </button>
    </div>
  </form>
                    </div>
                  </div>
                </div>
                </div>
             </div>
              </div>
            </div>
          </div>
        </section>
        <hr />
      </MainLayout>
    </div>
  );
};

// export default ReferEarn;
