import React, { useEffect, useState } from 'react';

const JobMatch = ({ selectedRole }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedRole) return;

    const fetchJobs = async () => {
  setLoading(true);
  setError(null);
  const url = 'https://jobs-search-api.p.rapidapi.com/getjobs';

  const bodyData = {
    search_term: selectedRole || 'developer', // example fallback
    location: '',
    results_wanted: 5,
    site_name: ['indeed', 'linkedin', 'zip_recruiter', 'glassdoor'],
    distance: 50,
    job_type: 'fulltime',
    is_remote: false,
    linkedin_fetch_description: false,
    hours_old: 72,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-rapidapi-key': 'da75fda6a0msh153ebb526df5644p1ebca0jsn91f0bc975125',
    'x-rapidapi-host': 'jobs-search-api.p.rapidapi.com',
    'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) throw new Error(`Error! status: ${response.status}`);

    const data = await response.json();
    console.log("Job Data:", data);

    setJobs(data.jobs || []);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};


    fetchJobs();
  }, [selectedRole]);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>Matching Jobs for: {selectedRole}</h3>
      {jobs.length === 0 ? (
        <p>No matching jobs found.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
  <h4>{job.title}</h4>
  <p>{job.company || 'Unknown Company'}</p>
  <p>{job.location || 'N/A'}</p>
  <a href={job.job_url} target="_blank" rel="noopener noreferrer">View Full Job</a>
</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobMatch;
