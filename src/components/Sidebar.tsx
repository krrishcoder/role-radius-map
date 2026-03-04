import { Search, SlidersHorizontal } from "lucide-react";
import type { JobPosting } from "@/types/job";
import JobCard from "./JobCard";

interface SidebarProps {
  jobs: JobPosting[];
  selectedId: string | null;
  filter: string;
  onFilterChange: (f: string) => void;
  onSelectJob: (job: JobPosting) => void;
}

const filters = [
  { id: "all", label: "All" },
  { id: "recent", label: "≤2 days" },
  { id: "stipend", label: "With Stipend" },
  { id: "nearest", label: "Nearest" },
];

export default function Sidebar({ jobs, selectedId, filter, onFilterChange, onSelectJob }: SidebarProps) {
  return (
    <div className="w-[340px] h-full border-r border-border flex flex-col bg-card/50 backdrop-blur-sm shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Search className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <h2 className="font-display font-bold text-foreground text-sm">AI/ML Intern Feeds</h2>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${filter === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            compact
            isSelected={selectedId === job.id}
            onClick={() => onSelectJob(job)}
          />
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No jobs match your filter.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">
          Data sourced from LinkedIn · Last 4 days
        </p>
      </div>
    </div>
  );
}
