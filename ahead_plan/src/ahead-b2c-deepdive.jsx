import { useState } from "react";

const NAV = [
  { id: "score", icon: "◎", label: "Score Engine" },
  { id: "taxonomy", icon: "⬡", label: "Skill Taxonomy" },
  { id: "subskills", icon: "⊹", label: "Sub-Skills" },
  { id: "verification", icon: "◈", label: "Verification" },
  { id: "ai", icon: "⌬", label: "AI Engine" },
  { id: "b2c", icon: "→", label: "B2C Model" },
  { id: "schema", icon: "⬕", label: "Schema" },
  { id: "flows", icon: "▣", label: "User Flows" },
];

// ─── DATA ────────────────────────────────────────────────────────────────────

const SCORE_ENGINE = {
  title: "Ahead Score Engine v2",
  subtitle: "Unbounded, granular, verification-weighted scoring",
  concept: "The Ahead Score is a perpetually growing number — there is no ceiling. Every verified sub-skill, every passed quiz, every linked project adds to it. The score compounds. A student who has been consistently learning for 2 years should score meaningfully higher than one who just joined — and the score reflects that truth.",
  pillars: [
    {
      name: "Skill Depth Score",
      weight: "40%",
      formula: "Σ (sub-skill weight × proficiency_multiplier × verification_multiplier)",
      desc: "Each skill contains N sub-skills. Each sub-skill is rated by the user (aware / familiar / proficient) and multiplied by its verification status. A verified 'proficient' sub-skill contributes far more than an unverified 'aware' self-report.",
      breakdown: [
        { label: "Self-reported, no verification", multiplier: "0.4×" },
        { label: "Quiz passed (7/10+)", multiplier: "1.0×" },
        { label: "Certification uploaded", multiplier: "1.2×" },
        { label: "GitHub repo linked + analyzed", multiplier: "1.3×" },
        { label: "Live project / Vercel link", multiplier: "1.4×" },
        { label: "Project link with AI code analysis", multiplier: "1.5×" },
      ],
    },
    {
      name: "Goal Alignment Score",
      weight: "20%",
      formula: "roadmap_completion_rate × goal_relevance_of_skills × recency_weight",
      desc: "How well the user's verified skill portfolio aligns with their stated ultimate goal. If your goal is 'FAANG SDE', but you have zero DSA verification, your alignment score drops.",
      breakdown: [
        { label: "Daily goal streak (7 days)", multiplier: "+5 pts/day" },
        { label: "Weekly milestone completed", multiplier: "+25 pts" },
        { label: "Roadmap phase completed", multiplier: "+100 pts" },
        { label: "Skills match goal cluster", multiplier: "1.0–1.3× multiplier" },
      ],
    },
    {
      name: "Learning Velocity",
      weight: "20%",
      formula: "Δ(skill_depth_score) / Δ(time) — rolling 30-day window",
      desc: "Rate of verified skill gain over the last 30 days. A user who added 8 verified sub-skills this month beats a static user with a higher total. Rewards momentum.",
      breakdown: [
        { label: "New sub-skill self-reported", multiplier: "+1 velocity pt" },
        { label: "New sub-skill verified", multiplier: "+4 velocity pts" },
        { label: "New top-level skill verified", multiplier: "+15 velocity pts" },
        { label: "30-day inactivity penalty", multiplier: "−10% velocity decay" },
      ],
    },
    {
      name: "Consistency Index",
      weight: "12%",
      formula: "log(streak_days + 1) × engagement_frequency_score",
      desc: "Platform engagement regularity, goal check-ins, and streak maintenance. Logarithmic scaling rewards long-term consistency without punishing missed days catastrophically.",
      breakdown: [
        { label: "Daily login + goal check", multiplier: "+2 pts/day" },
        { label: "7-day streak", multiplier: "+20 bonus" },
        { label: "30-day streak", multiplier: "+100 bonus" },
        { label: "Resource consumed + marked done", multiplier: "+3 pts" },
      ],
    },
    {
      name: "Peer Benchmark Modifier",
      weight: "8%",
      formula: "percentile_rank(user_score, peer_group) × 0.08",
      desc: "A normalization layer. Being in the top 5% of your college in your field adds a bonus. This keeps the score honest — a 600 at a top-tier college means more than a 600 at a smaller institution.",
      breakdown: [
        { label: "Top 1% in college", multiplier: "+80 pts modifier" },
        { label: "Top 10% in college", multiplier: "+40 pts modifier" },
        { label: "Top 25% in college", multiplier: "+20 pts modifier" },
        { label: "Below median", multiplier: "+0 modifier" },
      ],
    },
  ],
  growth: [
    "Score only moves upward — no decay except velocity and consistency sub-components.",
    "A student with 3 years of consistent verified skills could realistically reach 2000–4000+ points.",
    "Leaderboards show absolute Ahead Score, not normalized — rewarding genuine long-term growth.",
    "Rank within college is calculated by raw score relative to peers at the same institution.",
    "Global rank uses the raw score — no normalization at leaderboard level.",
  ],
};

