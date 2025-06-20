// Enhanced streak data storage
let streakData = {
  currentStreak: 0,
  totalXP: 0,
  projectsCompleted: 0,
  skillsMastered: 0,
  currentMonth: 1,
  frameworkCompletion: 0,
  completedDays: [],
  skillProgress: {
    rust: 0,
    cryptography: 0,
    security: 0,
    zk: 0,
    identity: 0,
    focus: 0,
  },
  frameworkProgress: {},
  achievements: [],
  lastCompletedDate: null,
  todoLists: {
    morning: [],
    evening: [],
    custom: [],
  },
  dailyXP: {}, // Track daily XP activity counts

  // Achievement tracking fields
  achievementStats: {
    articles_read: 0,
    research_implementations: 0,
    courses_completed: 0,
    research_published: 0,
    blog_posts: 0,
    rust_lines: 0,
    bugs_found: 0,
    unit_tests: 0,
    projects_deployed: 0,
    security_challenges: 0,
    vulnerabilities_found: 0,
    ctf_wins: 0,
    audits_completed: 0,
    vulnerabilities_disclosed: 0,
    rust_basics_completed: 0,
    memory_allocator_implemented: 0,
    async_app_built: 0,
    crypto_algorithm_implemented: 0,
    contract_vulnerability_found: 0,
    zk_proof_implemented: 0,
    fuzzing_suite_created: 0,
    performance_optimized: 0,
    questions_answered: 0,
    people_mentored: 0,
    tutorials_created: 0,
    open_source_contributions: 0,
    conference_talks: 0,
    influential_research: 0,
    presentations_given: 0,
    professional_connections: 0,
    junior_developers_mentored: 0,
    followers_gained: 0,
    comebacks_made: 0,
    early_morning_sessions: 0,
    deep_work_sessions: 0,
    failures_documented: 0,
    events_organized: 0,
  },
};

// Comprehensive framework systems based on your list
const frameworkSystems = [
  {
    id: "identity",
    emoji: "🎭",
    text: "Identity & Vision Alignment",
    category: "foundation",
  },
  {
    id: "xp",
    emoji: "📊",
    text: "XP & Level Tracking System",
    category: "tracking",
  },
  {
    id: "achievement",
    emoji: "🏆",
    text: "Achievement & Milestone Tracker",
    category: "tracking",
  },
  {
    id: "sacred",
    emoji: "⏰",
    text: "Sacred Block Time Management",
    category: "time",
  },
  {
    id: "focus",
    emoji: "🎯",
    text: "Focus & Attention Management",
    category: "mental",
  },
  {
    id: "planning",
    emoji: "📋",
    text: "Weekly Review & Planning",
    category: "organization",
  },
  {
    id: "resistance",
    emoji: "💪",
    text: "Resistance Management Protocol",
    category: "mental",
  },
  {
    id: "resources",
    emoji: "📚",
    text: "Learning Resources & Project Tracker",
    category: "learning",
  },
  {
    id: "action",
    emoji: "⚡",
    text: "Quick Action Items System",
    category: "productivity",
  },
  {
    id: "mastery",
    emoji: "🏆",
    text: "Mastery Progression Framework",
    category: "learning",
  },
  {
    id: "social",
    emoji: "🤝",
    text: "Social Accountability Network",
    category: "community",
  },
  {
    id: "performance",
    emoji: "⚡",
    text: "High Performance Day Patterns",
    category: "optimization",
  },
  {
    id: "vision",
    emoji: "🎯",
    text: "Long-Term Vision & Legacy",
    category: "purpose",
  },
  {
    id: "maintenance",
    emoji: "🔧",
    text: "System Maintenance & Evolution",
    category: "systems",
  },
  {
    id: "emergency",
    emoji: "🚨",
    text: "Emergency Protocols & Crisis Management",
    category: "resilience",
  },
  {
    id: "seasonal",
    emoji: "🌊",
    text: "Seasonal Challenges & Competitions",
    category: "motivation",
  },
  {
    id: "cognitive",
    emoji: "🧠",
    text: "Cognitive Enhancement & Mental Models",
    category: "mental",
  },
  {
    id: "experimental",
    emoji: "🔬",
    text: "Experimental Learning Laboratory",
    category: "innovation",
  },
  {
    id: "analytics",
    emoji: "📈",
    text: "Advanced Analytics & Intelligence",
    category: "data",
  },
  {
    id: "mindset",
    emoji: "🌱",
    text: "Growth Mindset & Resilience Building",
    category: "mindset",
  },
  {
    id: "architecture",
    emoji: "🏗️",
    text: "Identity & Mindset Architecture",
    category: "foundation",
  },
  {
    id: "legacy",
    emoji: "☀️",
    text: "Legacy & Impact Planning",
    category: "purpose",
  },
  {
    id: "integration",
    emoji: "🎯",
    text: "Final Integration & Commitment",
    category: "mastery",
  },
];

