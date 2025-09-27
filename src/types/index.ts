// User and Authentication Types
export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  aadhaarHash: string;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Health Records Types
export interface HealthRecord {
  id: string;
  userId: string;
  type: 'consultation' | 'prescription' | 'lab_result' | 'vaccination' | 'other';
  title: string;
  description: string;
  date: string;
  doctorName?: string;
  hospitalName?: string;
  attachments: string[];
  synced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecordsState {
  records: HealthRecord[];
  isLoading: boolean;
  error: string | null;
  lastSyncAt: string | null;
}

// Symptom Checker Types
export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant';
}

export interface SymptomCheckResult {
  id: string;
  symptoms: Symptom[];
  possibleConditions: Array<{
    name: string;
    probability: number;
    description: string;
    recommendations: string[];
  }>;
  generalAdvice: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  createdAt: string;
}

export interface SymptomCheckerState {
  currentSymptoms: Symptom[];
  results: SymptomCheckResult[];
  isLoading: boolean;
  error: string | null;
}

// Video Consultation Types
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  availableSlots: TimeSlot[];
  profileImage: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  doctorId: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meetingId: string;
  notes?: string;
  prescription?: string;
}

export interface VideoConsultationState {
  doctors: Doctor[];
  consultations: Consultation[];
  currentConsultation: Consultation | null;
  isInCall: boolean;
  isLoading: boolean;
  error: string | null;
}

// SOS Emergency Types
export interface SOSRequest {
  id: string;
  userId: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: string;
  status: 'pending' | 'sent' | 'acknowledged' | 'resolved';
  message: string;
  emergencyType: 'medical' | 'accident' | 'other';
}

export interface SOSState {
  isActive: boolean;
  currentRequest: SOSRequest | null;
  history: SOSRequest[];
  isLoading: boolean;
  error: string | null;
}

// Medicine Stock Types
export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  dosage: string;
  form: 'tablet' | 'syrup' | 'injection' | 'ointment' | 'capsule' | 'other';
  stock: number;
  price: number;
  expiryDate: string;
  pharmacyId: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  medicines: Array<{
    medicineId: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  diagnosis: string;
  notes: string;
  issuedAt: string;
  validUntil: string;
}

export interface MedicineStockState {
  medicines: Medicine[];
  prescriptions: Prescription[];
  nearbyPharmacies: Array<{
    id: string;
    name: string;
    address: string;
    phone: string;
    distance: number;
    isOpen: boolean;
  }>;
  isLoading: boolean;
  error: string | null;
  lastSyncAt: string | null;
}

// App State
export interface AppState {
  auth: AuthState;
  healthRecords: HealthRecordsState;
  symptomChecker: SymptomCheckerState;
  videoConsultation: VideoConsultationState;
  sos: SOSState;
  medicineStock: MedicineStockState;
  language: string;
  isOnline: boolean;
  lastSyncAt: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// OCR and Face Verification Types
export interface AadhaarData {
  aadhaarNumber: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  photo: string;
}

export interface FaceVerificationResult {
  isMatch: boolean;
  confidence: number;
  error?: string;
}

// Offline Sync Types
export interface SyncQueueItem {
  id: string;
  type: 'health_record' | 'consultation' | 'sos' | 'prescription';
  data: any;
  timestamp: string;
  retryCount: number;
  maxRetries: number;
}
