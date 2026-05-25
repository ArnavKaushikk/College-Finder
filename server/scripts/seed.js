import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const serverRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });
dotenv.config({ path: path.join(serverRoot, '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set.');
  console.error('Create server/.env or server/.env.local with MONGODB_URI=...');
  console.error('Or run from server folder: npm run seed');
  process.exit(1);
}

const colleges = [
  {
    name: 'Indian Institute of Technology Bombay',
    location: 'Mumbai, Maharashtra',
    fees: 230000,
    rating: 4.9,
    placementPercent: 92,
    type: 'Government',
    established: 1958,
    overview:
      'Premier engineering institute known for strong research, entrepreneurship culture, and excellent placements in tech and core sectors.',
    courses: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Chemical Engineering'],
    placements: {
      averagePackage: '₹22 LPA',
      highestPackage: '₹3.6 Cr',
      topRecruiters: ['Google', 'Microsoft', 'Goldman Sachs', 'Qualcomm'],
      summary: 'Consistently top-tier placements across software, consulting, and core engineering roles.',
    },
    reviews: [
      { author: 'Aditya K.', rating: 5, comment: 'World-class peers and faculty. Campus life is intense but rewarding.' },
      { author: 'Sneha R.', rating: 5, comment: 'Placements are outstanding if you stay consistent from year one.' },
    ],
    examCutoffs: [
      { exam: 'JEE', minRank: 1, maxRank: 150 },
      { exam: 'CUET', minRank: 1, maxRank: 5000 },
    ],
  },
  {
    name: 'Indian Institute of Technology Delhi',
    location: 'New Delhi',
    fees: 235000,
    rating: 4.9,
    placementPercent: 91,
    type: 'Government',
    established: 1961,
    overview:
      'Leading IIT with strong industry ties, vibrant startup ecosystem, and excellent infrastructure in the capital region.',
    courses: ['Computer Science', 'Mathematics and Computing', 'Electrical Engineering', 'Civil Engineering'],
    placements: {
      averagePackage: '₹21 LPA',
      highestPackage: '₹2.8 Cr',
      topRecruiters: ['Amazon', 'BCG', 'Samsung', 'Uber'],
      summary: 'High placement rates with diverse roles in product, consulting, and hardware.',
    },
    reviews: [
      { author: 'Rohan M.', rating: 5, comment: 'Great exposure and alumni network in Delhi NCR.' },
      { author: 'Priya S.', rating: 4, comment: 'Competitive environment; resources are excellent.' },
    ],
    examCutoffs: [
      { exam: 'JEE', minRank: 1, maxRank: 200 },
      { exam: 'CUET', minRank: 1, maxRank: 6000 },
    ],
  },
  {
    name: 'National Institute of Technology Trichy',
    location: 'Tiruchirappalli, Tamil Nadu',
    fees: 180000,
    rating: 4.5,
    placementPercent: 88,
    type: 'Government',
    established: 1964,
    overview:
      'Top NIT with robust placement record, strong alumni base, and balanced focus on academics and extracurriculars.',
    courses: ['Computer Science', 'Information Technology', 'Electronics and Communication', 'Mechanical Engineering'],
    placements: {
      averagePackage: '₹14 LPA',
      highestPackage: '₹52 LPA',
      topRecruiters: ['TCS', 'Infosys', 'Texas Instruments', 'Adobe'],
      summary: 'Solid IT and core placements with growing product company presence.',
    },
    reviews: [
      { author: 'Karthik V.', rating: 4, comment: 'Good value for rank. Campus is beautiful and well maintained.' },
    ],
    examCutoffs: [
      { exam: 'JEE', minRank: 500, maxRank: 8000 },
    ],
  },
  {
    name: 'Birla Institute of Technology and Science Pilani',
    location: 'Pilani, Rajasthan',
    fees: 450000,
    rating: 4.6,
    placementPercent: 90,
    type: 'Private',
    established: 1964,
    overview:
      'Renowned private institute with flexible academics, semester abroad options, and strong placement outcomes.',
    courses: ['Computer Science', 'Electronics and Instrumentation', 'Mechanical Engineering', 'Economics'],
    placements: {
      averagePackage: '₹18 LPA',
      highestPackage: '₹1.2 Cr',
      topRecruiters: ['Microsoft', 'Deutsche Bank', 'Flipkart', 'Oracle'],
      summary: 'Excellent placements across finance, tech, and analytics roles.',
    },
    reviews: [
      { author: 'Neha G.', rating: 5, comment: 'Freedom to shape your own path. Industry connect is strong.' },
    ],
    examCutoffs: [
      { exam: 'JEE', minRank: 2000, maxRank: 15000 },
    ],
  },
  {
    name: 'Vellore Institute of Technology',
    location: 'Vellore, Tamil Nadu',
    fees: 380000,
    rating: 4.2,
    placementPercent: 82,
    type: 'Private',
    established: 1984,
    overview:
      'Large private university with modern campus, many program choices, and wide recruiter participation.',
    courses: ['Computer Science', 'Information Technology', 'Biotechnology', 'Business Administration'],
    placements: {
      averagePackage: '₹8.5 LPA',
      highestPackage: '₹44 LPA',
      topRecruiters: ['Cognizant', 'Wipro', 'PayPal', 'Deloitte'],
      summary: 'Mass recruitment plus selective high-paying tech roles for top performers.',
    },
    reviews: [
      { author: 'Arjun T.', rating: 4, comment: 'Good infrastructure. Focus on CGPA for premium companies.' },
    ],
    examCutoffs: [
      { exam: 'JEE', minRank: 15000, maxRank: 80000 },
      { exam: 'CUET', minRank: 10000, maxRank: 100000 },
    ],
  },
  {
    name: 'Manipal Academy of Higher Education',
    location: 'Manipal, Karnataka',
    fees: 420000,
    rating: 4.3,
    placementPercent: 80,
    type: 'Private',
    established: 1953,
    overview:
      'Multi-disciplinary campus with medical and engineering streams, international collaborations, and active placement cell.',
    courses: ['Computer Science', 'Medicine', 'Pharmacy', 'Architecture'],
    placements: {
      averagePackage: '₹9 LPA',
      highestPackage: '₹38 LPA',
      topRecruiters: ['Accenture', 'IBM', 'Siemens', 'Philips'],
      summary: 'Strong healthcare and engineering placement tracks.',
    },
    reviews: [
      { author: 'Meera L.', rating: 4, comment: 'Campus life is vibrant. Medical and engineering blocks are separate hubs.' },
    ],
    examCutoffs: [
      { exam: 'JEE', minRank: 20000, maxRank: 120000 },
      { exam: 'NEET', minRank: 5000, maxRank: 80000 },
    ],
  },
  {
    name: 'All India Institute of Medical Sciences Delhi',
    location: 'New Delhi',
    fees: 15000,
    rating: 4.95,
    placementPercent: 98,
    type: 'Government',
    established: 1956,
    overview:
      'India’s premier medical institute offering MBBS, MD, and super-specialty programs with hospital-based training.',
    courses: ['Medicine', 'Surgery', 'Pediatrics', 'Radiology'],
    placements: {
      averagePackage: '₹15 LPA (stipend/residency track)',
      highestPackage: 'N/A (clinical pathways)',
      topRecruiters: ['AIIMS network', 'Apollo', 'Fortis', 'Research institutes'],
      summary: 'Graduates typically pursue residency, fellowships, or academic medicine.',
    },
    reviews: [
      { author: 'Dr. Ankit P.', rating: 5, comment: 'Unmatched clinical exposure and faculty mentorship.' },
    ],
    examCutoffs: [
      { exam: 'NEET', minRank: 1, maxRank: 200 },
    ],
  },
  {
    name: 'Christian Medical College Vellore',
    location: 'Vellore, Tamil Nadu',
    fees: 120000,
    rating: 4.7,
    placementPercent: 95,
    type: 'Private',
    established: 1900,
    overview:
      'Highly respected medical college with emphasis on ethics, community health, and rigorous clinical training.',
    courses: ['Medicine', 'Nursing', 'Allied Health Sciences'],
    placements: {
      averagePackage: '₹12 LPA',
      highestPackage: 'N/A',
      topRecruiters: ['CMC hospital network', 'Mission hospitals', 'Global fellowships'],
      summary: 'Strong hospital placements and research opportunities.',
    },
    reviews: [
      { author: 'Sarah J.', rating: 5, comment: 'Demanding curriculum with excellent patient contact from early years.' },
    ],
    examCutoffs: [
      { exam: 'NEET', minRank: 200, maxRank: 5000 },
    ],
  },
  {
    name: 'Delhi University — Shri Ram College of Commerce',
    location: 'New Delhi',
    fees: 65000,
    rating: 4.6,
    placementPercent: 85,
    type: 'Government',
    established: 1926,
    overview:
      'Top commerce college under Delhi University known for finance, economics, and consulting placements.',
    courses: ['Economics', 'Business Administration', 'Mathematics', 'Statistics'],
    placements: {
      averagePackage: '₹11 LPA',
      highestPackage: '₹31 LPA',
      topRecruiters: ['McKinsey', 'Bain', 'KPMG', 'HDFC Bank'],
      summary: 'Dominant recruiter base in consulting, banking, and analytics.',
    },
    reviews: [
      { author: 'Isha N.', rating: 5, comment: 'Amazing peer group and societies. CUET cutoffs are very high.' },
    ],
    examCutoffs: [
      { exam: 'CUET', minRank: 1, maxRank: 3000 },
    ],
  },
  {
    name: 'Symbiosis International University Pune',
    location: 'Pune, Maharashtra',
    fees: 520000,
    rating: 4.1,
    placementPercent: 78,
    type: 'Private',
    established: 1971,
    overview:
      'Private university hub with programs in law, management, media, and engineering across Symbiosis institutes.',
    courses: ['Business Administration', 'Law', 'Computer Science', 'Media Studies'],
    placements: {
      averagePackage: '₹7.5 LPA',
      highestPackage: '₹28 LPA',
      topRecruiters: ['EY', 'Capgemini', 'ICICI', 'Zee Media'],
      summary: 'Varied outcomes by institute; SCMHRD and SLS are flagship performers.',
    },
    reviews: [
      { author: 'Vikram D.', rating: 4, comment: 'Great campus diversity. Pick your institute carefully within Symbiosis.' },
    ],
    examCutoffs: [
      { exam: 'CUET', minRank: 5000, maxRank: 80000 },
    ],
  },
  {
    name: 'SRM Institute of Science and Technology',
    location: 'Chennai, Tamil Nadu',
    fees: 350000,
    rating: 4.0,
    placementPercent: 75,
    type: 'Private',
    established: 1985,
    overview:
      'Large private university with multiple campuses, industry projects, and broad program portfolio.',
    courses: ['Computer Science', 'Automobile Engineering', 'Biotechnology', 'Hotel Management'],
    placements: {
      averagePackage: '₹6.5 LPA',
      highestPackage: '₹35 LPA',
      topRecruiters: ['TCS', 'HCL', 'Hyundai', 'Marriott'],
      summary: 'Volume placements with niche roles for top students in CSE.',
    },
    reviews: [
      { author: 'Divya H.', rating: 3, comment: 'Good labs. Class sizes can be large in popular branches.' },
    ],
    examCutoffs: [
      { exam: 'JEE', minRank: 40000, maxRank: 200000 },
    ],
  },
  {
    name: 'Amity University Noida',
    location: 'Noida, Uttar Pradesh',
    fees: 480000,
    rating: 3.8,
    placementPercent: 70,
    type: 'Private',
    established: 2005,
    overview:
      'Private university with global partnerships, modern infrastructure, and programs across disciplines.',
    courses: ['Computer Science', 'Law', 'Fashion Design', 'Journalism'],
    placements: {
      averagePackage: '₹5.5 LPA',
      highestPackage: '₹18 LPA',
      topRecruiters: ['Genpact', 'Tech Mahindra', 'BYJU’S', 'India Today'],
      summary: 'Wide recruiter pool; outcomes vary significantly by program.',
    },
    reviews: [
      { author: 'Rahul B.', rating: 3, comment: 'Campus facilities are good. Research focus is growing.' },
    ],
    examCutoffs: [
      { exam: 'JEE', minRank: 80000, maxRank: 300000 },
      { exam: 'CUET', minRank: 50000, maxRank: 250000 },
    ],
  },
  {
    name: 'Thapar Institute of Engineering and Technology',
    location: 'Patiala, Punjab',
    fees: 410000,
    rating: 4.4,
    placementPercent: 86,
    type: 'Private',
    established: 1956,
    overview:
      'Established private engineering institute with disciplined academics and steady placement performance.',
    courses: ['Computer Science', 'Electronics and Communication', 'Chemical Engineering', 'Civil Engineering'],
    placements: {
      averagePackage: '₹12 LPA',
      highestPackage: '₹48 LPA',
      topRecruiters: ['Intel', 'Texas Instruments', 'Mahindra', 'JP Morgan'],
      summary: 'Consistent CSE placements with growing core sector hiring.',
    },
    reviews: [
      { author: 'Harpreet S.', rating: 4, comment: 'Strong alumni in North India. Good balance of academics and festivals.' },
    ],
    examCutoffs: [
      { exam: 'JEE', minRank: 10000, maxRank: 45000 },
    ],
  },
  {
    name: 'National Law School of India University',
    location: 'Bengaluru, Karnataka',
    fees: 280000,
    rating: 4.8,
    placementPercent: 88,
    type: 'Government',
    established: 1987,
    overview:
      'Premier law school offering integrated BA LLB and LLM with top-tier corporate and litigation pathways.',
    courses: ['Law', 'Public Policy', 'Business Administration'],
    placements: {
      averagePackage: '₹16 LPA',
      highestPackage: '₹25 LPA',
      topRecruiters: ['AZB Partners', 'Shardul Amarchand', 'Trilegal', 'UN bodies'],
      summary: 'Leading destination for corporate law and policy careers.',
    },
    reviews: [
      { author: 'Ananya C.', rating: 5, comment: 'Intense reading culture. Moot courts and internships are central.' },
    ],
    examCutoffs: [
      { exam: 'CUET', minRank: 500, maxRank: 8000 },
    ],
  },
  {
    name: 'PES University',
    location: 'Bengaluru, Karnataka',
    fees: 440000,
    rating: 4.2,
    placementPercent: 84,
    type: 'Private',
    established: 1972,
    overview:
      'Bangalore-based private university with strong tech industry proximity and startup-friendly environment.',
    courses: ['Computer Science', 'Artificial Intelligence', 'Electronics and Communication', 'Business Administration'],
    placements: {
      averagePackage: '₹10 LPA',
      highestPackage: '₹55 LPA',
      topRecruiters: ['Infosys', 'Rivigo', 'Swiggy', 'Intuit'],
      summary: 'Good tech placements leveraging Bengaluru ecosystem.',
    },
    reviews: [
      { author: 'Nikhil A.', rating: 4, comment: 'Industry projects are a highlight. Traffic around campus can be heavy.' },
    ],
    examCutoffs: [
      { exam: 'JEE', minRank: 25000, maxRank: 90000 },
    ],
  },
];

const collegeSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    fees: Number,
    rating: Number,
    placementPercent: Number,
    overview: String,
    type: String,
    established: Number,
    courses: [String],
    placements: Object,
    reviews: Array,
    examCutoffs: Array,
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  savedColleges: [{ type: mongoose.Schema.Types.ObjectId }],
  savedComparisons: Array,
});

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const College = mongoose.models.College || mongoose.model('College', collegeSchema);
  const User = mongoose.models.User || mongoose.model('User', userSchema);

  await College.deleteMany({});
  await User.deleteMany({});

  await College.insertMany(colleges);
  console.log(`Seeded ${colleges.length} colleges`);

  const passwordHash = await bcrypt.hash('demo1234', 10);
  await User.create({
    name: 'Demo User',
    email: 'demo@collegehub.com',
    passwordHash,
    savedColleges: [],
    savedComparisons: [],
  });
  console.log('Demo user: demo@collegehub.com / demo1234');

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
