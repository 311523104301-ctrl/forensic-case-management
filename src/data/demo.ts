import type { User, Case, Evidence, CustodyTransaction, Examination, Assignment, Document, Report, Notification, AuditLog, HashRecord, TimelineEvent } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@fcm.local', role: 'ADMINISTRATOR', status: 'ACTIVE', department: 'Administration', lastLogin: '2026-09-29T08:00:00Z', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u2', name: 'Arjun Mehta', email: 'investigator@fcm.local', role: 'INVESTIGATOR', status: 'ACTIVE', department: 'Investigation Division', lastLogin: '2026-09-29T07:45:00Z', createdAt: '2024-02-15T00:00:00Z' },
  { id: 'u3', name: 'Dr. Priya Rajan', email: 'expert@fcm.local', role: 'FORENSIC_EXPERT', status: 'ACTIVE', department: 'Forensic Science Laboratory', lastLogin: '2026-09-28T16:30:00Z', createdAt: '2024-02-20T00:00:00Z' },
  { id: 'u4', name: 'Suresh Kumar', email: 'supervisor@fcm.local', role: 'SUPERVISOR', status: 'ACTIVE', department: 'Case Supervision', lastLogin: '2026-09-29T09:00:00Z', createdAt: '2024-01-20T00:00:00Z' },
  { id: 'u5', name: 'Kavitha Nair', email: 'lab@fcm.local', role: 'LAB_TECHNICIAN', status: 'ACTIVE', department: 'Forensic Science Laboratory', lastLogin: '2026-09-28T14:00:00Z', createdAt: '2024-03-01T00:00:00Z' },
  { id: 'u6', name: 'Vikram Singh', email: 'vikram@fcm.local', role: 'INVESTIGATOR', status: 'ACTIVE', department: 'Investigation Division', lastLogin: '2026-09-27T11:00:00Z', createdAt: '2024-03-10T00:00:00Z' },
  { id: 'u7', name: 'Dr. Anand Bose', email: 'anand@fcm.local', role: 'FORENSIC_EXPERT', status: 'ACTIVE', department: 'Forensic Science Laboratory', lastLogin: '2026-09-26T15:00:00Z', createdAt: '2024-04-01T00:00:00Z' },
  { id: 'u8', name: 'Lakshmi Devi', email: 'lakshmi@fcm.local', role: 'LAB_TECHNICIAN', status: 'INACTIVE', department: 'Forensic Science Laboratory', lastLogin: '2026-08-15T10:00:00Z', createdAt: '2024-04-15T00:00:00Z' },
];

