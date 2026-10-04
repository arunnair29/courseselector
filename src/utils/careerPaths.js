// Curated, general-knowledge guide to common career paths by subject area.
//
// IMPORTANT — this is deliberately NOT course-specific or company-specific
// data. Unlike the rest of this dataset (which is built from real,
// source-cited university/UCAS/Discover Uni figures), there is no reliable,
// verifiable per-course source for "which companies hire graduates of this
// exact course" across all 481 courses — most UK universities simply don't
// publish that. Rather than invent specific employer names against a real
// course (which would misrepresent it as verified data), this module offers
// well-established, general job titles graduates in each broad subject
// area commonly go on to — the kind of guidance a careers adviser would
// give, not a claim about any particular course or university. The UI
// carries an explicit disclaimer alongside it; see CAREER_PATHS_DISCLAIMER.

export const CAREER_PATHS_DISCLAIMER =
  "General guidance on common career paths for this subject area — not specific to this course or university, and not a guarantee of any outcome. For course-specific destinations, see the Career prospects figures above and the university's own careers service."

export const CAREER_PATHS = {
  'Acoustical Engineering': ['Acoustic Consultant', 'Audio/Sound Engineer', 'Noise & Vibration Engineer', 'Building Services Engineer', 'Product Development Engineer'],
  'Actuarial Science': ['Trainee Actuary', 'Risk Analyst', 'Pensions Consultant', 'Insurance Underwriter', 'Data Analyst'],
  'Aerospace Engineering': ['Aerospace Engineer', 'Aircraft Design Engineer', 'Systems Engineer', 'Flight Test Engineer', 'Manufacturing Engineer'],
  'Anatomy': ['Research Assistant', 'Anatomical Demonstrator/Technician', 'Biomedical Scientist', 'Medical Science Liaison', 'Further study (Medicine/postgraduate)'],
  'Animal Behaviour': ['Animal Care Specialist / Zookeeper', 'Conservation Officer', 'Animal Behaviour Consultant', 'Research Assistant', 'Veterinary Nurse (with further training)'],
  'Archaeological Science': ['Field Archaeologist', 'Heritage Consultant', 'Museum/Collections Officer', 'Environmental Consultant', 'Forensic Science roles'],
  'Architectural Engineering': ['Structural Engineer', 'Building Services Engineer', 'Architectural Technologist', 'Sustainability Consultant', 'Project Engineer'],
  'Artificial Intelligence': ['Machine Learning Engineer', 'AI Research Scientist', 'Data Scientist', 'Software Engineer', 'NLP/Computer Vision Engineer'],
  'Astrophysics': ['Data Scientist', 'Scientific Software Developer', 'Quantitative Analyst', 'Science Communicator', 'Further study/research (PhD)'],
  'Automotive Engineering': ['Automotive Engineer', 'Powertrain Engineer', 'Vehicle Design Engineer', 'Manufacturing/Production Engineer', 'Test Engineer'],
  'Biochemistry': ['Research Scientist', 'Clinical Biochemist', 'Laboratory Technician', 'Pharmaceutical Scientist', 'Regulatory Affairs Officer'],
  'Biology': ['Research Scientist', 'Laboratory Technician', 'Environmental Consultant', 'Science Teacher', 'Conservation Officer'],
  'Biology and Chemistry': ['Research Scientist', 'Laboratory Technician', 'Pharmaceutical Scientist', 'Science Teacher', 'Quality Control Analyst'],
  'Biomedical Engineering': ['Biomedical Engineer', 'Medical Devices Engineer', 'Clinical Engineer', 'R&D Engineer', 'Regulatory Affairs Specialist'],
  'Biomedical Sciences': ['Biomedical Scientist', 'Clinical Research Associate', 'Laboratory Technician', 'Pharmaceutical Industry roles', 'Further study (Medicine)'],
  'Biotechnology': ['Biotechnologist', 'Research Scientist', 'Bioprocess Engineer', 'Quality Assurance Officer', 'Regulatory Affairs Officer'],
  'Chemical Engineering': ['Process Engineer', 'Chemical Engineer', 'Production Engineer', 'Environmental Engineer', 'Energy/Petrochemical Engineer'],
  'Chemistry': ['Research Chemist', 'Laboratory Analyst', 'Quality Control Chemist', 'Science Teacher', 'Patent Examiner/Attorney (with further training)'],
  'Civil Engineering': ['Civil Engineer', 'Structural Engineer', 'Site Engineer', 'Project Manager', 'Geotechnical Engineer'],
  'Computer Science': ['Software Engineer', 'Data Scientist', 'DevOps Engineer', 'Product Manager', 'Cyber Security Analyst', 'Machine Learning Engineer'],
  'Conservation Biology and Ecology': ['Conservation Officer', 'Ecologist', 'Environmental Consultant', 'Wildlife Ranger', 'Countryside/Park Ranger'],
  'Cyber Security': ['Cyber Security Analyst', 'Penetration Tester', 'Security Consultant', 'SOC Analyst', 'Information Security Manager'],
  'Data Science': ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'Business Intelligence Analyst', 'Data Engineer'],
  'Dentistry': ['Dentist (Dental Foundation Training)', 'Dental Researcher', 'Oral & Maxillofacial trainee', 'Public Health Dentistry', 'Practice Ownership (later career)'],
  'Diagnostic Radiography': ['Diagnostic Radiographer', 'MRI/CT Radiographer', 'Sonographer (with further training)', 'Clinical Applications Specialist', 'Imaging Informatics roles'],
  'Discrete Mathematics': ['Data Analyst', 'Software Engineer', 'Cryptographer', 'Operational Researcher', 'Actuarial Analyst'],
  'Earth Sciences': ['Geologist', 'Environmental Consultant', 'Hydrogeologist', 'Mining/Exploration Geologist', 'Geoscience Researcher'],
  'Electrical and Electronic Engineering': ['Electrical Engineer', 'Electronics Engineer', 'Systems Engineer', 'Power Engineer', 'Embedded Software Engineer'],
  'Engineering': ['Graduate Engineer', 'Project Engineer', 'Design Engineer', 'Manufacturing Engineer', 'Consulting Engineer'],
  'Engineering Mathematics': ['Data Scientist', 'Systems Engineer', 'Quantitative Analyst', 'Software Engineer', 'Operational Researcher'],
  'Environmental Science': ['Environmental Consultant', 'Sustainability Officer', 'Conservation Officer', 'Environmental Scientist (regulatory bodies)', 'Climate/Energy Analyst'],
  'Evolutionary Biology': ['Research Scientist', 'Conservation Biologist', 'Science Communicator', 'Laboratory Technician', 'Further study (PhD/academia)'],
  'Food Science': ['Food Technologist', 'Quality Assurance Officer', 'Product Development Scientist', 'Regulatory Affairs Officer', 'Nutritionist (with further training)'],
  'Genetics': ['Research Scientist', 'Clinical Scientist', 'Laboratory Technician', 'Bioinformatician', 'Genetic Counsellor (with further training)'],
  'Geography': ['Environmental Consultant', 'Urban/Town Planner', 'GIS Analyst', 'Sustainability Officer', 'Market Research Analyst'],
  'Geology & Earth Sciences': ['Geologist', 'Environmental Consultant', 'Mining/Exploration Geologist', 'Hydrogeologist', 'Geotechnical roles'],
  'Human Sciences': ['Public Health roles', 'Policy Analyst', 'Research Assistant', 'NGO/Development Worker', 'Further study (Medicine/Anthropology)'],
  'Infection and Immunity': ['Research Scientist', 'Clinical Research Associate', 'Biomedical Scientist', 'Public Health roles', 'Pharmaceutical Scientist'],
  'Landscape Architecture': ['Landscape Architect', 'Urban Designer', 'Environmental Planner', 'Landscape Consultant', 'Heritage/Conservation roles'],
  'Manufacturing and Mechanical Engineering': ['Manufacturing Engineer', 'Mechanical Engineer', 'Production Engineer', 'Quality Engineer', 'Process Improvement Engineer'],
  'Marine Biology': ['Marine Biologist', 'Conservation Officer', 'Research Assistant', 'Environmental Consultant', 'Aquarist'],
  'Materials Science': ['Materials Engineer', 'Research Scientist', 'Quality Engineer', 'Process Engineer', 'R&D roles in manufacturing'],
  'Mathematics': ['Data Analyst', 'Actuarial Analyst', 'Operational Researcher', 'Software Engineer', 'Quantitative Analyst'],
  'Mathematics & Statistics': ['Data Scientist', 'Statistician', 'Actuarial Analyst', 'Quantitative Analyst', 'Operational Researcher'],
  'Mathematics and Physics': ['Data Scientist', 'Quantitative Analyst', 'Research Scientist', 'Software Engineer', 'Graduate Engineer'],
  'Mathematics, Operational Research, Statistics and Economics': ['Operational Researcher', 'Data Analyst', 'Economist', 'Actuarial Analyst', 'Business Analyst'],
  'Mechanical Engineering': ['Mechanical Engineer', 'Design Engineer', 'Manufacturing Engineer', 'Project Engineer', 'Maintenance/Reliability Engineer'],
  'Medical Engineering': ['Biomedical/Medical Devices Engineer', 'Clinical Engineer', 'R&D Engineer', 'Regulatory Affairs Specialist', 'Rehabilitation Engineer'],
  'Medical Physics': ['Medical Physicist (with further training)', 'Clinical Technologist', 'Radiation Protection Adviser', 'Imaging Physicist', 'Research Scientist'],
  'Medicinal Chemistry': ['Medicinal/Pharmaceutical Chemist', 'Drug Discovery Scientist', 'Quality Control Chemist', 'Regulatory Affairs Officer', 'Research Scientist'],
  'Medicine': ['Doctor (Foundation Programme)', 'Specialty Trainee Doctor', 'Medical Researcher', 'Public Health Doctor', 'NHS Clinical Leadership (later career)'],
  'Microbiology': ['Microbiologist', 'Research Scientist', 'Clinical/Public Health Laboratory Scientist', 'Quality Control Analyst', 'Pharmaceutical Scientist'],
  'Molecular Cell Biology': ['Research Scientist', 'Laboratory Technician', 'Biomedical Scientist', 'Pharmaceutical Scientist', 'Further study (PhD)'],
  'Natural Sciences': ['Research Scientist', 'Laboratory roles (biology/chemistry/physics)', 'Science Teacher', 'Data Analyst', 'Science Communicator'],
  'Neuroscience': ['Research Scientist', 'Clinical Research Associate', 'Assistant Psychologist', 'Pharmaceutical Scientist', 'Further study (Medicine/PhD)'],
  'Nutritional Sciences': ['Nutritionist', 'Dietitian (with further training)', 'Public Health roles', 'Food Industry Scientist', 'Health/Wellness Consultant'],
  'Oceanography': ['Oceanographer', 'Environmental Consultant', 'Marine Data Analyst', 'Research Scientist', 'Hydrographic Surveyor'],
  'Optometry': ['Optometrist', 'Dispensing Optician', 'Ophthalmic roles', 'Clinical Researcher', 'Practice Management (later career)'],
  'Pharmacology': ['Pharmacologist', 'Research Scientist', 'Drug Safety/Pharmacovigilance Officer', 'Regulatory Affairs Officer', 'Medical Science Liaison'],
  'Pharmacy': ['Pharmacist (community/hospital)', 'Clinical Pharmacist', 'Pharmaceutical Industry roles', 'Regulatory Affairs', 'Academic Pharmacy'],
  'Physics': ['Research Scientist', 'Data Analyst', 'Graduate Engineer', 'Science Teacher', 'Quantitative Analyst'],
  'Physics and Philosophy': ['Data Analyst', 'Policy Researcher', 'Science Writer/Communicator', 'Research Scientist', 'Management Consultant'],
  'Physiotherapy': ['Physiotherapist (NHS/private practice)', 'Sports Rehabilitation Specialist', 'Musculoskeletal Practitioner', 'Clinical Researcher', 'Community Health roles'],
  'Psychology': ['Assistant Psychologist', 'HR/People roles', 'Market Researcher', 'Mental Health Support Worker', 'Further study (Clinical/Educational Psychology)'],
  'Robotic Engineering': ['Robotics Engineer', 'Automation Engineer', 'Control Systems Engineer', 'Software/Firmware Engineer', 'R&D Engineer'],
  'Ship Science': ['Naval Architect', 'Marine Engineer', 'Ship Surveyor', 'Offshore Engineer', 'Project Engineer (marine industry)'],
  'Sport and Exercise Science': ['Sports Scientist', 'Strength & Conditioning Coach', 'Sports Therapist (with further training)', 'PE Teacher', 'Performance Analyst'],
  'Statistics': ['Statistician', 'Data Scientist', 'Actuarial Analyst', 'Market Research Analyst', 'Operational Researcher'],
  'Theoretical Physics': ['Research Scientist', 'Quantitative Analyst', 'Data Scientist', 'Software Engineer', 'Further study/academia (PhD)'],
  'Veterinary Biosciences': ['Research Scientist', 'Laboratory Technician', 'Animal Health/Welfare roles', 'Pharmaceutical Scientist', 'Further study (Veterinary Medicine)'],
  'Veterinary Medicine': ['Veterinary Surgeon', 'Veterinary Researcher', 'Animal Welfare/Charity roles', 'Veterinary Public Health', 'Practice Ownership (later career)'],
  'Zoology': ['Conservation Officer', 'Animal Care Specialist / Zookeeper', 'Research Scientist', 'Wildlife Ranger', 'Environmental Consultant'],
}