const TAXONOMY = {
  title: "Skill Taxonomy",
  subtitle: "LinkedIn-scale breadth, with deep technical granularity",
  note: "Every top-level skill contains 8–25 sub-skills. Users pick which sub-skills they know, not just the parent skill. This is the core differentiator from every other platform.",
  domains: [
    {
      domain: "Computer Science Core",
      color: "#fff",
      skills: [
        { name: "Data Structures & Algorithms", subs: 24, example: "Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, Backtracking, Segment Trees, Tries, Heap, Sorting algorithms, BFS/DFS, Sliding Window, Two Pointers, Bit Manipulation..." },
        { name: "Operating Systems", subs: 14, example: "Process management, Threads, Deadlock, Memory Management, Virtual Memory, File Systems, CPU Scheduling, IPC, Semaphores, Paging..." },
        { name: "Computer Networks", subs: 16, example: "OSI Model, TCP/IP, HTTP/HTTPS, DNS, Routing protocols, Subnetting, NAT, Firewalls, Load Balancing, WebSockets, CDN..." },
        { name: "Database Management", subs: 18, example: "SQL queries, Joins, Indexes, Transactions, ACID, Normalization, Stored Procedures, Views, NoSQL fundamentals, Query optimization..." },
        { name: "System Design", subs: 20, example: "Load balancers, Caching strategies, CAP theorem, Microservices, Message queues, Rate limiting, Consistent hashing, DB sharding, API design..." },
        { name: "Computer Architecture", subs: 10, example: "CPU pipeline, Cache hierarchy, Memory models, RISC vs CISC, Instruction sets, Assembly basics..." },
      ],
    },
    {
      domain: "Programming Languages",
      color: "#d0d0d0",
      skills: [
        { name: "Python", subs: 18, example: "Syntax, OOP, Decorators, Generators, Asyncio, Type hints, Context managers, List comprehensions, Standard library, pip ecosystem..." },
        { name: "JavaScript / TypeScript", subs: 22, example: "ES6+, Closures, Event loop, Promises, async/await, Prototypes, TypeScript types, Generics, DOM API, Module systems..." },
        { name: "C / C++", subs: 16, example: "Pointers, Memory management, STL, Templates, RAII, Smart pointers, Compilation model, Concurrency, Makefile..." },
        { name: "Java", subs: 15, example: "OOP, Collections, Streams, Concurrency, JVM internals, Spring basics, Maven/Gradle, Annotations..." },
        { name: "Go", subs: 12, example: "Goroutines, Channels, Interfaces, Error handling, Modules, net/http, Testing..." },
        { name: "Rust", subs: 11, example: "Ownership, Borrowing, Lifetimes, Traits, Error handling, Cargo, Unsafe Rust basics..." },
      ],
    },
    {
      domain: "Web Development",
      color: "#b0b0b0",
      skills: [
        { name: "HTML", subs: 12, example: "Semantic HTML, Forms, Tables, Accessibility (ARIA), Meta tags, Canvas, SVG, Web components, SEO markup..." },
        { name: "CSS", subs: 20, example: "Box model, Flexbox, Grid, Animations, Transitions, Variables, Media queries, Pseudo-elements, Transforms, Clip-path, Filters..." },
        { name: "React", subs: 18, example: "JSX, Hooks (useState, useEffect, useMemo, useCallback, useRef), Context, Redux, React Query, Portals, Error boundaries, Performance..." },
        { name: "Next.js", subs: 14, example: "App Router, SSR, SSG, ISR, API routes, Middleware, Image optimization, Metadata API, Server components..." },
        { name: "Node.js", subs: 15, example: "Event loop, Streams, File system, HTTP module, Express, Middleware, Authentication, Error handling, Worker threads..." },
        { name: "REST API Design", subs: 12, example: "HTTP methods, Status codes, Versioning, Authentication, Pagination, Rate limiting, OpenAPI spec, Error handling..." },
        { name: "GraphQL", subs: 10, example: "Schema, Resolvers, Queries, Mutations, Subscriptions, Apollo, DataLoader, Introspection..." },
      ],
    },
    {
      domain: "AI / Machine Learning",
      color: "#909090",
      skills: [
        { name: "Machine Learning", subs: 22, example: "Linear regression, Logistic regression, Decision trees, Random forests, SVM, K-means, PCA, Cross-validation, Bias-variance, Feature engineering..." },
        { name: "Deep Learning", subs: 18, example: "Neural networks, Backpropagation, CNNs, RNNs, LSTMs, Attention mechanism, Transformers, Batch normalization, Dropout, Transfer learning..." },
        { name: "NLP", subs: 15, example: "Tokenization, Word embeddings, BERT, GPT architecture, Fine-tuning, RAG, Prompt engineering, Named entity recognition, Sentiment analysis..." },
        { name: "Computer Vision", subs: 13, example: "Image preprocessing, Object detection (YOLO), Segmentation, Feature extraction, OpenCV, CLIP, Image generation..." },
        { name: "MLOps", subs: 12, example: "Model versioning, ML pipelines, Feature stores, Model monitoring, Docker for ML, CI/CD for ML, Experiment tracking..." },
        { name: "Data Science", subs: 16, example: "Pandas, NumPy, Data cleaning, EDA, Statistical testing, Visualization (Matplotlib, Seaborn, Plotly), SQL for analysis..." },
        { name: "Reinforcement Learning", subs: 10, example: "MDP, Q-learning, Policy gradients, Actor-Critic, Multi-arm bandit, OpenAI Gym, PPO, DQN..." },
      ],
    },
    {
      domain: "DevOps & Cloud",
      color: "#707070",
      skills: [
        { name: "Docker", subs: 12, example: "Dockerfile, Layers, Multi-stage builds, Docker Compose, Networking, Volumes, Registry, Security..." },
        { name: "Kubernetes", subs: 15, example: "Pods, Deployments, Services, Ingress, ConfigMaps, Secrets, Namespaces, Helm, HPA, StatefulSets..." },
        { name: "AWS", subs: 20, example: "EC2, S3, RDS, Lambda, API Gateway, CloudFront, IAM, VPC, ECS, CloudWatch, Route53, SQS/SNS..." },
        { name: "CI/CD", subs: 10, example: "GitHub Actions, GitLab CI, Jenkins, Pipeline design, Deployment strategies, Artifact management, Secrets management..." },
        { name: "Linux & Shell", subs: 13, example: "File system, Permissions, Processes, Cron, Bash scripting, SSH, Grep/Sed/Awk, Systemd, Networking commands..." },
        { name: "Infrastructure as Code", subs: 10, example: "Terraform, Pulumi, AWS CDK, State management, Modules, Provider configuration..." },
      ],
    },
    {
      domain: "Cybersecurity",
      color: "#505050",
      skills: [
        { name: "Web Security", subs: 14, example: "OWASP Top 10, XSS, CSRF, SQL Injection, Authentication flaws, CORS, Content Security Policy, HTTPS/TLS..." },
        { name: "Network Security", subs: 11, example: "Firewalls, IDS/IPS, VPN, Packet analysis, Port scanning, Encryption protocols..." },
        { name: "Cryptography", subs: 10, example: "Symmetric/Asymmetric encryption, RSA, AES, Hashing, Digital signatures, PKI, TLS handshake..." },
        { name: "Ethical Hacking / Penetration Testing", subs: 12, example: "Reconnaissance, Exploitation, Privilege escalation, Metasploit, Burp Suite, CTF techniques..." },
      ],
    },
    {
      domain: "Mobile Development",
      color: "#383838",
      skills: [
        { name: "React Native", subs: 13, example: "Components, Navigation, State, Native modules, Expo, Performance, Publishing..." },
        { name: "Flutter / Dart", subs: 12, example: "Widgets, State management, Animations, Platform channels, Pub packages, Build and deploy..." },
        { name: "Android (Kotlin)", subs: 14, example: "Activities, Fragments, ViewModel, LiveData, Coroutines, Jetpack Compose, Room, Retrofit..." },
        { name: "iOS (Swift)", subs: 13, example: "UIKit, SwiftUI, Core Data, URLSession, Combine, App lifecycle, App Store submission..." },
      ],
    },
    {
      domain: "Other Technical",
      color: "#282828",
      skills: [
        { name: "Version Control (Git)", subs: 11, example: "Branching, Merging, Rebasing, Cherry-pick, Stash, GitHub workflow, PR reviews, Conflict resolution..." },
        { name: "Blockchain / Web3", subs: 12, example: "Smart contracts, Solidity, Ethereum, IPFS, NFTs, DeFi, Hardhat, Web3.js, Wallets..." },
        { name: "Competitive Programming", subs: 8, example: "Contest strategy, Number theory, Geometry, String algorithms, Advanced graphs, Codeforces/Leetcode patterns..." },
        { name: "Embedded Systems / IoT", subs: 10, example: "Microcontrollers, Raspberry Pi, Arduino, Sensors, RTOS, Protocols (I2C, SPI, UART), Firmware..." },
        { name: "Game Development", subs: 11, example: "Unity, Unreal, Game loop, Physics, Shader basics, Networking for games, Audio, Asset pipeline..." },
      ],
    },
  ],
};