export const CASES: Case[] = [
  {
    id: 'c1', caseNumber: 'FC-2026-001', title: 'Property Investigation – Nungambakkam Warehouse', type: 'PROPERTY_CRIME',
    description: 'Reported burglary and theft of industrial equipment from a warehouse. Suspect gained entry through a broken rear window. Fingerprints and trace evidence collected at scene.',
    incidentDate: '2026-09-20', reportedDate: '2026-09-21', location: 'Chennai, Tamil Nadu',
    investigatorId: 'u2', supervisorId: 'u4', priority: 'HIGH', status: 'UNDER_INVESTIGATION',
    createdAt: '2026-09-21T09:00:00Z', updatedAt: '2026-09-28T14:30:00Z', tags: ['Burglary', 'Theft', 'Industrial'],
    managementPriority: 'HIGH', managementReason: '2 examinations overdue and 1 report awaiting supervisor review.'
  },
  {
    id: 'c2', caseNumber: 'FC-2026-002', title: 'Cybercrime – Unauthorized System Access', type: 'CYBERCRIME',
    description: 'Unauthorized intrusion into municipal financial records system. Suspected data exfiltration detected by security monitoring.',
    incidentDate: '2026-09-15', reportedDate: '2026-09-16', location: 'Chennai, Tamil Nadu',
    investigatorId: 'u6', supervisorId: 'u4', priority: 'CRITICAL', status: 'LABORATORY_ANALYSIS',
    createdAt: '2026-09-16T11:00:00Z', updatedAt: '2026-09-29T08:00:00Z', tags: ['Cybercrime', 'Data Breach'],
    managementPriority: 'CRITICAL', managementReason: 'Critical priority case with 3 pending examinations and approaching deadline.'
  },
  {
    id: 'c3', caseNumber: 'FC-2026-003', title: 'Fraudulent Document Case – Anna Nagar', type: 'FRAUD',
    description: 'Discovery of forged land ownership documents used in property transaction fraud.',
    incidentDate: '2026-09-10', reportedDate: '2026-09-11', location: 'Chennai, Tamil Nadu',
    investigatorId: 'u2', supervisorId: 'u4', priority: 'MEDIUM', status: 'EXPERT_REVIEW',
    createdAt: '2026-09-11T10:00:00Z', updatedAt: '2026-09-27T16:00:00Z', tags: ['Fraud', 'Documents'],
    managementPriority: 'MEDIUM', managementReason: '1 examination under review, pending supervisor approval.'
  },
  {
    id: 'c4', caseNumber: 'FC-2026-004', title: 'Arson – Industrial Park Fire', type: 'ARSON',
    description: 'Suspicious fire at manufacturing unit. Accelerant traces identified. No casualties.',
    incidentDate: '2026-09-05', reportedDate: '2026-09-05', location: 'Ambattur, Chennai',
    investigatorId: 'u6', supervisorId: 'u4', priority: 'HIGH', status: 'REPORT_PREPARATION',
    createdAt: '2026-09-05T22:00:00Z', updatedAt: '2026-09-26T12:00:00Z', tags: ['Arson', 'Fire Investigation'],
    managementPriority: 'LOW', managementReason: 'All examinations completed. Report preparation in progress.'
  },
  {
    id: 'c5', caseNumber: 'FC-2026-005', title: 'Drug Seizure – Harbour Area', type: 'DRUG_OFFENSE',
    description: 'Controlled substance seizure during maritime customs inspection. Chemical analysis required.',
    incidentDate: '2026-09-22', reportedDate: '2026-09-22', location: 'Chennai Port',
    investigatorId: 'u2', supervisorId: 'u4', priority: 'CRITICAL', status: 'EVIDENCE_COLLECTION',
    createdAt: '2026-09-22T06:00:00Z', updatedAt: '2026-09-29T07:00:00Z', tags: ['Narcotics', 'Seizure'],
    managementPriority: 'CRITICAL', managementReason: 'Critical priority with 5 evidence items requiring urgent laboratory analysis.'
  },
  {
    id: 'c6', caseNumber: 'FC-2026-006', title: 'Assault Investigation – T Nagar', type: 'ASSAULT',
    description: 'Physical assault resulting in serious injury. Biological samples collected from scene.',
    incidentDate: '2026-09-18', reportedDate: '2026-09-18', location: 'T Nagar, Chennai',
    investigatorId: 'u6', supervisorId: 'u4', priority: 'HIGH', status: 'LABORATORY_ANALYSIS',
    createdAt: '2026-09-18T23:00:00Z', updatedAt: '2026-09-28T10:00:00Z', tags: ['Assault', 'Biological'],
    managementPriority: 'HIGH', managementReason: 'DNA analysis pending, approaching deadline.'
  },
  {
    id: 'c7', caseNumber: 'FC-2025-089', title: 'Vehicle Theft – Velachery', type: 'THEFT',
    description: 'High-value vehicle theft from secured parking facility. CCTV footage retrieved.',
    incidentDate: '2025-12-10', reportedDate: '2025-12-11', location: 'Velachery, Chennai',
    investigatorId: 'u2', supervisorId: 'u4', priority: 'LOW', status: 'CLOSED',
    createdAt: '2025-12-11T10:00:00Z', updatedAt: '2026-02-15T16:00:00Z', closedAt: '2026-02-15T16:00:00Z', tags: ['Vehicle Theft'],
    managementPriority: 'LOW', managementReason: 'Case closed.'
  },
  {
    id: 'c8', caseNumber: 'FC-2026-007', title: 'Identity Theft – Online Banking Fraud', type: 'FRAUD',
    description: 'Multiple victims of identity theft linked to phishing campaign. Digital forensics ongoing.',
    incidentDate: '2026-09-01', reportedDate: '2026-09-03', location: 'Multiple Locations, Chennai',
    investigatorId: 'u6', supervisorId: 'u4', priority: 'HIGH', status: 'UNDER_INVESTIGATION',
    createdAt: '2026-09-03T09:00:00Z', updatedAt: '2026-09-29T06:00:00Z', tags: ['Identity Theft', 'Phishing'],
    managementPriority: 'HIGH', managementReason: '4 pending digital evidence examinations.'
  },
  {
    id: 'c9', caseNumber: 'FC-2026-008', title: 'Counterfeiting – Currency Notes', type: 'FRAUD',
    description: 'Discovery of counterfeit currency notes in circulation. Document forensics required.',
    incidentDate: '2026-09-12', reportedDate: '2026-09-13', location: 'Mylapore, Chennai',
    investigatorId: 'u2', supervisorId: 'u4', priority: 'MEDIUM', status: 'UNDER_INVESTIGATION',
    createdAt: '2026-09-13T14:00:00Z', updatedAt: '2026-09-28T09:00:00Z', tags: ['Counterfeiting', 'Currency'],
    managementPriority: 'MEDIUM', managementReason: '2 examinations pending assignment.'
  },
  {
    id: 'c10', caseNumber: 'FC-2026-009', title: 'Corporate Espionage – Tech Company', type: 'CYBERCRIME',
    description: 'Suspected theft of proprietary technical designs by former employee. Digital media seized.',
    incidentDate: '2026-09-08', reportedDate: '2026-09-09', location: 'OMR, Chennai',
    investigatorId: 'u6', supervisorId: 'u4', priority: 'HIGH', status: 'EXPERT_REVIEW',
    createdAt: '2026-09-09T11:00:00Z', updatedAt: '2026-09-27T15:00:00Z', tags: ['Espionage', 'Digital'],
    managementPriority: 'HIGH', managementReason: '1 report under expert review awaiting approval.'
  },
];

