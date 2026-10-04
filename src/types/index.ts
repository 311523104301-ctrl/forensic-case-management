export type UserRole = 'ADMINISTRATOR' | 'INVESTIGATOR' | 'FORENSIC_EXPERT' | 'LAB_TECHNICIAN' | 'SUPERVISOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  department: string;
  lastLogin: string;
  createdAt: string;
  avatar?: string;
}

export type CaseStatus = 'REGISTERED' | 'UNDER_INVESTIGATION' | 'EVIDENCE_COLLECTION' | 'LABORATORY_ANALYSIS' | 'EXPERT_REVIEW' | 'REPORT_PREPARATION' | 'CLOSED';
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type CaseType = 'HOMICIDE' | 'PROPERTY_CRIME' | 'CYBERCRIME' | 'FRAUD' | 'DRUG_OFFENSE' | 'ASSAULT' | 'ARSON' | 'THEFT' | 'OTHER';

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  type: CaseType;
  description: string;
  incidentDate: string;
  reportedDate: string;
  location: string;
  investigatorId: string;
  supervisorId: string;
  priority: CasePriority;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  tags: string[];
  managementPriority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  managementReason?: string;
}

export type EvidenceType = 'FINGERPRINT' | 'DOCUMENT' | 'BIOLOGICAL_SAMPLE' | 'DIGITAL_MEDIA' | 'PHOTOGRAPH' | 'TRACE_MATERIAL' | 'PHYSICAL_OBJECT' | 'OTHER';
export type EvidenceStatus = 'REGISTERED' | 'STORED' | 'ASSIGNED' | 'IN_TRANSIT' | 'UNDER_EXAMINATION' | 'EXAMINATION_COMPLETED' | 'RETURNED' | 'ARCHIVED';
export type EvidenceCondition = 'SEALED' | 'SEAL_INTACT' | 'OPENED_FOR_EXAMINATION' | 'DAMAGED' | 'TAMPERED' | 'WET' | 'BROKEN' | 'OTHER';

export interface Evidence {
  id: string;
  evidenceNumber: string;
  caseId: string;
  type: EvidenceType;
  description: string;
  currentLocation: string;
  currentHolderId: string;
  status: EvidenceStatus;
  condition: EvidenceCondition;
  collectionDate: string;
  collectionLocation: string;
  collectedById: string;
  weight?: string;
  dimensions?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  hasQR: boolean;
}

export interface CustodyTransaction {
  id: string;
  transactionNumber: string;
  evidenceId: string;
  fromUserId: string;
  toUserId: string;
  fromLocation: string;
  toLocation: string;
  purpose: string;
  condition: EvidenceCondition;
  conditionRemarks: string;
  transferDate: string;
  confirmedAt?: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  previousHash: string;
  currentHash: string;
  createdAt: string;
}

export type ExamStatus = 'ASSIGNED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'UNDER_REVIEW' | 'APPROVED';

export interface Examination {
  id: string;
  examinationNumber: string;
  evidenceId: string;
  caseId: string;
  expertId: string;
  type: string;
  dateAssigned: string;
  dateStarted?: string;
  dateCompleted?: string;
  methodology: string;
  instruments: string;
  observations: string;
  findings: string;
  conclusion: string;
  status: ExamStatus;
  dueDate: string;
  priority: CasePriority;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  evidenceId: string;
  caseId: string;
  expertId: string;
  assignedById: string;
  assignedAt: string;
  dueDate: string;
  priority: CasePriority;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  notes: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'CASE_REPORT' | 'EVIDENCE_PHOTO' | 'LAB_REPORT' | 'EXAM_REPORT' | 'SUPPORTING' | 'OTHER';
  caseId?: string;
  evidenceId?: string;
  examinationId?: string;
  uploadedById: string;
  uploadedAt: string;
  fileSize: string;
  mimeType: string;
  version: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  description: string;
}

export interface Report {
  id: string;
  reportNumber: string;
  type: 'CASE_SUMMARY' | 'EVIDENCE_REPORT' | 'CHAIN_OF_CUSTODY' | 'EXAMINATION_REPORT' | 'COMPLETE_CASE';
  caseId: string;
  generatedById: string;
  generatedAt: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewedById?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  title: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT';
  read: boolean;
  relatedEntity?: string;
  relatedId?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  ipAddress: string;
  result: 'SUCCESS' | 'FAILURE';
  details: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  timestamp: string;
  userId: string;
  action: string;
  relatedEntity: string;
  relatedId: string;
  description: string;
  icon: string;
}

export interface HashRecord {
  id: string;
  transactionId: string;
  action: string;
  userId: string;
  entityId: string;
  data: string;
  previousHash: string;
  currentHash: string;
  timestamp: string;
  integrityStatus: 'VALID' | 'INVALID';
}
