import { useEffect } from "preact/hooks";
import React, { useState } from "react";
import { toast } from "react-toastify";
import _axios from "../../../../components/Axios";
import Alerts from "./Alerts";
import Events from "./Events";
const index = () => {
  const [activityDashboardInsights, setActivityDashboardInsights] = React.useState([]);
  const [showInsights, setShowInsights] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hazards, setHazards] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [reportingSources, setReportingSources] = useState([]);
  const [vulnerableEntities, setVulnerableEntities] = useState([]);
  const [events, setEvents] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [impactSeverities, setImpactSeverities] = useState([]);
  const [eventSeverities, setEventSeverities] = useState([]);
  const [regions, setRegions] = useState([]);

  return (
    <>
      {/* {isLoading && <Loader />} */}
      {/* {isLoading ? (
        <div className="flex gap-2">
          <Skeleton variant="rounded" width={340} height={130} />
          <Skeleton variant="rounded" width={340} height={130} />
          <Skeleton variant="rounded" width={340} height={130} />
          <Skeleton variant="rounded" width={340} height={130} />
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              className="text-white  flex items-center"
              onClick={() => {
                setShowInsights((prev) => !prev);
              }}
            >
              <span>Insights</span>

              <i
                className={`ml-1 fa-sharp fa-solid fa-caret-down transition-all  delay-100 ${
                  showInsights ? "rotate-180" : ""
                }`}
              ></i>
            </button>
          </div>
          {showInsights && (
            <>
              <h1 className="text-2xl font-semibold mb-2">Insights</h1>
              <div className="grid grid-cols-4 gap-2  ">
                {activityDashboardInsights.map((item) => (
                  <ActivityCard class={item.class} label={item.label} count={item.count} />
                ))}
              </div>
            </>
          )}
        </>
      )} */}
      {/* <Alerts /> */}
      {/* <Activities /> */}
      <Events />
    </>
  );
};

export default index;