export const EVIDENCE: Evidence[] = [
  {
    id: 'ev1', evidenceNumber: 'EV-2026-0001', caseId: 'c1', type: 'FINGERPRINT',
    description: 'Latent fingerprint lifted from broken window frame at rear of warehouse. Partial print, usable ridge detail.',
    currentLocation: 'Forensic Science Laboratory, Room 3', currentHolderId: 'u3',
    status: 'UNDER_EXAMINATION', condition: 'SEALED',
    collectionDate: '2026-09-21T10:30:00Z', collectionLocation: 'Warehouse Rear Window Frame',
    collectedById: 'u2', notes: 'Collected using standard fingerprint lifting tape. Chain of custody maintained.', createdAt: '2026-09-21T11:00:00Z', updatedAt: '2026-09-27T09:00:00Z', hasQR: true
  },
  {
    id: 'ev2', evidenceNumber: 'EV-2026-0002', caseId: 'c1', type: 'PHOTOGRAPH',
    description: 'Photographic documentation of crime scene – entry point, disturbed inventory, and footprints.',
    currentLocation: 'Evidence Storage Room A', currentHolderId: 'u5',
    status: 'STORED', condition: 'SEAL_INTACT',
    collectionDate: '2026-09-21T10:00:00Z', collectionLocation: 'Warehouse Interior',
    collectedById: 'u2', notes: '47 photographs captured. Digital copies archived.', createdAt: '2026-09-21T10:30:00Z', updatedAt: '2026-09-21T10:30:00Z', hasQR: true
  },
  {
    id: 'ev3', evidenceNumber: 'EV-2026-0003', caseId: 'c1', type: 'DOCUMENT',
    description: 'Partially burned inventory ledger found near loading dock. May contain record of stolen goods.',
    currentLocation: 'Forensic Science Laboratory, Document Analysis', currentHolderId: 'u3',
    status: 'UNDER_EXAMINATION', condition: 'DAMAGED',
    collectionDate: '2026-09-21T11:00:00Z', collectionLocation: 'Loading Dock Area',
    collectedById: 'u2', notes: 'Fragile. Handle with care. Partial charring on edges.', createdAt: '2026-09-21T11:30:00Z', updatedAt: '2026-09-26T14:00:00Z', hasQR: true
  },
  {
    id: 'ev4', evidenceNumber: 'EV-2026-0004', caseId: 'c2', type: 'DIGITAL_MEDIA',
    description: 'Server hard drive containing logs of unauthorized access. 2TB NVMe drive.',
    currentLocation: 'Digital Forensics Lab', currentHolderId: 'u7',
    status: 'UNDER_EXAMINATION', condition: 'SEALED',
    collectionDate: '2026-09-16T14:00:00Z', collectionLocation: 'Municipal IT Server Room',
    collectedById: 'u6', notes: 'Forensic imaging completed. Original preserved.', createdAt: '2026-09-16T15:00:00Z', updatedAt: '2026-09-29T07:00:00Z', hasQR: true
  },
  {
    id: 'ev5', evidenceNumber: 'EV-2026-0005', caseId: 'c2', type: 'DIGITAL_MEDIA',
    description: 'Network router with suspicious firmware modification.',
    currentLocation: 'Digital Forensics Lab', currentHolderId: 'u7',
    status: 'UNDER_EXAMINATION', condition: 'SEALED',
    collectionDate: '2026-09-16T15:00:00Z', collectionLocation: 'Municipal IT Server Room',
    collectedById: 'u6', notes: 'Firmware hash recorded at collection.', createdAt: '2026-09-16T16:00:00Z', updatedAt: '2026-09-28T11:00:00Z', hasQR: true
  },
  {
    id: 'ev6', evidenceNumber: 'EV-2026-0006', caseId: 'c3', type: 'DOCUMENT',
    description: 'Set of forged land ownership documents with suspected fabricated seals and signatures.',
    currentLocation: 'Document Analysis Unit', currentHolderId: 'u3',
    status: 'EXAMINATION_COMPLETED', condition: 'SEAL_INTACT',
    collectionDate: '2026-09-11T10:00:00Z', collectionLocation: 'Registrar Office',
    collectedById: 'u2', notes: 'Documents flagged by registrar staff. Originals secured.', createdAt: '2026-09-11T11:00:00Z', updatedAt: '2026-09-25T14:00:00Z', hasQR: true
  },
  {
    id: 'ev7', evidenceNumber: 'EV-2026-0007', caseId: 'c4', type: 'TRACE_MATERIAL',
    description: 'Accelerant residue sample collected from burn origin point.',
    currentLocation: 'Chemistry Analysis Lab', currentHolderId: 'u5',
    status: 'EXAMINATION_COMPLETED', condition: 'SEALED',
    collectionDate: '2026-09-05T23:00:00Z', collectionLocation: 'Fire Origin Point, Warehouse Floor',
    collectedById: 'u6', notes: 'Collected in sterile container. Refrigerated immediately.', createdAt: '2026-09-06T00:00:00Z', updatedAt: '2026-09-20T10:00:00Z', hasQR: true
  },
  {
    id: 'ev8', evidenceNumber: 'EV-2026-0008', caseId: 'c5', type: 'BIOLOGICAL_SAMPLE',
    description: 'Controlled substance sample – 2.4kg, white crystalline powder. Requires chemical analysis.',
    currentLocation: 'Secure Evidence Vault B', currentHolderId: 'u5',
    status: 'STORED', condition: 'SEALED',
    collectionDate: '2026-09-22T06:30:00Z', collectionLocation: 'Chennai Port, Container 4C',
    collectedById: 'u2', notes: 'Collected per narcotics handling protocol. Chain maintained.', createdAt: '2026-09-22T07:00:00Z', updatedAt: '2026-09-22T07:00:00Z', hasQR: true
  },
  {
    id: 'ev9', evidenceNumber: 'EV-2026-0009', caseId: 'c5', type: 'PHYSICAL_OBJECT',
    description: 'Concealment packaging – modified false-bottom container used to transport substance.',
    currentLocation: 'Secure Evidence Vault B', currentHolderId: 'u5',
    status: 'STORED', condition: 'SEALED',
    collectionDate: '2026-09-22T07:00:00Z', collectionLocation: 'Chennai Port, Container 4C',
    collectedById: 'u2', notes: 'Photographed in situ before collection.', createdAt: '2026-09-22T07:30:00Z', updatedAt: '2026-09-22T07:30:00Z', hasQR: true
  },
  {
    id: 'ev10', evidenceNumber: 'EV-2026-0010', caseId: 'c6', type: 'BIOLOGICAL_SAMPLE',
    description: 'Blood sample collected from assault scene – potential DNA profiling.',
    currentLocation: 'DNA Analysis Lab', currentHolderId: 'u7',
    status: 'UNDER_EXAMINATION', condition: 'SEALED',
    collectionDate: '2026-09-18T23:30:00Z', collectionLocation: 'T Nagar, Scene of Incident',
    collectedById: 'u6', notes: 'Collected using sterile swab. Refrigerated within 30 minutes.', createdAt: '2026-09-19T00:00:00Z', updatedAt: '2026-09-25T09:00:00Z', hasQR: true
  },
  {
    id: 'ev11', evidenceNumber: 'EV-2026-0011', caseId: 'c1', type: 'TRACE_MATERIAL',
    description: 'Soil sample from footprint impression near loading dock exit.',
    currentLocation: 'Evidence Storage Room A', currentHolderId: 'u5',
    status: 'STORED', condition: 'SEALED',
    collectionDate: '2026-09-21T11:30:00Z', collectionLocation: 'Loading Dock Exit, Warehouse',
    collectedById: 'u2', notes: 'Impression cast also taken. Separate container.', createdAt: '2026-09-21T12:00:00Z', updatedAt: '2026-09-21T12:00:00Z', hasQR: true
  },
  {
    id: 'ev12', evidenceNumber: 'EV-2026-0012', caseId: 'c8', type: 'DIGITAL_MEDIA',
    description: 'Phishing kit server image – virtual machine snapshot from suspected attacker infrastructure.',
    currentLocation: 'Digital Forensics Lab', currentHolderId: 'u7',
    status: 'UNDER_EXAMINATION', condition: 'SEALED',
    collectionDate: '2026-09-05T10:00:00Z', collectionLocation: 'Remote Server (Court Order)',
    collectedById: 'u6', notes: 'Acquired via legal process. Hash verified.', createdAt: '2026-09-05T11:00:00Z', updatedAt: '2026-09-20T14:00:00Z', hasQR: true
  },
];

