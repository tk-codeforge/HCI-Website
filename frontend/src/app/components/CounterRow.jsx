"use client";

import CountUp from "react-countup";
import Image from "next/image";

const CounterRow = (props) => {
  return (
    <div className="modern-excellence-wrapper w-100 py-5">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .modern-excellence-wrapper {
          background: #ffffff;
          overflow: hidden;
        }

        /* =========================
           SECTION HEADING
        ========================== */
        .section-heading-wrapper {
          margin-bottom: 3.5rem;
        }

        .section-main-heading {
          font-size: 2.75rem;
          color: #171717;
          letter-spacing: -0.5px;
        }

        .section-main-heading span {
          color: #ff914d;
        }

        /* =========================
           MAIN ROW
        ========================== */
        .excellence-row {
          align-items: stretch;
        }

        /* =========================
           IMAGE SIDE (Kept as requested)
        ========================== */
        .image-column {
          display: flex;
        }

        .excellence-image-container {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 640px; /* SWEET SPOT */
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 18px 45px rgba(0,0,0,0.08);
        }

        .excellence-img {
          object-fit: cover;
          object-position: center;
          transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .excellence-image-container:hover .excellence-img {
          transform: scale(1.04);
        }

        /* =========================
           RIGHT CONTENT
        ========================== */
        .excellence-content-right {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-left: 0.5rem;
        }

        /* =========================
           STATS GRID (Updated Logic)
        ========================== */
        .stat-grid-top {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem; /* Reduced Gap */
          margin-bottom: 2rem;
        }

        .stat-card {
          background: #fafafa;
          padding: 1rem 1.2rem; /* Reduced padding for smaller card */
          border-radius: 16px; /* Slightly smaller radius */
          border: 1px solid #f1f1f1;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          text-align: center; /* Centered content inside card */
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 25px rgba(255,145,77,0.12);
          border-color: #ffd9bf;
          background: #ffffff;
        }

        .stat-card::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 3px;
          background: #ff914d;
          transition: width 0.3s ease;
        }

        .stat-card:hover::after {
          width: 100%;
        }

        .stat-number {
          color: #ff914d;
          font-size: 2.4rem; /* Adjusted for smaller card */
          font-weight: 900; /* Bolder */
          line-height: 1;
          margin-bottom: 0.3rem; /* Reduced margin */
        }

        .stat-label {
          color: #444;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
          white-space: nowrap; /* Forces label to stay on ONE line */
        }

        /* =========================
           DESCRIPTION
        ========================== */
        .desc-middle {
          font-size: 1.08rem;
          line-height: 1.9;
          color: #555;
          margin-bottom: 2.2rem;
          text-align: center; /* Centered description to match centered buttons */
        }

        /* =========================
           BUTTONS (Updated Logic)
        ========================== */
        .action-bottom {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center; /* Forces buttons to center */
        }

        .btn-primary-modern {
          background: #ff914d;
          color: white !important;
          padding: 12px 32px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 2px solid #ff914d;
          box-shadow: 0 4px 15px rgba(255,145,77,0.25);
        }

        .btn-primary-modern:hover {
          background: transparent;
          color: #ff914d !important;
          transform: translateY(-2px);
        }

        .btn-outline-modern {
          background: transparent;
          color: #171717 !important;
          border: 2px solid #171717;
          padding: 12px 32px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-outline-modern:hover {
          background: #171717;
          color: white !important;
          transform: translateY(-2px);
        }

        /* =========================
           RESPONSIVE (Kept mostly as requested, tweaked for label)
        ========================== */
        @media (min-width: 992px) {
           .desc-middle { text-align: left; }
           .stat-card { text-align: left; }
        }

        @media (max-width: 1199px) {
          .excellence-image-container {
            min-height: 500px;
            max-height: 560px;
          }
        }

        @media (max-width: 991px) {
          .excellence-image-container {
            min-height: 420px;
            max-height: 500px;
          }
          .excellence-content-right {
            padding-left: 0;
            margin-top: 1rem;
          }
          .section-main-heading {
            font-size: 2.2rem;
          }
          .image-column {
            margin-bottom: 2rem;
          }
          .desc-middle {
            text-align: left;
          }
        }

        @media (max-width: 767px) {
          .excellence-image-container {
            min-height: 380px;
            max-height: 400px;
          }
          .stat-grid-top {
            grid-template-columns: 1fr;
          }
          .section-main-heading {
            font-size: 2rem;
          }
          .action-bottom {
            flex-direction: column;
          }
          .btn-primary-modern,
          .btn-outline-modern {
            width: 100%;
            text-align: center;
          }
          /* Prevent cut-off on tiny screens */
          .stat-label { 
            font-size: 0.8rem; 
            letter-spacing: 0px; 
          }
        }
      `,
        }}
      />

      <div className="container-fluid px-lg-5 px-3">
        {/* HEADING */}
        <div className="section-heading-wrapper text-center">
          <h2 className="h2 font_about fw-bolder section-main-heading mb-0">
            {props.titleHeadingCounter}
            <span className={props.subHeadingClassCounter}>
              {" "}
              {props.subHeadingCounter}
            </span>
          </h2>
        </div>

        {/* MAIN GRID */}
        <div className="row excellence-row g-4 align-items-start mx-0">
          
          {/* IMAGE */}
          <div className="col-lg-5 col-md-12 image-column">
            <div className="excellence-image-container">
              {props.ImgCounter && (
                <Image
                  src={props.ImgCounter}
                  className={props.ImgCounterClass || "excellence-img"}
                  alt={
                    props.imgAltCounter ||
                    props.titleHeadingCounter ||
                    "Interior Design"
                  }
                  fill
                  quality={100}
                  sizes="(max-width: 991px) 100vw, 50vw"
                  priority
                />
              )}
            </div>
          </div>

          {/* CONTENT */}
          <div className="col-lg-7 col-md-12">
            <div className="excellence-content-right">
              
              {/* STATS (Single line text without \n) */}
              <div className="stat-grid-top">
                <CounterBlock
                  end={props.counterEnd}
                  duration={props.counterDuration}
                  suffix={props.counterSuffix || "+"}
                  label={props.label1 ||"Renovations Accomplished"}
                />

                <CounterBlock
                  end={props.counterEnd2}
                  duration={props.counterDuration2}
                  suffix={props.counterSuffix2 || "+"}
                  label={props.label2 ||"Delighted Customers"}
                />

                <CounterBlock
                  end={props.counterEnd3}
                  duration={props.counterDuration3}
                  suffix={props.counterSuffix3 || "+"}
                  label={props.label3 ||"Staff"}
                />

                <CounterBlock
                  end={props.counterEnd4}
                  duration={props.counterDuration4}
                  suffix={props.counterSuffix4 || "+"}
                  label={props.label4 || "Years of Proficiency"}
                />
              </div>

              {/* DESCRIPTION */}
              {props.descriptionCounter && (
                <p className="desc-middle">
                  {props.descriptionCounter}
                </p>
              )}

              {/* BUTTONS */}
              <div className="action-bottom">
                {props.btnLink && (
                  <a
                    className="btn-primary-modern"
                    href={props.btnLink}
                    aria-label={props.textAboutBtnCounter}
                  >
                    {props.textAboutBtnCounter}
                  </a>
                )}

                {props.btnLink2 && (
                  <a
                    className="btn-outline-modern"
                    href={props.btnLink2}
                    aria-label={props.textAboutBtnCounter2}
                  >
                    {props.textAboutBtnCounter2}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   COUNTER BLOCK
========================= */

const CounterBlock = ({ end, duration, suffix, label }) => {
  let safeEnd = 0;

  try {
    if (end !== undefined && end !== null) {
      const sanitized = String(end).replace(/,/g, "");
      const parsed = parseInt(sanitized, 10);

      if (!isNaN(parsed)) {
        safeEnd = parsed;
      }
    }
  } catch (error) {
    safeEnd = 0;
  }

  return (
    <div className="stat-card">
      <div className="stat-number">
        <CountUp
          start={0}
          end={safeEnd}
          duration={Number(duration) || 2.5}
          suffix={suffix}
          enableScrollSpy={true}
          scrollSpyOnce={true}
        />
      </div>

      <div className="stat-label">
        {/* Render label as a single line span */}
        <span>{label}</span>
      </div>
    </div>
  );
};

export default CounterRow;