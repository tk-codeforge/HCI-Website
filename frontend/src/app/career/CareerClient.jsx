"use client";

import React from "react";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";

export default function CareerClient({ pageData, jobPostList }) {
  // React requires dynamic tag names to be capitalized variables
  const BannerHeadingTag = pageData.bannerHeadingTag || "h1";

  return (
    <main>
      <BackgroundImageWithHeading
        sectionBgImages={"contact_wrapper career_page_banner"}
        sectionBgHeading={pageData.bgHeading}
        headingTag={pageData.bgHeadingTag}
        secBgHeadingClass="sec_bgheading_lass"
        sectionBgDescription=""
        secBgDesClass={"text-center bg-transparent"}
        bgImageUrl={pageData.bgImage}
      />

      <section className="my-5">
        <div className="container">
          <div className="row g-4 justify-content-center mx-0">
            <center>
              <BannerHeadingTag
                className="fw-bold mb-4"
                style={{ fontSize: "2.5rem" }}
              >
                {pageData.bannerHeading}
              </BannerHeadingTag>

              {/* Dynamic Description & Font Size */}
              <p
                className="text-muted mx-auto"
                style={{
                  fontSize: `${pageData.bannerDescFontSize}px`,
                  maxWidth: "1000px",
                  lineHeight: "1.8",
                }}
              >
                {pageData.bannerDescription}
              </p>
            </center>

            <div className="col-lg-10">
              <div className="row justify-content-center g-4 mx-0">
                {pageData.sections.map((section, index) => {
                  const BlockHeadingTag = section.headingTag || "h3";
                  return (
                    <div
                      key={index}
                      className="col-12 col-md-6 col-lg-4 text-center mb-4 px-2"
                    >
                      {/* Dynamic Image & Resize */}
                      <div
                        className="mb-4 d-flex justify-content-center align-items-center w-100"
                        style={{ height: "80px" }}
                      >
                        <img
                          src={section.image || "/fallback-icon.png"}
                          alt={section.heading || "Career Icon"}
                          className="d-block mx-auto img-fluid"
                          style={{
                            width: `${section.imageSize || 100}%`,
                            maxWidth: "80px",
                            maxHeight: "80px",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      {/* Dynamic Heading & Tag */}
                      <BlockHeadingTag
                        className="fw-normal mb-3"
                        style={{ fontSize: "1.5rem" }}
                      >
                        {section.heading}
                      </BlockHeadingTag>

                      {/* Dynamic Description & Font Size */}
                      <p
                        className="text-muted mx-auto"
                        style={{
                          fontSize: `${section.descriptionFontSize || 14}px`,
                          lineHeight: "1.6",
                          maxWidth: "320px",
                        }}
                      >
                        {section.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .ckeditor-table-wrapper table tbody tr {
              transition: background-color 0.2s ease-in-out;
            }
            
            .ckeditor-table-wrapper table tbody tr:hover,
            .ckeditor-table-wrapper table tbody tr:hover td {
              background-color: #ebebeb !important; 
              cursor: pointer;
            }

            @media (max-width: 768px) {
              /* Center aligning the icons */
              .row {
                margin-left: 0 !important;
                margin-right: 0 !important;
              }

              /* Force clean centering on images */
              .col-12 img {
                margin-left: auto !important;
                margin-right: auto !important;
                display: block !important;
              }

              /* Preventing the arrow column from collapsing in CKEditor table */
              .ckeditor-table-wrapper table tbody tr td:last-child {
                  min-width: 40px; 
                  width: 40px;
                  white-space: nowrap; 
                  text-align: center;
                  vertical-align: middle;
              }

              /* Allows the table to scroll horizontally */
              .ckeditor-table-wrapper {
                  overflow-x: auto;
                  display: block;
                  width: 100%;
              }
            }
          `,
        }}
      />

      <section className="pb-5">
        <div className="container">
          <div className="row justify-content-center mx-0">
            <div className="col-lg-10">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Job Posting</th>
                      <th>Experience</th>
                      <th>No of Opening</th>
                      <th>Location</th>
                      <th>Posted On</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobPostList && jobPostList.length > 0 ? (
                      jobPostList.map((job, index) => (
                        <tr key={index}>
                          <td>{job?.title ?? "-"}</td>
                          <td>{job?.experience_required ?? "-"}</td>
                          <td>{job?.job_opening ?? "-"}</td>
                          <td>{job?.location ?? "-"}</td>
                          <td>
                            {job?.created_at
                              ? new Date(job.created_at).toLocaleDateString(
                                  "en-GB"
                                )
                              : "-"}
                          </td>
                          <td>
                            <Link
                              href={`/career/career-form?jobId=${job.id}`}
                              className="text-muted"
                            >
                              <FaArrowRightLong className="fs-4" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No active job openings at the moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="pt-5" />
    </main>
  );
}