const SUBSKILLS = {
  title: "Sub-Skill Detail System",
  subtitle: "Granular knowledge declaration — the platform's core differentiator",
  concept: "When a user selects 'CSS' as a skill, they don't just mark themselves as a CSS developer. They expand into 20 sub-skills and tell us exactly what they know. This creates a skill fingerprint that is honest, specific, and directly actionable for AI roadmap generation.",
  levels: [
    { level: "Aware", desc: "I've heard of this / read about it / know it conceptually. I couldn't implement it from scratch.", points: 1, color: "#3a3a3a" },
    { level: "Familiar", desc: "I've used this before with reference material. I understand how it works but need to look things up.", points: 3, color: "#606060" },
    { level: "Proficient", desc: "I can implement this confidently without reference. I understand edge cases and trade-offs.", points: 7, color: "#ffffff" },
  ],
  example: {
    skill: "CSS",
    subs: [
      { name: "Box Model", chosen: "Proficient" },
      { name: "Flexbox", chosen: "Proficient" },
      { name: "CSS Grid", chosen: "Familiar" },
      { name: "Animations & Transitions", chosen: "Familiar" },
      { name: "CSS Variables", chosen: "Proficient" },
      { name: "Media Queries", chosen: "Proficient" },
      { name: "Pseudo-elements & Pseudo-classes", chosen: "Familiar" },
      { name: "Transforms & Clip-path", chosen: "Aware" },
      { name: "CSS Filters", chosen: "Aware" },
      { name: "CSS Preprocessors (Sass/Less)", chosen: "Familiar" },
    ],
  },
  ux: [
    "On skill selection, an inline drawer expands showing all sub-skills for that skill.",
    "Each sub-skill row has three toggle buttons: Aware / Familiar / Proficient. Default is none selected.",
    "User can also select 'Skip' — meaning they don't know this sub-skill yet (doesn't penalize, but doesn't add points).",
    "After selecting, the row shows a visual indicator and the contribution to their Ahead Score preview updates live.",
    "A progress bar at the top of the skill drawer shows how much of the skill taxonomy they've declared.",
    "Users can return to update sub-skill levels at any time — score updates immediately.",
  ],
};

const VERIFICATION = {
  title: "Skill Verification System",
  subtitle: "Trust but verify — multiple paths to credibility",
  concept: "Self-reported skills are the starting point, not the end. The platform actively encourages users to back their claims with evidence. Each verification method carries a different weight multiplier. Users choose which path works best for each skill.",
  methods: [
    {
      method: "Adaptive Quiz",
      icon: "◎",
      multiplier: "1.0×",
      best_for: "Any sub-skill",
      desc: "5–10 AI-generated questions per sub-skill cluster. Questions adapt in difficulty based on the user's stated proficiency level. Proficient-level questions test application, not just recall.",
      detail: [
        "Questions generated dynamically per sub-skill, not from a static bank.",
        "Minimum passing threshold: 70% (7/10 or 4/5 depending on length).",
        "Failed quiz: user drops to 'Familiar' level regardless of self-report.",
        "Quiz can be retaken after 48 hours.",
        "Partial quiz credit: 50–69% score → 'Familiar' level unlocked at 0.7× multiplier.",
        "Questions include MCQ, code-trace, fill-in-blank, and output prediction types.",
      ],
    },
    {
      method: "GitHub Repository",
      icon: "⬡",
      multiplier: "1.3×",
      best_for: "Programming, frameworks, system design",
      desc: "User submits a GitHub repo URL. The platform's AI analyzer reads the repo: languages used, complexity of code, patterns implemented, README quality, commit history, and test coverage.",
      detail: [
        "AI analysis checks: does the code actually demonstrate the claimed sub-skills?",
        "Repo must be public or user grants read access via GitHub OAuth.",
        "Analysis flags: complexity score, sub-skills evidenced, code quality markers.",
        "Manual fallback: if AI analysis is uncertain, repo is queued for lightweight human review.",
        "Private repos supported via GitHub OAuth token (not stored, only read-once).",
        "Repo can verify multiple skills/sub-skills in a single submission.",
      ],
    },
    {
      method: "Live Project / Vercel / Netlify Link",
      icon: "→",
      multiplier: "1.4×",
      best_for: "Frontend, full-stack, backend APIs",
      desc: "User submits a live deployment URL. The platform fetches the site, analyzes its features, complexity, and the technologies visibly in use. Highest trust for web skills.",
      detail: [
        "AI visits the URL and evaluates: features present, responsiveness, complexity.",
        "Cross-references with any linked GitHub source repo for full-stack verification.",
        "Checks technology indicators: bundle analysis, API responses, UI patterns.",
        "User adds a brief description of what they built and which skills it demonstrates.",
        "Re-verification available if project is updated.",
      ],
    },
    {
      method: "Certification Upload",
      icon: "◈",
      multiplier: "1.2×",
      best_for: "Cloud, ML, cybersecurity, formal courses",
      desc: "User uploads a certification image or PDF. AI reads the issuing body, course name, completion date, and score (if present). Recognized issuers get full multiplier.",
      detail: [
        "Recognized issuers (full 1.2×): Google, AWS, Meta, Microsoft, Coursera, edX, NPTEL, Udemy (rated 4.5+), Leetcode.",
        "Unknown issuers (partial 1.05×): any cert from an unrecognized source gets reduced multiplier.",
        "Expiry check: AWS/GCP certs expire — platform tracks expiry and reduces multiplier post-expiry.",
        "Cert is parsed via OCR + AI to extract structured data.",
        "PDF certificates are preferred; image fallback with quality check.",
        "Certificate metadata stored; original file is not retained after processing.",
      ],
    },
    {
      method: "External Project Link",
      icon: "⊹",
      multiplier: "1.25×",
      best_for: "General projects, portfolios, hackathons",
      desc: "Any public URL to a project — could be a blog post, a published npm package, an API endpoint, a Kaggle notebook, a Devpost entry, or similar. More flexible than Vercel-specific links.",
      detail: [
        "User provides URL + description of which skills are demonstrated.",
        "AI attempts to fetch and analyze the linked content.",
        "Kaggle: reads notebook complexity, dataset used, score achieved.",
        "npm/PyPI packages: reads package complexity, download count, documentation quality.",
        "Blog/writeup: reads technical depth and sub-skills demonstrated.",
        "Hackathon (Devpost): reads project description and tech stack.",
      ],
    },
  ],
  flow: [
    { step: "01", action: "User declares sub-skills for a parent skill (Aware / Familiar / Proficient)" },
    { step: "02", action: "Platform shows verification prompt: 'Back your claim — choose a verification method'" },
    { step: "03", action: "User selects method: Quiz, GitHub, Live Link, Cert, or Project Link" },
    { step: "04", action: "Verification runs (quiz: immediate; link/cert: async, usually < 2 minutes)" },
    { step: "05", action: "Result returned: verified ✓ or dropped to lower proficiency level" },
    { step: "06", action: "Ahead Score recalculates with new multiplier. Leaderboard updates in real-time." },
  ],
};

