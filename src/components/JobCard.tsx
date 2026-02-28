import { Mail, Phone, ExternalLink, MapPin, Clock, IndianRupee } from "lucide-react";
import type { JobPosting } from "@/data/mockJobs";

const logoColors: Record<string, string> = {
  G: "bg-primary",
  M: "bg-indigo",
  A: "bg-amber",
  F: "bg-cyan",
  S: "bg-pink",
  I: "bg-success",
  Z: "bg-accent",
  T: "bg-primary",
};

interface JobCardProps {
  job: JobPosting;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export default function JobCard({ job, isSelected, onClick, compact }: JobCardProps) {
  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`glass rounded-lg p-3 cursor-pointer transition-all duration-300 card-3d ${
          isSelected ? "ring-2 ring-primary shadow-[var(--shadow-glow)]" : "hover:ring-1 hover:ring-primary/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-md ${logoColors[job.companyLogo] || "bg-muted"} flex items-center justify-center text-primary-foreground font-display font-bold text-sm`}>
            {job.companyLogo}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{job.role}</p>
            <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
          </div>
          {job.stipend && (
            <span className="text-xs font-medium text-primary whitespace-nowrap">{job.stipend}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-5 card-3d animate-float shadow-[var(--shadow-3d)] max-w-[300px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-lg ${logoColors[job.companyLogo] || "bg-muted"} flex items-center justify-center text-primary-foreground font-display font-bold`}>
            {job.companyLogo}
          </div>
          <div>
            <p className="font-display font-semibold text-foreground text-sm">{job.company}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {job.daysAgo}d ago
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-semibold uppercase tracking-wide">
          Hiring
        </span>
      </div>

      {/* Role */}
      <h3 className="font-display font-bold text-foreground mb-1 text-base">{job.role}</h3>
      
      {/* Location */}
      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
        <MapPin className="w-3 h-3 text-pink" />
        {job.location}
        {job.distance !== undefined && (
          <span className="text-primary ml-1">({job.distance.toFixed(0)} km away)</span>
        )}
      </p>

      {/* Stipend */}
      {job.stipend && (
        <div className="flex items-center gap-1 mb-3 text-sm font-semibold text-amber">
          <IndianRupee className="w-3.5 h-3.5" />
          {job.stipend}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {job.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium">
            {tag}
          </span>
        ))}
      </div>

      {/* Poster */}
      <div className="border-t border-border pt-3 mb-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Posted by</p>
        <p className="text-xs font-medium text-foreground">{job.posterName}</p>
        <p className="text-[10px] text-muted-foreground">{job.posterTitle}</p>
      </div>

      {/* Contact */}
      <div className="flex gap-2">
        {job.email && (
          <a href={`mailto:${job.email}`} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground text-[10px] font-medium transition-colors">
            <Mail className="w-3 h-3" /> Email
          </a>
        )}
        {job.phone && (
          <a href={`tel:${job.phone}`} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground text-[10px] font-medium transition-colors">
            <Phone className="w-3 h-3" /> Call
          </a>
        )}
        <a href={job.postUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-primary/20 hover:bg-primary/30 text-primary text-[10px] font-medium transition-colors">
          <ExternalLink className="w-3 h-3" /> Post
        </a>
      </div>
    </div>
  );
}
