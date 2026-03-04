const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yxjwycpadvtcmgrvycla.supabase.co';
const supabaseKey = 'sb_publishable_HRJ9SLkLr0MgMQvaPFc6VQ_YwASvPWV';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    const { data, error } = await supabase.from('jobs_data').select('*').limit(5);
    if (error) {
        console.error('Error fetching data:', error);
    } else {
        console.log(`Fetched ${data.length} rows.`);
        console.log(data);
    }
}

checkSchema();