// Comprehensive daily tasks based on the 24-month curriculum
const dailyTasks = [
  {
    id: "rust-fundamentals",
    text: "Complete Rust fundamentals practice (ownership, borrowing, lifetimes)",
    xp: 50,
    category: "rust",
  },
  {
    id: "smart-contract",
    text: "Build and audit a smart contract security feature",
    xp: 75,
    category: "security",
  },
  {
    id: "crypto-study",
    text: "Study cryptographic primitives and implement example",
    xp: 60,
    category: "cryptography",
  },
  {
    id: "zk-research",
    text: "Research zero-knowledge proof concepts and applications",
    xp: 70,
    category: "zk",
  },
  {
    id: "framework-review",
    text: "Review and update 3 framework systems",
    xp: 40,
    category: "framework",
  },
  {
    id: "project-progress",
    text: "Make significant progress on current project",
    xp: 80,
    category: "project",
  },
  {
    id: "code-review",
    text: "Perform thorough code review and security analysis",
    xp: 55,
    category: "security",
  },
  {
    id: "learning-session",
    text: "Complete focused learning session (2+ hours)",
    xp: 45,
    category: "learning",
  },
  {
    id: "documentation",
    text: "Document learnings and create technical content",
    xp: 35,
    category: "documentation",
  },
  {
    id: "network-engage",
    text: "Engage with blockchain security community",
    xp: 30,
    category: "community",
  },
];

