// A client-side geocoding utility for mapping Supabase string locations to [latitude, longitude].
// Avoids external API rate limits. Expanded to handle noisy LinkedIn scraped string formats.

const GEO_DICT: Record<string, [number, number]> = {
    // Top IT hubs (Prioritized)
    "bangalore": [12.9716, 77.5946],
    "bengaluru": [12.9716, 77.5946],
    "hyderabad": [17.3850, 78.4867],
    "pune": [18.5204, 73.8567],
    "mumbai": [19.0760, 72.8777],
    "chennai": [13.0827, 80.2707],
    "delhi": [28.7041, 77.1025],
    "new delhi": [28.6139, 77.2090],
    "gurgaon": [28.4595, 77.0266],
    "gurugram": [28.4595, 77.0266],
    "noida": [28.5355, 77.3910],
    
    // Other major Indian cities
    "ahmedabad": [23.0225, 72.5714],
    "kolkata": [22.5726, 88.3639],
    "jaipur": [26.9124, 75.7873],
    "chandigarh": [30.7333, 76.7794],
    "lucknow": [26.8467, 80.9462],
    "indore": [22.7196, 75.8577],
    "kochi": [9.9312, 76.2673],
    "trivandrum": [8.5241, 76.9366],
    "thiruvananthapuram": [8.5241, 76.9366],
    "bhubaneswar": [20.2961, 85.8245],
    "coimbatore": [11.0168, 76.9558],

    // International Tech Hubs (Remote jobs from Scraper)
    "san francisco": [37.7749, -122.4194],
    "london": [51.5074, -0.1278],
    "new york": [40.7128, -74.0060],
    "singapore": [1.3521, 103.8198],

    // States as fallbacks (Lowest priority)
    "karnataka": [15.3173, 75.7139],
    "maharashtra": [19.7515, 75.7139],
    "telangana": [18.1124, 79.0193],
    "tamil nadu": [11.1271, 78.6569],
    "kerala": [10.8505, 76.2711],
    "india": [20.5937, 78.9629] // Center of India
};

export function geocodeLocation(locationStr: string | null | undefined): [number, number] | null {
    if (!locationStr) return null;
    
    // 1. Convert to lowercase
    let normalized = locationStr.toLowerCase();
    
    // 2. Remove common noisy suffixes/words that disrupt exact matching
    const noiseWords = [
        "division", "district", "city", "metropolitan area", "region", 
        "greater", "area", "urban", "state"
    ];
    
    for (const word of noiseWords) {
        // Remove the word if it stands alone
        normalized = normalized.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
    }
    
    // 3. Clean up punctuation
    normalized = normalized.replace(/[.,-]/g, ' ').replace(/\s+/g, ' ').trim();

    // 4. Exact/Partial Match against Dictionary
    // We sort the dictionary keys by length descending to match longest specific names first before generic ones
    const sortedKeys = Object.keys(GEO_DICT).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
        if (normalized.includes(key) || locationStr.toLowerCase().includes(key)) {
            return GEO_DICT[key];
        }
    }
    
    return null; // Could not resolve
}
