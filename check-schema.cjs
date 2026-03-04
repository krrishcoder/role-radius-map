const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yxjwycpadvtcmgrvycla.supabase.co';
const supabaseKey = 'sb_publishable_HRJ9SLkLr0MgMQvaPFc6VQ_YwASvPWV';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    const { data, error } = await supabase.from('jobs_data').select('*').limit(1);
    if (error) {
        console.error('Error fetching data:', error);
    } else {
        if (data && data.length > 0) {
            console.log('Columns for jobs_data:');
            console.log(Object.keys(data[0]).join(', '));
            console.log('\Sample row:');
            console.log(JSON.stringify(data[0], null, 2));
        } else {
            console.log('No rows found in jobs_data, or cannot access due to RLS.');
        }
    }
}

checkSchema();