export const CUSTODY_TRANSACTIONS: CustodyTransaction[] = [
  {
    id: 'ct1', transactionNumber: 'TX-2026-001', evidenceId: 'ev1',
    fromUserId: 'u2', toUserId: 'u5', fromLocation: 'Crime Scene', toLocation: 'Evidence Storage Room A',
    purpose: 'Initial evidence intake and secure storage after collection',
    condition: 'SEALED', conditionRemarks: 'Evidence sealed and tagged at scene.',
    transferDate: '2026-09-21T12:00:00Z', confirmedAt: '2026-09-21T12:30:00Z',
    status: 'CONFIRMED', previousHash: 'GENESIS',
    currentHash: 'a83f9c2d1e4b5f6a7890abcdef1234567890abcdef1234567890abcdef123456',
    createdAt: '2026-09-21T12:00:00Z'
  },
  {
    id: 'ct2', transactionNumber: 'TX-2026-002', evidenceId: 'ev1',
    fromUserId: 'u5', toUserId: 'u2', fromLocation: 'Evidence Storage Room A', toLocation: 'Investigation Office',
    purpose: 'Evidence review for case documentation preparation',
    condition: 'SEAL_INTACT', conditionRemarks: 'Seal verified intact on checkout.',
    transferDate: '2026-09-23T09:00:00Z', confirmedAt: '2026-09-23T09:15:00Z',
    status: 'CONFIRMED', previousHash: 'a83f9c2d1e4b5f6a7890abcdef1234567890abcdef1234567890abcdef123456',
    currentHash: 'b71c8d3e2f5a6b7c8901bcdef2345678901bcdef2345678901bcdef234567890',
    createdAt: '2026-09-23T09:00:00Z'
  },
  {
    id: 'ct3', transactionNumber: 'TX-2026-003', evidenceId: 'ev1',
    fromUserId: 'u2', toUserId: 'u3', fromLocation: 'Investigation Office', toLocation: 'Forensic Science Laboratory, Room 3',
    purpose: 'Assignment to forensic expert for fingerprint analysis examination',
    condition: 'SEALED', conditionRemarks: 'Re-sealed after review. Expert received.',
    transferDate: '2026-09-25T10:00:00Z', confirmedAt: '2026-09-25T10:20:00Z',
    status: 'CONFIRMED', previousHash: 'b71c8d3e2f5a6b7c8901bcdef2345678901bcdef2345678901bcdef234567890',
    currentHash: 'c92a1e4f3a6b7c8d9012cdef3456789012cdef3456789012cdef345678901234',
    createdAt: '2026-09-25T10:00:00Z'
  },
  {
    id: 'ct4', transactionNumber: 'TX-2026-004', evidenceId: 'ev4',
    fromUserId: 'u6', toUserId: 'u5', fromLocation: 'Crime Scene', toLocation: 'Digital Forensics Lab',
    purpose: 'Initial storage and preparation for digital forensics examination',
    condition: 'SEALED', conditionRemarks: 'Factory sealed in original packaging.',
    transferDate: '2026-09-16T16:00:00Z', confirmedAt: '2026-09-16T16:30:00Z',
    status: 'CONFIRMED', previousHash: 'GENESIS',
    currentHash: 'd83b2f5e4a7c8d9e0123def4567890123def4567890123def456789012345678',
    createdAt: '2026-09-16T16:00:00Z'
  },
  {
    id: 'ct5', transactionNumber: 'TX-2026-005', evidenceId: 'ev4',
    fromUserId: 'u5', toUserId: 'u7', fromLocation: 'Digital Forensics Lab', toLocation: 'Digital Forensics Lab – Workstation 7',
    purpose: 'Assignment to digital forensics expert for analysis',
    condition: 'SEALED', conditionRemarks: 'Forensic image created. Original intact.',
    transferDate: '2026-09-17T09:00:00Z', confirmedAt: '2026-09-17T09:30:00Z',
    status: 'CONFIRMED', previousHash: 'd83b2f5e4a7c8d9e0123def4567890123def4567890123def456789012345678',
    currentHash: 'e94c3a6f5b8d9e0f1234ef56789012345ef6789012345ef6789012345ef67890',
    createdAt: '2026-09-17T09:00:00Z'
  },
  {
    id: 'ct6', transactionNumber: 'TX-2026-006', evidenceId: 'ev2',
    fromUserId: 'u2', toUserId: 'u5', fromLocation: 'Crime Scene', toLocation: 'Evidence Storage Room A',
    purpose: 'Initial evidence intake – photographic documentation',
    condition: 'SEALED', conditionRemarks: 'Sealed in standard evidence packaging.',
    transferDate: '2026-09-21T11:00:00Z', confirmedAt: '2026-09-21T11:30:00Z',
    status: 'CONFIRMED', previousHash: 'GENESIS',
    currentHash: 'f05d4b7a6c9e0f1a2345fa6789012345fa6789012345fa6789012345fa67890a',
    createdAt: '2026-09-21T11:00:00Z'
  },
];

