-- Create the jobs table
CREATE TABLE public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo TEXT NOT NULL,
  posted_date DATE NOT NULL,
  days_ago INTEGER NOT NULL,
  stipend TEXT,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  post_url TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  poster_name TEXT NOT NULL,
  poster_title TEXT NOT NULL,
  poster_avatar TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read jobs
CREATE POLICY "Allow public read access"
  ON public.jobs
  FOR SELECT
  TO public
  USING (true);

-- Insert dummy data matching the mockJobs.ts
INSERT INTO public.jobs (
  id, role, company, company_logo, posted_date, days_ago, stipend, location, latitude, longitude, post_url, email, phone, poster_name, poster_title, poster_avatar, tags
) VALUES 
('11111111-1111-1111-1111-111111111111', 'AI/ML Intern', 'Google', 'G', '2026-02-26', 2, '₹80,000/month', 'Bangalore, India', 12.9716, 77.5946, 'https://linkedin.com/posts/1', 'careers@google.com', NULL, 'Priya Sharma', 'ML Engineer at Google', '', ARRAY['TensorFlow', 'Python', 'NLP']),
('22222222-2222-2222-2222-222222222222', 'Machine Learning Intern', 'Microsoft', 'M', '2026-02-25', 3, '₹60,000/month', 'Hyderabad, India', 17.385, 78.4867, 'https://linkedin.com/posts/2', 'hiring@microsoft.com', '+91-9876543210', 'Rahul Verma', 'Senior Data Scientist at Microsoft', '', ARRAY['Azure ML', 'Python', 'Computer Vision']),
('33333333-3333-3333-3333-333333333333', 'AI Research Intern', 'Amazon', 'A', '2026-02-27', 1, NULL, 'Gurgaon, India', 28.4595, 77.0266, 'https://linkedin.com/posts/3', NULL, NULL, 'Ankit Jain', 'Applied Scientist at Amazon', '', ARRAY['AWS SageMaker', 'Deep Learning', 'PyTorch']),
('44444444-4444-4444-4444-444444444444', 'Data Science Intern', 'Flipkart', 'F', '2026-02-24', 4, '₹50,000/month', 'Bangalore, India', 12.9352, 77.6245, 'https://linkedin.com/posts/4', 'internships@flipkart.com', NULL, 'Sneha Patel', 'Data Lead at Flipkart', '', ARRAY['Recommendation Systems', 'Spark', 'Python']),
('55555555-5555-5555-5555-555555555555', 'AI/ML Engineering Intern', 'Swiggy', 'S', '2026-02-26', 2, '₹40,000/month', 'Bangalore, India', 12.9279, 77.6271, 'https://linkedin.com/posts/5', NULL, '+91-8765432109', 'Vikram Singh', 'ML Platform at Swiggy', '', ARRAY['MLOps', 'Kubernetes', 'Python']),
('66666666-6666-6666-6666-666666666666', 'Deep Learning Intern', 'Infosys', 'I', '2026-02-25', 3, NULL, 'Pune, India', 18.5204, 73.8567, 'https://linkedin.com/posts/6', 'recruit@infosys.com', NULL, 'Meera Reddy', 'AI Practice Lead at Infosys', '', ARRAY['GANs', 'TensorFlow', 'Research']),
('77777777-7777-7777-7777-777777777777', 'NLP Intern', 'Zoho', 'Z', '2026-02-27', 1, '₹35,000/month', 'Chennai, India', 13.0827, 80.2707, 'https://linkedin.com/posts/7', NULL, NULL, 'Karthik Raman', 'NLP Engineer at Zoho', '', ARRAY['NLP', 'Transformers', 'BERT']),
('88888888-8888-8888-8888-888888888888', 'Computer Vision Intern', 'TCS', 'T', '2026-02-26', 2, '₹30,000/month', 'Mumbai, India', 19.076, 72.8777, 'https://linkedin.com/posts/8', 'cvteam@tcs.com', NULL, 'Arjun Nair', 'Research Scientist at TCS', '', ARRAY['OpenCV', 'YOLO', 'PyTorch']);
