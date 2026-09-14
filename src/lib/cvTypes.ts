export type SectionType =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "references";

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  start: string;
  end: string;
  details: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  role: string;
  contact: string;
}

export interface CVData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  photo: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  references: ReferenceItem[];
  sectionOrder: SectionType[];
  visibleSections: Record<SectionType, boolean>;
}

export const SECTION_LABELS: Record<SectionType, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  references: "References",
};

export const DEFAULT_SECTION_ORDER: SectionType[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "references",
];

export function emptyCV(): CVData {
  return {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    photo: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    references: [],
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    visibleSections: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
      languages: true,
      references: true,
    },
  };
}

export function sampleCV(): CVData {
  return {
    fullName: "Daniel Mwangi",
    jobTitle: "Software Engineer",
    email: "daniel.mwangi@example.com",
    phone: "+254 712 345 678",
    location: "Nairobi, Kenya",
    website: "linkedin.com/in/danielmwangi",
    photo: "",
    summary:
      "Motivated and detail-oriented Software Engineer with 3+ years of experience building scalable web applications. Passionate about clean code, continuous learning, and shipping products that solve real problems.",
    experience: [
      {
        id: "e1",
        role: "Software Engineer",
        company: "TechSolutions Ltd",
        location: "Nairobi, Kenya",
        start: "2022",
        end: "Present",
        current: true,
        bullets: [
          "Developed and maintained web applications using React and Node.js",
          "Collaborated with cross-functional teams to deliver high-quality software",
          "Improved application performance by 40% through targeted optimization",
        ],
      },
      {
        id: "e2",
        role: "Junior Developer",
        company: "BrightTech Solutions",
        location: "Nairobi, Kenya",
        start: "2020",
        end: "2021",
        current: false,
        bullets: [
          "Built responsive interfaces with HTML, CSS and JavaScript",
          "Assisted in database design and integration",
        ],
      },
    ],
    education: [
      {
        id: "ed1",
        degree: "BSc. Electrical & Electronics Engineering",
        school: "University of Nairobi",
        location: "Nairobi, Kenya",
        start: "2016",
        end: "2020",
        details: "",
      },
    ],
    skills: [
      { id: "s1", name: "JavaScript", level: 5 },
      { id: "s2", name: "React", level: 5 },
      { id: "s3", name: "Node.js", level: 4 },
      { id: "s4", name: "Python", level: 3 },
      { id: "s5", name: "Project Management", level: 4 },
      { id: "s6", name: "Problem Solving", level: 5 },
    ],
    projects: [],
    certifications: [],
    languages: [
      { id: "l1", name: "English", level: "Fluent" },
      { id: "l2", name: "Kiswahili", level: "Native" },
    ],
    references: [],
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    visibleSections: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: false,
      certifications: false,
      languages: true,
      references: false,
    },
  };
}