export const EXAMINATIONS: Examination[] = [
  {
    id: 'ex1', examinationNumber: 'EX-2026-001', evidenceId: 'ev1', caseId: 'c1',
    expertId: 'u3', type: 'Fingerprint Analysis',
    dateAssigned: '2026-09-25T10:00:00Z', dateStarted: '2026-09-26T09:00:00Z',
    methodology: 'AFIS database comparison with manual ridge analysis using comparative microscopy',
    instruments: 'AFIS Terminal v4.2, Comparative Microscope CM-300, Digital Imaging System',
    observations: 'Partial print with 12 identifiable ridge characteristics. Loop pattern detected on thenar zone.',
    findings: 'Print exhibits 14 matching characteristics with AFIS candidate XXXXXX. Sufficient for tentative comparison pending confirmation analysis.',
    conclusion: 'The latent print is of sufficient quality for comparison analysis. AFIS preliminary match identified. Further confirmation examination recommended.',
    status: 'IN_PROGRESS', dueDate: '2026-09-30T00:00:00Z', priority: 'HIGH',
    createdAt: '2026-09-25T10:00:00Z', updatedAt: '2026-09-28T16:00:00Z'
  },
  {
    id: 'ex2', examinationNumber: 'EX-2026-002', evidenceId: 'ev3', caseId: 'c1',
    expertId: 'u3', type: 'Document Analysis',
    dateAssigned: '2026-09-22T10:00:00Z', dateStarted: '2026-09-23T09:00:00Z', dateCompleted: '2026-09-26T14:00:00Z',
    methodology: 'Infrared reflectography, ultraviolet fluorescence imaging, and questioned document examination',
    instruments: 'VSC6000 Video Spectral Comparator, UV Light Source UVL-4, Stereo Microscope SM-2',
    observations: 'Document shows multiple ink types and paper compositions. Burn damage to 30% of surface.',
    findings: 'Legible content recovered from 70% of document using IR imaging. Partial inventory list recovered showing 23 items. Ink analysis indicates document authenticity.',
    conclusion: 'Original genuine document. Inventory list partially recovered for investigative use. IR copies provided to investigator.',
    status: 'UNDER_REVIEW', dueDate: '2026-09-28T00:00:00Z', priority: 'HIGH',
    createdAt: '2026-09-22T10:00:00Z', updatedAt: '2026-09-26T14:00:00Z'
  },
  {
    id: 'ex3', examinationNumber: 'EX-2026-003', evidenceId: 'ev4', caseId: 'c2',
    expertId: 'u7', type: 'Digital Media Forensics',
    dateAssigned: '2026-09-17T09:00:00Z', dateStarted: '2026-09-17T10:00:00Z',
    methodology: 'Forensic disk imaging, filesystem analysis, log file correlation, timeline reconstruction',
    instruments: 'FTK Imager 4.7, Autopsy 4.21, EnCase Enterprise, Wireshark 4.2',
    observations: 'Access logs show 47 authentication events with 3 failed attempts preceding successful access. Files accessed include payroll and budget databases.',
    findings: 'Intrusion path identified through compromised service account. Lateral movement detected across 6 internal systems. Data exfiltration of 4.2GB detected between 02:14 and 04:37.',
    conclusion: 'Evidence confirms unauthorized access and data exfiltration. Source IP traceable through proxy chain. Complete forensic report prepared.',
    status: 'COMPLETED', dueDate: '2026-09-25T00:00:00Z', priority: 'CRITICAL',
    createdAt: '2026-09-17T09:00:00Z', updatedAt: '2026-09-25T16:00:00Z'
  },
  {
    id: 'ex4', examinationNumber: 'EX-2026-004', evidenceId: 'ev6', caseId: 'c3',
    expertId: 'u3', type: 'Questioned Document Examination',
    dateAssigned: '2026-09-12T09:00:00Z', dateStarted: '2026-09-13T09:00:00Z', dateCompleted: '2026-09-22T14:00:00Z',
    methodology: 'Multi-spectral imaging, ink chromatography, seal impression analysis, paper age testing',
    instruments: 'VSC6000, HPLC Ink Analysis System, Stereomicroscope',
    observations: 'Document seals show characteristics inconsistent with authentic government seals. Ink chemical composition mismatch detected.',
    findings: 'All 4 documents examined are determined to be counterfeit. Seals are digitally reproduced rather than physically stamped. Ink composition inconsistent with official document ink standards.',
    conclusion: 'Documents are confirmed forgeries. Laboratory findings conclusive. Complete forensic report submitted for case record.',
    status: 'APPROVED', dueDate: '2026-09-25T00:00:00Z', priority: 'MEDIUM',
    createdAt: '2026-09-12T09:00:00Z', updatedAt: '2026-09-25T10:00:00Z'
  },
];