// Comprehensive achievement system
const achievements = [
  // Consistency Achievements
  {
    id: "fire-starter",
    name: "🔥 Fire Starter",
    description: "7-day coding streak",
    category: "consistency",
    requirement: { type: "streak", value: 7 },
    xpReward: 100,
  },
  {
    id: "rising-star",
    name: "🌟 Rising Star",
    description: "30-day coding streak",
    category: "consistency",
    requirement: { type: "streak", value: 30 },
    xpReward: 500,
  },
  {
    id: "lightning",
    name: "⚡ Lightning",
    description: "90-day coding streak",
    category: "consistency",
    requirement: { type: "streak", value: 90 },
    xpReward: 1000,
  },
  {
    id: "unstoppable",
    name: "🚀 Unstoppable",
    description: "180-day coding streak",
    category: "consistency",
    requirement: { type: "streak", value: 180 },
    xpReward: 2000,
  },
  {
    id: "legend",
    name: "👑 Legend",
    description: "365-day coding streak",
    category: "consistency",
    requirement: { type: "streak", value: 365 },
    xpReward: 5000,
  },

  // Learning Achievements
  {
    id: "bookworm",
    name: "📚 Bookworm",
    description: "Read 50 technical articles",
    category: "learning",
    requirement: { type: "articles_read", value: 50 },
    xpReward: 200,
  },
  {
    id: "deep-thinker",
    name: "🧠 Deep Thinker",
    description: "Complete 10 research paper implementations",
    category: "learning",
    requirement: { type: "research_implementations", value: 10 },
    xpReward: 500,
  },
  {
    id: "scholar",
    name: "🎓 Scholar",
    description: "Finish 5 online courses",
    category: "learning",
    requirement: { type: "courses_completed", value: 5 },
    xpReward: 300,
  },
  {
    id: "researcher",
    name: "🔬 Researcher",
    description: "Publish original research",
    category: "learning",
    requirement: { type: "research_published", value: 1 },
    xpReward: 1000,
  },
  {
    id: "author",
    name: "✍️ Author",
    description: "Write 25 blog posts",
    category: "learning",
    requirement: { type: "blog_posts", value: 25 },
    xpReward: 400,
  },

  // Coding Achievements
  {
    id: "code-warrior",
    name: "⚔️ Code Warrior",
    description: "1000 lines of Rust code",
    category: "coding",
    requirement: { type: "rust_lines", value: 1000 },
    xpReward: 300,
  },
  {
    id: "architect",
    name: "🏗️ Architect",
    description: "Build 10 complete projects",
    category: "coding",
    requirement: { type: "projects_completed", value: 10 },
    xpReward: 500,
  },
  {
    id: "bug-hunter",
    name: "🐛 Bug Hunter",
    description: "Find 50 bugs in your own code",
    category: "coding",
    requirement: { type: "bugs_found", value: 50 },
    xpReward: 200,
  },
  {
    id: "test-master",
    name: "🧪 Test Master",
    description: "Write 1000 unit tests",
    category: "coding",
    requirement: { type: "unit_tests", value: 1000 },
    xpReward: 400,
  },
  {
    id: "deployer",
    name: "🚀 Deployer",
    description: "Deploy 10 projects to production",
    category: "coding",
    requirement: { type: "projects_deployed", value: 10 },
    xpReward: 600,
  },

  // Security Achievements
  {
    id: "guardian",
    name: "🛡️ Guardian",
    description: "Complete 50 security challenges",
    category: "security",
    requirement: { type: "security_challenges", value: 50 },
    xpReward: 300,
  },
  {
    id: "detective",
    name: "🔍 Detective",
    description: "Find 10 security vulnerabilities",
    category: "security",
    requirement: { type: "vulnerabilities_found", value: 10 },
    xpReward: 500,
  },
  {
    id: "champion",
    name: "🏆 Champion",
    description: "Win security CTF competition",
    category: "security",
    requirement: { type: "ctf_wins", value: 1 },
    xpReward: 1000,
  },
  {
    id: "auditor",
    name: "🔒 Auditor",
    description: "Complete 5 professional audits",
    category: "security",
    requirement: { type: "audits_completed", value: 5 },
    xpReward: 800,
  },
  {
    id: "whistleblower",
    name: "🚨 Whistleblower",
    description: "Responsibly disclose critical vulnerability",
    category: "security",
    requirement: { type: "vulnerabilities_disclosed", value: 1 },
    xpReward: 1500,
  },

  // Technical Mastery Badges
  {
    id: "rust-basics",
    name: "🦀 Rust Basics",
    description: "Rust basics and beginner level",
    category: "technical_mastery",
    requirement: { type: "rust_basics_completed", value: 1 },
    xpReward: 200,
  },
  {
    id: "memory-master",
    name: "🧠 Memory Master",
    description: "Implemented custom memory allocator",
    category: "technical_mastery",
    requirement: { type: "memory_allocator_implemented", value: 1 },
    xpReward: 500,
  },
  {
    id: "async-architect",
    name: "⚡ Async Architect",
    description: "Built concurrent application with proper error handling",
    category: "technical_mastery",
    requirement: { type: "async_app_built", value: 1 },
    xpReward: 400,
  },
  {
    id: "crypto-craftsman",
    name: "🔐 Crypto Craftsman",
    description: "Implemented cryptographic algorithm from scratch",
    category: "technical_mastery",
    requirement: { type: "crypto_algorithm_implemented", value: 1 },
    xpReward: 600,
  },
  {
    id: "contract-auditor",
    name: "📋 Contract Auditor",
    description: "Found first smart contract vulnerability",
    category: "technical_mastery",
    requirement: { type: "contract_vulnerability_found", value: 1 },
    xpReward: 300,
  },
  {
    id: "zero-knowledge",
    name: "🔒 Zero Knowledge",
    description: "Implemented basic ZK-proof system",
    category: "technical_mastery",
    requirement: { type: "zk_proof_implemented", value: 1 },
    xpReward: 800,
  },
  {
    id: "fuzzing-fanatic",
    name: "🧪 Fuzzing Fanatic",
    description: "Created comprehensive fuzzing test suite",
    category: "technical_mastery",
    requirement: { type: "fuzzing_suite_created", value: 1 },
    xpReward: 400,
  },
  {
    id: "performance-perfectionist",
    name: "⚡ Performance Perfectionist",
    description: "Optimized code for 10x speed improvement",
    category: "technical_mastery",
    requirement: { type: "performance_optimized", value: 1 },
    xpReward: 600,
  },

  // Community Contribution Badges
  {
    id: "helper",
    name: "🤝 Helper",
    description: "Answered 10 questions in community forums",
    category: "community_contribution",
    requirement: { type: "questions_answered", value: 10 },
    xpReward: 200,
  },
  {
    id: "mentor",
    name: "👨‍🏫 Mentor",
    description: "Successfully guided someone through their first project",
    category: "community_contribution",
    requirement: { type: "people_mentored", value: 1 },
    xpReward: 300,
  },
  {
    id: "teacher",
    name: "📚 Teacher",
    description: "Created tutorial that got 100+ positive reactions",
    category: "community_contribution",
    requirement: { type: "tutorials_created", value: 1 },
    xpReward: 400,
  },
  {
    id: "open-source-hero",
    name: "🌟 Open Source Hero",
    description: "Made significant contribution to major project",
    category: "community_contribution",
    requirement: { type: "open_source_contributions", value: 1 },
    xpReward: 500,
  },
  {
    id: "conference-speaker",
    name: "🎤 Conference Speaker",
    description: "Accepted to speak at industry event",
    category: "community_contribution",
    requirement: { type: "conference_talks", value: 1 },
    xpReward: 600,
  },
  {
    id: "thought-leader",
    name: "💡 Thought Leader",
    description: "Published research that influenced industry practices",
    category: "community_contribution",
    requirement: { type: "influential_research", value: 1 },
    xpReward: 1000,
  },
  {
    id: "speaker",
    name: "🎤 Speaker",
    description: "Give 5 presentations",
    category: "community_contribution",
    requirement: { type: "presentations_given", value: 5 },
    xpReward: 400,
  },
  {
    id: "connector",
    name: "🔗 Connector",
    description: "Make 50 professional connections",
    category: "community_contribution",
    requirement: { type: "professional_connections", value: 50 },
    xpReward: 300,
  },
  {
    id: "mentor-junior",
    name: "👨‍🏫 Mentor",
    description: "Guide 10 junior developers",
    category: "community_contribution",
    requirement: { type: "junior_developers_mentored", value: 10 },
    xpReward: 500,
  },
  {
    id: "influencer",
    name: "📢 Influencer",
    description: "Gain 1000 followers",
    category: "community_contribution",
    requirement: { type: "followers_gained", value: 1000 },
    xpReward: 400,
  },

  // Character Development Badges
  {
    id: "streak-keeper",
    name: "🔥 Streak Keeper",
    description: "Maintained 30-day daily practice streak",
    category: "character_development",
    requirement: { type: "streak", value: 30 },
    xpReward: 300,
  },
  {
    id: "comeback-king",
    name: "👑 Comeback King",
    description: "Rebuilt momentum after major setback",
    category: "character_development",
    requirement: { type: "comebacks_made", value: 1 },
    xpReward: 400,
  },
  {
    id: "discipline-demon",
    name: "😈 Discipline Demon",
    description: "Completed 100 early morning sessions",
    category: "character_development",
    requirement: { type: "early_morning_sessions", value: 100 },
    xpReward: 500,
  },
  {
    id: "focus-fortress",
    name: "🏰 Focus Fortress",
    description: "Completed 50 distraction-free deep work sessions",
    category: "character_development",
    requirement: { type: "deep_work_sessions", value: 50 },
    xpReward: 400,
  },
  {
    id: "growth-mindset",
    name: "🌱 Growth Mindset",
    description: "Documented 25 failures and lessons learned",
    category: "character_development",
    requirement: { type: "failures_documented", value: 25 },
    xpReward: 300,
  },
  {
    id: "community-builder",
    name: "🏗️ Community Builder",
    description: "Organized successful meetup or event",
    category: "character_development",
    requirement: { type: "events_organized", value: 1 },
    xpReward: 400,
  },
];

