export const INITIAL_BIODATA = {
  name: "John Doe",
  location: "City, Country",
  phoneNumber: "+62 812-3456-7890",
  gmail: "johndoe@example.com",
  linkedin: "linkedin.com/in/johndoe",
  github: "github.com/johndoe",
};

export const INITIAL_CV_DATA = {
  summary: {
    title: "Summary",
    template: "description",
    entries: [
      {
        id: "summary_1",
        description:
          "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>",
        isVisible: true,
        linkUrl: "",
      },
    ],
  },
  education: {
    title: "Education",
    template: "normal",
    entries: [
      {
        id: "education_1",
        title: "Bachelor of Science in Major",
        subtitle: "University Name (GPA 3.80 / 4.00)",
        date: "09/2020 - 07/2024",
        location: "City, Country",
        description:
          '<p>Final Project: <em>\"Title of Final Project or Thesis\"</em></p><ul class=\"list-disc pl-4\"><li><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></li><li><p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p></li><li><p>Tools used: Tool A, Tool B, Tool C</p></li></ul><p></p>',
        isVisible: true,
        linkUrl: "https://example.com/thesis",
      },
    ],
  },
  workExperience: {
    title: "Work Experience",
    template: "normal",
    entries: [
      {
        id: "work_1",
        title: "Job Title",
        subtitle: "Company Name",
        date: "01/2023 - Present",
        location: "City, Country",
        description:
          '<ul class=\"list-disc pl-4\"><li><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, increasing <strong>efficiency by 20%</strong>.</p></li><li><p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p></li><li><p>Collaborated with cross-functional teams to achieve project milestones.</p></li></ul><p></p>',
        isVisible: true,
        linkUrl: "",
      },
    ],
  },
  msib: {
    title: "Internship / MSIB",
    template: "normal",
    entries: [
      {
        id: "internship_1",
        title: "Internship Position",
        subtitle: "Company / Organization Name",
        date: "08/2024 - 12/2024",
        location: "Remote",
        description:
          '<ul class=\"list-disc pl-4\"><li><p>Completed intensive training program covering Subject A, Subject B, and Subject C.</p></li><li><p>Developed a final project using specific technologies and methodologies.</p></li><li><p>Graduated with distinction after completing <strong>X hours</strong> of coursework.</p></li></ul><p></p>',
        isVisible: true,
        linkUrl: "https://example.com/certificate",
      },
      {
        id: "internship_2",
        title: "Another Internship Position",
        subtitle: "Another Company",
        date: "01/2024 - 06/2024",
        location: "City",
        description:
          '<ul class=\"list-disc pl-4\"><li><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></li><li><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p></li></ul><p></p>',
        isVisible: true,
        linkUrl: "https://example.com/portfolio",
      },
    ],
  },
  organization: {
    title: "Organization",
    template: "normal",
    entries: [
      {
        id: "org_1",
        title: "Organization Name",
        subtitle: "Role / Position",
        date: "01/2022 - 12/2023",
        location: "City",
        description:
          '<ul class=\"list-disc pl-4\"><li><p>Led a team of X members to organize annual events.</p></li></ul><ul class=\"list-disc pl-4\"><li><p>Managed budget planning and execution for various projects.</p></li></ul><p></p>',
        isVisible: true,
        linkUrl: "",
      },
      {
        id: "org_2",
        title: "Another Organization",
        subtitle: "Member / Staff",
        date: "06/2021 - 12/2021",
        location: "City",
        description:
          '<ul class=\"list-disc pl-4\"><li><p>Contributed to community service activities involving <strong>100+ participants</strong>.</p></li></ul><ul class=\"list-disc pl-4\"><li><p>Facilitated workshops and seminars for students.</p></li></ul><p></p>',
        isVisible: true,
        linkUrl: "",
      },
      {
        id: "org_3",
        title: "Event Committee",
        subtitle: "Division Coordinator",
        date: "01/2021 - 03/2021",
        location: "City",
        description:
          '<ul class="list-disc pl-4"><li><p>Coordinated logistics and scheduling for a major university event.</p></li><li><p>Liaised with external vendors and sponsors.</p></li></ul><p></p>',
        isVisible: false,
        linkUrl: "",
      },
    ],
  },
  certification: {
    title: "Certifications",
    template: "simple",
    entries: [
      {
        id: "cert_1",
        title: "Certification Name A",
        description: "Issued by Issuing Organization",
        date: "2025",
        isVisible: true,
        linkUrl: "https://example.com/cert1",
      },
      {
        id: "cert_2",
        title: "Certification Name B",
        description: "Issued by Another Organization",
        date: "2024",
        isVisible: true,
        linkUrl: "https://example.com/cert2",
      },
      {
        id: "cert_3",
        title: "Workshop on Topic C",
        description: "Issued by Provider",
        date: "2024",
        isVisible: true,
        linkUrl: "https://example.com/cert3",
      },
      {
        id: "cert_4",
        title: "Training Course D",
        description: "Issued by Training Center",
        date: "2023",
        isVisible: true,
        linkUrl: "https://example.com/cert4",
      },
    ],
  },
  skills: {
    title: "Skills",
    template: "simple_no_link",
    entries: [
      {
        id: "skill_1",
        title: "Soft Skills",
        description: "Leadership, Communication, Teamwork, Problem Solving",
        date: "",
        isVisible: true,
        linkUrl: "",
      },
      {
        id: "skill_2",
        title: "Technical Skills",
        description: "Software A, Framework B, Language C, Tool D",
        date: "",
        isVisible: true,
        linkUrl: "",
      },
      {
        id: "skill_3",
        title: "Languages",
        description: "Native Language (Native), Second Language (Intermediate)",
        date: "",
        isVisible: true,
        linkUrl: "",
      },
    ],
  },
};
