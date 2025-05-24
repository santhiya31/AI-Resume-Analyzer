import React, { useState,useRef } from 'react';
import './App.css';
import JobRoleDropdown from './JobRoleDropdown.jsx';
import JobMatch from './JobMatch.jsx';


function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  //const [selectedSkill, setSelectedSkill] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const fileInputRef = useRef(null);
  const [flatSkills, setFlatSkills] = useState([]);




  const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile App Developer",
  "Cloud Engineer",
  "Software Tester",
  "AI/ML Engineer",
  "Database Administrator",
];

const [selectedRole, setSelectedRole] = useState(roles[0]); // default first role
  const handleClear = () => {
  setFile(null);
  setResult(null);
  setSelectedRole(roles[0]); // reset to default role
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

  const handleUpload = async (e) => {
  e.preventDefault();
  if (!file) return alert('Please select a PDF resume');
  setLoading(true);
  
  

  const formData = new FormData();
  formData.append('resume', file);
  formData.append('target_role', selectedRole); // <-- add this

  try {
    const res = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    const skillsArray = data.skills ? Object.values(data.skills).flat() : [];
  setFlatSkills(skillsArray);
  } catch (err) {
    console.error('Error:', err);
    alert('Something went wrong.');
  } finally {
    setLoading(false);
  }
};

  const skillDescriptions = {
    "Python": "Python is a versatile, high-level programming language widely used in web development, automation, data science, and AI.",
    "Java": "Java is a class-based, object-oriented programming language designed to have as few implementation dependencies as possible.",
    "JavaScript": "JavaScript is a scripting language that enables interactive web pages and is an essential part of web applications.",
    "TypeScript": "TypeScript is a strongly typed programming language that builds on JavaScript, adding static types.",
    "React": "React is a popular JavaScript library for building user interfaces using reusable components.",
    "Angular": "Angular is a TypeScript-based open-source web application framework led by the Angular Team at Google.",
    "Vue": "Vue.js is a progressive JavaScript framework for building user interfaces and single-page applications.",
    "Django": "Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design.",
    "Flask": "Flask is a lightweight Python web framework designed for quick development of simple web apps.",
    "Rails": "Ruby on Rails is a server-side web application framework written in Ruby under the MIT License.",
    "Express": "Express is a minimal and flexible Node.js web application framework providing robust features.",
    "MySQL": "MySQL is an open-source relational database management system based on SQL.",
    "PostgreSQL": "PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development.",
    "MongoDB": "MongoDB is a document database with the scalability and flexibility that you want with the querying and indexing that you need.",
    "Docker": "Docker is a platform for developing, shipping, and running applications using containerization.",
    "Kubernetes": "Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.",
    "AWS": "Amazon Web Services (AWS) provides on-demand cloud computing platforms and APIs to individuals and companies.",
    "Azure": "Microsoft Azure is a cloud computing service for building, testing, deploying, and managing applications.",
    "Communication": "Communication involves effectively sharing information and ideas in various formats.",
    "Leadership": "Leadership is the ability to guide, motivate, and direct a team toward achieving goals.",
    "Teamwork": "Teamwork is the collaborative effort of a group to achieve a common goal.",
    "Time Management": "Time management is the process of planning and exercising conscious control over time spent on activities.",
    "Machine Learning": "Machine Learning is a branch of AI that enables systems to learn and improve from experience automatically.",
    "TensorFlow": "TensorFlow is an end-to-end open source platform for machine learning developed by Google.",
    "HTML": "HTML is the standard markup language for creating web pages and web applications.",
    "CSS": "CSS is a stylesheet language used to describe the presentation of a document written in HTML.",
    "Agile": "Agile is a set of practices for software development emphasizing incremental delivery and collaboration.",
    "Linux": "Linux is a family of open-source Unix-like operating systems based on the Linux kernel.",
    "Cybersecurity": "Cybersecurity involves protecting computer systems and networks from information disclosure, theft, or damage."
   
}



  return (
    <div className="App">
      <div className="bg-image top-right"></div>
  <div className="bg-image bottom-left"></div>

      <h1>AI Resume Analyzer</h1>
      <form onSubmit={handleUpload}>
         <h2>Select a job role</h2>
      <JobRoleDropdown
        roles={roles}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />
      {selectedRole && <p>You selected: <strong>{selectedRole}</strong></p>}

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileInputRef}
        />
        <button type="submit" disabled={loading}>
  {loading ? (
    <>
      Analyzing...
      <span className="spinner"></span>
    </>
  ) : (
    'Analyze Resume'
  )}
</button>
<button
  type="button"
  onClick={handleClear}
  style={{
    marginLeft: "10px",
    backgroundColor: "cadetblue",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  }}
>
  🔄 Start Over
</button>

      </form>

      {result && (
        <div className="result">
          <h3>Raw Resume Text (Preview):</h3>
          <pre>{result.raw_text}</pre>
              <h3>Resume Score:</h3>
    <div style={{
      fontSize: "28px",
      fontWeight: "bold",
      color: result.score >= 80 ? "green" : result.score >= 50 ? "orange" : "red",
      marginBottom: "20px"
    }}>
      {result.score} / 100
    </div>

          <h3>Skills/Entities Detected:</h3>
       {Object.entries(result.skills).map(([category, skills]) => {
  if (!Array.isArray(skills) || skills.length === 0) return null;

  return (
    <div key={category} style={{ marginBottom: "16px" }}>
      <h4>{category}</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {skills.map((skill, idx) => (
          <span
            key={idx}
             className="skill-tag"
            onMouseEnter={() => setHoveredSkill(skill)}
  onMouseLeave={() => setHoveredSkill(null)}
>
            {skill}
            {hoveredSkill === skill && skillDescriptions[skill] &&(
              <div
                className="tooltip"
              >
                {skillDescriptions[skill] || "No description available."}
              </div>
            )}
          </span>
        ))}
      </div>
      
    </div>
    
  );
})}
{result.suggested_roles && result.suggested_roles.length > 0 && (
  <div className="suggested-roles">
    <h3>Suggested Roles:</h3>
    <ul>
      {result.suggested_roles.map((role, index) => (
        <li key={index} style={{
          background: "#e0f7fa",
          padding: "8px 12px",
          marginBottom: "8px",
          borderRadius: "8px",
          fontWeight: "500"
        }}>
          {role}
        </li>
      ))}
    </ul>
    
  </div>
  
)}

        <JobMatch selectedRole={selectedRole} skills={flatSkills} />
        </div>
      )}
    </div>
  );
}

export default App;
