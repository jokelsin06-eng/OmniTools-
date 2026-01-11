
import { Tool, ToolCategory } from './types';
import * as TextTools from './tools/TextTools';
import * as CalcTools from './tools/CalculatorTools';
import * as DevTools from './tools/DeveloperTools';
import * as ImageTools from './tools/ImageTools';
import * as FileTools from './tools/FileTools';
import * as AITools from './tools/AITools';
import * as SEOTools from './tools/SEOTools';
import * as SocialTools from './tools/SocialTools';
import * as PDFTools from './tools/PDFTools';
import * as AudioTools from './tools/AudioTools';
import * as VideoTools from './tools/VideoTools';
import * as EducationTools from './tools/EducationTools';
import * as DataTools from './tools/DataTools';
import * as FunTools from './tools/FunTools';
import * as PlagiarismTool from './tools/PlagiarismTool';
import * as OnlineTools from './tools/OnlineTools';
import * as CompilerTools from './tools/CompilerTools';

export const ALL_TOOLS: Tool[] = [
  // --- DEVELOPER TOOLS (Core) ---
  { id: 'code-compiler', name: 'Online Code Compiler', description: 'Run Python, C, C++, Java, JS, HTML and PHP code instantly in a secure sandbox', category: ToolCategory.DEVELOPER, subCategory: '⚙️ Developer Utilities', icon: 'fa-terminal', component: CompilerTools.CodeCompiler },

  // --- UTILITIES / ONLINE TOOLS ---
  { id: 'video-downloader', name: 'Social Video Downloader', description: 'Download Reels, Posts, and Videos from Instagram, FB, YT, and TikTok instantly', category: ToolCategory.UTILITIES, subCategory: '📥 Video Downloader', icon: 'fa-download', component: OnlineTools.SocialVideoDownloader },
  { id: 'temp-email', name: 'Temporary Email Generator', description: 'Generate private, disposable email addresses to prevent spam and receive OTPs', category: ToolCategory.UTILITIES, subCategory: '📧 Temporary Email', icon: 'fa-envelope-open-text', component: OnlineTools.TempEmailGenerator },
  { id: 'temp-phone', name: 'Temporary Phone Number', description: 'Receive SMS OTPs online for WhatsApp, Telegram, and social media verification', category: ToolCategory.UTILITIES, subCategory: '📱 Temporary Phone Number', icon: 'fa-mobile-screen', component: OnlineTools.TempPhoneReceiver },

  // --- GAMING & ENTERTAINMENT (40) ---
  ...['Game Score Tracker', 'Tournament Bracket Generator', 'Random Team Generator', 'Dice Roller', 'Card Shuffler', 'Bingo Card Generator', 'Lottery Number Generator', 'Spin Wheel Generator', 'Trivia Quiz Generator', 'Puzzle Generator', 'Crossword Generator', 'Sudoku Generator', 'Word Search Generator', 'Anagram Solver', 'Guess the Number Game', 'Reaction Time Tester', 'CPS (Clicks Per Second) Tester', 'Typing Speed Test', 'Aim Trainer', 'Memory Game', 'Character Name Generator', 'Fantasy Name Generator', 'Story Game Generator', 'RPG Character Builder', 'Game Map Planner', 'Game Level Designer', 'Achievement Tracker', 'Player Stats Analyzer', 'Leaderboard Generator', 'Match Schedule Generator', 'Live Score Widget', 'Stream Overlay Generator', 'Stream Title Generator', 'Stream Description Generator', 'Emote Generator', 'Soundboard', 'Voice Changer', 'Game Screenshot Editor', 'Highlight Clip Generator', 'Fan Art Generator'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `High-performance utility for ${name}`, category: ToolCategory.GAMING, subCategory: '🎮 Gaming & Entertainment', icon: 'fa-gamepad', component: FunTools.GenericFunTool
  })),

  // --- REAL ESTATE & PROPERTY (40) ---
  ...['Home Loan EMI Calculator', 'Rent Calculator', 'Property Value Estimator', 'Price per Sq Ft Calculator', 'Rental Yield Calculator', 'Stamp Duty Calculator', 'Registration Fee Calculator', 'Home Budget Planner', 'Floor Plan Creator', 'Area Unit Converter', 'Vastu Checker', 'Property Tax Calculator', 'Maintenance Cost Calculator', 'Society Expense Splitter', 'Mortgage Comparison Tool', 'Lease Agreement Generator', 'Rental Agreement Generator', 'Tenant Management Tool', 'Landlord Dashboard', 'Property Listing Manager', 'Property Photo Optimizer', 'Property Description Generator', 'Virtual Tour Builder', 'Property Inspection Checklist', 'Move-in Checklist Generator', 'Move-out Checklist Generator', 'Relocation Planner', 'Home Insurance Comparator', 'Risk Assessment Tool', 'Neighborhood Analysis Tool', 'School Finder', 'Hospital Finder', 'Commute Time Calculator', 'Property ROI Calculator', 'Rental Price Comparison', 'Property Appreciation Calculator', 'Housing Loan Eligibility Checker', 'Property Document Organizer', 'Smart Home Planner', 'Interior Design Planner', 'Property Dashboard'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Professional analytics for ${name}`, category: ToolCategory.REAL_ESTATE, subCategory: '🏠 Real Estate & Property', icon: 'fa-house-chimney', component: CalcTools.GenericFinanceCalc
  })),

  // --- HEALTH & FITNESS (40) ---
  ...['BMI Calculator', 'BMR Calculator', 'Daily Calorie Calculator', 'Water Intake Calculator', 'Step Counter', 'Distance Tracker', 'Workout Planner', 'Exercise Timer', 'HIIT Timer', 'Yoga Routine Generator', 'Meditation Timer', 'Sleep Tracker', 'Sleep Quality Analyzer', 'Heart Rate Zone Calculator', 'Body Fat Percentage Calculator', 'Ideal Weight Calculator', 'Macro Nutrient Calculator', 'Diet Planner', 'Meal Planner', 'Calorie Burn Calculator', 'Running Pace Calculator', 'Cycling Speed Calculator', 'VO2 Max Calculator', 'Fitness Goal Tracker', 'Injury Recovery Planner', 'Posture Checker', 'Stress Level Analyzer', 'Mental Health Journal', 'Habit Tracker', 'Wellness Score Calculator', 'Pregnancy Due Date Calculator', 'Ovulation Calculator', 'Period Tracker', 'Blood Pressure Log', 'Glucose Level Log', 'Medical Report Analyzer', 'Medicine Reminder', 'Doctor Appointment Planner', 'Health Risk Assessment', 'Fitness Progress Dashboard'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Monitor your wellness with ${name}`, category: ToolCategory.HEALTH, subCategory: '🏥 Health & Fitness', icon: 'fa-heart-pulse', component: CalcTools.GenericMathCalc
  })),

  // --- E-COMMERCE & BUSINESS (40) ---
  ...['Product Name Generator', 'Product Description Generator', 'Price Calculator', 'Profit Margin Calculator', 'Discount Calculator', 'Tax Calculator', 'Invoice Generator', 'Quotation Generator', 'Receipt Generator', 'Order Tracker', 'Inventory Manager', 'Stock Alert Tool', 'SKU Generator', 'Barcode Generator', 'QR Code Generator', 'Shipping Cost Calculator', 'Delivery Time Estimator', 'Return Policy Generator', 'Refund Calculator', 'Customer Database Manager', 'Sales Analytics Tool', 'Revenue Forecast Tool', 'Break-Even Calculator', 'Business Plan Generator', 'Market Research Tool', 'Competitor Analysis Tool', 'SWOT Analysis Generator', 'Lead Generator', 'CRM Lite Tool', 'Email Marketing Tool', 'Newsletter Generator', 'Landing Page Analyzer', 'Conversion Rate Optimizer', 'A/B Test Planner', 'Payment Reminder Tool', 'Subscription Manager', 'Vendor Management Tool', 'Expense Tracker', 'Cash Flow Analyzer', 'Business Dashboard'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Scale your business with ${name}`, category: ToolCategory.ECOMMERCE, subCategory: '🛒 E-Commerce & Business', icon: 'fa-cart-shopping', component: AITools.GenericAIProductivity
  })),

  // --- TRAVEL & TRANSPORT (40) ---
  ...['Travel Planner', 'Trip Itinerary Generator', 'Distance Calculator', 'Route Planner', 'Fuel Cost Calculator', 'Mileage Calculator', 'Travel Budget Planner', 'Packing Checklist Generator', 'Weather Forecast Tool', 'Currency Converter', 'Time Zone Converter', 'Flight Price Tracker', 'Hotel Price Tracker', 'Visa Requirement Checker', 'Travel Insurance Comparator', 'Train Schedule Finder', 'Bus Schedule Finder', 'Taxi Fare Calculator', 'Car Rental Calculator', 'Map Location Finder', 'Nearby Places Finder', 'Tourist Attraction Finder', 'Travel Safety Checker', 'Emergency Contact Finder', 'Language Phrasebook', 'Travel Translator', 'Local Customs Guide', 'Power Plug Converter', 'Travel Health Advisor', 'Vaccination Checker', 'Travel Reminder Tool', 'Travel Journal', 'Photo Travel Album', 'Travel Expense Tracker', 'Travel Carbon Footprint Calculator', 'Travel Deals Finder', 'Travel Review Analyzer', 'Travel Checklist Manager', 'Lost Item Tracker', 'Return Trip Planner'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Plan your next adventure: ${name}`, category: ToolCategory.TRAVEL, subCategory: '🚗 Travel & Transport', icon: 'fa-plane-departure', component: AITools.GenericAIProductivity
  })),

  // --- EDUCATION & LEARNING (40) ---
  { id: 'plagiarism-checker', name: 'Plagiarism Checker', description: 'Deep AI scan for duplicate and similar web content with report download', category: ToolCategory.EDUCATION, subCategory: '📚 Study & Research Tools', icon: 'fa-magnifying-glass-chart', component: PlagiarismTool.AdvancedPlagiarismChecker },
  ...['Study Planner', 'Timetable Generator', 'Exam Countdown Timer', 'Flashcard Generator', 'Quiz Generator', 'MCQ Generator', 'Question Paper Generator', 'Answer Sheet Generator', 'Notes Generator', 'Notes Summarizer', 'Mind Map Generator', 'Concept Explainer', 'Formula Sheet Generator', 'Vocabulary Builder', 'Grammar Practice Tool', 'Reading Practice Tool', 'Writing Practice Tool', 'Pronunciation Trainer', 'Language Learning Tool', 'Coding Practice Tool', 'Law Notes Generator', 'Case Law Finder', 'Legal Definition Tool', 'Bare Act Search Tool', 'Judgment Summary Tool', 'Study Progress Tracker', 'Pomodoro Study Timer', 'Focus Mode Tool', 'Assignment Planner', 'Project Planner', 'Presentation Generator', 'Citation Generator', 'Reference Manager', 'Academic Word Checker', 'Plagiarism Checker AI', 'Learning Path Generator', 'Skill Gap Analyzer', 'Exam Performance Analyzer', 'Doubt Clearing Assistant', 'Revision Planner'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Academic helper for ${name}`, category: ToolCategory.EDUCATION, subCategory: '📚 Study & Research Tools', icon: 'fa-graduation-cap', component: EducationTools.GenericEducationAI
  })),

  // --- SECURITY & PRIVACY (40) ---
  ...['Password Strength Checker', 'Password Breach Checker', 'Password Generator', 'Two-Factor Code Generator', 'Hash Generator', 'Hash Verifier', 'Encryption Tool', 'Decryption Tool', 'Secure Note Tool', 'Secure Text Shredder', 'URL Safety Checker', 'Malware URL Scanner', 'IP Reputation Checker', 'Email Header Analyzer', 'Phishing Detector', 'SSL Certificate Checker', 'Privacy Policy Generator', 'Terms & Conditions Generator', 'Cookie Consent Generator', 'Data Leak Monitor', 'File Integrity Checker', 'VPN Speed Tester', 'Secure File Vault', 'Metadata Cleaner', 'Browser Fingerprint Tester', 'DNS Security Checker', 'HTTP Security Headers Checker', 'Content Security Policy Generator', 'Secure Password Vault', 'Brute Force Simulation Tool', 'Account Activity Monitor', 'Secure Session Generator', 'CAPTCHA Generator', 'CAPTCHA Validator', 'Token Generator', 'Secure API Key Generator', 'Digital Signature Generator', 'Digital Signature Verifier', 'Secure Backup Tool', 'Zero-Trust Access Checker'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Enhance your security: ${name}`, category: ToolCategory.SECURITY, subCategory: '🛡️ Security & Privacy', icon: 'fa-shield-halved', component: DevTools.GenericDevUtil
  })),

  // --- AUDIO TOOLS (40) ---
  ...['Audio Converter', 'MP3 to WAV', 'WAV to MP3', 'Audio Compressor', 'Audio Trimmer', 'Audio Merger', 'Audio Splitter', 'Audio Speed Changer', 'Pitch Changer', 'Volume Booster', 'Noise Reduction', 'Silence Remover', 'Audio Normalizer', 'Equalizer', 'Audio Recorder', 'Voice Recorder', 'Text to Speech', 'Speech to Text', 'Audio to Text', 'Podcast Editor', 'Ringtone Maker', 'Audio Metadata Editor', 'Audio Tag Editor', 'Audio Visualizer', 'Beat Detector', 'Tempo Finder', 'Audio Loop Maker', 'Karaoke Maker', 'Lyrics Extractor', 'Audio Format Analyzer', 'Audio Channel Converter', 'Stereo to Mono', 'Mono to Stereo', 'Audio Fade In', 'Audio Fade Out', 'Audio Waveform Viewer', 'Audio Transcription Tool', 'Audio Silence Detector', 'Audio Echo Tool', 'Audio Reverb Tool'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Process your sound: ${name}`, category: ToolCategory.AUDIO, subCategory: '🎵 Audio Processing', icon: 'fa-volume-high', component: AudioTools.GenericAudioConverter
  })),

  // --- VIDEO TOOLS (40) ---
  ...['Video Converter', 'MP4 to AVI', 'AVI to MP4', 'Video Compressor', 'Video Trimmer', 'Video Merger', 'Video Splitter', 'Video Cropper', 'Video Resizer', 'Video Rotator', 'Video Speed Controller', 'Video Stabilizer', 'Video Frame Extractor', 'GIF Maker', 'Video Thumbnail Generator', 'Video Watermark Tool', 'Subtitle Generator', 'Subtitle Editor', 'Subtitle Translator', 'Video to Audio', 'Audio to Video', 'Video Color Correction', 'Video Brightness Adjuster', 'Video Contrast Adjuster', 'Video Noise Reduction', 'Video Background Remover', 'Green Screen Tool', 'Video Metadata Editor', 'Video Format Analyzer', 'Video Bitrate Calculator', 'Video FPS Converter', 'Video Codec Finder', 'Video Caption Generator', 'Video Timeline Editor', 'Video Slideshow Maker', 'Video Intro Maker', 'Video Outro Maker', 'Video Aspect Ratio Changer', 'Video Loop Tool', 'Video Preview Generator'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Edit your footage: ${name}`, category: ToolCategory.VIDEO, subCategory: '🎥 Video Engineering', icon: 'fa-film', component: VideoTools.GenericVideoConverter
  })),

  // --- DATA & ANALYTICS (40) ---
  ...['CSV Analyzer', 'Excel Analyzer', 'JSON Analyzer', 'XML Analyzer', 'Data Cleaner', 'Data Normalizer', 'Data Validator', 'Data Visualizer', 'Chart Generator', 'Graph Generator', 'Dataset Comparator', 'Duplicate Data Finder', 'Outlier Detector', 'Missing Value Finder', 'Data Type Detector', 'Statistical Summary Tool', 'Correlation Analyzer', 'Regression Calculator', 'Forecasting Tool', 'Trend Analyzer', 'KPI Calculator', 'Business Metrics Analyzer', 'Conversion Rate Calculator', 'Funnel Analyzer', 'Cohort Analyzer', 'A/B Test Calculator', 'Heatmap Generator', 'Data Export Tool', 'Data Import Tool', 'Data Transformation Tool', 'Pivot Table Generator', 'SQL Data Analyzer', 'Log Data Analyzer', 'Real-Time Data Monitor', 'Data Quality Score Tool', 'ETL Pipeline Builder', 'Big Data Sample Tool', 'Time Series Analyzer', 'Anomaly Detection Tool', 'Dashboard Builder'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Analytics power tool: ${name}`, category: ToolCategory.DATA, subCategory: '📊 Data Engineering', icon: 'fa-chart-area', component: DataTools.GenericDataUtility
  })),

  // --- TEXT TOOLS (40) ---
  ...['Uppercase Converter', 'Lowercase Converter', 'Sentence Case Converter', 'Title Case Converter', 'Toggle Case Converter', 'Camel Case Converter', 'Pascal Case Converter', 'Snake Case Converter', 'Kebab Case Converter', 'Random Case Generator'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Transform case: ${name}`, category: ToolCategory.TEXT, subCategory: '🔠 Case & Style', icon: 'fa-font', component: TextTools.UpperCaseTool
  })),
  ...['Word Counter', 'Character Counter (with spaces)', 'Character Counter (without spaces)', 'Sentence Counter', 'Paragraph Counter', 'Line Counter', 'Reading Time Calculator', 'Speaking Time Calculator', 'Keyword Frequency Counter', 'Duplicate Word Finder'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Metric check: ${name}`, category: ToolCategory.TEXT, subCategory: '🔢 Counting & Analysis', icon: 'fa-arrow-up-9-1', component: TextTools.WordCountTool
  })),
  ...['Remove Extra Spaces', 'Trim Text Tool', 'Remove Empty Lines', 'Remove Numbers', 'Remove Special Characters', 'Remove Emojis', 'Remove HTML Tags', 'Remove URLs', 'Remove Duplicate Lines', 'Normalize Unicode'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Scrub text: ${name}`, category: ToolCategory.TEXT, subCategory: '🧹 Text Cleaning', icon: 'fa-broom', component: TextTools.RemoveAllSpacesTool
  })),
  ...['Text Formatter', 'Add Line Numbers', 'Add Prefix & Suffix', 'Wrap / Unwrap Text', 'Find and Replace Text', 'Text Reverser', 'Base64 Encode', 'Base64 Decode', 'URL Encode / Decode', 'Fancy Text Generator'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Advanced edit: ${name}`, category: ToolCategory.TEXT, subCategory: '🎨 Formatting & Conversion', icon: 'fa-wand-magic-sparkles', component: TextTools.UpperCaseTool
  })),

  // --- CALCULATOR TOOLS (40) ---
  ...['Basic Calculator', 'Percentage Calculator', 'Ratio Calculator', 'Average Calculator', 'Fraction Calculator', 'Decimal to Fraction Converter', 'Rounding Calculator', 'Age Calculator', 'Date Difference Calculator', 'Time Calculator'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Daily math: ${name}`, category: ToolCategory.CALCULATOR, subCategory: '➗ Basic & Daily', icon: 'fa-calculator', component: CalcTools.GenericMathCalc
  })),
  ...['Simple Interest Calculator', 'Compound Interest Calculator', 'EMI Calculator', 'Loan Calculator', 'Savings Calculator', 'Investment Return Calculator', 'GST Calculator', 'Income Tax Calculator', 'Profit & Loss Calculator', 'Break-even Calculator'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Financial tool: ${name}`, category: ToolCategory.CALCULATOR, subCategory: '💰 Finance & Business', icon: 'fa-money-bill-trend-up', component: CalcTools.GenericFinanceCalc
  })),
  ...['Scientific Calculator', 'Algebra Solver', 'Quadratic Equation Solver', 'Matrix Calculator', 'Vector Calculator', 'Trigonometry Calculator', 'Logarithm Calculator', 'Exponent Calculator', 'Permutation & Combination Calculator', 'Probability Calculator'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Science/Math: ${name}`, category: ToolCategory.CALCULATOR, subCategory: '📐 Math & Science', icon: 'fa-flask', component: CalcTools.GenericMathCalc
  })),
  ...['Unit Converter', 'Length Converter', 'Weight Converter', 'Temperature Converter', 'Speed Converter', 'Area Converter', 'Volume Converter', 'Currency Converter', 'Fuel Cost Calculator', 'BMI Calculator'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Unit tool: ${name}`, category: ToolCategory.CALCULATOR, subCategory: '⚙️ Utility & Conversion', icon: 'fa-gear', component: CalcTools.GenericMathCalc
  })),

  // --- WEB & SEO TOOLS (40) ---
  ...['SEO Audit Tool', 'Keyword Density Checker', 'Keyword Research Tool', 'SERP Preview Tool', 'SEO Score Checker', 'Page Speed Analyzer', 'Mobile Friendly Test', 'Core Web Vitals Checker', 'On-Page SEO Analyzer', 'SEO Competitor Analysis Tool'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Audit: ${name}`, category: ToolCategory.SEO, subCategory: '🔍 SEO ANALYSIS', icon: 'fa-search', component: SEOTools.GenericWebTool
  })),
  ...['Meta Title Generator', 'Meta Description Generator', 'Open Graph Tag Generator', 'Twitter Card Generator', 'Canonical URL Generator', 'Heading Structure Checker', 'Image Alt Text Generator', 'Content Readability Checker', 'Duplicate Content Checker', 'SEO Content Optimizer'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Content SEO: ${name}`, category: ToolCategory.SEO, subCategory: '🏷️ META & CONTENT', icon: 'fa-tags', component: SEOTools.GenericWebTool
  })),
  ...['URL Analyzer', 'URL Encoder / Decoder', 'Broken Link Checker', 'Backlink Checker', 'Internal Link Analyzer', 'Redirect Checker (301 / 302)', 'UTM Parameter Generator', 'Short URL Generator', 'Anchor Text Analyzer', 'Link Status Checker'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Links: ${name}`, category: ToolCategory.SEO, subCategory: '🔗 LINK & URL', icon: 'fa-link', component: SEOTools.GenericWebTool
  })),
  ...['Sitemap Generator', 'Sitemap Validator', 'Robots.txt Generator', 'Robots.txt Tester', 'Page Index Checker', 'Crawlability Checker', 'HTTP Status Code Checker', 'Schema Markup Generator', 'AMP Validator', 'Website Uptime Monitor'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Index SEO: ${name}`, category: ToolCategory.SEO, subCategory: '🕷️ INDEXING & TECHNICAL', icon: 'fa-robot', component: SEOTools.GenericWebTool
  })),

  // --- IMAGE TOOLS (40) ---
  ...['Image Crop Tool', 'Image Resize Tool', 'Image Rotate Tool', 'Image Flip Tool', 'Image Brightness Adjuster', 'Image Contrast Adjuster', 'Image Saturation Adjuster', 'Image Sharpness Enhancer', 'Image Blur Tool', 'Image Noise Reducer'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Enhance: ${name}`, category: ToolCategory.IMAGE, subCategory: '🎨 EDITING & ENHANCEMENT', icon: 'fa-image', component: ImageTools.GenericImageFilter
  })),
  ...['Image Format Converter', 'JPG to PNG Converter', 'PNG to JPG Converter', 'WebP Converter', 'SVG Converter', 'Image Compressor', 'Lossless Image Compressor', 'Image Quality Optimizer', 'Image DPI Changer', 'Image Resolution Checker'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Convert: ${name}`, category: ToolCategory.IMAGE, subCategory: '📐 CONVERSION & OPTIMIZATION', icon: 'fa-file-export', component: ImageTools.GenericImageConverter
  })),
  ...['AI Image Enhancer', 'AI Image Upscaler', 'AI Background Remover', 'AI Object Remover', 'AI Image Colorizer', 'AI Face Enhancer', 'AI Image Denoiser', 'AI Image Super Resolution', 'AI Image Style Transfer', 'AI Image Text Extractor (OCR)'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `AI Logic: ${name}`, category: ToolCategory.IMAGE, subCategory: '🧠 AI-POWERED IMAGE', icon: 'fa-brain', component: ImageTools.AIImageGeneratorTool
  })),
  ...['Image Watermark Tool', 'Image Metadata Viewer', 'Image Metadata Remover', 'Image Color Picker', 'Image Palette Generator', 'Image Aspect Ratio Checker', 'Image to PDF Converter', 'PDF to Image Converter', 'Image Collage Maker', 'Screenshot Editor'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Utility: ${name}`, category: ToolCategory.IMAGE, subCategory: '🧩 UTILITY & DESIGN', icon: 'fa-puzzle-piece', component: ImageTools.GenericImageFilter
  })),

  // --- AI & PRODUCTIVITY (40) ---
  ...['AI Article Writer', 'AI Blog Post Generator', 'AI Paragraph Rewriter', 'AI Grammar Checker', 'AI Tone Changer', 'AI Text Summarizer', 'AI Title Generator', 'AI Headline Generator', 'AI Story Generator', 'AI Email Writer'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Gemini Logic: ${name}`, category: ToolCategory.AI, subCategory: '🧠 AI WRITING & CONTENT', icon: 'fa-pen-fancy', component: AITools.GenericAIProductivity
  })),
  ...['AI Daily Planner', 'AI Weekly Planner', 'AI To-Do List Generator', 'AI Goal Planner', 'AI Habit Tracker', 'AI Time Management Assistant', 'AI Focus Timer', 'AI Productivity Analyzer', 'AI Task Prioritizer', 'AI Meeting Notes Generator'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Organize: ${name}`, category: ToolCategory.AI, subCategory: '📋 PRODUCTIVITY & PLANNING', icon: 'fa-calendar-check', component: AITools.GenericAIProductivity
  })),
  ...['AI Notes Summarizer', 'AI Flashcard Generator', 'AI Question Generator', 'AI Quiz Generator', 'AI Study Planner', 'AI Learning Roadmap Generator', 'AI Concept Explainer', 'AI Code Explanation Tool', 'AI Language Translator', 'AI Vocabulary Builder'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Knowledge: ${name}`, category: ToolCategory.AI, subCategory: '📚 LEARNING & KNOWLEDGE', icon: 'fa-book-open', component: AITools.GenericAIProductivity
  })),
  ...['AI Idea Generator', 'AI Startup Idea Generator', 'AI Marketing Copy Generator', 'AI Social Media Caption Generator', 'AI Resume Builder', 'AI Cover Letter Generator', 'AI SWOT Analysis Generator', 'AI Business Name Generator', 'AI Pitch Deck Generator', 'AI Decision Assistant'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Business AI: ${name}`, category: ToolCategory.AI, subCategory: '🎯 CREATIVE & BUSINESS AI', icon: 'fa-briefcase', component: AITools.GenericAIProductivity
  })),

  // --- DEVELOPER TOOLS (Generic) ---
  ...['JSON Prettifier', 'JSON Minifier', 'HTML Formatter', 'CSS Formatter', 'JS Formatter', 'SQL Formatter', 'YAML to JSON', 'JSON to YAML', 'XML to JSON', 'JSON to XML', 'CURL to Code', 'JSON to TypeScript', 'Cron Helper', 'Regex Tester', 'UUID Generator', 'Hash Generator', 'Base64 Image Encoder', 'JWT Decoder', 'URL Parser', 'Timestamp Converter', 'Color Converter', 'CSS Shadow Generator', 'CSS Gradient Generator', 'Lorem Ipsum Generator', 'Markdown to HTML', 'HTML to Markdown', 'JS Minifier', 'CSS Minifier', 'Babel Transpiler', 'Git Command Helper', 'Docker File Generator', 'Nginx Config Generator', 'HTACCESS Generator', 'Code Snippet Manager', 'API Response Mock', 'Env File Generator', 'Readme Generator', 'License Generator', 'Port Checker', 'Subnet Calculator'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Dev utility for ${name}`, category: ToolCategory.DEVELOPER, subCategory: '⚙️ Developer Utilities', icon: 'fa-code', component: DevTools.GenericDevUtil
  })),

  // --- FILE TOOLS (40) ---
  ...['File Info Inspector', 'File Hash Calculator', 'Binary to File', 'File Extension Changer', 'CSV to JSON', 'JSON to CSV', 'XML to CSV', 'CSV to XML', 'Excel to JSON', 'JSON to Excel', 'VCard Generator', 'ICS Generator', 'Mock Data Generator', 'Text Diff Tool', 'Markdown Table Generator', 'File Integrity Checker', 'Duplicate File Finder', 'Batch Rename Helper', 'Zip File Analyzer', 'File Header Checker', 'MIME Type Detector', 'Word to PDF', 'PDF to Text', 'Image to Text', 'Text to PDF', 'HTML to PDF', 'Code to PDF', 'Log File Analyzer', 'Big File Splitter', 'File Merger', 'Sensitive Data Masker', 'Data Anonymizer', 'Backup Planner', 'Cloud Storage Link Gen', 'File Shredder', 'Hidden Data Finder', 'File Permission Calc', 'System Path Helper', 'Shortcut Creator', 'Registry Key Helper'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Manage files with ${name}`, category: ToolCategory.FILE, subCategory: '📂 File Utilities', icon: 'fa-file-shield', component: FileTools.GenericFileTool
  })),

  // --- SOCIAL & MEDIA (40) ---
  ...['Post Caption Generator', 'Hashtag Generator', 'Bio Generator', 'Profile Picture Optimizer', 'Story Idea Generator', 'YouTube Title Gen', 'YouTube Tags Gen', 'Video Script Writer', 'Viral Hook Generator', 'LinkedIn Post Writer', 'Twitter Thread Builder', 'TikTok Trend Finder', 'Instagram Grid Planner', 'Social Media Calendar', 'Engagement Rate Calc', 'Influencer Fee Calc', 'Ad Copy Generator', 'Brand Name Generator', 'Logo Text Ideas', 'Meme Text Generator', 'Social Media Link Tree', 'Short URL Generator', 'QR Code Generator', 'Click to Tweet Gen', 'Facebook Post Planner', 'Pinterest Description Gen', 'Reddit Post Helper', 'Discord Message Formatter', 'Twitch Title Gen', 'Podcast Episode Planner', 'Interview Question Gen', 'Poll Question Ideas', 'Contest Entry Tracker', 'User Persona Builder', 'Content Repurposer', 'Emoji Search', 'Text Art Generator', 'Voice Over Script Gen', 'Video Description Gen', 'Social Media Audit'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Grow your presence: ${name}`, category: ToolCategory.SOCIAL, subCategory: '📱 Social Media Management', icon: 'fa-share-nodes', component: SocialTools.GenericSocialAI
  })),

  // --- PDF TOOLS (40) ---
  ...['PDF Merge', 'PDF Split', 'PDF Compress', 'PDF Rotate', 'PDF Crop', 'PDF Watermark', 'PDF Password Protect', 'PDF Remove Password', 'PDF to Word', 'PDF to JPG', 'PDF to PNG', 'PDF to Text', 'Word to PDF', 'JPG to PDF', 'PNG to PDF', 'Excel to PDF', 'PPT to PDF', 'PDF Page Deleter', 'PDF Page Reorder', 'PDF Metadata Editor', 'PDF Form Filler', 'PDF E-Signature', 'PDF Grayscale', 'PDF Extract Images', 'PDF Extract Text', 'PDF OCR', 'PDF Overlay', 'PDF Repair', 'PDF Viewer', 'PDF Organizer', 'PDF Flatten', 'PDF Inverse Colors', 'PDF Linearize', 'PDF Validate', 'PDF Compare', 'PDF Booklet Creator', 'PDF Margin Adjuster', 'PDF Numbering', 'PDF Header/Footer', 'PDF Redaction'].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name: name, description: `Process PDF: ${name}`, category: ToolCategory.PDF, subCategory: '📄 PDF Utilities', icon: 'fa-file-pdf', component: PDFTools.GenericPDFTool
  })),
];
