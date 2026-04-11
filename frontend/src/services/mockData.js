// src/services/mockData.js

// Creates a fake but decodable JWT (AuthContext uses atob to decode payload)
function makeMockToken(payload) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body   = btoa(JSON.stringify(payload));
  return `${header}.${body}.mock_signature`;
}

// exp: 4102444800 = year 2099, so tokens never expire during demo
export const mockEmployerToken = makeMockToken({
  _id: "user_001",
  name: "Ahmed Raza",
  phone: "+923001234567",
  role: "employer",
  exp: 4102444800,
});

export const mockWorkerToken = makeMockToken({
  _id: "user_002",
  name: "Usman Ali",
  phone: "+923007654321",
  role: "worker",
  exp: 4102444800,
});

export const mockAdminToken = makeMockToken({
  _id: "user_admin",
  name: "Admin User",
  phone: "+923009999999",
  role: "admin",
  exp: 4102444800,
});

export const mockUser = {
  _id: "user_001",
  name: "Ahmed Raza",
  phone: "+923001234567",
  role: "employer",
  createdAt: "2024-01-15T10:00:00.000Z",
};

export const mockWorkerUser = {
  _id: "user_002",
  name: "Usman Ali",
  phone: "+923007654321",
  role: "worker",
  createdAt: "2024-01-10T10:00:00.000Z",
};

export const mockAdminUser = {
  _id: "user_admin",
  name: "Admin User",
  phone: "+923009999999",
  role: "admin",
  createdAt: "2024-01-01T10:00:00.000Z",
};

export const mockWorkers = [
  {
    _id: "worker_001",
    userId: { _id: "user_002", name: "Usman Ali", phone: "+923007654321" },
    serviceType: { _id: "st_001", name: "Electrician" },
    bio: "5 years experience in residential and commercial electrical work.",
    cnic: "35202-1234567-1",
    isAvailable: true,
    isVerified: true,
    location: { city: "Lahore", area: "Johar Town" },
    hourlyRate: 500,
    dailyRate: 3500,
    rating: 4.7,
    totalRatings: 23,
    profilePicture: null,
    createdAt: "2024-01-10T10:00:00.000Z",
  },
  {
    _id: "worker_002",
    userId: { _id: "user_003", name: "Bilal Hassan", phone: "+923011112233" },
    serviceType: { _id: "st_002", name: "Plumber" },
    bio: "Expert in pipe fitting, leakage repair, and bathroom installations.",
    cnic: "35202-7654321-2",
    isAvailable: true,
    isVerified: true,
    location: { city: "Lahore", area: "Gulberg" },
    hourlyRate: 450,
    dailyRate: 3000,
    rating: 4.5,
    totalRatings: 18,
    profilePicture: null,
    createdAt: "2024-01-12T10:00:00.000Z",
  },
  {
    _id: "worker_003",
    userId: { _id: "user_004", name: "Tariq Mehmood", phone: "+923022223344" },
    serviceType: { _id: "st_003", name: "Painter" },
    bio: "Interior and exterior painting specialist with 7 years experience.",
    cnic: "35202-1112233-3",
    isAvailable: false,
    isVerified: true,
    location: { city: "Lahore", area: "DHA Phase 5" },
    hourlyRate: 400,
    dailyRate: 2800,
    rating: 4.2,
    totalRatings: 31,
    profilePicture: null,
    createdAt: "2024-01-08T10:00:00.000Z",
  },
  {
    _id: "worker_004",
    userId: { _id: "user_005", name: "Naeem Khan", phone: "+923033334455" },
    serviceType: { _id: "st_004", name: "Carpenter" },
    bio: "Furniture making, door/window fitting, and woodwork repairs.",
    cnic: "35202-4445556-4",
    isAvailable: true,
    isVerified: true,
    location: { city: "Lahore", area: "Model Town" },
    hourlyRate: 550,
    dailyRate: 4000,
    rating: 4.8,
    totalRatings: 15,
    profilePicture: null,
    createdAt: "2024-01-05T10:00:00.000Z",
  },
  {
    _id: "worker_005",
    userId: { _id: "user_006", name: "Shahid Iqbal", phone: "+923044445566" },
    serviceType: { _id: "st_005", name: "AC Technician" },
    bio: "AC installation, servicing, gas refilling, and repair work.",
    cnic: "35202-5556667-5",
    isAvailable: true,
    isVerified: true,
    location: { city: "Lahore", area: "Bahria Town" },
    hourlyRate: 600,
    dailyRate: 4500,
    rating: 4.6,
    totalRatings: 40,
    profilePicture: null,
    createdAt: "2024-01-03T10:00:00.000Z",
  },
];