const AI_ENGINE = {
  title: "AI Intelligence Engine",
  subtitle: "Roadmaps, resources, and recommendations — all context-aware",
  systems: [
    {
      name: "Roadmap Generator",
      desc: "Builds a fully personalized, phased learning roadmap based on three inputs: the user's ultimate goal, their current verified skill fingerprint, and the gap analysis between the two.",
      inputs: ["Ultimate goal (e.g. 'FAANG SDE-2', 'Build and ship an AI SaaS', 'Research in NLP')", "Current verified sub-skills per domain", "Time availability (hours/week — set during onboarding)", "Preferred learning style (video / reading / project-based)"],
      outputs: ["Phase-by-phase roadmap (Foundation → Core → Advanced → Goal-specific)", "Each phase: list of skills/sub-skills to acquire with priority order", "Daily tasks: micro-actions (e.g. 'Solve 2 sliding window problems on LeetCode')", "Weekly milestones: verifiable checkpoints (e.g. 'Complete binary trees section + pass quiz')", "Estimated completion timeline per phase"],
      model: "Uses Claude/GPT-4o with a structured system prompt containing the full skill taxonomy, the user's verified skill state as JSON, and their goal. Output is structured JSON parsed into the roadmap UI.",
    },
    {
      name: "Resource Recommendation Engine",
      desc: "For each sub-skill in the roadmap, the engine recommends the best learning resources — ranked by community rating, relevance to the specific sub-skill, and the user's stated preferred learning style.",
      resource_types: [
        { type: "YouTube Videos", example: "Abdul Bari for DSA algorithms, Andrej Karpathy for neural nets" },
        { type: "Websites & Docs", example: "MDN for web, Papers With Code for ML, CP-Algorithms for competitive programming" },
        { type: "Books", example: "CLRS for algorithms, DDIA for system design, Deep Learning by Goodfellow" },
        { type: "Courses", example: "Coursera ML Specialization, MIT OCW, CS50, fast.ai" },
        { type: "Practice Platforms", example: "LeetCode, HackerRank, Kaggle, OverTheWire (security)" },
        { type: "GitHub Repos", example: "Curated awesome-lists, reference implementations, open-source projects to study" },
      ],
      ranking: "Resources are ranked using a hybrid score: static curated quality score + user rating within .ahead + recency weight + relevance-to-sub-skill embedding similarity.",
    },
    {
      name: "Quiz Generator",
      desc: "On-demand quiz generation for any sub-skill cluster. Questions are generated fresh per quiz attempt using the skill taxonomy and the user's declared proficiency level to calibrate difficulty.",
      question_types: [
        { type: "Multiple Choice", use: "Conceptual understanding, definitions, which-is-correct" },
        { type: "Code Trace", use: "Given this code, what is the output? (For programming skills)" },
        { type: "Fill in the Blank", use: "Complete the code snippet / formula" },
        { type: "Output Prediction", use: "What does this function return for input X?" },
        { type: "Short Identify", use: "Which data structure best fits this scenario? Why?" },
      ],
      calibration: "Aware-level questions test recognition. Familiar-level tests application. Proficient-level tests edge cases, optimization, and trade-offs.",
    },
    {
      name: "GitHub / Project Analyzer",
      desc: "An AI agent that reads submitted repositories and project URLs, maps the code to skill sub-skills in the taxonomy, and returns a structured verification result.",
      analysis_points: ["Languages and frameworks detected", "Design patterns identified (MVC, repository pattern, singleton, etc.)", "Complexity indicators (cyclomatic complexity, abstraction level)", "Sub-skills evidenced in code with confidence scores", "Red flags: plagiarized boilerplate, tutorial clones, minimal complexity"],
    },
    {
      name: "Adaptive Goal Suggester",
      desc: "If a user hasn't declared a goal yet, or wants to explore, this system suggests top ultimate goals based on their current skill fingerprint, field, and similar users' trajectories.",
      data_used: ["Current verified skills", "College field (CSE, AI/ML, IT)", "Top skills of students who achieved similar goals", "Job market signals (trending skills in JD analysis)"],
    },
  ],
};

