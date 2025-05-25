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
  const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;
const apiHost = process.env.REACT_APP_RAPIDAPI_HOST;
const apiUrl = process.env.REACT_APP_API_URL;

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
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
       'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': apiHost,
    'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
    }


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
   <div className="jobmatch-container">
  <h3 className="jobmatch-title">Matching Jobs for: {selectedRole}</h3>

  {jobs.length === 0 ? (
    <p className="no-jobs">No matching jobs found.</p>
  ) : (
    <ul className="job-list">
      {jobs.map((job) => (
        <li key={job.id} className="job-item">
          <h4 className="job-title">{job.title}</h4>
          <p className="job-company">Company : {job.company || 'Unknown Company'}</p>
          <p className="job-location">Location : {job.location || 'N/A'}</p>
          <a
            href={job.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="job-link"
          >
            View Full Job
          </a>
        </li>
      ))}
    </ul>
  )}
</div>


  );
};

export default JobMatch;