// Phase definitions for the 24-month journey
const phases = [
  {
    id: 1,
    name: "Phase 1: Foundations & Smart Contract Security",
    months: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 2,
    name: "Phase 2: Advanced Cryptography & ZK Proofs",
    months: [7, 8, 9, 10, 11, 12],
  },
  {
    id: 3,
    name: "Phase 3: DeFi Security & Protocol Analysis",
    months: [13, 14, 15, 16, 17, 18],
  },
  {
    id: 4,
    name: "Phase 4: Elite Mastery & Leadership",
    months: [19, 20, 21, 22, 23, 24],
  },
];

// Daily habits data
const habitData = {
  code: { streak: 0, completed: false },
  security: { streak: 0, completed: false },
  community: { streak: 0, completed: false },
  reflection: { streak: 0, completed: false },
};

// Default todo items
const defaultTodos = {
  morning: [
    {
      id: "morning-1",
      text: "Drink water and hydrate",
      completed: false,
      time: "5 min",
    },
    {
      id: "morning-2",
      text: "Review today's goals and priorities",
      completed: false,
      time: "10 min",
    },
    {
      id: "morning-3",
      text: "Quick stretching or light exercise",
      completed: false,
      time: "15 min",
    },
    {
      id: "morning-4",
      text: "Check and organize workspace",
      completed: false,
      time: "5 min",
    },
    {
      id: "morning-5",
      text: "Plan Rust/security learning session",
      completed: false,
      time: "5 min",
    },
  ],
  evening: [
    {
      id: "evening-1",
      text: "Review today's accomplishments",
      completed: false,
      time: "10 min",
    },
    {
      id: "evening-2",
      text: "Plan tomorrow's tasks",
      completed: false,
      time: "10 min",
    },
    {
      id: "evening-3",
      text: "Document today's learnings",
      completed: false,
      time: "15 min",
    },
    {
      id: "evening-4",
      text: "Update streak tracker",
      completed: false,
      time: "5 min",
    },
    {
      id: "evening-5",
      text: "Prepare for tomorrow's challenges",
      completed: false,
      time: "10 min",
    },
  ],
  custom: [
    {
      id: "custom-1",
      text: "Research new Rust security patterns",
      completed: false,
      time: "30 min",
    },
    {
      id: "custom-2",
      text: "Practice smart contract auditing",
      completed: false,
      time: "45 min",
    },
    {
      id: "custom-3",
      text: "Study zero-knowledge proofs",
      completed: false,
      time: "60 min",
    },
  ],
};