export const ASSIGNMENTS: Assignment[] = [
  { id: 'as1', evidenceId: 'ev1', caseId: 'c1', expertId: 'u3', assignedById: 'u2', assignedAt: '2026-09-25T10:00:00Z', dueDate: '2026-09-30T00:00:00Z', priority: 'HIGH', status: 'IN_PROGRESS', notes: 'Urgent fingerprint analysis required for suspect identification.' },
  { id: 'as2', evidenceId: 'ev3', caseId: 'c1', expertId: 'u3', assignedById: 'u2', assignedAt: '2026-09-22T10:00:00Z', dueDate: '2026-09-28T00:00:00Z', priority: 'HIGH', status: 'IN_PROGRESS', notes: 'Recover inventory list from damaged document.' },
  { id: 'as3', evidenceId: 'ev4', caseId: 'c2', expertId: 'u7', assignedById: 'u6', assignedAt: '2026-09-17T09:00:00Z', dueDate: '2026-09-25T00:00:00Z', priority: 'CRITICAL', status: 'COMPLETED', notes: 'Full digital forensics on server drive.' },
  { id: 'as4', evidenceId: 'ev6', caseId: 'c3', expertId: 'u3', assignedById: 'u2', assignedAt: '2026-09-12T09:00:00Z', dueDate: '2026-09-25T00:00:00Z', priority: 'MEDIUM', status: 'COMPLETED', notes: 'Determine authenticity of land documents.' },
  { id: 'as5', evidenceId: 'ev10', caseId: 'c6', expertId: 'u7', assignedById: 'u6', assignedAt: '2026-09-20T09:00:00Z', dueDate: '2026-09-29T00:00:00Z', priority: 'HIGH', status: 'OVERDUE', notes: 'DNA profile from biological sample.' },
  { id: 'as6', evidenceId: 'ev7', caseId: 'c4', expertId: 'u5', assignedById: 'u6', assignedAt: '2026-09-06T09:00:00Z', dueDate: '2026-09-15T00:00:00Z', priority: 'HIGH', status: 'COMPLETED', notes: 'Identify accelerant type from residue.' },
];

export const DOCUMENTS: Document[] = [
  { id: 'doc1', name: 'FC-2026-001 Initial Case Report.pdf', type: 'CASE_REPORT', caseId: 'c1', uploadedById: 'u2', uploadedAt: '2026-09-21T14:00:00Z', fileSize: '1.2 MB', mimeType: 'application/pdf', version: 1, status: 'ACTIVE', description: 'Initial case registration report and scene assessment.' },
  { id: 'doc2', name: 'EV-2026-0001 Crime Scene Photographs.zip', type: 'EVIDENCE_PHOTO', caseId: 'c1', evidenceId: 'ev2', uploadedById: 'u2', uploadedAt: '2026-09-21T15:00:00Z', fileSize: '48.7 MB', mimeType: 'application/zip', version: 1, status: 'ACTIVE', description: '47 high-resolution crime scene photographs.' },
  { id: 'doc3', name: 'EX-2026-002 Document Analysis Report.pdf', type: 'EXAM_REPORT', caseId: 'c1', evidenceId: 'ev3', examinationId: 'ex2', uploadedById: 'u3', uploadedAt: '2026-09-26T15:00:00Z', fileSize: '3.4 MB', mimeType: 'application/pdf', version: 1, status: 'ACTIVE', description: 'Full document analysis report with IR imaging results.' },
  { id: 'doc4', name: 'FC-2026-002 Cybercrime Investigation Report.pdf', type: 'CASE_REPORT', caseId: 'c2', uploadedById: 'u6', uploadedAt: '2026-09-17T10:00:00Z', fileSize: '2.1 MB', mimeType: 'application/pdf', version: 2, status: 'ACTIVE', description: 'Case investigation report with technical findings.' },
  { id: 'doc5', name: 'EX-2026-003 Digital Forensics Report.pdf', type: 'EXAM_REPORT', caseId: 'c2', evidenceId: 'ev4', examinationId: 'ex3', uploadedById: 'u7', uploadedAt: '2026-09-25T17:00:00Z', fileSize: '5.8 MB', mimeType: 'application/pdf', version: 1, status: 'ACTIVE', description: 'Complete digital forensics examination report.' },
  { id: 'doc6', name: 'EX-2026-004 Document Forgery Report.pdf', type: 'EXAM_REPORT', caseId: 'c3', evidenceId: 'ev6', examinationId: 'ex4', uploadedById: 'u3', uploadedAt: '2026-09-22T15:00:00Z', fileSize: '4.2 MB', mimeType: 'application/pdf', version: 1, status: 'ACTIVE', description: 'Questioned document examination report confirming forgery.' },
  { id: 'doc7', name: 'FC-2026-004 Arson Scene Analysis.pdf', type: 'LAB_REPORT', caseId: 'c4', uploadedById: 'u5', uploadedAt: '2026-09-10T10:00:00Z', fileSize: '2.8 MB', mimeType: 'application/pdf', version: 1, status: 'ACTIVE', description: 'Laboratory analysis of accelerant samples from fire scene.' },
  { id: 'doc8', name: 'FC-2026-001 Chain of Custody Record.pdf', type: 'SUPPORTING', caseId: 'c1', uploadedById: 'u2', uploadedAt: '2026-09-28T09:00:00Z', fileSize: '0.8 MB', mimeType: 'application/pdf', version: 1, status: 'ACTIVE', description: 'Complete chain of custody documentation.' },
];