const B2C = {
  title: "B2C Business Model",
  subtitle: "Free by default. Premium for power users. Institutional for colleges.",
  tiers: [
    {
      name: "Free",
      price: "₹0",
      target: "Every student",
      color: "#3a3a3a",
      features: [
        "Full skill taxonomy access (all domains)",
        "Sub-skill declaration for up to 3 domains",
        "Basic Ahead Score (Skill Depth + Consistency only)",
        "College leaderboard view",
        "AI roadmap (1 active roadmap)",
        "5 resource recommendations per skill",
        "1 quiz attempt per sub-skill per week",
        "1 GitHub repo verification",
        "Friend search + add (up to 10 friends)",
        "Basic 1-on-1 chat",
      ],
      limits: ["Limited to 3 domains", "No project/cert verification", "No country/global leaderboard", "No rank history graph"],
    },
    {
      name: "Pro",
      price: "₹199/mo",
      target: "Serious learners",
      color: "#ffffff",
      features: [
        "All skill domains unlocked (unlimited sub-skills)",
        "Full Ahead Score (all 5 pillars)",
        "All verification methods: quiz, GitHub, Vercel, cert, project link",
        "AI roadmap (unlimited, switchable goals)",
        "Unlimited resource recommendations + save to library",
        "Unlimited quiz attempts (48hr cooldown on same sub-skill)",
        "State + Country + Global leaderboard views",
        "Full rank history graph (all-time)",
        "Friends up to 100 + group chat (up to 10 friends)",
        "Priority AI roadmap regeneration",
        "Weekly Ahead Score breakdown email",
        "Profile badge: Pro",
      ],
      limits: [],
    },
    {
      name: "Pro Annual",
      price: "₹1,499/yr",
      target: "Committed users",
      color: "#e8d5a3",
      features: [
        "Everything in Pro",
        "2 months free vs monthly",
        "Ahead Score export (PDF resume supplement)",
        "Priority verification queue (< 30 min turnaround)",
        "Early access to new features",
        "Profile badge: Pro ∞",
      ],
      limits: [],
    },
    {
      name: "Campus",
      price: "Custom (per college)",
      target: "Colleges & institutions",
      color: "#888",
      features: [
        "All students get Pro features free",
        "Admin dashboard: see aggregated skill stats of enrolled students",
        "Placement cell: filter students by skill + Ahead Score for internship/job referrals",
        "Anonymous college-wide skill gap reports",
        "College branding on leaderboard",
        "API access for integration with college LMS",
        "Dedicated onboarding support",
      ],
      limits: [],
    },
  ],
  monetization: [
    { stream: "Pro subscriptions", desc: "Primary revenue. Target: 5–10% of MAU convert to Pro." },
    { stream: "Campus licensing", desc: "B2B2C: college pays flat annual fee, all students get Pro." },
    { stream: "Certification partnerships", desc: "Courses/platforms pay for featured placement in resource recommendations." },
    { stream: "Recruitment API", desc: "Companies pay to search verified skill profiles for hiring." },
    { stream: "Ahead Score API", desc: "Third-party platforms (LMS, job boards) can query normalized scores via API." },
  ],
  growth: [
    { stage: "0–6 months", action: "Seed 2–3 colleges. Free only. Focus on leaderboard virality within college WhatsApp groups." },
    { stage: "6–12 months", action: "Launch Pro. Use college leaderboard FOMO ('Your classmate is ranked #3 nationally') to drive conversion." },
    { stage: "12–18 months", action: "First Campus deals with placement-focused engineering colleges." },
    { stage: "18–30 months", action: "Recruitment API launch. Verified Ahead Scores become a hiring signal." },
    { stage: "30+ months", action: "Pan-India scale. Explore ASEAN expansion (similar engineering college culture)." },
  ],
};

const SCHEMA = {
  title: "Extended Schema",
  subtitle: "Data models for the deeper skill system",
  models: [
    {
      name: "SkillDomain",
      desc: "Top-level domain (e.g. 'AI / Machine Learning')",
      fields: [
        { f: "id", t: "uuid", n: "PK" },
        { f: "name", t: "string", n: "e.g. 'Web Development'" },
        { f: "slug", t: "string", n: "unique, URL-safe" },
        { f: "icon", t: "string", n: "emoji or icon key" },
        { f: "sort_order", t: "int", n: "display ordering" },
      ],
    },
    {
      name: "Skill",
      desc: "A skill within a domain (e.g. 'CSS' within 'Web Development')",
      fields: [
        { f: "id", t: "uuid", n: "PK" },
        { f: "domain_id", t: "uuid", n: "FK → SkillDomain" },
        { f: "name", t: "string", n: "e.g. 'CSS'" },
        { f: "slug", t: "string", n: "unique" },
        { f: "sub_skill_count", t: "int", n: "denormalized count" },
        { f: "base_weight", t: "float", n: "skill importance in scoring" },
        { f: "embedding", t: "vector(1536)", n: "pgvector, for AI matching" },
      ],
    },
    {
      name: "SubSkill",
      desc: "A specific sub-skill within a skill (e.g. 'CSS Animations' within 'CSS')",
      fields: [
        { f: "id", t: "uuid", n: "PK" },
        { f: "skill_id", t: "uuid", n: "FK → Skill" },
        { f: "name", t: "string", n: "e.g. 'CSS Animations & Transitions'" },
        { f: "description", t: "text", n: "what proficiency in this means" },
        { f: "point_value", t: "int", n: "base score contribution" },
        { f: "difficulty", t: "enum", n: "beginner | intermediate | advanced" },
        { f: "embedding", t: "vector(1536)", n: "for resource matching" },
      ],
    },
    {
      name: "UserSubSkill",
      desc: "A user's declared + verified state for a specific sub-skill",
      fields: [
        { f: "id", t: "uuid", n: "PK" },
        { f: "user_id", t: "uuid", n: "FK → User" },
        { f: "sub_skill_id", t: "uuid", n: "FK → SubSkill" },
        { f: "self_level", t: "enum", n: "aware | familiar | proficient | skipped" },
        { f: "verified_level", t: "enum", n: "null | aware | familiar | proficient" },
        { f: "verification_method", t: "enum", n: "quiz | github | vercel | cert | project | none" },
        { f: "verification_id", t: "uuid", n: "FK → Verification" },
        { f: "score_contribution", t: "float", n: "computed: points × multiplier" },
        { f: "updated_at", t: "timestamp", n: "" },
      ],
    },
    {
      name: "Verification",
      desc: "A single verification attempt and its result",
      fields: [
        { f: "id", t: "uuid", n: "PK" },
        { f: "user_id", t: "uuid", n: "FK → User" },
        { f: "method", t: "enum", n: "quiz | github | vercel | cert | project" },
        { f: "resource_url", t: "string", n: "null for quiz" },
        { f: "status", t: "enum", n: "pending | analyzing | passed | failed | partial" },
        { f: "multiplier_awarded", t: "float", n: "0.4 – 1.5" },
        { f: "ai_analysis_result", t: "jsonb", n: "structured AI output" },
        { f: "sub_skills_verified", t: "uuid[]", n: "array of SubSkill IDs confirmed" },
        { f: "submitted_at", t: "timestamp", n: "" },
        { f: "completed_at", t: "timestamp", n: "null if pending" },
      ],
    },
    {
      name: "QuizAttempt",
      desc: "A quiz session for a skill cluster",
      fields: [
        { f: "id", t: "uuid", n: "PK" },
        { f: "user_id", t: "uuid", n: "FK → User" },
        { f: "skill_id", t: "uuid", n: "FK → Skill" },
        { f: "questions", t: "jsonb", n: "array of generated Q&A objects" },
        { f: "answers_given", t: "jsonb", n: "user's answers" },
        { f: "score", t: "float", n: "0.0 – 1.0" },
        { f: "passed", t: "bool", n: "score ≥ 0.70" },
        { f: "proficiency_awarded", t: "enum", n: "aware | familiar | proficient" },
        { f: "attempted_at", t: "timestamp", n: "" },
        { f: "next_attempt_allowed_at", t: "timestamp", n: "+48hr if failed" },
      ],
    },
  ],
};