export const mockJobs = [
  {
    _id: "job_001",
    employer: { _id: "user_001", name: "Ahmed Raza" },
    worker: mockWorkers[0],
    serviceType: { _id: "st_001", name: "Electrician" },
    hireType: "hourly",
    hours: 4,
    estimatedCost: 2000,
    status: "pending",
    location: { city: "Lahore", area: "Johar Town", address: "House 12, Block C" },
    scheduledAt: "2025-04-15T09:00:00.000Z",
    notes: "Need to fix wiring in 2 rooms and replace some switches.",
    createdAt: "2025-04-10T08:00:00.000Z",
  },
  {
    _id: "job_002",
    employer: { _id: "user_001", name: "Ahmed Raza" },
    worker: mockWorkers[1],
    serviceType: { _id: "st_002", name: "Plumber" },
    hireType: "daily",
    days: 1,
    estimatedCost: 3000,
    status: "accepted",
    location: { city: "Lahore", area: "Gulberg", address: "Flat 5, Green Apartments" },
    scheduledAt: "2025-04-12T10:00:00.000Z",
    notes: "Bathroom pipe leakage repair.",
    createdAt: "2025-04-09T08:00:00.000Z",
  },
  {
    _id: "job_003",
    employer: { _id: "user_001", name: "Ahmed Raza" },
    worker: mockWorkers[2],
    serviceType: { _id: "st_003", name: "Painter" },
    hireType: "daily",
    days: 3,
    estimatedCost: 8400,
    status: "completed",
    location: { city: "Lahore", area: "DHA", address: "House 45, Street 7" },
    scheduledAt: "2025-03-20T08:00:00.000Z",
    notes: "Full interior painting of 3 rooms.",
    createdAt: "2025-03-18T08:00:00.000Z",
  },
  {
    _id: "job_004",
    employer: { _id: "user_001", name: "Ahmed Raza" },
    worker: mockWorkers[3],
    serviceType: { _id: "st_004", name: "Carpenter" },
    hireType: "hourly",
    hours: 6,
    estimatedCost: 3300,
    status: "cancelled",
    location: { city: "Lahore", area: "Model Town", address: "House 99, Block L" },
    scheduledAt: "2025-03-10T09:00:00.000Z",
    notes: "Cupboard repair and door fixing.",
    createdAt: "2025-03-08T08:00:00.000Z",
  },
];

export const mockWorkerJobs = [
  {
    _id: "job_001",
    employer: { _id: "user_001", name: "Ahmed Raza", phone: "+923001234567" },
    serviceType: { _id: "st_001", name: "Electrician" },
    hireType: "hourly",
    hours: 4,
    estimatedCost: 2000,
    status: "pending",
    location: { city: "Lahore", area: "Johar Town", address: "House 12, Block C" },
    scheduledAt: "2025-04-15T09:00:00.000Z",
    notes: "Need to fix wiring in 2 rooms and replace some switches.",
    createdAt: "2025-04-10T08:00:00.000Z",
  },
  {
    _id: "job_002",
    employer: { _id: "user_007", name: "Sara Malik", phone: "+923055556677" },
    serviceType: { _id: "st_001", name: "Electrician" },
    hireType: "daily",
    days: 2,
    estimatedCost: 7000,
    status: "accepted",
    location: { city: "Lahore", area: "Bahria Town", address: "Villa 22, Block F" },
    scheduledAt: "2025-04-13T08:00:00.000Z",
    notes: "Complete house rewiring needed.",
    createdAt: "2025-04-09T08:00:00.000Z",
  },
];