// Keyword-based fallback for any subjectArea not explicitly listed above
// (e.g. a future data-expansion pass adds a new category before this file
// is updated) — matched against broad, recognisable subject keywords so a
// reasonable general answer is still shown rather than nothing.
const FALLBACK_KEYWORDS = [
  ['engineer', ['Graduate Engineer', 'Design Engineer', 'Project Engineer', 'Manufacturing Engineer', 'Consulting Engineer']],
  ['comput', ['Software Engineer', 'Data Scientist', 'IT Consultant', 'Systems Analyst', 'DevOps Engineer']],
  ['data', ['Data Analyst', 'Data Scientist', 'Business Intelligence Analyst', 'Data Engineer', 'Quantitative Analyst']],
  ['math', ['Data Analyst', 'Actuarial Analyst', 'Operational Researcher', 'Quantitative Analyst', 'Software Engineer']],
  ['stat', ['Statistician', 'Data Scientist', 'Actuarial Analyst', 'Market Research Analyst', 'Operational Researcher']],
  ['physic', ['Research Scientist', 'Data Analyst', 'Graduate Engineer', 'Science Teacher', 'Quantitative Analyst']],
  ['chem', ['Research Chemist', 'Laboratory Analyst', 'Quality Control Chemist', 'Science Teacher', 'Regulatory Affairs Officer']],
  ['biolog', ['Research Scientist', 'Laboratory Technician', 'Environmental Consultant', 'Science Teacher', 'Conservation Officer']],
  ['medic', ['Doctor/Clinician (with further training)', 'Medical Researcher', 'Public Health roles', 'NHS roles', 'Further postgraduate study']],
  ['environment', ['Environmental Consultant', 'Sustainability Officer', 'Conservation Officer', 'Environmental Scientist', 'Climate/Energy Analyst']],
  ['psycholog', ['Assistant Psychologist', 'HR/People roles', 'Market Researcher', 'Mental Health Support Worker', 'Further study (Clinical Psychology)']],
]

const DEFAULT_CAREER_PATHS = [
  'Graduate scheme roles related to this subject',
  'Research or laboratory roles',
  'Roles in industry, the public sector, or academia',
  'Further postgraduate study (MSc/PhD)',
]

export function getCareerPaths(subjectArea) {
  if (CAREER_PATHS[subjectArea]) return CAREER_PATHS[subjectArea]
  const lower = (subjectArea || '').toLowerCase()
  for (const [keyword, paths] of FALLBACK_KEYWORDS) {
    if (lower.includes(keyword)) return paths
  }
  return DEFAULT_CAREER_PATHS
}