const FLOWS = {
  title: "Key User Flows",
  subtitle: "The journeys that define the .ahead experience",
  flows: [
    {
      name: "Skill Onboarding Flow",
      steps: [
        { n: "01", title: "Pick Your Field", desc: "CSE / AI & ML / IT / Other. This pre-filters domain recommendations." },
        { n: "02", title: "Declare Your Ultimate Goal", desc: "Choose from suggestions or type custom: 'Get into FAANG', 'Build an AI startup', 'MS in USA', 'Crack GATE', etc." },
        { n: "03", title: "Browse Skill Domains", desc: "All domains shown. User selects domains they have any skills in." },
        { n: "04", title: "Expand Skills Within Domain", desc: "Select which skills apply within the domain (e.g. select CSS, React, Node within Web Dev)." },
        { n: "05", title: "Declare Sub-Skills", desc: "For each selected skill, an inline drawer shows all sub-skills. User picks Aware / Familiar / Proficient per sub-skill." },
        { n: "06", title: "Ahead Score Preview", desc: "Live score preview updates as sub-skills are declared. Shows estimated initial rank." },
        { n: "07", title: "Verification Prompts", desc: "Platform suggests 2–3 high-value verifications to do immediately to boost score." },
        { n: "08", title: "Dashboard Unlocked", desc: "Initial roadmap is generated. Score is live. Welcome to .ahead." },
      ],
    },
    {
      name: "Verification Flow",
      steps: [
        { n: "01", title: "Verification Entry Point", desc: "User sees 'Verify' button next to any declared sub-skill. Or prompted via daily goal." },
        { n: "02", title: "Choose Method", desc: "Modal shows 5 methods with their multiplier clearly displayed. User picks one." },
        { n: "03", title: "Submit Evidence", desc: "Quiz: start quiz. GitHub/Vercel/Project: paste URL. Cert: upload file. Add optional description." },
        { n: "04", title: "Processing", desc: "Quiz: real-time. Links/certs: async (spinner shown, push notification on complete, max 5 min)." },
        { n: "05", title: "Result", desc: "Verification result returned. Sub-skill level confirmed or adjusted. Multiplier applied." },
        { n: "06", title: "Score Update", desc: "Ahead Score recalculates. Rank updates on leaderboard in real-time via WebSocket." },
      ],
    },
    {
      name: "Daily Usage Flow",
      steps: [
        { n: "01", title: "Dashboard", desc: "User sees: Ahead Score, today's rank, daily goal card, and a streak indicator." },
        { n: "02", title: "Daily Goal", desc: "AI-generated micro-task for today (tied to roadmap phase). User marks complete." },
        { n: "03", title: "Resource", desc: "Recommended resource for today's goal (YouTube / article / problem). Opened, consumed, marked done." },
        { n: "04", title: "Leaderboard Check", desc: "User checks their college rank. Views top performers. Motivated by proximity to next rank." },
        { n: "05", title: "Social", desc: "Optional: message a friend, see a friend's roadmap progress milestone." },
        { n: "06", title: "Sub-skill Update", desc: "Optional: if user learned something new, they update sub-skills → triggers verification prompt → score goes up." },
      ],
    },
  ],
};

// ─── RENDERER ────────────────────────────────────────────────────────────────

