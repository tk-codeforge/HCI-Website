"use client"
import api from "@/utils/api";
import { defaultAltText } from "@/utils/helper";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const TeamGallery = ({ galleryImage, showFallback = true  }) => {
  
  const [teamDataList, setTeamDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueries = useCallback(async () => {
    try {
        const response = await api.get("/cms-content/team", {
        });
        if (response.data?.length > 0) {
          setTeamDataList(response.data ?? []);
        }
        setLoading(false);
    } catch (err) {
        toast.error(err.message ?? "Failed to fetch team data. Please try again.");
        setLoading(false);
    }
}, []);

useEffect(() => {
    fetchQueries();
}, [fetchQueries]);
  
  
  return (
    <div>
      <section className="my-5">
        <div className="container">
          {(galleryImage || showFallback) && (
          <img 
            src={galleryImage} 
            className="img-thumbnail responsive-media" 
            alt="Team gallery" 
            loading="lazy" 
            decoding="async" 
          /> 
)}
        </div>
      </section>
      <hr />
    </div>
  );
};

export default TeamGallery;
