from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import re
import os

app = Flask(__name__)
CORS(app)  # Replace with actual Firebase URL



# Define skill categories and their skills
SKILL_CATEGORIES = {
    "Programming Languages": [
        "Python", "Java", "JavaScript", "TypeScript", "Ruby", "PHP", "C++", "C#", "Go", "Swift", "Kotlin", "Rust"
    ],
    "Frameworks": [
        "React", "Angular", "Vue", "Django", "Flask", "Rails", "Express", "Spring", "Laravel", "ASP.NET", "Flutter"
    ],
    "Databases": [
        "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "Cassandra", "Elasticsearch"
    ],
    "DevOps": [
        "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "Jenkins", "CircleCI", "Terraform", "Ansible"
    ],
    "Soft Skills": [
        "Communication", "Leadership", "Teamwork", "Time Management", "Problem Solving", "Creativity", "Adaptability"
    ],
    "Machine Learning / Data Science": [
        "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Keras", "Matplotlib", "Seaborn"
    ],
    "Web Technologies": [
        "HTML", "CSS", "Sass", "Less", "Bootstrap", "Tailwind CSS", "REST API", "GraphQL", "SOAP"
    ],
    "Methodologies": [
        "Agile", "Scrum", "Kanban", "Waterfall", "CI/CD", "DevOps"
    ],
    "Operating Systems": [
        "Linux", "Windows", "MacOS", "Unix"
    ],
    "Security": [
        "Cybersecurity", "Penetration Testing", "Encryption", "OAuth", "SSL/TLS"
    ]
}

ROLE_MAPPINGS = {
    "Frontend Developer": ["React", "JavaScript", "HTML", "CSS", "Vue", "Angular"],
    "Backend Developer": ["Node.js", "Express", "Flask", "Django", "Java", "PHP"],
    "Full Stack Developer": ["React", "Node.js", "MongoDB", "Express", "HTML", "CSS"],
    "Data Scientist": ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Machine Learning"],
    "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins"],
    "Mobile App Developer": ["React Native", "Flutter", "Java", "Kotlin", "Swift"],
    "Cloud Engineer": ["AWS", "Azure", "Google Cloud", "DevOps", "Linux"],
    "Software Tester": ["Selenium", "TestNG", "JUnit", "Postman", "Automation"],
    "AI/ML Engineer": ["Python", "TensorFlow", "PyTorch", "Deep Learning", "Machine Learning"],
    "Database Administrator": ["MySQL", "PostgreSQL", "MongoDB", "SQLite"]
}

ESSENTIAL_SECTIONS = {
    "education": ["education", "degree", "bachelor", "master", "university", "college", "school"],
    "experience": ["experience", "worked", "internship", "project", "role", "responsibility"],
    "projects": ["project", "developed", "created", "built"],
    "tools": ["tool", "technology", "software", "platform", "framework"],
    "certifications": ["certificate", "certification", "credential", "licensed", "exam"]
}
ESSENTIAL_SECTIONS = {
    "education": 20,
    "experience": 25,
    "skills": 25,
    "contact": 15,
    "summary": 15
}

def score_sections(text):
    score = 0
    text_lower = text.lower()

    if re.search(r'\beducation\b', text_lower):
        score += ESSENTIAL_SECTIONS["education"]
    if re.search(r'\bexperience\b', text_lower) or re.search(r'\bwork history\b', text_lower):
        score += ESSENTIAL_SECTIONS["experience"]
    if re.search(r'\bskills\b', text_lower):
        score += ESSENTIAL_SECTIONS["skills"]
    if re.search(r'\bcontact\b', text_lower) or re.search(r'\bemail\b', text_lower) or re.search(r'\bphone\b', text_lower):
        score += ESSENTIAL_SECTIONS["contact"]
    if re.search(r'\bsummary\b', text_lower) or re.search(r'\bobjective\b', text_lower):
        score += ESSENTIAL_SECTIONS["summary"]
    
    return score

def score_job_keywords(skills, target_role):
    keywords = ROLE_MAPPINGS.get(target_role, [])
    if not keywords:
        return 0
    matched = set(skills).intersection(keywords)
    ratio = len(matched) / len(keywords)
    return round(ratio * 40, 2)  # max 40 points
def score_ats_density(skills):
    ratio = len(skills) / len(ALL_SKILLS)
    if ratio > 1:
        ratio = 1
    return round(ratio * 40, 2)
def calculate_final_score(text, skills, target_role):
    section_score = score_sections(text)
    job_score = score_job_keywords(skills, target_role)
    ats_score = score_ats_density(skills)

    total_score = section_score + job_score + ats_score
    if total_score > 100:
        total_score = 100
    return round(total_score, 2)


def suggest_roles(skills):
    suggested_roles = []
    for role, keywords in ROLE_MAPPINGS.items():
        match_count = len(set(skills).intersection(keywords))
        if match_count >= 2:  # minimum 2 skills matched
            suggested_roles.append(role)
    return suggested_roles


# Flatten all skills into one list for detection
ALL_SKILLS = [skill for skills in SKILL_CATEGORIES.values() for skill in skills]

def extract_text_from_pdf(pdf_file):
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def extract_skills(text):
    found_skills = []
    for skill in ALL_SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE):
            found_skills.append(skill)
    return list(set(found_skills))

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No resume file uploaded'}), 400
    
    resume_file = request.files['resume']
    text = extract_text_from_pdf(resume_file)
    detected_skills = extract_skills(text)
    roles = suggest_roles(detected_skills)

    
    # Map detected skills to categories
    categorized_skills = {}
    for category, skills in SKILL_CATEGORIES.items():
        categorized_skills[category] = [skill for skill in detected_skills if skill in skills]
    
    target_role = request.form.get('target_role', 'Full Stack Developer')  # Default role if none sent
    score = calculate_final_score(text, detected_skills, target_role)
    # Use target_role to calculate score if provided, else default role or 0
    if target_role:
        score = calculate_final_score(text, detected_skills, target_role)
    else:
        score = score_sections(text)  # fallback if no role provided
    return jsonify({
        'raw_text': text[:500],  # preview first 500 chars
        'skills': categorized_skills,
        'suggested_roles': roles,
        'score': score,
        'target_role': target_role
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
