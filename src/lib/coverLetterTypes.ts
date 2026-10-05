export interface CoverLetterData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  date: string;
  recipientName: string;
  recipientTitle: string;
  company: string;
  companyAddress: string;
  subject: string;
  salutation: string;
  body: string; // paragraphs separated by a blank line
  closing: string;
}

export function emptyLetter(): CoverLetterData {
  return {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    date: "",
    recipientName: "",
    recipientTitle: "",
    company: "",
    companyAddress: "",
    subject: "",
    salutation: "Dear Hiring Manager,",
    body: "",
    closing: "Yours sincerely,",
  };
}

export function todayString(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function sampleLetter(): CoverLetterData {
  return {
    fullName: "Daniel Mwangi",
    jobTitle: "Software Engineer",
    email: "daniel.mwangi@example.com",
    phone: "+254 712 345 678",
    location: "Nairobi, Kenya",
    website: "linkedin.com/in/danielmwangi",
    date: todayString(),
    recipientName: "Grace Wanjiru",
    recipientTitle: "Head of Engineering",
    company: "Savanna Digital Ltd",
    companyAddress: "Westlands, Nairobi",
    subject: "Application for Software Engineer",
    salutation: "Dear Ms. Wanjiru,",
    body:
      "I am writing to apply for the Software Engineer position at Savanna Digital. With over three years of experience building scalable web applications, I am confident I can contribute to your team from day one.\n\n" +
      "At TechSolutions Ltd, I developed and maintained React and Node.js applications used by thousands of customers, and improved performance by 40% through targeted optimisation. I work closely with designers and product managers to ship reliable features on schedule.\n\n" +
      "I would welcome the opportunity to discuss how my skills can support your goals. Thank you for your time and consideration.",
    closing: "Yours sincerely,",
  };
}

export function splitParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);
}
