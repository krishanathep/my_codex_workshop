export type RequestStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Waiting for Documents'
  | 'Approved'
  | 'Rejected';

export type DocumentStatus = 'Complete' | 'Missing Documents' | 'Pending Review';

export type DocumentItem = {
  name: string;
  status: DocumentStatus;
};

export type VisaRequest = {
  id: string;
  applicantName: string;
  email: string;
  nationality: string;
  visaType: string;
  submittedDate: string;
  currentStatus: RequestStatus;
  documentStatus: DocumentStatus;
  assignedOfficer: string;
  expectedCompletionDate: string;
  adminComment: string;
  documents: DocumentItem[];
};

export const mockRequests: VisaRequest[] = [
  {
    id: 'LTR-1001',
    applicantName: 'Ariya Sutham',
    email: 'ariya.sutham@example.com',
    nationality: 'Singapore',
    visaType: 'Work-From-Thailand Professional',
    submittedDate: '2026-06-18',
    currentStatus: 'Under Review',
    documentStatus: 'Complete',
    assignedOfficer: 'K. Tanaka',
    expectedCompletionDate: '2026-07-08',
    adminComment: 'All core documents are in place. Awaiting final internal review.',
    documents: [
      { name: 'Passport Copy', status: 'Complete' },
      { name: 'Proof of Income', status: 'Complete' },
      { name: 'Health Insurance', status: 'Complete' },
    ],
  },
  {
    id: 'LTR-1002',
    applicantName: 'Mina Kapoor',
    email: 'mina.kapoor@example.com',
    nationality: 'India',
    visaType: 'High-Skilled Professional',
    submittedDate: '2026-06-15',
    currentStatus: 'Waiting for Documents',
    documentStatus: 'Missing Documents',
    assignedOfficer: 'S. Watanabe',
    expectedCompletionDate: '2026-07-14',
    adminComment: 'Please upload the employment verification letter and updated photo.',
    documents: [
      { name: 'Passport Copy', status: 'Complete' },
      { name: 'Employment Letter', status: 'Missing Documents' },
      { name: 'Photo', status: 'Missing Documents' },
    ],
  },
  {
    id: 'LTR-1003',
    applicantName: 'Daniel Reyes',
    email: 'daniel.reyes@example.com',
    nationality: 'Spain',
    visaType: 'Wealthy Pensioner',
    submittedDate: '2026-06-10',
    currentStatus: 'Approved',
    documentStatus: 'Complete',
    assignedOfficer: 'A. Prasert',
    expectedCompletionDate: '2026-06-30',
    adminComment: 'Approved after successful document verification and policy check.',
    documents: [
      { name: 'Passport Copy', status: 'Complete' },
      { name: 'Bank Statement', status: 'Complete' },
      { name: 'Address Proof', status: 'Complete' },
    ],
  },
  {
    id: 'LTR-1004',
    applicantName: 'Nadia Rahman',
    email: 'nadia.rahman@example.com',
    nationality: 'Bangladesh',
    visaType: 'Remote Worker',
    submittedDate: '2026-06-21',
    currentStatus: 'Submitted',
    documentStatus: 'Pending Review',
    assignedOfficer: 'P. Chaiyaporn',
    expectedCompletionDate: '2026-07-18',
    adminComment: 'New submission received. Waiting for document screening.',
    documents: [
      { name: 'Passport Copy', status: 'Pending Review' },
      { name: 'Income Evidence', status: 'Pending Review' },
      { name: 'Photo', status: 'Pending Review' },
    ],
  },
  {
    id: 'LTR-1005',
    applicantName: 'Oliver Smith',
    email: 'oliver.smith@example.com',
    nationality: 'United Kingdom',
    visaType: 'Talent Professional',
    submittedDate: '2026-06-17',
    currentStatus: 'Rejected',
    documentStatus: 'Missing Documents',
    assignedOfficer: 'N. Suriya',
    expectedCompletionDate: '2026-07-03',
    adminComment: 'Rejected due to missing proof of qualifying salary threshold.',
    documents: [
      { name: 'Passport Copy', status: 'Complete' },
      { name: 'Salary Evidence', status: 'Missing Documents' },
      { name: 'Insurance Certificate', status: 'Complete' },
    ],
  },
  {
    id: 'LTR-1006',
    applicantName: 'Chloe Martin',
    email: 'chloe.martin@example.com',
    nationality: 'France',
    visaType: 'Specialist Expert',
    submittedDate: '2026-06-24',
    currentStatus: 'Under Review',
    documentStatus: 'Pending Review',
    assignedOfficer: 'M. Kittipong',
    expectedCompletionDate: '2026-07-12',
    adminComment: 'Review started. Technical background documents are being checked.',
    documents: [
      { name: 'Passport Copy', status: 'Complete' },
      { name: 'Portfolio', status: 'Pending Review' },
      { name: 'Reference Letter', status: 'Pending Review' },
    ],
  },
];