// XP Point System Activities
const xpActivities = {
  core: [
    {
      id: "morning-routine",
      text: "Morning routine completed",
      xp: 10,
      category: "core",
      dailyCap: 100,
      emoji: "🌅",
    },
    {
      id: "deep-work-90",
      text: "90-minute deep work session",
      xp: 30,
      category: "core",
      dailyCap: 100,
      emoji: "🎯",
    },
    {
      id: "coding-challenge",
      text: "Coding challenge",
      xp: 15,
      category: "core",
      dailyCap: 100,
      emoji: "🧩",
    },
    {
      id: "github-commit",
      text: "Github commit",
      xp: 2,
      category: "core",
      dailyCap: 100,
      emoji: "📝",
    },
    {
      id: "quality-code",
      text: "Quality code written (min 50 lines)",
      xp: 20,
      category: "core",
      dailyCap: 100,
      emoji: "💻",
    },
    {
      id: "tests-written",
      text: "Tests written for new code",
      xp: 15,
      category: "core",
      dailyCap: 100,
      emoji: "🧪",
    },
    {
      id: "documentation",
      text: "Documentation updated",
      xp: 10,
      category: "core",
      dailyCap: 100,
      emoji: "📚",
    },
    {
      id: "community-engagement",
      text: "Community engagement (15 min)",
      xp: 10,
      category: "core",
      dailyCap: 100,
      emoji: "👥",
    },
    {
      id: "evening-routine",
      text: "Evening routine completed",
      xp: 5,
      category: "core",
      dailyCap: 100,
      emoji: "🌙",
    },
    {
      id: "blog-post",
      text: "Blog post",
      xp: 30,
      category: "core",
      dailyCap: 100,
      emoji: "✍️",
    },
    {
      id: "security-audit",
      text: "Security audit",
      xp: 30,
      category: "core",
      dailyCap: 100,
      emoji: "🔍",
    },
  ],
  bonus: [
    {
      id: "extra-deep-work",
      text: "Extra deep work session",
      xp: 15,
      category: "bonus",
      dailyCap: null,
      emoji: "⚡",
    },
    {
      id: "help-someone",
      text: "Help someone solve a problem",
      xp: 25,
      category: "bonus",
      dailyCap: null,
      emoji: "🤝",
    },
    {
      id: "blog-published",
      text: "Blog post published",
      xp: 50,
      category: "bonus",
      dailyCap: null,
      emoji: "📖",
    },
    {
      id: "open-source",
      text: "Open source contribution",
      xp: 75,
      category: "bonus",
      dailyCap: null,
      emoji: "🌟",
    },
    {
      id: "conference-talk",
      text: "Conference talk submitted",
      xp: 100,
      category: "bonus",
      dailyCap: null,
      emoji: "🎤",
    },
    {
      id: "security-vulnerability",
      text: "Security vulnerability found",
      xp: 200,
      category: "bonus",
      dailyCap: null,
      emoji: "🛡️",
    },
  ],
};
