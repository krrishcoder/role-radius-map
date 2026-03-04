import { useMemo, useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { JobPosting } from "@/types/job";
import { useJobs } from "@/hooks/useJobs";
import { useUserLocation, getDistance } from "@/hooks/useUserLocation";
import JobCard from "@/components/JobCard";
import Sidebar from "@/components/Sidebar";

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
  html: `<div style="width:20px;height:20px;background:hsl(174,72%,56%);border-radius:50%;border:3px solid hsl(222,47%,6%);box-shadow:0 0 12px hsla(174,72%,56%,0.6);"></div>`,
});

export default function MapView() {
  const { location: userLoc } = useUserLocation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const { data: fetchedJobs = [], isLoading } = useJobs();

  const jobs = useMemo(() => {
    let list = fetchedJobs.map((j) => ({
      ...j,
      distance: userLoc ? getDistance(userLoc[0], userLoc[1], j.officeCoords[0], j.officeCoords[1]) : undefined,
    }));
    if (filter === "stipend") list = list.filter((j) => j.stipend);
    if (filter === "recent") list = list.filter((j) => j.daysAgo <= 2);

    if (filter === "nearest") {
      list = list.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    } else {
      list = list.sort((a, b) => a.daysAgo - b.daysAgo);
    }
    return list;
  }, [userLoc, filter, fetchedJobs]);

  const selectedJob = jobs.find((j) => j.id === selectedId);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const indiaBounds = L.latLngBounds(
      L.latLng(6.0, 68.0), // South West
      L.latLng(36.0, 98.0) // North East
    );

    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: false,
      maxBounds: indiaBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 4,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current || !userLoc) return;
    const marker = L.marker(userLoc, { icon: userIcon }).addTo(mapRef.current);
    marker.bindPopup("<span style='font-size:12px;font-weight:500;'>📍 Your location</span>");
    return () => { marker.remove(); };
  }, [userLoc]);

  // Update job markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    jobs.forEach((job) => {
      const marker = L.marker(job.officeCoords, {
        icon: createIcon(colorMap[job.companyLogo] || "hsl(174,72%,56%)", job.companyLogo),
      }).addTo(mapRef.current!);

      const popupContent = `
        <div style="font-family:Inter,sans-serif;min-width:220px;padding:4px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <div style="width:32px;height:32px;border-radius:8px;background:${colorMap[job.companyLogo]};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;">${job.companyLogo}</div>
            <div>
              <div style="font-weight:600;font-size:13px;">${job.company}</div>
              <div style="font-size:11px;color:#888;">${job.daysAgo}d ago</div>
            </div>
          </div>
          <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${job.role}</div>
          <div style="font-size:11px;color:#888;margin-bottom:4px;">📍 ${job.location}${job.distance !== undefined ? ` (${job.distance.toFixed(0)} km)` : ""}</div>
          ${job.stipend ? `<div style="font-size:13px;font-weight:600;color:hsl(38,92%,60%);margin-bottom:8px;">💰 ${job.stipend}</div>` : ""}
          <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;">${job.tags.map((t) => `<span style="padding:2px 6px;border-radius:4px;background:#f0f0f0;font-size:10px;">${t}</span>`).join("")}</div>
          <div style="border-top:1px solid #eee;padding-top:6px;font-size:11px;color:#666;">
            <div>Posted by <b>${job.posterName}</b></div>
            <div>${job.posterTitle}</div>
          </div>
          <div style="display:flex;gap:4px;margin-top:8px;">
            ${job.email ? `<a href="mailto:${job.email}" style="padding:4px 8px;border-radius:4px;background:#e8f5e9;font-size:10px;text-decoration:none;color:#2e7d32;">📧 Email</a>` : ""}
            ${job.phone ? `<a href="tel:${job.phone}" style="padding:4px 8px;border-radius:4px;background:#e3f2fd;font-size:10px;text-decoration:none;color:#1565c0;">📞 Call</a>` : ""}
            <a href="${job.postUrl}" target="_blank" style="padding:4px 8px;border-radius:4px;background:#f3e5f5;font-size:10px;text-decoration:none;color:#7b1fa2;">🔗 Post</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300, minWidth: 240 });
      marker.on("click", () => setSelectedId(job.id));
      markersRef.current.push(marker);
    });
  }, [jobs]);

  const handleSelect = (job: JobPosting) => {
    setSelectedId(job.id);
    if (mapRef.current) {
      mapRef.current.flyTo(job.officeCoords, 12, { duration: 1.5 });
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      <Sidebar
        jobs={jobs}
        selectedId={selectedId}
        filter={filter}
        onFilterChange={setFilter}
        onSelectJob={handleSelect}
      />

      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="h-full w-full" />

        {/* Floating header */}
        <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none">
          <div className="glass rounded-xl px-5 py-3 pointer-events-auto inline-flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-sm">AI</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground text-sm">Job Market Tracker</h1>
              <p className="text-[10px] text-muted-foreground">Showing latest {jobs.length} open positions</p>
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