export const mockNotifications = [
  {
    _id: "notif_001",
    userId: "user_001",
    title: "Job Request Accepted",
    message: "Bilal Hassan has accepted your plumbing job request.",
    type: "job_accepted",
    isRead: false,
    createdAt: "2025-04-10T09:00:00.000Z",
  },
  {
    _id: "notif_002",
    userId: "user_001",
    title: "Job Completed",
    message: "Tariq Mehmood has marked the painting job as done.",
    type: "job_completed",
    isRead: false,
    createdAt: "2025-03-23T14:00:00.000Z",
  },
  {
    _id: "notif_003",
    userId: "user_001",
    title: "New Message",
    message: "You have a new message from Usman Ali.",
    type: "message",
    isRead: true,
    createdAt: "2025-04-08T11:00:00.000Z",
  },
  {
    _id: "notif_004",
    userId: "user_001",
    title: "Job Request Sent",
    message: "Your job request has been sent to Usman Ali.",
    type: "job_sent",
    isRead: true,
    createdAt: "2025-04-10T08:05:00.000Z",
  },
];

export const mockMessages = [
  {
    _id: "msg_001",
    jobId: "job_001",
    senderId: "user_001",
    receiverId: "user_002",
    text: "Hello, are you available on the 15th?",
    createdAt: "2025-04-10T08:10:00.000Z",
  },
  {
    _id: "msg_002",
    jobId: "job_001",
    senderId: "user_002",
    receiverId: "user_001",
    text: "Yes, I am available. What time works for you?",
    createdAt: "2025-04-10T08:15:00.000Z",
  },
  {
    _id: "msg_003",
    jobId: "job_001",
    senderId: "user_001",
    receiverId: "user_002",
    text: "9 AM would be great. The work is in Johar Town.",
    createdAt: "2025-04-10T08:20:00.000Z",
  },
  {
    _id: "msg_004",
    jobId: "job_001",
    senderId: "user_002",
    receiverId: "user_001",
    text: "Perfect, I will be there at 9 AM sharp.",
    createdAt: "2025-04-10T08:25:00.000Z",
  },
];

export const mockServiceTypes = [
  { _id: "st_001", name: "Electrician" },
  { _id: "st_002", name: "Plumber" },
  { _id: "st_003", name: "Painter" },
  { _id: "st_004", name: "Carpenter" },
  { _id: "st_005", name: "AC Technician" },
  { _id: "st_006", name: "Mason" },
  { _id: "st_007", name: "Welder" },
  { _id: "st_008", name: "Cleaner" },
];

export const mockDashboardMetrics = {
  totalWorkers: 48,
  totalEmployers: 132,
  totalJobs: 310,
  pendingApprovals: 5,
  completedJobs: 214,
  cancelledJobs: 28,
  activeJobs: 68,
  recentWorkers: [
    {
      _id: "worker_pending_001",
      userId: { name: "Kamran Yousaf", phone: "+923066667788" },
      serviceType: { name: "Electrician" },
      cnic: "35202-6667778-1",
      isVerified: false,
      createdAt: "2025-04-09T10:00:00.000Z",
    },
    {
      _id: "worker_pending_002",
      userId: { name: "Faisal Nawaz", phone: "+923077778899" },
      serviceType: { name: "Plumber" },
      cnic: "35202-7778889-2",
      isVerified: false,
      createdAt: "2025-04-08T10:00:00.000Z",
    },
    {
      _id: "worker_pending_003",
      userId: { name: "Asif Javed", phone: "+923088889900" },
      serviceType: { name: "Carpenter" },
      cnic: "35202-8889990-3",
      isVerified: false,
      createdAt: "2025-04-07T10:00:00.000Z",
    },
  ],
};

export const mockWorkerProfile = {
  _id: "worker_001",
  userId: { _id: "user_002", name: "Usman Ali", phone: "+923007654321" },
  serviceType: { _id: "st_001", name: "Electrician" },
  bio: "5 years experience in residential and commercial electrical work.",
  cnic: "35202-1234567-1",
  isAvailable: true,
  isVerified: true,
  location: { city: "Lahore", area: "Johar Town" },
  hourlyRate: 500,
  dailyRate: 3500,
  rating: 4.7,
  totalRatings: 23,
  profilePicture: null,
};