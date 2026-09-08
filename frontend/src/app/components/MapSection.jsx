"use client";
import React, { useState } from "react";

// Store all your locations with dynamically generated Google Maps embed URLs
const DEFAULT_LOCATIONS = [
  // --- 1. Corporate Office ---
  {
    id: 1,
    type: "Corporate Office",
    address: "H-56, 1st Floor, Sector-63, Noida, Uttar Pradesh- 201301",
    mapSrc: "https://www.google.com/maps?q=H-56,+1st+Floor,+Sector-63,+Noida,+Uttar+Pradesh-+201301&output=embed",
  },
  // {
  //   id: 2,
  //   type: "Corporate Office",
  //   address: "DDC Arcade, 1st Floor, Plot No 1 Main, Sector 48 Road, Badshahpur Sohna Rd, Opposite Vipul Business Park, Gurugram, Haryana 122018",
  //   mapSrc: "https://www.google.com/maps?q=DDC+Arcade,+Badshahpur+Sohna+Rd,+Gurugram,+Haryana&output=embed",
  // },

  // --- 2. Experience Center ---
  {
    id: 3,
    type: "Experience Center",
    address: "H101, LGF, Sector-63, Noida, Uttar Pradesh- 201301",
    mapSrc: "https://www.google.com/maps?q=H101,+LGF,+Sector-63,+Noida,+Uttar+Pradesh-+201301&output=embed",
  },
  // {
  //   id: 4,
  //   type: "Experience Center",
  //   address: "4th Floor, Jmd Galleria Mall, Unit Nos. 402, Sector-47 & 48, Sohna - Gurgaon Rd, Gurugram, Haryana 122001",
  //   mapSrc: "https://www.google.com/maps?q=Jmd+Galleria+Mall,+Sector-47,+Gurugram,+Haryana&output=embed",
  // },
  {
    id: 4,
    type: "Experience Center",
    address: "DDC Arcade, 1st Floor, Plot No 1 Main, Sector 48 Road, Badshahpur Sohna Rd, Opposite Vipul Business Park, Gurugram, Haryana 122018",
    mapSrc: "https://www.google.com/maps?q=DDC+Arcade,+Badshahpur+Sohna+Rd,+Gurugram,+Haryana&output=embed",
  },
  {
    id: 5,
    type: "Experience Center",
    address: "1st Floor, Plot No 24, near old Faridabad Metro Station, Sector 20A, Faridabad, Haryana 121002",
    mapSrc: "https://www.google.com/maps?q=Plot+No+24,+Sector+20A,+Faridabad,+Haryana&output=embed",
  },

  // --- 3. Workshop ---
  {
    id: 6,
    type: "Workshop",
    address: "Gata No - 336, Village - Upeda, Hapur, Uttar Pradesh 245201",
    mapSrc: "https://www.google.com/maps?q=Upeda,+Hapur,+Uttar+Pradesh+245201&output=embed"
    // mapSrc: "https://www.google.com/maps?q=Sorkha+Village,+Sector-115,+Noida,+Uttar+Pradesh&output=embed",
  },
];

export default function MapSection({ locations: locationsProp, heading: headingProp }) {
  const locations = locationsProp && locationsProp.length ? locationsProp : DEFAULT_LOCATIONS;
  const heading = headingProp || "Explore us on Map";
  // Set the first location as the default active map
  const [activeLocation, setActiveLocation] = useState(locations[0]);

  return (
    <section className="container my-5 map">
      <div className="row mx-0">
        <div className="col-lg-6 pe-lg-4">
          <h2 className="pb-4">{heading}</h2>
          
          {/* Render Locations List */}
          {locations.map((loc, index) => {
            // Check if this is the first item or if the category has changed
            const showHeader = index === 0 || locations[index - 1].type !== loc.type;

            return (
              <React.Fragment key={loc.id}>
                
                {/* Heading is safely outside the clickable div */}
                {showHeader && (
                  <h5 className={index !== 0 ? "pt-3" : ""}>{loc.type}</h5>
                )}

                {/* Clickable Address Box */}
                <div 
                  onClick={() => setActiveLocation(loc)}
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    backgroundColor: activeLocation.id === loc.id ? "#f8f9fa" : "transparent",
                    borderLeft: activeLocation.id === loc.id ? "4px solid #f5a623" : "4px solid transparent"
                  }}
                >
                  <p className="mb-0">
                    <b>{loc.address}</b>
                  </p>
                </div>

              </React.Fragment>
            );
          })}
        </div>

        <div className="col-lg-6 mt-4 mt-lg-0">
          {/* Dynamic Iframe */}
          <div className="rounded overflow-hidden" style={{ height: "100%", minHeight: "525px" }}>
            <iframe
              src={activeLocation.mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "525px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}