export default function AheadB2C() {
  const [active, setActive] = useState("score");
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [expandedMethod, setExpandedMethod] = useState(null);

  const renderScoreEngine = () => (
    <div style={{ animation: "fadeUp 0.35s ease-out" }}>
      <Header t={SCORE_ENGINE.title} s={SCORE_ENGINE.subtitle} />
      <div style={{ color: "#888", fontSize: "0.87rem", lineHeight: 1.8, maxWidth: "640px", marginBottom: "2.5rem", padding: "1.25rem", border: "1px solid #1a1a1a", borderLeft: "2px solid #fff" }}>
        {SCORE_ENGINE.concept}
      </div>
      {SCORE_ENGINE.pillars.map((p, i) => (
        <div key={i} style={{ borderBottom: "1px solid #141414", padding: "1.75rem 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "start", marginBottom: "0.75rem" }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{p.name}</div>
            <div style={{ fontFamily: "monospace", fontSize: "1rem", color: "#fff", fontWeight: 700 }}>{p.weight}</div>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "#444", marginBottom: "0.75rem", background: "#111", padding: "0.4rem 0.75rem", display: "inline-block" }}>{p.formula}</div>
          <div style={{ color: "#777", fontSize: "0.83rem", lineHeight: 1.7, marginBottom: "1rem", maxWidth: "560px" }}>{p.desc}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
            {p.breakdown.map((b, j) => (
              <div key={j} style={{ display: "flex", justifyContent: "space-between", background: "#0f0f0f", border: "1px solid #1a1a1a", padding: "0.4rem 0.75rem" }}>
                <span style={{ color: "#666", fontSize: "0.78rem" }}>{b.label}</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#fff" }}>{b.multiplier}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop: "2rem" }}>
        <Label t="Score Growth Rules" />
        {SCORE_ENGINE.growth.map((g, i) => (
          <Row key={i} n={`0${i + 1}`} t={g} />
        ))}
      </div>
    </div>
  );

  const renderTaxonomy = () => (
    <div style={{ animation: "fadeUp 0.35s ease-out" }}>
      <Header t={TAXONOMY.title} s={TAXONOMY.subtitle} />
      <div style={{ color: "#888", fontSize: "0.83rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "580px", borderLeft: "2px solid #fff", paddingLeft: "1rem" }}>{TAXONOMY.note}</div>
      {TAXONOMY.domains.map((d, i) => (
        <div key={i} style={{ borderBottom: "1px solid #141414" }}>
          <button onClick={() => setExpandedDomain(expandedDomain === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "1.25rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#333" }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontWeight: 700, fontSize: "0.92rem", color: d.color }}>{d.domain}</span>
              <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#444" }}>{d.skills.length} skills</span>
            </div>
            <span style={{ color: "#333", fontSize: "0.8rem" }}>{expandedDomain === i ? "−" : "+"}</span>
          </button>
          {expandedDomain === i && (
            <div style={{ paddingBottom: "1.25rem" }}>
              {d.skills.map((s, j) => (
                <div key={j} style={{ display: "grid", gridTemplateColumns: "220px 60px 1fr", gap: "1rem", padding: "0.65rem 0", borderTop: "1px solid #111", alignItems: "start" }}>
                  <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "#ccc" }}>{s.name}</span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#555" }}>{s.subs} subs</span>
                  <span style={{ fontSize: "0.76rem", color: "#555", lineHeight: 1.6 }}>{s.example}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSubSkills = () => (
    <div style={{ animation: "fadeUp 0.35s ease-out" }}>
      <Header t={SUBSKILLS.title} s={SUBSKILLS.subtitle} />
      <div style={{ color: "#888", fontSize: "0.83rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "600px", borderLeft: "2px solid #fff", paddingLeft: "1rem" }}>{SUBSKILLS.concept}</div>
      <div style={{ marginBottom: "2.5rem" }}>
        <Label t="Proficiency Levels" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "#1a1a1a", border: "1px solid #1a1a1a" }}>
          {SUBSKILLS.levels.map((l, i) => (
            <div key={i} style={{ background: "#0a0a0a", padding: "1.5rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: l.color, marginBottom: "0.5rem" }}>{l.level}</div>
              <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#555", marginBottom: "0.75rem" }}>+{l.points} pts / sub-skill</div>
              <div style={{ color: "#666", fontSize: "0.79rem", lineHeight: 1.6 }}>{l.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: "2.5rem" }}>
        <Label t={`Live Example: ${SUBSKILLS.example.skill} Sub-Skills`} />
        <div style={{ border: "1px solid #1a1a1a" }}>
          <div style={{ borderBottom: "1px solid #1a1a1a", padding: "0.6rem 1.25rem", display: "grid", gridTemplateColumns: "1fr auto", background: "#0d0d0d" }}>
            <span style={{ fontSize: "0.7rem", color: "#444", fontFamily: "monospace" }}>SUB-SKILL</span>
            <span style={{ fontSize: "0.7rem", color: "#444", fontFamily: "monospace" }}>LEVEL DECLARED</span>
          </div>
          {SUBSKILLS.example.subs.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", padding: "0.65rem 1.25rem", borderBottom: i < SUBSKILLS.example.subs.length - 1 ? "1px solid #111" : "none", alignItems: "center" }}>
              <span style={{ fontSize: "0.83rem", color: "#bbb" }}>{s.name}</span>
              <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: s.chosen === "Proficient" ? "#fff" : s.chosen === "Familiar" ? "#888" : "#444" }}>{s.chosen}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label t="UX Behaviour" />
        {SUBSKILLS.ux.map((u, i) => <Row key={i} n={`0${i + 1}`} t={u} />)}
      </div>
    </div>
  );

  const renderVerification = () => (
    <div style={{ animation: "fadeUp 0.35s ease-out" }}>
      <Header t={VERIFICATION.title} s={VERIFICATION.subtitle} />
      <div style={{ color: "#888", fontSize: "0.83rem", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "600px", borderLeft: "2px solid #fff", paddingLeft: "1rem" }}>{VERIFICATION.concept}</div>
      <div style={{ marginBottom: "2.5rem" }}>
        {VERIFICATION.methods.map((m, i) => (
          <div key={i} style={{ borderBottom: "1px solid #141414" }}>
            <button onClick={() => setExpandedMethod(expandedMethod === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "1.25rem 0", display: "grid", gridTemplateColumns: "32px 1fr 80px 160px auto", gap: "1rem", alignItems: "center", color: "#fff", textAlign: "left" }}>
              <span style={{ color: "#444", fontSize: "0.9rem" }}>{m.icon}</span>
              <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{m.method}</span>
              <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#fff" }}>{m.multiplier}</span>
              <span style={{ fontSize: "0.75rem", color: "#555" }}>{m.best_for}</span>
              <span style={{ color: "#333" }}>{expandedMethod === i ? "−" : "+"}</span>
            </button>
            {expandedMethod === i && (
              <div style={{ paddingBottom: "1.5rem" }}>
                <div style={{ color: "#777", fontSize: "0.83rem", lineHeight: 1.7, marginBottom: "1rem", maxWidth: "560px" }}>{m.desc}</div>
                {m.detail.map((d, j) => (
                  <div key={j} style={{ display: "flex", gap: "0.75rem", padding: "0.4rem 0", borderTop: j === 0 ? "1px solid #111" : "none" }}>
                    <span style={{ color: "#2a2a2a", fontSize: "0.65rem", flexShrink: 0, marginTop: "0.15rem" }}>◆</span>
                    <span style={{ color: "#666", fontSize: "0.8rem", lineHeight: 1.6 }}>{d}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Label t="Verification Flow" />
      {VERIFICATION.flow.map((f, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: "1rem", padding: "0.75rem 0", borderBottom: "1px solid #111", alignItems: "start" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#333" }}>{f.step}</span>
          <span style={{ color: "#aaa", fontSize: "0.83rem", lineHeight: 1.6 }}>{f.action}</span>
        </div>
      ))}
    </div>
  );

  const renderAI = () => (
    <div style={{ animation: "fadeUp 0.35s ease-out" }}>
      <Header t={AI_ENGINE.title} s={AI_ENGINE.subtitle} />
      {AI_ENGINE.systems.map((s, i) => (
        <div key={i} style={{ borderBottom: "1px solid #141414", padding: "2rem 0" }}>
          <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>{s.name}</div>
          <div style={{ color: "#777", fontSize: "0.83rem", lineHeight: 1.7, marginBottom: "1.25rem", maxWidth: "560px" }}>{s.desc}</div>
          {s.inputs && (
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#444", fontFamily: "monospace" }}>Inputs</span>
              {s.inputs.map((x, j) => <Row key={j} n="—" t={x} small />)}
            </div>
          )}
          {s.outputs && (
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#444", fontFamily: "monospace" }}>Outputs</span>
              {s.outputs.map((x, j) => <Row key={j} n="—" t={x} small />)}
            </div>
          )}
          {s.model && <div style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#444", background: "#0d0d0d", border: "1px solid #1a1a1a", padding: "0.6rem 0.9rem", marginTop: "0.75rem" }}>{s.model}</div>}
          {s.resource_types && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {s.resource_types.map((r, j) => (
                <div key={j} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", padding: "0.6rem 0.9rem" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#ccc", marginBottom: "0.2rem" }}>{r.type}</div>
                  <div style={{ fontSize: "0.73rem", color: "#555" }}>{r.example}</div>
                </div>
              ))}
            </div>
          )}
          {s.ranking && <div style={{ color: "#555", fontSize: "0.78rem", lineHeight: 1.6, borderTop: "1px solid #111", paddingTop: "0.75rem" }}>{s.ranking}</div>}
          {s.question_types && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {s.question_types.map((q, j) => (
                <div key={j} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "1rem", padding: "0.4rem 0", borderBottom: "1px solid #111" }}>
                  <span style={{ fontSize: "0.78rem", color: "#ccc" }}>{q.type}</span>
                  <span style={{ fontSize: "0.76rem", color: "#555" }}>{q.use}</span>
                </div>
              ))}
            </div>
          )}
          {s.calibration && <div style={{ color: "#555", fontSize: "0.78rem", lineHeight: 1.6, marginTop: "0.75rem" }}>{s.calibration}</div>}
          {s.analysis_points && s.analysis_points.map((a, j) => <Row key={j} n="—" t={a} small />)}
          {s.data_used && s.data_used.map((d, j) => <Row key={j} n="—" t={d} small />)}
        </div>
      ))}
    </div>
  );

  const renderB2C = () => (
    <div style={{ animation: "fadeUp 0.35s ease-out" }}>
      <Header t={B2C.title} s={B2C.subtitle} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "#1a1a1a", border: "1px solid #1a1a1a", marginBottom: "2.5rem" }}>
        {B2C.tiers.map((t, i) => (
          <div key={i} style={{ background: "#0a0a0a", padding: "1.75rem", borderBottom: i < 2 ? "1px solid #1a1a1a" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
              <span style={{ fontWeight: 800, fontSize: "1rem", color: t.color }}>{t.name}</span>
              <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#fff" }}>{t.price}</span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "#444", marginBottom: "1.25rem" }}>{t.target}</div>
            {t.features.map((f, j) => (
              <div key={j} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.3rem" }}>
                <span style={{ color: "#2a5a2a", fontSize: "0.65rem", flexShrink: 0, marginTop: "0.15rem" }}>✓</span>
                <span style={{ color: "#888", fontSize: "0.78rem", lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
            {t.limits.length > 0 && (
              <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #141414" }}>
                {t.limits.map((l, j) => (
                  <div key={j} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.25rem" }}>
                    <span style={{ color: "#3a1a1a", fontSize: "0.65rem", flexShrink: 0, marginTop: "0.15rem" }}>✗</span>
                    <span style={{ color: "#444", fontSize: "0.76rem" }}>{l}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Label t="Revenue Streams" />
      {B2C.monetization.map((m, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1.5rem", padding: "0.75rem 0", borderBottom: "1px solid #111" }}>
          <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "#ccc" }}>{m.stream}</span>
          <span style={{ color: "#666", fontSize: "0.8rem", lineHeight: 1.6 }}>{m.desc}</span>
        </div>
      ))}
      <div style={{ marginTop: "2.5rem" }}>
        <Label t="Growth Timeline" />
        {B2C.growth.map((g, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "1.5rem", padding: "0.75rem 0", borderBottom: "1px solid #111" }}>
            <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#555" }}>{g.stage}</span>
            <span style={{ color: "#888", fontSize: "0.8rem", lineHeight: 1.6 }}>{g.action}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchema = () => (
    <div style={{ animation: "fadeUp 0.35s ease-out" }}>
      <Header t={SCHEMA.title} s={SCHEMA.subtitle} />
      {SCHEMA.models.map((m, i) => (
        <div key={i} style={{ marginBottom: "1.5rem", border: "1px solid #1a1a1a" }}>
          <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid #1a1a1a", background: "#0d0d0d", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#444" }}>model</span>
            <span style={{ fontWeight: 700, fontFamily: "monospace", fontSize: "0.9rem" }}>{m.name}</span>
            <span style={{ fontSize: "0.72rem", color: "#555" }}>{m.desc}</span>
          </div>
          {m.fields.map((f, j) => (
            <div key={j} style={{ display: "grid", gridTemplateColumns: "160px 160px 1fr", padding: "0.5rem 1.25rem", borderBottom: j < m.fields.length - 1 ? "1px solid #111" : "none" }}>
              <span style={{ fontFamily: "monospace", fontSize: "0.79rem", color: "#fff" }}>{f.f}</span>
              <span style={{ fontFamily: "monospace", fontSize: "0.77rem", color: "#555" }}>{f.t}</span>
              <span style={{ fontSize: "0.76rem", color: "#3a3a3a" }}>{f.n}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderFlows = () => (
    <div style={{ animation: "fadeUp 0.35s ease-out" }}>
      <Header t={FLOWS.title} s={FLOWS.subtitle} />
      {FLOWS.flows.map((fl, i) => (
        <div key={i} style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid #1a1a1a" }}>{fl.name}</div>
          {fl.steps.map((s, j) => (
            <div key={j} style={{ display: "grid", gridTemplateColumns: "40px 160px 1fr", gap: "1rem", padding: "0.9rem 0", borderBottom: "1px solid #111", alignItems: "start" }}>
              <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#333" }}>{s.n}</span>
              <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "#ccc" }}>{s.title}</span>
              <span style={{ color: "#666", fontSize: "0.81rem", lineHeight: 1.65 }}>{s.desc}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderers = { score: renderScoreEngine, taxonomy: renderTaxonomy, subskills: renderSubSkills, verification: renderVerification, ai: renderAI, b2c: renderB2C, schema: renderSchema, flows: renderFlows };

  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#fff", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #1e1e1e; }
        button:hover { opacity: 0.85; }
      `}</style>
      {/* Sidebar */}
      <div style={{ width: "190px", flexShrink: 0, borderRight: "1px solid #111", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "1.75rem 1.5rem 1.5rem", borderBottom: "1px solid #111" }}>
          <div style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.03em", fontFamily: "Syne, sans-serif" }}>.ahead</div>
          <div style={{ fontSize: "0.6rem", color: "#333", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.2rem", fontFamily: "monospace" }}>B2C Deep-Dive</div>
        </div>
        <div style={{ flex: 1, padding: "0.75rem 0" }}>
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setActive(n.id)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "0.6rem 1.5rem", display: "flex", alignItems: "center", gap: "0.6rem", color: active === n.id ? "#fff" : "#aaa", borderLeft: active === n.id ? "1px solid #fff" : "1px solid transparent", transition: "all 0.12s" }}>
              <span style={{ fontSize: "0.72rem" }}>{n.icon}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: active === n.id ? 600 : 400 }}>{n.label}</span>
            </button>
          ))}
        </div>
        <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid #111" }}>
          <div style={{ fontSize: "0.6rem", color: "#555", fontFamily: "monospace", lineHeight: 2 }}>8 domains<br />100+ skills<br />1000+ sub-skills<br />5 verify methods</div>
        </div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: "2.75rem 3rem", maxWidth: "900px", overflowY: "auto", maxHeight: "100vh" }}>
        {renderers[active]?.()}
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
function Header({ t, s }) {
  return (
    <div style={{ marginBottom: "2.25rem" }}>
      <h2 style={{ fontSize: "1.65rem", fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "Syne, sans-serif", marginBottom: "0.35rem" }}>{t}</h2>
      <p style={{ color: "#555", fontSize: "0.83rem" }}>{s}</p>
    </div>
  );
}
function Label({ t }) {
  return <div style={{ fontSize: "0.65rem", letterSpacing: "0.14em", color: "#333", textTransform: "uppercase", marginBottom: "1rem", fontFamily: "monospace" }}>{t}</div>;
}
function Row({ n, t, small }) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", padding: small ? "0.35rem 0" : "0.6rem 0", borderBottom: "1px solid #0f0f0f" }}>
      <span style={{ fontFamily: "monospace", color: "#2a2a2a", fontSize: small ? "0.68rem" : "0.73rem", flexShrink: 0, paddingTop: "0.05rem" }}>{n}</span>
      <span style={{ color: "#777", fontSize: small ? "0.79rem" : "0.83rem", lineHeight: 1.65 }}>{t}</span>
    </div>
  );
}
