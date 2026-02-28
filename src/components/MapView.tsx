import { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockJobs, type JobPosting } from "@/data/mockJobs";
import { useUserLocation, getDistance } from "@/hooks/useUserLocation";
import JobCard from "@/components/JobCard";
import Sidebar from "@/components/Sidebar";

// Custom marker icon
function createIcon(color: string, label: string) {
  return L.divIcon({
    className: "",
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -52],
    html: `
      <div style="position:relative;width:40px;height:48px;">
        <svg viewBox="0 0 40 48" width="40" height="48">
          <path d="M20 0C9 0 0 9 0 20c0 15 20 28 20 28s20-13 20-28C40 9 31 0 20 0z" fill="${color}" opacity="0.9"/>
        </svg>
        <span style="position:absolute;top:8px;left:0;right:0;text-align:center;color:#fff;font-weight:700;font-size:14px;font-family:'Space Grotesk',sans-serif;">${label}</span>
      </div>`,
  });
}

const userIcon = L.divIcon({
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  html: `<div style="width:20px;height:20px;background:hsl(174 72% 56%);border-radius:50%;border:3px solid hsl(222 47% 6%);box-shadow:0 0 12px hsl(174 72% 56% / 0.6);"></div>`,
});

const colorMap: Record<string, string> = {
  G: "hsl(174,72%,56%)",
  M: "hsl(250,70%,65%)",
  A: "hsl(38,92%,60%)",
  F: "hsl(174,72%,56%)",
  S: "hsl(340,75%,60%)",
  I: "hsl(152,69%,50%)",
  Z: "hsl(250,70%,65%)",
  T: "hsl(174,72%,56%)",
};

function FlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 12, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function MapView() {
  const { location: userLoc } = useUserLocation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);

  const jobs = useMemo(() => {
    let list = mockJobs.map((j) => ({
      ...j,
      distance: userLoc ? getDistance(userLoc[0], userLoc[1], j.officeCoords[0], j.officeCoords[1]) : undefined,
    }));
    if (filter === "stipend") list = list.filter((j) => j.stipend);
    if (filter === "recent") list = list.filter((j) => j.daysAgo <= 2);
    if (filter === "nearest") list = list.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
    else list = list.sort((a, b) => a.daysAgo - b.daysAgo);
    return list;
  }, [userLoc, filter]);

  const selectedJob = jobs.find((j) => j.id === selectedId);
  const center: [number, number] = userLoc || [20.5937, 78.9629];

  const handleSelect = (job: JobPosting) => {
    setSelectedId(job.id);
    setFlyTarget(job.officeCoords);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        jobs={jobs}
        selectedId={selectedId}
        filter={filter}
        onFilterChange={setFilter}
        onSelectJob={handleSelect}
      />

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={5}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {flyTarget && <FlyTo center={flyTarget} />}

          {/* User marker */}
          {userLoc && (
            <Marker position={userLoc} icon={userIcon}>
              <Popup className="custom-popup">
                <span className="text-xs font-medium">📍 Your location</span>
              </Popup>
            </Marker>
          )}

          {/* Job markers */}
          {jobs.map((job) => (
            <Marker
              key={job.id}
              position={job.officeCoords}
              icon={createIcon(colorMap[job.companyLogo] || "hsl(174,72%,56%)", job.companyLogo)}
              eventHandlers={{ click: () => handleSelect(job) }}
            >
              <Popup className="custom-popup" maxWidth={320} minWidth={280}>
                <JobCard job={job} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating header */}
        <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none">
          <div className="glass rounded-xl px-5 py-3 pointer-events-auto inline-flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-sm">AI</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground text-sm">LinkedIn AI/ML Intern Tracker</h1>
              <p className="text-[10px] text-muted-foreground">Last 4 days · {jobs.length} positions found</p>
            </div>
          </div>
        </div>

        {/* Selected card overlay */}
        {selectedJob && (
          <div className="absolute bottom-6 right-6 z-[1000]">
            <JobCard job={selectedJob} />
          </div>
        )}
      </div>
    </div>
  );
}
