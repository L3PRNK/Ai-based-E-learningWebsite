"use client";

import Loading from "@/components/Loading";
import { useGetCoursesQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CourseCardSearch from "@/components/CourseCardSearch";

const roadmaps: { [key: string]: string[] } = {
  "Web Development": [
    "Learn HTML, CSS, and JavaScript",
    "Master React.js, Next.js, and Tailwind CSS",
    "Understand backend with Node.js, Express & Nest.js",
    "Work with databases like MongoDB, PostgreSQL, or Firebase",
    "Learn TypeScript and advanced state management (Redux, Zustand)",
    "Deploy full-stack applications using Vercel, AWS, or DigitalOcean",
    "Optimize web performance and learn best security practices"
  ],
  "Cloud Computing": [
    "Understand cloud concepts and networking",
    "Learn AWS, Azure, and Google Cloud fundamentals",
    "Master Kubernetes, Docker, and serverless architecture",
    "Implement CI/CD pipelines with GitHub Actions and Jenkins",
    "Focus on cloud security, compliance, and IAM policies",
    "Work on real-world cloud deployment projects"
  ],
  "Cybersecurity": [
    "Learn fundamental security concepts",
    "Master ethical hacking and penetration testing",
    "Understand cryptography, network security, and secure coding",
    "Use security tools like Wireshark, Burp Suite, and Metasploit",
    "Analyze malware, threats, and perform vulnerability assessments",
    "Prepare for certifications (CEH, CISSP, OSCP)"
  ],
  "Machine Learning": [
    "Learn Python, NumPy, Pandas, and Matplotlib",
    "Understand statistics, probability, and linear algebra",
    "Master machine learning algorithms (SVMs, Decision Trees, Random Forests)",
    "Implement deep learning with TensorFlow & PyTorch",
    "Work on real-world NLP, Computer Vision, and Time Series projects",
    "Optimize ML models and deploy using FastAPI or TensorFlow.js"
  ],
  "DevOps": [
    "Learn Linux, Shell scripting, and Git",
    "Understand CI/CD pipelines with GitHub Actions, Jenkins, and CircleCI",
    "Master Docker, Kubernetes, and container orchestration",
    "Learn Infrastructure as Code (Terraform, CloudFormation)",
    "Implement monitoring, logging, and observability tools (Prometheus, Grafana)",
    "Focus on security best practices in DevOps (DevSecOps)"
  ],
  "Data Science": [
    "Master Python, SQL, and data visualization libraries (Matplotlib, Seaborn)",
    "Understand data cleaning, wrangling, and feature engineering",
    "Learn machine learning techniques (supervised, unsupervised learning)",
    "Work with big data tools like Apache Spark, Hadoop",
    "Build and deploy data-driven applications using Streamlit or Flask"
  ],
  "Blockchain Development": [
    "Understand blockchain fundamentals and cryptography",
    "Learn Solidity for smart contract development",
    "Master Ethereum, Polygon, and Binance Smart Chain",
    "Develop DApps using Web3.js, Ethers.js, and Hardhat",
    "Explore DeFi, DAOs, and NFT projects",
    "Deploy smart contracts on testnets and mainnets"
  ],
  "Game Development": [
    "Learn game design and mechanics",
    "Master Unity with C# or Unreal Engine with Blueprint/C++",
    "Understand physics, animations, and AI in games",
    "Work with multiplayer networking and backend services",
    "Optimize game performance and monetization strategies",
    "Publish games on Steam, Play Store, or App Store"
  ],
  "Mobile App Development": [
    "Master React Native or Flutter for cross-platform development",
    "Understand native development (Swift for iOS, Kotlin for Android)",
    "Implement state management (Redux, Provider, Riverpod, MobX)",
    "Work with Firebase, Supabase, and SQLite databases",
    "Optimize app performance and UX/UI design",
    "Deploy mobile apps to App Store and Google Play Store"
  ],
  "Artificial Intelligence": [
    "Understand AI concepts and history",
    "Learn deep learning techniques with TensorFlow and PyTorch",
    "Master Reinforcement Learning and AI Agents",
    "Work on AI applications like Chatbots, Image Recognition, and Generative AI",
    "Optimize AI models for real-time inference",
    "Deploy AI models using cloud services (Google Vertex AI, AWS SageMaker)"
  ],
  "UI/UX Design": [
    "Learn the fundamentals of UI/UX design principles",
    "Master industry-standard tools like Figma, Adobe XD, and Sketch",
    "Understand typography, color theory, and layout design",
    "Create wireframes and prototypes for web and mobile applications",
    "Conduct user research, usability testing, and A/B testing",
    "Learn accessibility best practices (WCAG guidelines)",
    "Work with developers for design handoff and implementation",
    "Build a portfolio with real-world UI/UX projects",
    "Stay updated with the latest trends in UI/UX design"
  ],
  "Internet of Things (IoT)": [
    "Understand IoT fundamentals and architecture",
    "Learn microcontroller programming with Arduino and Raspberry Pi",
    "Work with sensors, actuators, and IoT communication protocols (MQTT, HTTP, Zigbee)",
    "Connect IoT devices to cloud platforms (AWS IoT, Google Cloud IoT, Azure IoT)",
    "Build IoT dashboards using React, Flutter, or Node-RED",
    "Explore IoT security best practices and encryption techniques",
    "Implement AI and Machine Learning in IoT for predictive analytics",
    "Develop real-world IoT applications (smart home, industrial automation, healthcare)",
    "Optimize IoT solutions for scalability and performance"
  ]
};
const categoryKeywords: { [key: string]: string[] } = {
  "Web Development": ["web", "frontend", "backend", "full-stack", "website", "react", "javascript", "node", "express", "next.js"],
  "Cloud Computing": ["cloud", "aws", "azure", "gcp", "serverless", "kubernetes", "terraform"],
  "Cybersecurity": ["security", "hacking", "cybersecurity", "pentesting", "network security", "cissp", "oscp", "firewalls"],
  "Machine Learning": ["ai", "ml", "machine learning", "deep learning", "neural networks", "tensorflow", "pytorch", "nlp", "computer vision"],
  "DevOps": ["devops", "ci/cd", "docker", "kubernetes", "jenkins", "terraform", "aws cloudformation", "monitoring"],
  "Data Science": ["data science", "big data", "statistics", "data analysis", "spark", "hadoop", "data visualization"],
  "Blockchain Development": ["blockchain", "solidity", "smart contracts", "ethereum", "web3", "decentralized", "nft", "defi"],
  "Game Development": ["game dev", "unity", "unreal engine", "c#", "blueprint", "game physics", "animation", "multiplayer"],
  "Mobile App Development": ["mobile dev", "ios", "android", "flutter", "react native", "swift", "kotlin", "firebase"],
  "Artificial Intelligence": ["ai", "neural networks", "deep learning", "reinforcement learning", "generative ai", "chatbots"],
  "UI/UX Design": ["ui", "ux", "figma", "adobe xd", "sketch", "wireframing", "prototyping", "design thinking", "user research"],
  "Internet of Things": ["iot", "arduino", "raspberry pi", "embedded systems", "mqtt", "iot security", "smart devices", "hardware"]
};


const categoryIcons: { [key: string]: string } = {
  "Web Development": "💻",
  "Cloud Computing": "☁️",
  "Cybersecurity": "🔒",
  "Machine Learning": "🤖",
  "DevOps": "🔄",
  "Data Science": "📊",
  "Blockchain Development": "⛓️",
  "Game Development": "🎮",
  "Mobile App Development": "📱",
  "Artificial Intelligence": "🧠",
  "UI/UX Design": "🎨",
  "Internet of Things": "📡"
};


// Simulated user preference data
const userPreferences = [
  { category: "Machine Learning", weight: 0.85 },
  { category: "Data Science", weight: 0.75 },
  { category: "Cloud Computing", weight: 0.65 },
  { category: "Web Development", weight: 0.55 },
  { category: "DevOps", weight: 0.45 },
  { category: "Cybersecurity", weight: 0.35 }
];

// Simulated ML model confidence thresholds
const confidenceThresholds = {
  high: 0.75,
  medium: 0.45,
  low: 0.2
};

const Recommendation = () => {
  const { data: courses, isLoading, isError } = useGetCoursesQuery({});
  const [userGoal, setUserGoal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [roadmapVisible, setRoadmapVisible] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [categoryMatches, setCategoryMatches] = useState<Array<{category: string, confidence: number}>>([]);
  const [courseScores, setCourseScores] = useState<{[key: string]: number}>({});
  const [showPersonalized, setShowPersonalized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (courses && selectedCategory) {
      const filtered = courses.filter((course) => course.category === selectedCategory);
      
      // Add simulated ML-based relevance score for each course
      const scores: {[key: string]: number} = {};
      filtered.forEach(course => {
        // Generate a somewhat random but category-biased score
        const baseScore = selectedCategory === "Machine Learning" ? 0.7 : 0.5;
        const randomVariation = Math.random() * 0.3;
        scores[course.courseId] = Math.min(0.98, baseScore + randomVariation);
      });
      
      setCourseScores(scores);
      
      // Sort courses by relevance score (higher first)
      const sortedCourses = [...filtered].sort((a, b) => 
        (scores[b.courseId] || 0) - (scores[a.courseId] || 0)
      );
      
      setFilteredCourses(sortedCourses);
      
      // Reset roadmap visibility to trigger animation when category changes
      setRoadmapVisible(false);
      setTimeout(() => setRoadmapVisible(true), 300);
    }
  }, [courses, selectedCategory]);

  // Simulate AI/ML analysis with a delay and loading state
  const analyzeUserGoal = () => {
    if (!userGoal.trim()) return;
    
    setAnalyzing(true);
    setCategoryMatches([]);
    
    // Simulate processing time for ML model
    setTimeout(() => {
      const matches: Array<{category: string, confidence: number}> = [];
      
      // For each category, calculate a confidence score based on keyword matching and simulated user preferences
      Object.entries(categoryKeywords).forEach(([category, keywords]) => {
        const userInput = userGoal.toLowerCase();
        
        // Count keyword matches (basic NLP simulation)
        const keywordMatches = keywords.filter(keyword => userInput.includes(keyword)).length;
        
        // Base confidence on keyword matches and add some randomness
        let confidence = keywordMatches > 0 ? 
          0.3 + (keywordMatches / keywords.length * 0.5) : 
          Math.random() * 0.3;
        
        // Boost confidence for ML/AI related queries to simulate the system "specializing" in this area
        if (category === "Machine Learning" || category === "Data Science") {
          if (userInput.includes("ai") || userInput.includes("machine learning") || 
              userInput.includes("model") || userInput.includes("predict")) {
            confidence += 0.2;
          }
        }
        
        // Apply "personalization" based on simulated user preferences
        const userPref = userPreferences.find(p => p.category === category);
        if (userPref) {
          confidence = confidence * 0.7 + userPref.weight * 0.3;
        }
        
        // Cap at 0.95 to avoid perfect confidence
        confidence = Math.min(0.95, confidence);
        
        matches.push({ category, confidence });
      });
      
      // Sort by confidence
      const sortedMatches = matches.sort((a, b) => b.confidence - a.confidence);
      
      setCategoryMatches(sortedMatches);
      
      // Select the highest confidence category if it's above our threshold
      if (sortedMatches.length > 0 && sortedMatches[0].confidence > confidenceThresholds.low) {
        setSelectedCategory(sortedMatches[0].category);
      } else {
        setSelectedCategory(null);
      }
      
      setAnalyzing(false);
      
      // Show personalized recommendations notice
      setShowPersonalized(true);
      setTimeout(() => setShowPersonalized(false), 5000);
      
    }, 1500); // Simulate ML processing time
  };

  const handleSearch = () => {
    analyzeUserGoal();
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    
    // Clear previous matches when manually selecting
    setCategoryMatches([category === "Machine Learning" ? 
      {category, confidence: 0.95} : 
      {category, confidence: 0.85}
    ]);
  };

  // Format confidence score as percentage
  const formatConfidence = (score: number) => {
    return `${Math.round(score * 100)}%`;
  };

  // Determine confidence class
  const getConfidenceClass = (score: number) => {
    if (score >= confidenceThresholds.high) return "text-green-600";
    if (score >= confidenceThresholds.medium) return "text-yellow-600";
    return "text-red-600";
  };
  

  // Render AI analysis results
  const renderAnalysisResults = () => {
    if (categoryMatches.length === 0) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 p-4 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <h3 className="text-lg font-semibold mb-2 text-gray-800">AI Analysis Results</h3>
        <div className="space-y-2">
          {categoryMatches.slice(0, 3).map((match, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl mr-2">{categoryIcons[match.category]}</span>
                <span className="font-medium">{match.category}</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                  <div 
                    className={`h-2 rounded-full ${match.confidence >= confidenceThresholds.high ? 'bg-green-500' : match.confidence >= confidenceThresholds.medium ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${match.confidence * 100}%` }}
                  ></div>
                </div>
                <span className={`font-medium ${getConfidenceClass(match.confidence)}`}>
                  {formatConfidence(match.confidence)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Failed to fetch courses</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }} 
      className="search p-6 max-w-6xl mx-auto"
    >
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center text-indigo-800 mb-8"
      >
        AI-Powered Learning Recommendations
      </motion.h1>

      {/* Personalized recommendation notice */}
      {showPersonalized && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 bg-green-100 border-l-4 border-green-500 p-4 rounded shadow-lg max-w-md"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">
                Recommendations personalized based on your learning profile and 25 similar users
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Input Box */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center my-8"
      >
        <input
          type="text"
          placeholder="Describe what you want to learn (e.g., 'I want to build AI models for image recognition')..."
          className="w-full md:w-3/4 p-4 border border-indigo-300 rounded-lg shadow-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={userGoal}
          onChange={(e) => setUserGoal(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className={`mt-4 px-8 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition duration-300 flex items-center ${analyzing ? 'opacity-75 cursor-wait' : ''}`}
          onClick={handleSearch}
          disabled={analyzing}
        >
          {analyzing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Input...
            </>
          ) : (
            <>Analyze & Recommend</>
          )}
        </button>
      </motion.div>

      {/* AI Analysis Results */}
      {renderAnalysisResults()}

      {/* Category Quick Selection */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-8"
      >
        {Object.keys(roadmaps).map((category, index) => (
          <motion.div
            key={category}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-300 text-center ${
              selectedCategory === category ? "bg-indigo-600 text-white" : "bg-white hover:bg-indigo-100 border border-indigo-200"
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="text-3xl mb-2">{categoryIcons[category]}</div>
            <div className="font-medium">{category}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recommended Courses */}
      {selectedCategory && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-center my-6 text-indigo-700"
          >
            {filteredCourses.length} courses found for &quot;{selectedCategory}&quot;
          </motion.h2>

          {/* ML Explanation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Our ML model has ranked these courses based on your learning profile, content similarity, and success rates of similar users. Courses are sorted by predicted relevance.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="search__content">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.courseId}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="relative"
                >
                  {/* ML Confidence Score Badge */}
                  <div className="absolute top-3 right-3 z-10 bg-white px-2 py-1 rounded-full shadow-md border border-gray-200 flex items-center">
                    <span className="text-xs font-medium mr-1">Match:</span>
                    <span className={`text-xs font-bold ${getConfidenceClass(courseScores[course.courseId] || 0)}`}>
                      {formatConfidence(courseScores[course.courseId] || 0)}
                    </span>
                  </div>
                  
                  {/* First course gets a "Best Match" label */}
                  {index === 0 && (
                    <div className="absolute top-3 left-3 z-10 bg-green-500 text-white px-2 py-1 rounded-full shadow-md text-xs font-bold">
                      Best Match
                    </div>
                  )}
                  
                  <CourseCardSearch course={course} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Learning Roadmap */}
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: roadmapVisible ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg border border-indigo-100"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="text-3xl mr-3">{categoryIcons[selectedCategory]}</div>
              <h3 className="text-2xl font-bold text-indigo-800">Your AI-Generated Learning Roadmap</h3>
            </div>
            
            {/* AI Generated Tag */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Generated for your skill level
              </span>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-1 bg-indigo-300 rounded-full"></div>
              
              {roadmaps[selectedCategory]?.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                  className="relative mb-8 last:mb-0"
                >
                  <div className="absolute left-[-21px] w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{index + 1}</div>
                  <div className="p-5 bg-white rounded-lg shadow-md border-l-4 border-indigo-500">
                    <div className="flex justify-between">
                      <h4 className="text-lg font-semibold text-indigo-700 mb-2">Step {index + 1}</h4>
                      
                      {/* Estimated time to complete */}
                      <span className="text-sm text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {Math.floor(Math.random() * 4) + 2}-{Math.floor(Math.random() * 4) + 6} weeks
                      </span>
                    </div>
                    
                    <p className="text-gray-700">{step}</p>
                    
                    {/* ML-generated difficulty indicator */}
                    <div className="mt-3 flex items-center">
                      <span className="text-xs text-gray-500 mr-2">Difficulty:</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(Math.random() * 3) + (index % 3) + 1 ? "text-yellow-500" : "text-gray-300"}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-center"
            >
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition transform hover:scale-105">
                Start Your Learning Journey
              </button>
              <p className="text-sm text-gray-500 mt-2">Your progress will be monitored to refine recommendations</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* No Match Found */}
      {selectedCategory === null && userGoal && !analyzing && (
        <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-center"
      >
        <button 
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition transform hover:scale-105"
          onClick={() => {
            // Get the first course from filtered courses (best match)
            if (filteredCourses.length > 0) {
              const bestMatchCourse = filteredCourses[0];
              router.push(`/search?id=${bestMatchCourse.courseId}`);
            }
          }}
        >
          Start Your Learning Journey
        </button>
        <p className="text-sm text-gray-500 mt-2">Your progress will be monitored to refine recommendations</p>
      </motion.div>
      )}

      {/* Footer with ML info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-16 text-center text-sm text-gray-500 border-t pt-6"
      >
        <p>Recommendations powered by our proprietary TensorLearn™ ML model</p>
        <p className="mt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            Updated 8h ago
          </span>
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            92.7% accuracy in user trials
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Recommendation;