export const REPORTS: Report[] = [
  { id: 'r1', reportNumber: 'RPT-2026-001', type: 'COMPLETE_CASE', caseId: 'c3', generatedById: 'u2', generatedAt: '2026-09-27T10:00:00Z', status: 'APPROVED', reviewedById: 'u4', reviewedAt: '2026-09-28T14:00:00Z', reviewNotes: 'Comprehensive report. Approved for filing.', title: 'Complete Case Report – FC-2026-003 Document Fraud' },
  { id: 'r2', reportNumber: 'RPT-2026-002', type: 'EXAMINATION_REPORT', caseId: 'c2', generatedById: 'u7', generatedAt: '2026-09-25T17:00:00Z', status: 'PENDING_REVIEW', title: 'Digital Forensics Examination Report – FC-2026-002' },
  { id: 'r3', reportNumber: 'RPT-2026-003', type: 'CHAIN_OF_CUSTODY', caseId: 'c1', generatedById: 'u2', generatedAt: '2026-09-28T09:00:00Z', status: 'DRAFT', title: 'Chain of Custody Report – FC-2026-001' },
  { id: 'r4', reportNumber: 'RPT-2026-004', type: 'CASE_SUMMARY', caseId: 'c4', generatedById: 'u6', generatedAt: '2026-09-26T14:00:00Z', status: 'PENDING_REVIEW', title: 'Case Summary Report – FC-2026-004 Arson Investigation' },
  { id: 'r5', reportNumber: 'RPT-2025-089', type: 'COMPLETE_CASE', caseId: 'c7', generatedById: 'u2', generatedAt: '2026-02-15T14:00:00Z', status: 'APPROVED', reviewedById: 'u4', reviewedAt: '2026-02-15T16:00:00Z', title: 'Complete Case Report – FC-2025-089 Vehicle Theft' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u3', title: 'New Assignment', message: 'Evidence EV-2026-0001 has been assigned to you for fingerprint analysis.', type: 'INFO', read: false, relatedEntity: 'EVIDENCE', relatedId: 'ev1', createdAt: '2026-09-25T10:05:00Z' },
  { id: 'n2', userId: 'u3', title: 'Examination Deadline Approaching', message: 'Examination EX-2026-001 is due in 2 days. Please ensure timely completion.', type: 'WARNING', read: false, relatedEntity: 'EXAMINATION', relatedId: 'ex1', createdAt: '2026-09-28T08:00:00Z' },
  { id: 'n3', userId: 'u2', title: 'Evidence Transfer Confirmed', message: 'Transfer of EV-2026-0001 to Dr. Priya Rajan has been confirmed.', type: 'SUCCESS', read: true, relatedEntity: 'EVIDENCE', relatedId: 'ev1', createdAt: '2026-09-25T10:20:00Z' },
  { id: 'n4', userId: 'u4', title: 'Report Awaiting Review', message: 'Report RPT-2026-002 is awaiting your review and approval.', type: 'ALERT', read: false, relatedEntity: 'REPORT', relatedId: 'r2', createdAt: '2026-09-25T17:05:00Z' },
  { id: 'n5', userId: 'u7', title: 'Examination Overdue', message: 'Examination for EV-2026-0010 (DNA Analysis) has passed its due date.', type: 'ALERT', read: false, relatedEntity: 'ASSIGNMENT', relatedId: 'as5', createdAt: '2026-09-29T08:00:00Z' },
  { id: 'n6', userId: 'u2', title: 'Integrity Verification', message: 'Chain of custody integrity verification for FC-2026-001 completed successfully.', type: 'SUCCESS', read: true, relatedEntity: 'CASE', relatedId: 'c1', createdAt: '2026-09-28T11:00:00Z' },
  { id: 'n7', userId: 'u6', title: 'Case Priority Update', message: 'FC-2026-002 management priority elevated to CRITICAL due to approaching deadline.', type: 'WARNING', read: false, relatedEntity: 'CASE', relatedId: 'c2', createdAt: '2026-09-29T07:00:00Z' },
  { id: 'n8', userId: 'u3', title: 'Examination Approved', message: 'Your examination EX-2026-004 has been approved by Supervisor Suresh Kumar.', type: 'SUCCESS', read: false, relatedEntity: 'EXAMINATION', relatedId: 'ex4', createdAt: '2026-09-28T14:05:00Z' },
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'al1', timestamp: '2026-09-29T08:00:00Z', userId: 'u1', userRole: 'ADMINISTRATOR', action: 'LOGIN', entity: 'USER', entityId: 'u1', ipAddress: '192.168.1.100', result: 'SUCCESS', details: 'Administrator login from dashboard terminal.' },
  { id: 'al2', timestamp: '2026-09-28T16:00:00Z', userId: 'u3', userRole: 'FORENSIC_EXPERT', action: 'FINDINGS_SUBMITTED', entity: 'EXAMINATION', entityId: 'ex2', ipAddress: '192.168.1.105', result: 'SUCCESS', details: 'Examination EX-2026-002 findings submitted for review.' },
  { id: 'al3', timestamp: '2026-09-28T14:00:00Z', userId: 'u4', userRole: 'SUPERVISOR', action: 'REPORT_APPROVED', entity: 'REPORT', entityId: 'r1', ipAddress: '192.168.1.102', result: 'SUCCESS', details: 'Report RPT-2026-001 approved and filed.' },
  { id: 'al4', timestamp: '2026-09-27T10:00:00Z', userId: 'u2', userRole: 'INVESTIGATOR', action: 'REPORT_GENERATED', entity: 'REPORT', entityId: 'r1', ipAddress: '192.168.1.103', result: 'SUCCESS', details: 'Complete case report generated for FC-2026-003.' },
  { id: 'al5', timestamp: '2026-09-26T09:00:00Z', userId: 'u3', userRole: 'FORENSIC_EXPERT', action: 'EXAMINATION_STARTED', entity: 'EXAMINATION', entityId: 'ex1', ipAddress: '192.168.1.105', result: 'SUCCESS', details: 'Examination EX-2026-001 started.' },
  { id: 'al6', timestamp: '2026-09-25T10:20:00Z', userId: 'u3', userRole: 'FORENSIC_EXPERT', action: 'EVIDENCE_TRANSFERRED', entity: 'EVIDENCE', entityId: 'ev1', ipAddress: '192.168.1.105', result: 'SUCCESS', details: 'Received evidence EV-2026-0001. Transfer TX-2026-003 confirmed.' },
  { id: 'al7', timestamp: '2026-09-25T10:00:00Z', userId: 'u2', userRole: 'INVESTIGATOR', action: 'EVIDENCE_TRANSFERRED', entity: 'EVIDENCE', entityId: 'ev1', ipAddress: '192.168.1.103', result: 'SUCCESS', details: 'Initiated transfer TX-2026-003 to forensic expert.' },
  { id: 'al8', timestamp: '2026-09-22T10:00:00Z', userId: 'u2', userRole: 'INVESTIGATOR', action: 'EVIDENCE_CREATED', entity: 'EVIDENCE', entityId: 'ev8', ipAddress: '192.168.1.103', result: 'SUCCESS', details: 'Evidence EV-2026-0008 registered for FC-2026-005.' },
  { id: 'al9', timestamp: '2026-09-21T09:00:00Z', userId: 'u2', userRole: 'INVESTIGATOR', action: 'CASE_CREATED', entity: 'CASE', entityId: 'c1', ipAddress: '192.168.1.103', result: 'SUCCESS', details: 'Case FC-2026-001 registered.' },
  { id: 'al10', timestamp: '2026-09-17T09:30:00Z', userId: 'u7', userRole: 'FORENSIC_EXPERT', action: 'EVIDENCE_TRANSFERRED', entity: 'EVIDENCE', entityId: 'ev4', ipAddress: '192.168.1.107', result: 'SUCCESS', details: 'Received evidence EV-2026-0004. Transfer TX-2026-005 confirmed.' },
  { id: 'al11', timestamp: '2026-09-16T11:00:00Z', userId: 'u6', userRole: 'INVESTIGATOR', action: 'CASE_CREATED', entity: 'CASE', entityId: 'c2', ipAddress: '192.168.1.106', result: 'SUCCESS', details: 'Case FC-2026-002 registered.' },
  { id: 'al12', timestamp: '2026-09-29T07:45:00Z', userId: 'u2', userRole: 'INVESTIGATOR', action: 'LOGIN', entity: 'USER', entityId: 'u2', ipAddress: '192.168.1.103', result: 'SUCCESS', details: 'Investigator login.' },
];

