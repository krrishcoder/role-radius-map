import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JobPosting } from '@/types/job';
import { geocodeLocation } from '@/lib/geocode';

// This function attempts to fetch jobs from Supabase's jobs_data table
export function useJobs() {
    return useQuery({
        queryKey: ['jobs_data'],
        queryFn: async (): Promise<JobPosting[]> => {
            const { data, error } = await (supabase as any)
                .from('jobs_data')
                .select('*');

            if (error) {
                console.error('Error fetching jobs_data from Supabase:', error);
                return [];
            }

            if (!data || data.length === 0) {
                console.warn('No rows found in jobs_data.');
                return [];
            }

            // Map the jobs_data names to our JobPosting interface
            const mappedJobs: JobPosting[] = [];

            // To prevent map overlap, ensure we only visualize absolutely unique jobs based on their LinkedIn URL
            const seenUrls = new Set<string>();

            for (const row of data) {
                const uniqueId = row.jobUrl || String(row.id);
                if (seenUrls.has(uniqueId)) {
                    continue; // Skip duplicate
                }
                seenUrls.add(uniqueId);

                // Try resolving coordinates
                const coords = geocodeLocation(row.location);

                // If we absolutely cannot determine coordinates, we can either skip it 
                // or place it in the center of India. For map accuracy, skipping is usually safer, 
                // but for debugging, let's put it on the map with a fallback.
                const officeCoords = coords || [20.5937, 78.9629] as [number, number];

                // Parse 'daysAgo' out of postedTime like "12 hours ago" or "4 days ago"
                let daysAgo = 0;
                if (row.postedTime) {
                    const match = row.postedTime.match(/(\d+)\s+day/);
                    if (match) {
                        daysAgo = parseInt(match[1]);
                    } else if (row.postedTime.includes('week')) {
                        daysAgo = 7;
                    }
                }

                mappedJobs.push({
                    id: String(row.id),
                    role: row.title || 'Unknown Role',
                    company: row.companyName || 'Unknown Company',
                    companyLogo: row.companyName ? row.companyName.charAt(0).toUpperCase() : 'U',
                    postedDate: row.publishedAt || row.created_at,
                    daysAgo: daysAgo,
                    stipend: row.salary || '',
                    location: row.location || 'Unknown Location',
                    officeCoords: officeCoords,
                    postUrl: row.jobUrl || '',
                    email: '', // Not available in scraper
                    phone: '', // Not available in scraper
                    posterName: row.posterFullName || 'LinkedIn Member',
                    posterTitle: '', // Not available
                    posterAvatar: row.posterProfileUrl || '',
                    tags: [], // Could NLP parse descriptionHtml here if needed
                });
            }

            return mappedJobs;
        },
        // Prevent refetching aggressively since job data is static
        staleTime: 1000 * 60 * 5,
    });
}
