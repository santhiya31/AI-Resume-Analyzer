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
    const res = await fetch('https://ai-resume-analyzer-mouv.onrender.com/analyze', {
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
  "Problem Solving": "Problem solving is the ability to find solutions to complex or difficult issues effectively.",
  "Creativity": "Creativity is the use of imagination or original ideas to create something new or solve problems innovatively.",
  "Adaptability": "Adaptability is the ability to adjust to new conditions and environments efficiently.",
  "Machine Learning": "Machine Learning is a branch of AI that enables systems to learn and improve from experience automatically.",
  "TensorFlow": "TensorFlow is an end-to-end open source platform for machine learning developed by Google.",
  "PyTorch": "PyTorch is an open-source machine learning library based on the Torch library, widely used for deep learning.",
  "Scikit-learn": "Scikit-learn is a Python library for machine learning that features various classification, regression, and clustering algorithms.",
  "Pandas": "Pandas is a Python library providing high-performance, easy-to-use data structures and data analysis tools.",
  "NumPy": "NumPy is a fundamental package for scientific computing in Python, supporting arrays and matrices.",
  "Keras": "Keras is an open-source neural-network library written in Python for fast experimentation with deep learning.",
  "Matplotlib": "Matplotlib is a comprehensive Python library for creating static, animated, and interactive visualizations.",
  "Seaborn": "Seaborn is a Python data visualization library based on Matplotlib that provides a high-level interface for drawing attractive graphs.",
  "HTML": "HTML is the standard markup language for creating web pages and web applications.",
  "CSS": "CSS is a stylesheet language used to describe the presentation of a document written in HTML.",
  "Sass": "Sass is a preprocessor scripting language that is interpreted or compiled into CSS, adding features like variables and nesting.",
  "Less": "Less is a dynamic preprocessor style sheet language that extends CSS with dynamic behaviors such as variables and functions.",
  "Bootstrap": "Bootstrap is a popular CSS framework for building responsive, mobile-first websites quickly.",
  "Tailwind CSS": "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.",
  "REST API": "REST API is an architectural style for designing networked applications using stateless communication protocols.",
  "GraphQL": "GraphQL is a query language for APIs and a runtime for executing those queries with your existing data.",
  "SOAP": "SOAP is a protocol for exchanging structured information in web services using XML.",
  "Agile": "Agile is a set of practices for software development emphasizing incremental delivery and collaboration.",
  "Scrum": "Scrum is an Agile framework for managing complex knowledge work, with an emphasis on iterative progress.",
  "Kanban": "Kanban is a visual workflow management method to improve work efficiency and quality.",
  "Waterfall": "Waterfall is a linear sequential software development process where progress flows in one direction.",
  "CI/CD": "CI/CD stands for Continuous Integration and Continuous Deployment, automating code integration and delivery.",
  "DevOps": "DevOps is a set of practices that combine software development and IT operations to shorten the development lifecycle.",
  "Linux": "Linux is a family of open-source Unix-like operating systems based on the Linux kernel.",
  "Windows": "Windows is a widely used operating system developed by Microsoft for personal computers.",
  "MacOS": "macOS is a series of proprietary graphical operating systems developed by Apple for their Mac computers.",
  "Unix": "Unix is a powerful, multiuser operating system originally developed in the 1970s at Bell Labs.",
  "Cybersecurity": "Cybersecurity involves protecting computer systems and networks from information disclosure, theft, or damage.",
  "Penetration Testing": "Penetration testing is a simulated cyber attack against a system to evaluate its security.",
  "Encryption": "Encryption is the process of encoding information to prevent unauthorized access.",
  "OAuth": "OAuth is an open standard for access delegation commonly used as a way to grant websites access to user information on other websites.",
  "SSL/TLS": "SSL/TLS are cryptographic protocols designed to provide communications security over a computer network.",
  "Google Cloud": "Google Cloud Platform (GCP) is a suite of cloud computing services offered by Google, providing infrastructure, platform, and software solutions for scalable and reliable application development and hosting."

};



  return (
    <div className="App">
       

      
    

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