export const HASH_RECORDS: HashRecord[] = [
  { id: 'hr1', transactionId: 'ct1', action: 'EVIDENCE_INTAKE', userId: 'u5', entityId: 'ev1', data: 'EV-2026-0001|INTAKE|u2->u5|2026-09-21T12:00:00Z|SEALED', previousHash: 'GENESIS', currentHash: 'a83f9c2d1e4b5f6a7890abcdef1234567890abcdef1234567890abcdef123456', timestamp: '2026-09-21T12:00:00Z', integrityStatus: 'VALID' },
  { id: 'hr2', transactionId: 'ct2', action: 'EVIDENCE_CHECKOUT', userId: 'u2', entityId: 'ev1', data: 'EV-2026-0001|CHECKOUT|u5->u2|2026-09-23T09:00:00Z|SEAL_INTACT', previousHash: 'a83f9c2d1e4b5f6a7890abcdef1234567890abcdef1234567890abcdef123456', currentHash: 'b71c8d3e2f5a6b7c8901bcdef2345678901bcdef2345678901bcdef234567890', timestamp: '2026-09-23T09:00:00Z', integrityStatus: 'VALID' },
  { id: 'hr3', transactionId: 'ct3', action: 'EVIDENCE_ASSIGNMENT', userId: 'u3', entityId: 'ev1', data: 'EV-2026-0001|ASSIGNMENT|u2->u3|2026-09-25T10:00:00Z|SEALED', previousHash: 'b71c8d3e2f5a6b7c8901bcdef2345678901bcdef2345678901bcdef234567890', currentHash: 'c92a1e4f3a6b7c8d9012cdef3456789012cdef3456789012cdef345678901234', timestamp: '2026-09-25T10:00:00Z', integrityStatus: 'VALID' },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 'te1', caseId: 'c1', timestamp: '2026-09-21T09:00:00Z', userId: 'u2', action: 'CASE_CREATED', relatedEntity: 'CASE', relatedId: 'c1', description: 'Case FC-2026-001 registered and assigned to Investigation Division.', icon: 'case' },
  { id: 'te2', caseId: 'c1', timestamp: '2026-09-21T11:00:00Z', userId: 'u2', action: 'EVIDENCE_REGISTERED', relatedEntity: 'EVIDENCE', relatedId: 'ev1', description: 'Evidence EV-2026-0001 (Fingerprint Sample) registered and secured.', icon: 'evidence' },
  { id: 'te3', caseId: 'c1', timestamp: '2026-09-21T11:30:00Z', userId: 'u2', action: 'EVIDENCE_REGISTERED', relatedEntity: 'EVIDENCE', relatedId: 'ev2', description: 'Evidence EV-2026-0002 (Scene Photographs) registered.', icon: 'evidence' },
  { id: 'te4', caseId: 'c1', timestamp: '2026-09-21T12:00:00Z', userId: 'u5', action: 'EVIDENCE_TRANSFERRED', relatedEntity: 'CUSTODY', relatedId: 'ct1', description: 'Evidence EV-2026-0001 transferred to secure storage. Transfer confirmed.', icon: 'transfer' },
  { id: 'te5', caseId: 'c1', timestamp: '2026-09-25T10:00:00Z', userId: 'u2', action: 'EVIDENCE_ASSIGNED', relatedEntity: 'ASSIGNMENT', relatedId: 'as1', description: 'EV-2026-0001 assigned to Dr. Priya Rajan for fingerprint analysis.', icon: 'assign' },
  { id: 'te6', caseId: 'c1', timestamp: '2026-09-26T09:00:00Z', userId: 'u3', action: 'EXAMINATION_STARTED', relatedEntity: 'EXAMINATION', relatedId: 'ex1', description: 'Fingerprint analysis examination EX-2026-001 commenced by Dr. Priya Rajan.', icon: 'exam' },
  { id: 'te7', caseId: 'c1', timestamp: '2026-09-26T14:00:00Z', userId: 'u3', action: 'FINDINGS_SUBMITTED', relatedEntity: 'EXAMINATION', relatedId: 'ex2', description: 'Document analysis findings submitted for EX-2026-002.', icon: 'findings' },
];

export const DEMO_CREDENTIALS: Record<string, string> = {
  'admin@fcm.local': 'admin',
  'investigator@fcm.local': 'investigator',
  'expert@fcm.local': 'expert',
  'supervisor@fcm.local': 'supervisor',
  'lab@fcm.local': 'lab',
};
