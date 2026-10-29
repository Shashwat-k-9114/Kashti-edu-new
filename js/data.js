/* =====================================================================
   KASHTI EDUCARE · SITE CONTENT
   ---------------------------------------------------------------------
   Every list on the site (notices, downloads, programmes, partners,
   gallery, FAQs…) is rendered from this one file. Edit here, save,
   refresh. No build step needed.

   Images: paths below are relative to `config.img`. They currently
   point at the live site's /public folder. To self-host, copy the
   Next.js `public/images` folder and `logo.jpeg` into this site's root
   and set  img: ""  (then also find/replace
   "https://kashtieducare.com/images/" → "images/" in the .html files).
   ===================================================================== */

window.KASHTI = {
  config: {
    img: "https://kashtieducare.com",
    email: "engage@kashtieducare.com",
    phone: "+91 8307039685",
    phoneHref: "+918307039685",
    location: "India",
    /* Paste a form endpoint (Formspree, Getform, Google Apps Script web app…)
       to receive enquiries directly. Left empty, the form opens the
       visitor's email app with everything pre-filled. */
    formEndpoint: ""
  },

  announcement: {
    text: "Winter cohort applications are now open for Global Immersion Programmes.",
    cta: "View programmes",
    href: "programs.html?theme=global#catalogue"
  },

  /* ---------- NOTICE BOARD (newest first) ---------- */
  notices: [
    { date: "2026-08-18", tag: "Applications", title: "Winter cohort applications now open for Global Immersion Programmes", href: "programs.html?theme=global#catalogue" },
    { date: "2026-08-05", tag: "Partnerships", title: "New partnership: three additional Higher Education institutions onboarded", href: "partners.html" },
    { date: "2026-07-27", tag: "Programmes", title: "STEM Tours adds a new Coimbatore–Siruvani circuit for the 2026–27 season", href: "programs.html?p=stem-tours-school" },
    { date: "2026-07-14", tag: "Deadline", title: "Registration deadline: Placement Readiness Retreats, Batch 3", href: "programs.html?p=placement-readiness-retreats-he" },
    { date: "2026-07-02", tag: "Recognition", title: "Kashti Educare featured in NEP 2020 experiential-learning case studies", href: "why-kashti.html#nep" }
  ],

  /* ---------- RESOURCES & DOWNLOADS ----------
     Add the PDF path in `url` (e.g. "downloads/school-catalogue.pdf").
     Until then the link asks us for the file by email. */
  downloads: [
    { title: "Higher Education Programme Brochure 2026–27", meta: "PDF · 4.1 MB", url: "" },
    { title: "School Programs Catalogue 2026–27", meta: "PDF · 3.6 MB", url: "" },
    { title: "Parent & Guardian Consent Form (Template)", meta: "PDF · 210 KB", url: "" },
    { title: "Safety & Risk Management Policy", meta: "PDF · 480 KB", url: "" },
    { title: "Partner Institution MOU (Template)", meta: "PDF · 190 KB", url: "" }
  ],

  featured: [
    {
      img: "/images/hero/devdutt-record-to-role-model.jpg",
      alt: "Lt Cdr Devdutt Sharma swimming, cycling and running: a composite marking his Guinness World Records",
      kicker: "Featured story",
      title: "From Record to Role Model",
      text: "Lt Cdr Devdutt Sharma swam, cycled and ran his way into the Guinness World Records."
    },
    {
      img: "/images/hero/dwarka-future-conclave.jpg",
      alt: "Students with a VR headset beside a robot, with a skyline stretching from Dwarka to Delhi landmarks",
      kicker: "Event",
      title: "Dwarka Education & Future Conclave 2026",
      text: "Future skills, VR and robotics, from Dwarka to the world."
    }
  ],

  /* ---------- 8 PROGRAMME THEMES ---------- */
  themes: [
    { id: "stem", no: "01", name: "Future & STEM Exploration", tagline: "Where curiosity meets what's next.", color: "#2150C2", icon: "rocket", audience: "School & Higher Ed",
      desc: "Hands-on exposure to science, technology, research and innovation: live labs, research centres and future-facing industries.",
      offers: ["STEM Tours", "Research & Innovation Centre Visits", "Innovation Labs", "Startup Ecosystem Visits"],
      img: "/images/gallery/isro-visit-1.jpeg", imgAlt: "Students on a visit to ISRO" },
    { id: "lead", no: "02", name: "Leadership, Discipline & Character", tagline: "Build the person behind the performance.", color: "#6544CC", icon: "flag", audience: "School & Higher Ed",
      desc: "Structured residential and outdoor experiences that build discipline, resilience, leadership, teamwork, decision-making and personal responsibility.",
      offers: ["Boot Camps & Discipline Programmes", "Skill Development Programmes", "Leadership-oriented experiential learning", "Character development"],
      img: "/images/gallery/leadership-session.jpeg", imgAlt: "A leadership and mentorship session" },
    { id: "adv", no: "03", name: "Adventure & Experiential Learning", tagline: "Learning through doing.", color: "#3D8B33", icon: "mountain", audience: "School & Higher Ed",
      desc: "Outdoor challenges, exploration and collaborative experiences that turn unfamiliar environments into confidence, problem-solving, teamwork and discovery.",
      offers: ["Experiential & Adventure Learning", "Applied & Outdoor Learning", "Day Excursions", "Nature-based experiences"],
      img: "/images/gallery/expedition-group-1.jpg", imgAlt: "Kashti group at the Sitabani buffer zone, Corbett National Park" },
    { id: "career", no: "04", name: "Career & Industry Exposure", tagline: "Let students see where learning leads.", color: "#0E8C84", icon: "factory", audience: "School & Higher Ed",
      desc: "Connects students with industries, professionals, workplaces and emerging careers to build curiosity, application and career awareness.",
      offers: ["Industrial Visits", "Career Exposure", "Industry Connect", "Skill Development"],
      img: "/images/gallery/ntpc-activity.jpeg", imgAlt: "An activity session at NTPC" },
    { id: "uni", no: "05", name: "University & Future Pathways", tagline: "Turn aspiration into direction.", color: "#C2560C", icon: "cap", audience: "School & Higher Ed",
      desc: "Lets students experience universities, academic environments and emerging disciplines before they make major education decisions.",
      offers: ["University Exposure Programmes", "Higher Education Awareness", "Career Discovery", "Academic ecosystem exposure"],
      img: "/images/gallery/opj-visit-1.jpeg", imgAlt: "A visit to O.P. Jindal Global University" },
    { id: "culture", no: "06", name: "Culture, Wellness & Social Development", tagline: "Develop perspective beyond the classroom.", color: "#CF4A6E", icon: "leaf", audience: "School & Higher Ed",
      desc: "Cultural, heritage, wellness, community and national experiences that build identity, responsibility, resilience and a sense of place in the wider world.",
      offers: ["Spiritual & Wellness Retreats", "Heritage & Culture", "Social responsibility", "Community experiences"],
      img: "/images/gallery/giving-back-to-society.jpeg", imgAlt: "Kashti team members at a community service initiative" },
    { id: "global", no: "07", name: "Global & International Immersion", tagline: "Expand the student's world.", color: "#1584C7", icon: "globe", audience: "School & Higher Ed",
      desc: "International experiences built around cross-cultural understanding, global exposure, academic discovery, industry ecosystems and global citizenship.",
      offers: ["Global Immersion Programmes", "International exposure", "Cross-cultural learning", "International academic & industry exposure"],
      img: "/images/gallery/nepal-mp-visit.jpeg", imgAlt: "A visit with a Nepal Member of Parliament, hosted by Muni International" },
    { id: "ent", no: "08", name: "Entrepreneurship & Innovation", tagline: "Go where ideas become ventures.", color: "#D99A06", icon: "bulb", audience: "Higher Education",
      desc: "Founder journeys, startup immersions, incubators and innovation ecosystems that show how ventures are built, from first idea to funded venture.",
      offers: ["Founder Learning Expeditions", "Startup Immersion Programs", "Innovation Labs", "Incubator & Accelerator Visits"],
      img: "/images/gallery/scrap-uncle-meeting.jpeg", imgAlt: "A meeting with the founders of Scrap Uncle" }
  ],

  /* Higher-education portfolio groups (from /programs/higher-education) */
  heGroups: {
    "Academic & Industry Exposure": "Take academic learning into the real economy.",
    "Entrepreneurship & Innovation": "Go where ideas become ventures.",
    "Career Development": "Bridge the gap between campus and career.",
    "Experiential Learning": "Learn through experience, challenge and reflection.",
    "Global Learning": "Put students into a global context.",
    "Alumni Programs": "Turn alumni networks into active communities.",
    "Faculty Programs": "Develop the people who develop students."
  },

  /* ---------- FULL CATALOGUE: 53 PROGRAMMES ----------
     aud: "school" | "he"   formats: one, multi, res, intl   themes: ids above */
  programmes: [
    /* School (12) */
    { name: "STEM Tours", aud: "school", formats: ["one", "multi"], themes: ["stem"],
      desc: "Visits to science and technology centres, labs and STEM-focused institutions that spark curiosity about science and technology. Most visits include an interactive or demonstration element, and multi-city circuits let students compare sites.",
      details: { "Recommended for": "Grades 6–12", "Suggested length": "1 day for a single site, 2–3 days for a circuit", "Recommended months": "October to March", "Group size": "30–45 students" },
      circuits: ["Pune–Lonavala", "Bengaluru–Mysuru", "Chennai–Sriharikota (space research & launch infrastructure)", "Jaipur–Bhadla–Jaisalmer (solar power infrastructure)", "Indore–Pithampur–Ujjain", "Ahmedabad–Sanand–Kevadia", "Kochi–Munnar–Thekkady–Alleppey", "Coimbatore–Siruvani"] },
    { name: "Boot Camps & Discipline Programs", aud: "school", formats: ["multi", "res"], themes: ["lead"],
      desc: "Structured, often military-style camps that build discipline, routine and resilience." },
    { name: "Experiential & Adventure Learning", aud: "school", formats: ["multi", "res"], themes: ["adv"],
      desc: "Outdoor, activity-based learning that pairs adventure elements with structured experiential lessons." },
    { name: "Border & Patriotism Tours", aud: "school", formats: ["multi"], themes: ["culture"],
      desc: "Trips to border areas and defence-related sites that build patriotism, geographic understanding and awareness of national security." },
    { name: "Spiritual & Wellness Retreats", aud: "school", formats: ["one", "multi"], themes: ["culture"],
      desc: "Retreats focused on mindfulness, wellness and inner development for school-age students." },
    { name: "Career Exposure & Industry Connect", aud: "school", formats: ["one"], themes: ["career"],
      desc: "Early exposure to industries and careers through visits and conversations with working professionals." },
    { name: "Applied Skill & Outdoor Learning", aud: "school", formats: ["one", "multi"], themes: ["adv"],
      desc: "Hands-on skill-building activities set in outdoor learning environments." },
    { name: "University Exposure Programs", aud: "school", formats: ["one", "multi"], themes: ["uni"],
      desc: "Visits to universities and colleges that introduce school students to higher-education pathways early." },
    { name: "Industrial Visits", aud: "school", formats: ["one"], themes: ["career"],
      desc: "Age-appropriate visits to factories and businesses that introduce school students to manufacturing and operations." },
    { name: "Day Excursions", aud: "school", formats: ["one"], themes: ["adv"],
      desc: "Single-day trips to educational or recreational destinations aligned with the school curriculum." },
    { name: "Skill Development Programs", aud: "school", formats: ["one", "multi"], themes: ["lead"],
      desc: "Practical, age-appropriate skills training that goes beyond the standard classroom curriculum." },
    { name: "Global Immersion Programs", aud: "school", formats: ["multi", "intl"], themes: ["global"],
      desc: "International trips that expose school students to global culture and education systems." },

    /* Higher Education (41) */
    { name: "Industrial Visits", aud: "he", group: "Academic & Industry Exposure", formats: ["one"], themes: ["career"],
      desc: "Guided tours of live factories to see manufacturing, quality systems and supply chains in action." },
    { name: "Corporate Exposure Tours", aud: "he", group: "Academic & Industry Exposure", formats: ["one"], themes: ["career"],
      desc: "Visits to corporate offices to observe workplace settings, departments and professional culture." },
    { name: "Manufacturing Cluster Visits", aud: "he", group: "Academic & Industry Exposure", formats: ["one", "multi"], themes: ["career"],
      desc: "Tours of industrial hubs, such as textiles or electronics, showing how supporting industries work together." },
    { name: "Research & Innovation Centre Visits", aud: "he", group: "Academic & Industry Exposure", formats: ["one"], themes: ["stem"],
      desc: "Visits to R&D labs, innovation centres and science parks that show applied research, prototyping and technology transfer in practice." },
    { name: "Business Smart Tours", aud: "he", group: "Academic & Industry Exposure", formats: ["one", "multi"], themes: ["career"],
      desc: "Multi-stop circuits across sectors for a fast overview of different business models." },
    { name: "International Trade Fair & Expo Tours", aud: "he", group: "Academic & Industry Exposure", formats: ["multi", "intl"], themes: ["global"],
      desc: "Accompanied trips to major global trade fairs and expos for direct insight into sourcing, exhibitions and market trends." },
    { name: "Canton Fair Business Tours", aud: "he", group: "Academic & Industry Exposure", formats: ["multi", "intl"], themes: ["global"],
      desc: "Specialised tours to the Canton Fair in China, one of the world's largest trade fairs, for hands-on experience of sourcing, negotiation and trade networks." },
    { name: "Startup Ecosystem Visits", aud: "he", group: "Entrepreneurship & Innovation", formats: ["one"], themes: ["ent"],
      desc: "Visits to startup hubs and co-working spaces to see how early-stage companies operate and what support surrounds them." },
    { name: "MSME Exposure Programs", aud: "he", group: "Academic & Industry Exposure", formats: ["one", "multi"], themes: ["career"],
      desc: "Visits to small and medium enterprises to understand grassroots entrepreneurship and its challenges." },
    { name: "Entrepreneurship Exposure Tours", aud: "he", group: "Entrepreneurship & Innovation", formats: ["one", "multi"], themes: ["ent"],
      desc: "Tours introducing students to entrepreneurial ventures, founders and business journeys across industries." },
    { name: "Founder Learning Expeditions", aud: "he", group: "Entrepreneurship & Innovation", formats: ["multi"], themes: ["ent", "career"],
      desc: "In-depth, direct interactions with startup founders about their journeys, decisions and setbacks." },
    { name: "Startup Immersion Programs", aud: "he", group: "Entrepreneurship & Innovation", formats: ["multi", "res"], themes: ["ent"],
      desc: "Multi-day residential programmes where students work alongside a startup team and observe daily operations." },
    { name: "Innovation Labs", aud: "he", group: "Entrepreneurship & Innovation", formats: ["one"], themes: ["ent", "stem"],
      desc: "Visits to innovation labs and makerspaces to explore prototyping tools, design-thinking spaces and innovation workflows." },
    { name: "Incubator & Accelerator Visits", aud: "he", group: "Entrepreneurship & Innovation", formats: ["one"], themes: ["ent"],
      desc: "Visits to incubators and accelerators to understand mentoring, funding pathways and venture-building support." },
    { name: "Business Leadership Journeys", aud: "he", group: "Entrepreneurship & Innovation", formats: ["multi"], themes: ["lead", "career"],
      desc: "Curated trips to meet business leaders and CXOs for first-hand leadership insight." },
    { name: "Social Entrepreneurship Programs", aud: "he", group: "Entrepreneurship & Innovation", formats: ["multi"], themes: ["culture", "ent"],
      desc: "Exposure to social enterprises tackling community problems, and the impact-driven business models behind them." },
    { name: "Career Exposure Programs", aud: "he", group: "Career Development", formats: ["multi"], themes: ["career"],
      desc: "Structured introductions to varied career paths through site visits and professional interaction." },
    { name: "Industry Connect Programs", aud: "he", group: "Career Development", formats: ["one", "multi"], themes: ["career"],
      desc: "Networking sessions linking students with professionals for mentorship and career guidance." },
    { name: "Leadership Development Camps", aud: "he", group: "Career Development", formats: ["multi", "res"], themes: ["lead"],
      desc: "Camps mixing workshops, activities and outdoor challenges to build practical leadership skills." },
    { name: "Skill Development Programs", aud: "he", group: "Career Development", formats: ["multi"], themes: ["lead", "career"],
      desc: "Hands-on, employability-focused skills training beyond the standard curriculum." },
    { name: "Campus-to-Corporate Programs", aud: "he", group: "Career Development", formats: ["multi"], themes: ["career"],
      desc: "Transition programmes for final-year students covering workplace etiquette, communication and readiness." },
    { name: "Placement Readiness Retreats", aud: "he", group: "Career Development", formats: ["multi", "res"], themes: ["career"],
      desc: "Residential retreats focused on interview preparation, résumé building and placement strategy." },
    { name: "Adventure Leadership Camps", aud: "he", group: "Experiential Learning", formats: ["multi", "res"], themes: ["adv", "lead"],
      desc: "Outdoor camps pairing adventure activities with structured leadership exercises." },
    { name: "Trekking Expeditions", aud: "he", group: "Experiential Learning", formats: ["multi", "res"], themes: ["adv"],
      desc: "Guided treks through natural or mountain terrain that build resilience, teamwork and physical endurance." },
    { name: "Outdoor Leadership Programs", aud: "he", group: "Experiential Learning", formats: ["multi", "res"], themes: ["adv", "lead"],
      desc: "Structured outdoor programmes that develop leadership through hands-on experiential challenges." },
    { name: "Community Service Programs", aud: "he", group: "Experiential Learning", formats: ["multi"], themes: ["culture"],
      desc: "Volunteering and service trips that involve students directly in social-impact projects." },
    { name: "Cultural & Heritage Tours", aud: "he", group: "Experiential Learning", formats: ["one", "multi"], themes: ["culture"],
      desc: "Visits to historical and cultural sites that build heritage appreciation and cultural understanding." },
    { name: "Border Tourism Tours", aud: "he", group: "Experiential Learning", formats: ["multi"], themes: ["culture"],
      desc: "Trips to border areas and defence outposts that build patriotism, geographic awareness and an understanding of national security." },
    { name: "Educational Excursions", aud: "he", group: "Experiential Learning", formats: ["one"], themes: ["adv"],
      desc: "Academic trips to museums, science centres and similar sites, aligned with curriculum themes." },
    { name: "University Exchange Programs", aud: "he", group: "Global Learning", formats: ["multi", "intl", "res"], themes: ["uni", "global"],
      desc: "Semester-long or short-term exchange placements at partner universities abroad." },
    { name: "Global Immersion Programs", aud: "he", group: "Global Learning", formats: ["multi", "intl"], themes: ["global"],
      desc: "Short international immersion trips exposing students to global business, culture and education systems. University visits, business interactions and cultural experiences are combined into one itinerary, so the trip feels like a single journey.",
      details: { "Recommended for": "UG & PG students", "Suggested length": "7–14 days", "Recommended months": "May to June and December to January (academic breaks)", "Group size": "20–30 students" } },
    { name: "International Business Delegations", aud: "he", group: "Global Learning", formats: ["multi", "intl"], themes: ["global"],
      desc: "Trips in which student or faculty delegations meet directly with businesses and institutions overseas." },
    { name: "Cross-Cultural Learning Programs", aud: "he", group: "Global Learning", formats: ["multi", "intl"], themes: ["global"],
      desc: "Structured international interactions designed to build cross-cultural competence." },
    { name: "Alumni Reunion Retreats", aud: "he", group: "Alumni Programs", formats: ["multi", "res"], themes: [],
      desc: "Reunion retreats that turn alumni networks into active communities." },
    { name: "Networking Retreats", aud: "he", group: "Alumni Programs", formats: ["multi", "res"], themes: [],
      desc: "Networking retreats that reconnect alumni with one another and with their institution." },
    { name: "Leadership Retreats", aud: "he", group: "Alumni Programs", formats: ["multi", "res"], themes: ["lead"],
      desc: "Retreats for alumni leadership development and mentorship engagement with current students." },
    { name: "Faculty Development Programs (FDPs)", aud: "he", group: "Faculty Programs", formats: ["multi"], themes: [],
      desc: "Development programmes for the faculty who teach and mentor students." },
    { name: "Academic & Research Exposure Visits", aud: "he", group: "Faculty Programs", formats: ["multi"], themes: ["stem"],
      desc: "Visits to research institutions and universities where faculty observe academic best practice first-hand." },
    { name: "International Faculty Immersion Programs", aud: "he", group: "Faculty Programs", formats: ["multi", "intl"], themes: ["global"],
      desc: "International trips giving faculty direct exposure to global education systems and teaching practices." },
    { name: "Wellness & Spiritual Retreats", aud: "he", group: "Faculty Programs", formats: ["multi", "res"], themes: ["culture"],
      desc: "Retreats focused on faculty wellbeing, mindfulness and stress management." },
    { name: "Team Building Programs", aud: "he", group: "Faculty Programs", formats: ["one", "multi", "res"], themes: ["lead"],
      desc: "Activities that strengthen collaboration, trust and culture within faculty teams." }
  ],

  formatLabels: { one: "One Day", multi: "Multi-Day", res: "Residential", intl: "International" },

  /* ---------- HERO CALENDAR: a sample school year (one school programme per month) ---------- */
  roadmap: [
    { m: "2026-04", prog: "Day Excursions", theme: "adv", fmt: "1 day", days: [18], stage: "Orient", note: "Open the year with a curriculum-linked day out." },
    { m: "2026-05", prog: "Spiritual & Wellness Retreats", theme: "culture", fmt: "1 day", days: [9], stage: "Orient", note: "Mindfulness and wellbeing before the summer break." },
    { m: "2026-06", prog: "Boot Camps & Discipline Programs", theme: "lead", fmt: "Residential", days: [8, 9, 10, 11, 12], stage: "Orient", note: "Summer camp: routine, discipline and resilience." },
    { m: "2026-07", prog: "Skill Development Programs", theme: "lead", fmt: "1 day", days: [18], stage: "Immerse", note: "Practical skills beyond the classroom." },
    { m: "2026-08", prog: "Industrial Visits", theme: "career", fmt: "1 day", days: [21], stage: "Immerse", note: "See manufacturing and operations up close." },
    { m: "2026-09", prog: "University Exposure Programs", theme: "uni", fmt: "1 day", days: [12], stage: "Immerse", note: "Meet higher-education pathways early." },
    { m: "2026-10", prog: "STEM Tours", theme: "stem", fmt: "2–3 day circuit", days: [14, 15, 16], stage: "Build", note: "STEM season opens, e.g. the Chennai–Sriharikota circuit." },
    { m: "2026-11", prog: "Applied Skill & Outdoor Learning", theme: "adv", fmt: "2 days", days: [20, 21], stage: "Build", note: "Hands-on skills in the outdoors." },
    { m: "2026-12", prog: "Global Immersion Programs", theme: "global", fmt: "International", days: [20, 21, 22, 23, 24, 25, 26], stage: "Build", note: "Winter cohort: global culture and education systems." },
    { m: "2027-01", prog: "Border & Patriotism Tours", theme: "culture", fmt: "Multi-day", days: [22, 23, 24, 25], stage: "Transform", note: "Republic Day season at border and defence sites." },
    { m: "2027-02", prog: "Experiential & Adventure Learning", theme: "adv", fmt: "Residential", days: [5, 6, 7, 8], stage: "Transform", note: "Adventure camp with structured reflection." },
    { m: "2027-03", prog: "Career Exposure & Industry Connect", theme: "career", fmt: "1 day", days: [20], stage: "Transform", note: "Close the year talking to working professionals." }
  ],

  /* ---------- RECENT EXPEDITIONS ---------- */
  expeditions: [
    { title: "STEM Tours", when: "Feb 2026", where: "Pune–Lonavala Circuit", theme: "stem", id: "stem-tours-school" },
    { title: "Leadership Development Camps", when: "Jan 2026", where: "Aravalli Hills, Rajasthan", theme: "lead", id: "leadership-development-camps-he" },
    { title: "Global Immersion Programs", when: "Dec 2025", where: "Singapore & Malaysia", theme: "global", id: "global-immersion-programs-he" },
    { title: "Industrial Visits", when: "Nov 2025", where: "Pune Industrial Belt", theme: "career", id: "industrial-visits-he" },
    { title: "Trekking Expeditions", when: "Oct 2025", where: "Sahyadri Range", theme: "adv", id: "trekking-expeditions-he" },
    { title: "University Exposure Programs", when: "Sep 2025", where: "Bengaluru", theme: "uni", id: "university-exposure-programs-school" }
  ],

  /* Testimonials (home page, above the footer).
     who: "student" or "teacher". Add real feedback as it comes in, e.g.
     { who: "teacher", quote: "…", source: "Name, designation", detail: "School / programme" } */
  testimonials: [
    { who: "student", quote: "The founders didn't just talk about failure. They walked us through the actual decision, live.", source: "Founder Learning Expeditions", detail: "Pune cohort" }
  ],

  /* Counts taken from the site's own content. Add verified figures
     (students reached, mentors, institutions…) here when ready. */
  stats: [
    { n: 53, suffix: "", label: "programmes in the catalogue", icon: "layers", c: "#2150C2" },
    { n: 18, suffix: "+", label: "partner institutions & public bodies", icon: "landmark", c: "#0E8C84" },
    { n: 8, suffix: "", label: "STEM Tour circuits across India", icon: "route", c: "#D99A06" },
    { n: 5, suffix: "", label: "formats, 90 minutes to a full year", icon: "clock", c: "#1584C7" }
  ],

  /* What institutions gain */
  values: [
    { t: "Curriculum Enrichment", d: "Extend learning beyond the classroom.", icon: "book" },
    { t: "Student Engagement", d: "Create meaningful and memorable experiences.", icon: "sparkles" },
    { t: "Future Readiness", d: "Build awareness, skills and career clarity.", icon: "target" },
    { t: "NEP-Aligned Learning", d: "Support experiential, multidisciplinary and practical learning.", icon: "check" },
    { t: "Institutional Differentiation", d: "Strengthen your learning ecosystem and student experience.", icon: "award" },
    { t: "Industry-Academia Bridge", d: "Connect learners with real-world practitioners.", icon: "handshake" },
    { t: "IB CAS Support", d: "Give IB Diploma students structured Creativity, Activity and Service experiences with reflection built in.", icon: "globe" }
  ],

  standFor: [
    { t: "NEP 2020 Aligned", d: "Experiential, multidisciplinary, competency-based.", icon: "check", c: "#2150C2" },
    { t: "Beyond Textbooks", d: "Learning on shop floors, campuses and expedition trails.", icon: "book", c: "#0E8C84" },
    { t: "Real Connections", d: "Direct access to professionals, founders, faculty and institutions.", icon: "users", c: "#D99A06" },
    { t: "Practical Exposure", d: "Structured, hands-on exposure to real environments.", icon: "wrench", c: "#6544CC" },
    { t: "Future Ready", d: "Awareness, skills and career clarity.", icon: "target", c: "#1584C7" },
    { t: "IB CAS Ready", d: "Experiences that support the International Baccalaureate's Creativity, Activity, Service (CAS) requirements.", icon: "globe", c: "#CF4A6E" }
  ],

  /* ---------- PARTNERS ---------- */
  partners: {
    government: [
      { name: "Ministry of Tourism", full: "Ministry of Tourism, Government of India", logo: "/images/logos/ministry-of-tourism.png" },
      { name: "DPIIT", full: "Department for Promotion of Industry and Internal Trade", logo: "/images/logos/dpiit.png" },
      { name: "Incredible India", full: "Incredible India", logo: "/images/logos/incredible-india.png" },
      { name: "Startup India", full: "Startup India", logo: "/images/logos/startup-india.jpeg" },
      { name: "MSME", full: "Ministry of Micro, Small & Medium Enterprises", logo: "/images/logos/msme.jpeg" },
      { name: "Delhi Tourism", full: "Delhi Tourism", logo: "/images/logos/delhi-tourism.png" }
    ],
    academia: [
      { name: "University of Delhi", full: "University of Delhi", logo: "/images/logos/du.jpeg" },
      { name: "GGSIPU", full: "Guru Gobind Singh Indraprastha University", logo: "/images/logos/ggsipu.jpeg" },
      { name: "O.P. Jindal Global University", full: "O.P. Jindal Global University", logo: "/images/logos/opjgu.jpeg" },
      { name: "IILM", full: "IILM", logo: "/images/logos/iilm.jpeg" },
      { name: "IITTM", full: "Indian Institute of Tourism and Travel Management", logo: "/images/logos/iittm.png" },
      { name: "MSIT", full: "Maharaja Surajmal Institute of Technology", logo: "/images/logos/msit.jpeg" }
    ],
    community: [
      { name: "ICOSA", full: "ICOSA, school accreditation", logo: "/images/logos/icosa.png" },
      { name: "Young Thinkers' Forum", full: "Young Thinkers' Forum", logo: "/images/logos/ytf.png" },
      { name: "Sewadham Ashram", full: "Sewadham Ashram", logo: "/images/logos/sewadham.png" },
      { name: "National Computrade News", full: "National Computrade News (NCN)", logo: "/images/logos/ncn-magazine.jpeg" },
      { name: "Neon Light Pictures", full: "Neon Light Pictures", logo: "/images/logos/neon-light-pictures.jpeg" },
      { name: "Futred", full: "Futred", logo: "/images/logos/futred.png" }
    ]
  },
  partnerTabs: { government: "Government & public", academia: "Universities & institutes", community: "Community, media & ecosystem" },
  nepLogo: "/images/logos/nep-2020.png",

  /* Education & Experience Council */
  council: [
    { t: "Founding Council", d: "Senior leadership who set strategic direction and overall programme philosophy.", badge: "Strategy", icon: "compass", c: "#2150C2" },
    { t: "Advisors", d: "Subject-matter experts who guide curriculum design and learning outcomes.", badge: "Curriculum", icon: "book", c: "#D99A06" },
    { t: "Guest Faculty", d: "Practitioners and academics who lead sessions, workshops and masterclasses.", badge: "Delivery", icon: "cap", c: "#0E8C84" },
    { t: "Institutional Partners", d: "Universities, industry bodies and organisations that host, co-design or facilitate experiences.", badge: "Hosting", icon: "landmark", c: "#CF4A6E" },
    { t: "Expert Network", d: "A wider pool of professionals for programme interactions, panels and mentorship.", badge: "Mentorship", icon: "network", c: "#6544CC" }
  ],

  /* ---------- PEOPLE BEHIND THE IDEA ----------
     To add a headshot: put the file in this folder's images/people/ and set photo: "images/people/name.jpg"
     (square crops look best). To add someone, copy a block and set group to "founder" or "advisor". */
  people: [
    {
      group: "founder",
      name: "Karan Kumar Singh",
      role: "Founder & CEO",
      initials: "KS", color: "#0F3E9E", photo: "",
      headline: "Building Kashti on one belief: learning should not end at the classroom door.",
      bio: "Karan founded Kashti to take learners out of the classroom and into the real world. Under his leadership, Kashti has grown into an experiential-learning partner for schools, colleges and universities, with 53 programmes across STEM, leadership, careers, culture and global immersion. He leads Kashti's strategy, partnerships and programme philosophy from its Noida office.",
      highlights: [
        "Founder & CEO, Kashti Educare",
        "Leads strategy, institutional partnerships and programme design",
        "Built a portfolio of 53 programmes across eight learning themes"
      ],
      tags: ["Strategy", "Partnerships", "Experiential learning"],
      links: [{ label: "LinkedIn", url: "https://www.linkedin.com/in/karan-kumar-singh-/" }]
    },
    {
      group: "advisor",
      name: "Dr. Rishi Mohan Bhatnagar",
      role: "Advisor",
      designation: "Chairman, Futred Innovation Studios · Former President, Aeris Communications",
      initials: "RB", color: "#6544CC", photo: "",
      headline: "Technology leader, education innovator and humanitarian with 25+ years across Europe, North America and Asia.",
      bio: "Dr. Bhatnagar has spent more than two decades building technology businesses: at Perot Systems in Europe, as Global Head of Digital Enterprise Services at Tech Mahindra, and as President of Aeris Communications, where he set up Aeris India. He later served as President of Lava International. Today he chairs Futred Innovation Studios and Ankit Gram Sewadham Ashram in Ujjain, and is National Convenor for Education and Technology at Bharatiya Shikshan Mandal.",
      highlights: [
        "Former President, Aeris Communications (2016–2023) and Lava International (2023–2024)",
        "Chairman, Futred Innovation Studios and Ankit Gram Sewadham Ashram, Ujjain",
        "National Convenor, Education & Technology, Bharatiya Shikshan Mandal",
        "Co-author of Enterprise IoT (2015); Economic Times IoT CEO of the Year (2022)",
        "Ph.D. in Computer Science & Engineering; MCA, IMT Ghaziabad; B.Sc. (Hons.) Electronics, University of Delhi"
      ],
      tags: ["Technology & AI", "Education reform", "Seva"],
      links: [{ label: "rishibhatnagar.in", url: "https://rishibhatnagar.in/about/" }]
    },
    {
      group: "advisor",
      name: "Dr. Ashok Kumar Thakur",
      role: "Advisor",
      designation: "Founder, Muni International School, New Delhi",
      initials: "AT", color: "#0E8F86", photo: "",
      headline: "Founder of Muni International School and creator of an activity-based, values-led model of schooling.",
      bio: "An ex-serviceman and Delhi University alumnus, Dr. Thakur founded Muni International School in New Delhi in 2002 with a handful of students. He went on to build the Muni Education Model, which blends Indian learning traditions with skills, values and activity-based teaching, and has taken it to schools beyond his own. He speaks widely on education, including at TEDx.",
      highlights: [
        "Founder, Muni International School, New Delhi (2002)",
        "Creator of the Muni Education Model: values and skills through activity-based learning",
        "Muni International is recognised as an Ashoka Changemaker School",
        "Ex-serviceman and alumnus of the University of Delhi; TEDx speaker"
      ],
      tags: ["School education", "Pedagogy", "Values & skills"],
      links: [{ label: "LinkedIn", url: "https://www.linkedin.com/in/theashokthakur/" }]
    },
    {
      group: "advisor",
      name: "Coach Aditya Sisodia",
      role: "Advisor",
      designation: "Executive career & leadership coach · ICF PCC",
      initials: "AS", color: "#C98A00", photo: "",
      headline: "Executive career and leadership coach to CXOs, senior professionals and aspiring coaches.",
      bio: "Aditya is an ICF Professional Certified Coach and ICF Registered Mentor Coach who works with CXOs and senior executives on leadership, career transitions and personal effectiveness. Alongside coaching, he is an author, keynote speaker, corporate trainer and serial entrepreneur, with more than 50,000 hours of facilitation, training, consulting and mentoring.",
      highlights: [
        "ICF Professional Certified Coach (PCC) and ICF Registered Mentor Coach",
        "50,000+ hours of facilitation, training, consulting and mentoring",
        "Has coached senior executives from Fortune 50 companies",
        "YourDost Hall of Fame (2023); National Education Award (2015)"
      ],
      tags: ["Leadership", "Career coaching", "Mentoring"],
      links: [{ label: "coachsisodia.com", url: "https://coachsisodia.com/about" }]
    }
  ],

  /* Roles still being filled: shown as open seats on the People page */
  peopleUpcoming: [
    { t: "Academic advisors", d: "Educators and researchers who shape curriculum and learning outcomes.", icon: "book" },
    { t: "Industry mentors", d: "Practitioners who open their workplaces and share real decisions.", icon: "briefcase" },
    { t: "Guest faculty", d: "Experts who lead sessions, workshops and masterclasses.", icon: "cap" }
  ],

  /* ---------- GALLERY ---------- */
  galleryCats: { expeditions: "Expeditions", visits: "Institution visits", community: "Sessions & community", team: "On-tour workshops & recognition" },
  gallery: [
    { src: "/images/gallery/expedition-group-1.jpg", alt: "Kashti group at the Sitabani buffer zone, Corbett National Park", cat: "expeditions" },
    { src: "/images/gallery/isro-visit-1.jpeg", alt: "A visit to ISRO, the Indian Space Research Organisation", cat: "visits" },
    { src: "/images/gallery/leadership-session.jpeg", alt: "A leadership and mentorship session", cat: "community" },
    { src: "/images/gallery/opj-visit-1.jpeg", alt: "A visit to O.P. Jindal Global University", cat: "visits" },
    { src: "/images/gallery/shimla-expedition.jpeg", alt: "An expedition to Shimla", cat: "expeditions" },
    { src: "/images/gallery/ministry-award.jpeg", alt: "Receiving recognition from a government ministry", cat: "team" },
    { src: "/images/gallery/iilm-session.jpeg", alt: "A programme session at IILM", cat: "visits" },
    { src: "/images/gallery/expedition-group-2.jpg", alt: "Kashti group at the Sitabani buffer zone, Corbett National Park", cat: "expeditions" },
    { src: "/images/gallery/giving-back-to-society.jpeg", alt: "Kashti team members at a community service initiative", cat: "community" },
    { src: "/images/gallery/isro-visit-2.jpeg", alt: "A visit to ISRO, the Indian Space Research Organisation", cat: "visits" },
    { src: "/images/gallery/school-leaders-summit.jpeg", alt: "Kashti at the School Leaders' Summit", cat: "community" },
    { src: "/images/gallery/field-moment-1.jpg", alt: "Kashti group at the Sitabani buffer zone, Corbett National Park", cat: "expeditions" },
    { src: "/images/gallery/msit-visit.jpeg", alt: "A visit to Maharaja Surajmal Institute of Technology", cat: "visits" },
    { src: "/images/gallery/noida-office-1.jpeg", alt: "On tour learning workshops", cat: "team" },
    { src: "/images/gallery/youth-buzz.jpeg", alt: "A Youth Buzz programme session", cat: "community" },
    { src: "/images/gallery/ntpc-activity.jpeg", alt: "An activity session at NTPC", cat: "visits" },
    { src: "/images/gallery/expedition-group-3.jpg", alt: "Kashti group at the Sitabani buffer zone, Corbett National Park", cat: "expeditions" },
    { src: "/images/gallery/muni-international-1.jpeg", alt: "A session with Muni International", cat: "community" },
    { src: "/images/gallery/opj-visit-2.jpeg", alt: "A visit to O.P. Jindal Global University", cat: "visits" },
    { src: "/images/gallery/noida-office-2.jpeg", alt: "On tour learning workshops", cat: "team" },
    { src: "/images/gallery/field-moment-2.jpg", alt: "Kashti group at the Sitabani buffer zone, Corbett National Park", cat: "expeditions" },
    { src: "/images/gallery/nepal-mp-visit.jpeg", alt: "A visit with a Nepal Member of Parliament, hosted by Muni International", cat: "community" },
    { src: "/images/gallery/iilm-collab.jpeg", alt: "Kashti in collaboration discussions at IILM", cat: "visits" },
    { src: "/images/gallery/field-moment-4.jpg", alt: "Kashti team at an evening community gathering", cat: "community" },
    { src: "/images/gallery/noida-office-3.jpeg", alt: "On tour learning workshops", cat: "team" },
    { src: "/images/gallery/field-moment-3.jpg", alt: "Kashti group at the Sitabani buffer zone, Corbett National Park", cat: "expeditions" },
    { src: "/images/gallery/iilm-discussion.jpeg", alt: "A discussion session at IILM", cat: "visits" },
    { src: "/images/gallery/scrap-uncle-meeting.jpeg", alt: "A meeting with Scrap Uncle", cat: "community" },
    { src: "/images/gallery/muni-international-2.jpeg", alt: "A session with Muni International", cat: "community" },
    { src: "/images/gallery/noida-office-4.jpeg", alt: "On tour learning workshops", cat: "team" }
  ],

  /* ---------- FAQ (answers drafted from the site's own content; review before launch) ---------- */
  faq: [
    { q: "How are these programs designed?", a: "Every programme follows the same pedagogy (Orient, Immerse, Build, Transform) and is built to move a learner from seeing a real environment, to building capability, to gaining clarity about what comes next (See → Build → Become)." },
    { q: "Can programs be customised for our institution?", a: "Yes. Tell us about your institution, learners and goals through Design an Experience, and we reply with a tailored proposal covering the formats, months and group sizes that fit your academic calendar." },
    { q: "Who conducts these programs?", a: "Programmes are designed and delivered through the Kashti Education & Experience Council: the founding council and advisors, guest faculty who lead sessions and workshops, institutional partners who host experiences, and a wider expert network." },
    { q: "What is included in the program fee?", a: "Inclusions depend on the format, destination and group, so they're set out line by line in the customised proposal we send your institution." },
    { q: "How is student safety managed?", a: "Every programme runs under our Safety & Risk Management Policy, and school groups travel with signed parent and guardian consent. Both documents are available under Resources & downloads." },
    { q: "How far in advance should we book?", a: "As early as you can. Each programme has recommended months: STEM Tours run October to March, and Global Immersion runs in the May–June and December–January breaks. Group size and timing are confirmed with a programme manager at proposal stage." },
    { q: "Do you provide reports or documentation post-program?", a: "Tell us what your institution needs when you enquire. Documentation and reporting are agreed with your programme manager as part of the proposal." },
    { q: "How do we get started?", a: "Use Design an Experience to share your institution, learners and goals. Our team replies with a customised proposal." }
  ]
};
