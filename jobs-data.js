if (!localStorage.getItem('adminPassword')) {
    localStorage.setItem('adminPassword', 'edo2026');
}
if (!localStorage.getItem('applications')) {
    localStorage.setItem('applications', JSON.stringify([]));
}

const defaultJobs = [
    {
        id: 1,
        title: "Frontend Developer Intern",
        company: "Edo State ICT Agency",
        location: "Benin City, Edo State",
        type: "Internship",
        category: "Software Development",
        deadline: "2026-10-30",
        status: "open",
        postedDate: "2026-10-01",
        duration: "6 Months",
        stipend: "Competitive",
        description: "Join the Edo State ICT Agency to build and maintain public-facing web applications for citizens across Edo State. You will work on citizen portals and e-governance solutions.",
        responsibilities: [
            "Convert wireframes and mockups into responsive HTML/CSS web pages.",
            "Assist in optimizing web pages for maximum mobile performance.",
            "Collaborate with the database and backend teams on form integration.",
            "Participate in code reviews and weekly technical team syncs."
        ],
        requirements: [
            "Solid understanding of HTML5, CSS3, and JavaScript.",
            "Basic knowledge of React or Vue.js is an added advantage.",
            "Understanding of responsive web design.",
            "Familiarity with Git/GitHub."
        ]
    },
    {
        id: 2,
        title: "UI/UX Design Intern",
        company: "Edo State ICT Agency",
        location: "Benin City, Edo State",
        type: "Internship",
        category: "Design",
        deadline: "2026-11-15",
        status: "open",
        postedDate: "2026-10-05",
        duration: "4 Months",
        stipend: "Competitive",
        description: "Help design intuitive and accessible interfaces for Edo State digital services. You will create wireframes, prototypes, and user flows for public-facing platforms.",
        responsibilities: [
            "Design wireframes, mockups, and interactive prototypes.",
            "Conduct user research and usability testing.",
            "Collaborate with developers to ensure design implementation."
        ],
        requirements: [
            "Proficiency in Figma or Adobe XD.",
            "Strong portfolio demonstrating user-centered design.",
            "Understanding of color theory and typography."
        ]
    },
    {
        id: 3,
        title: "Database Administrator Intern",
        company: "Edo State ICT Agency",
        location: "Benin City, Edo State",
        type: "Internship",
        category: "Data & Infrastructure",
        deadline: "2026-11-20",
        status: "open",
        postedDate: "2026-10-08",
        duration: "6 Months",
        stipend: "Competitive",
        description: "Assist in managing spatial databases and state records. You will help backup, secure, and optimize large datasets used across Edo State government.",
        responsibilities: [
            "Perform routine database backups and maintenance.",
            "Write and optimize SQL queries.",
            "Monitor database performance and troubleshoot issues."
        ],
        requirements: [
            "Basic knowledge of SQL and database architecture.",
            "Familiarity with PostgreSQL or MySQL.",
            "High attention to detail."
        ]
    },
    {
        id: 4,
        title: "IT Support Helpdesk Intern",
        company: "Edo State ICT Agency",
        location: "Benin City, Edo State",
        type: "Internship",
        category: "IT Support",
        deadline: "2026-09-30",
        status: "closed",
        postedDate: "2026-09-01",
        duration: "3 Months",
        stipend: "Competitive",
        description: "Provide first-line technical support to government staff, troubleshoot hardware/software issues, and maintain IT equipment across departments.",
        responsibilities: [
            "Respond to helpdesk tickets promptly.",
            "Install and configure software and hardware.",
            "Maintain IT asset inventory."
        ],
        requirements: [
            "Good knowledge of Windows operating systems.",
            "Basic networking skills (LAN, WLAN).",
            "Excellent communication skills."
        ]
    },
    {
        id: 5,
        title: "Cybersecurity Analyst Intern",
        company: "Edo State ICT Agency",
        location: "Benin City, Edo State",
        type: "Internship",
        category: "Cybersecurity",
        deadline: "2026-12-01",
        status: "open",
        postedDate: "2026-10-10",
        duration: "6 Months",
        stipend: "Competitive",
        description: "Monitor state networks for security breaches, assist in vulnerability assessments, and help enforce security policies.",
        responsibilities: [
            "Monitor security alerts and logs.",
            "Conduct vulnerability scans.",
            "Assist in incident response."
        ],
        requirements: [
            "Understanding of network protocols and firewalls.",
            "Familiarity with basic security tools.",
            "Discretion and high ethical standards."
        ]
    },
    {
        id: 6,
        title: "Network Engineering Intern",
        company: "Edo State ICT Agency",
        location: "Benin City, Edo State",
        type: "Internship",
        category: "Data & Infrastructure",
        deadline: "2026-11-25",
        status: "open",
        postedDate: "2026-10-12",
        duration: "6 Months",
        stipend: "Competitive",
        description: "Assist in configuring and maintaining government network infrastructure across multiple MDAs.",
        responsibilities: [
            "Configure routers, switches, and access points.",
            "Troubleshoot network connectivity issues.",
            "Support LAN/WAN infrastructure."
        ],
        requirements: [
            "Understanding of TCP/IP, routing, and switching.",
            "CCNA training (certification not strictly required).",
            "Ability to work in server rooms."
        ]
    }
];

if (!localStorage.getItem('edoJobsDB')) {
    localStorage.setItem('edoJobsDB', JSON.stringify(defaultJobs));
}

const jobs = JSON.parse(localStorage.getItem('edoJobsDB'));