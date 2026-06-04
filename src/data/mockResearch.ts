export const mockResearch = {
  topic: "AI in Software Engineering",

  themes: [
    "Productivity",
    "Code Quality",
    "Developer Learning",
    "Security",
  ],

  landscape: [
    {
      name: "Productivity gains",
      explanation:
        "Research here asks whether AI coding tools genuinely improve output or simply move effort into prompting, debugging, and review.",
      debateStatus: "mixed evidence",
      paperTitles: [
        "The Impact of Generative AI on Developers",
        "Measuring Developer Productivity with AI Coding Assistants",
        "AI-Assisted Debugging in Professional Engineering Workflows",
      ],
      debateQuestions: [
        "Does AI make developers faster or simply shift where effort happens?",
      ],
    },
    {
      name: "Code quality concerns",
      explanation:
        "This area focuses on maintainability, review depth, hidden defects, and whether faster code creation leads to better software.",
      debateStatus: "mixed evidence",
      paperTitles: [
        "AI Pair Programming and Code Review Quality",
        "Code Maintainability After AI-Assisted Development",
        "Security Risks in AI-Generated Code",
      ],
      debateQuestions: [
        "Can generated code be trusted without changing review practices?",
      ],
    },
    {
      name: "Developer learning",
      explanation:
        "Studies in this theme examine whether AI support helps novice programmers learn or reduces necessary conceptual struggle.",
      debateStatus: "emerging",
      paperTitles: [
        "Novice Programmers and Generative AI Support",
        "Generative AI Tools in Computing Education",
        "The Impact of Generative AI on Developers",
      ],
      debateQuestions: [
        "Will AI improve learning or weaken foundational programming skills?",
      ],
    },
    {
      name: "Security risks",
      explanation:
        "This theme looks at vulnerabilities, unsafe suggestions, and how much developers should trust generated code.",
      debateStatus: "mostly agreed",
      paperTitles: [
        "Security Risks in AI-Generated Code",
        "Automation Bias in Software Development Teams",
        "Developer Trust in AI Code Recommendations",
      ],
      debateQuestions: [
        "Can generated code be trusted without changing review practices?",
      ],
    },
    {
      name: "Team collaboration",
      explanation:
        "This theme explores how AI coding tools affect communication, shared ownership, trust, and review practices inside teams.",
      debateStatus: "emerging",
      paperTitles: [
        "AI Pair Programming and Code Review Quality",
        "Automation Bias in Software Development Teams",
        "Developer Trust in AI Code Recommendations",
      ],
      debateQuestions: [
        "Does AI make developers faster or simply shift where effort happens?",
        "Can generated code be trusted without changing review practices?",
      ],
    },
  ],

  debates: [
    {
      question:
        "Does AI make developers faster or simply shift where effort happens?",
      explanation:
        "These papers help compare speed gains against review effort, debugging time, and confidence in generated code.",
      papers: [
        {
          title: "The Impact of Generative AI on Developers",
          stance: "Supports productivity gains",
        },
        {
          title: "AI Pair Programming and Code Review Quality",
          stance: "Complicates the claim",
        },
      ],
    },
    {
      question: "Can generated code be trusted without changing review practices?",
      explanation:
        "This debate focuses on whether current code review habits are enough when code is produced by AI tools.",
      papers: [
        {
          title: "AI Pair Programming and Code Review Quality",
          stance: "Challenges current review habits",
        },
        {
          title: "Security Risks in AI-Generated Code",
          stance: "Shows risk evidence",
        },
      ],
    },
    {
      question:
        "Will AI improve learning or weaken foundational programming skills?",
      explanation:
        "These sources point toward the tension between faster assistance and slower development of core expertise.",
      papers: [
        {
          title: "The Impact of Generative AI on Developers",
          stance: "Raises learning questions",
        },
        {
          title: "AI Pair Programming and Code Review Quality",
          stance: "Adds workflow context",
        },
      ],
    },
  ],

  sources: [
    {
      title: "The Impact of Generative AI on Developers",
      year: 2025,
      authors: "Mock et al.",
      venue: "Journal of Software Research",
      credibility: 92,
      relevance: 96,
      citations: 184,
      type: "Empirical study",
      url: "https://scholar.google.com/scholar?q=The+Impact+of+Generative+AI+on+Developers",
      whyItMatters:
        "Useful for understanding how AI tools change developer speed, review habits, and confidence.",
      credibilityBreakdown: {
        citationStrength: "High",
        recency: "Recent",
        methodology: "Empirical developer study",
        venueQuality: "Strong academic venue",
        limitations: "May focus on a narrow developer sample",
        whyTrust:
          "This is a strong source because it is recent, well-cited, and based on empirical developer data. However, it may not generalize to every programming team.",
      },
    },
    {
      title: "AI Pair Programming and Code Review Quality",
      year: 2024,
      authors: "Chen and Alvarez",
      venue: "Software Engineering Notes",
      credibility: 88,
      relevance: 91,
      citations: 96,
      type: "Mixed-methods paper",
      url: "https://scholar.google.com/scholar?q=AI+Pair+Programming+and+Code+Review+Quality",
      whyItMatters:
        "Helps compare productivity gains with risks around maintainability and review depth.",
      credibilityBreakdown: {
        citationStrength: "Moderate",
        recency: "Recent",
        methodology: "Mixed-methods study",
        venueQuality: "Relevant software engineering venue",
        limitations: "May depend on how code review quality was measured",
        whyTrust:
          "This is useful because it combines more than one kind of evidence and focuses on review quality, not just speed. Its claims should be checked against how quality was measured.",
      },
    },
    {
      title: "Security Risks in AI-Generated Code",
      year: 2023,
      authors: "Rahman et al.",
      venue: "ACM Computing Surveys",
      credibility: 94,
      relevance: 87,
      citations: 312,
      type: "Survey paper",
      url: "https://scholar.google.com/scholar?q=Security+Risks+in+AI-Generated+Code",
      whyItMatters:
        "Strong for understanding the limitations and risks of relying on generated code.",
      credibilityBreakdown: {
        citationStrength: "High",
        recency: "Recent",
        methodology: "Survey of security evidence",
        venueQuality: "Strong academic venue",
        limitations: "Survey papers depend on the quality of the studies they include",
        whyTrust:
          "This is a credible background source because it is well-cited and synthesizes security research. It is strongest for mapping risks, but less direct than a new experiment.",
      },
    },
    {
      title: "Measuring Developer Productivity with AI Coding Assistants",
      year: 2025,
      authors: "Singh and Patel",
      venue: "IEEE Software",
      credibility: 86,
      relevance: 89,
      citations: 74,
      type: "Quantitative study",
      url: "https://scholar.google.com/scholar?q=Measuring+Developer+Productivity+with+AI+Coding+Assistants",
      whyItMatters:
        "Useful for questioning how productivity is measured when AI changes planning, coding, and review work.",
      credibilityBreakdown: {
        citationStrength: "Moderate",
        recency: "Very recent",
        methodology: "Quantitative productivity study",
        venueQuality: "Recognized professional academic venue",
        limitations: "Productivity metrics may miss learning, quality, or long-term maintenance",
        whyTrust:
          "This source is useful because it uses measurable productivity data and is very recent. Be careful, though: productivity numbers do not always capture code quality or learning.",
      },
    },
    {
      title: "Novice Programmers and Generative AI Support",
      year: 2024,
      authors: "Williams et al.",
      venue: "Computers & Education",
      credibility: 90,
      relevance: 84,
      citations: 143,
      type: "Education study",
      url: "https://scholar.google.com/scholar?q=Novice+Programmers+and+Generative+AI+Support",
      whyItMatters:
        "Good for exploring whether AI support helps beginners learn concepts or bypass important struggle.",
      credibilityBreakdown: {
        citationStrength: "High",
        recency: "Recent",
        methodology: "Education-focused study",
        venueQuality: "Strong education research venue",
        limitations: "Findings may depend on the course design and student background",
        whyTrust:
          "This is a strong source for learning questions because it focuses on novice programmers rather than professional developers. It may not apply to advanced engineering teams.",
      },
    },
    {
      title: "Automation Bias in Software Development Teams",
      year: 2022,
      authors: "Kumar and Ellis",
      venue: "Human Factors in Computing Systems",
      credibility: 91,
      relevance: 82,
      citations: 267,
      type: "Human factors paper",
      url: "https://scholar.google.com/scholar?q=Automation+Bias+in+Software+Development+Teams",
      whyItMatters:
        "Helps explain why developers may over-trust AI suggestions even when errors are present.",
      credibilityBreakdown: {
        citationStrength: "High",
        recency: "Slightly older but still relevant",
        methodology: "Human factors study",
        venueQuality: "Strong human-computer interaction venue",
        limitations: "May discuss automation behavior more broadly than coding assistants specifically",
        whyTrust:
          "This is valuable because it explains the human side of trusting automation. It may need pairing with newer AI coding papers for the most current context.",
      },
    },
    {
      title: "AI-Assisted Debugging in Professional Engineering Workflows",
      year: 2025,
      authors: "Morgan and Ito",
      venue: "Empirical Software Engineering",
      credibility: 87,
      relevance: 80,
      citations: 41,
      type: "Field study",
      url: "https://scholar.google.com/scholar?q=AI-Assisted+Debugging+in+Professional+Engineering+Workflows",
      whyItMatters:
        "Adds detail on how AI tools affect debugging, not only code generation.",
      credibilityBreakdown: {
        citationStrength: "Emerging",
        recency: "Very recent",
        methodology: "Field study",
        venueQuality: "Relevant empirical software engineering venue",
        limitations: "Early evidence with fewer citations because it is new",
        whyTrust:
          "This is useful because it studies real debugging workflows and is very recent. Its citation count is lower mainly because newer papers have had less time to be cited.",
      },
    },
    {
      title: "Code Maintainability After AI-Assisted Development",
      year: 2023,
      authors: "Garcia et al.",
      venue: "Journal of Systems and Software",
      credibility: 89,
      relevance: 79,
      citations: 118,
      type: "Repository analysis",
      url: "https://scholar.google.com/scholar?q=Code+Maintainability+After+AI-Assisted+Development",
      whyItMatters:
        "Important for comparing short-term speed against longer-term maintenance costs.",
      credibilityBreakdown: {
        citationStrength: "Moderate",
        recency: "Recent",
        methodology: "Repository analysis",
        venueQuality: "Strong software systems venue",
        limitations: "Repository data may not explain why developers made specific choices",
        whyTrust:
          "This is credible for maintainability questions because it looks at code artifacts rather than only developer opinions. It may need qualitative evidence to explain developer reasoning.",
      },
    },
    {
      title: "Developer Trust in AI Code Recommendations",
      year: 2024,
      authors: "O'Neill and Park",
      venue: "ACM Transactions on Software Engineering",
      credibility: 85,
      relevance: 77,
      citations: 68,
      type: "Interview study",
      url: "https://scholar.google.com/scholar?q=Developer+Trust+in+AI+Code+Recommendations",
      whyItMatters:
        "Useful for understanding how developers decide when to accept, reject, or modify AI suggestions.",
      credibilityBreakdown: {
        citationStrength: "Moderate",
        recency: "Recent",
        methodology: "Interview study",
        venueQuality: "Relevant software engineering venue",
        limitations: "Interview studies can reveal reasoning but may not measure actual code outcomes",
        whyTrust:
          "This is a useful source because it explains developer judgment and trust in plain workflow terms. Pair it with empirical code-quality studies before making broad claims.",
      },
    },
    {
      title: "Generative AI Tools in Computing Education",
      year: 2023,
      authors: "Hassan and Miller",
      venue: "International Computing Education Research",
      credibility: 88,
      relevance: 75,
      citations: 205,
      type: "Literature review",
      url: "https://scholar.google.com/scholar?q=Generative+AI+Tools+in+Computing+Education",
      whyItMatters:
        "A helpful background source for education-focused dissertations.",
      credibilityBreakdown: {
        citationStrength: "High",
        recency: "Recent",
        methodology: "Literature review",
        venueQuality: "Specialist computing education venue",
        limitations: "Best for background, not for proving one specific causal effect",
        whyTrust:
          "This is a strong orientation source because it reviews a wider education literature. Use it to understand the field, then follow up with focused empirical studies.",
      },
    },
  ],

  comparison: {
    agreement:
      "Both papers argue that AI tools change developer workflows, but they define the value of that change differently.",
    disagreement:
      "One paper focuses on productivity and confidence, while the other asks whether faster work also improves review quality and maintainability.",
    methodDifference:
      "Compare the evidence type carefully: survey or field data can show developer experience, while review or repository analysis can reveal quality risks.",
    dissertationUse:
      "Use one paper to frame the promise of AI-assisted development and the other to introduce a more critical counterpoint.",
  },

  readingPath: [
    "Start Here",
    "Build Context",
    "Understand Debate",
    "Advanced Reading",
  ],

  reflectionQuestions: [
    "What assumptions are being made?",
    "Which papers disagree?",
  ],
};
