import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { mockRequests, type DocumentStatus, type VisaRequest } from '../data/mockData';

export type CreateVisaRequestInput = {
  applicantName: string;
  email: string;
  nationality: string;
  visaType: string;
  additionalInfo: string;
  files: string[];
};

type VisaRequestContextValue = {
  requests: VisaRequest[];
  addRequest: (input: CreateVisaRequestInput) => VisaRequest;
};

const STORAGE_KEY = 'ltr-visa-dashboard-requests-v1';
const VisaRequestContext = createContext<VisaRequestContextValue | undefined>(undefined);

function getNextRequestId(existingRequests: VisaRequest[]) {
  const maxNumber = existingRequests.reduce((max, request) => {
    const numericPart = Number.parseInt(request.id.replace(/\D/g, ''), 10);
    return Number.isFinite(numericPart) && numericPart > max ? numericPart : max;
  }, 1000);

  return `LTR-${maxNumber + 1}`;
}

function buildInitialRequests() {
  if (typeof window === 'undefined') {
    return mockRequests;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return mockRequests;
  }

  try {
    const parsed = JSON.parse(raw) as VisaRequest[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockRequests;
  } catch {
    return mockRequests;
  }
}

export function VisaRequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<VisaRequest[]>(buildInitialRequests);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  const value = useMemo<VisaRequestContextValue>(() => {
    return {
      requests,
      addRequest: (input) => {
        const id = getNextRequestId(requests);
        const submittedDate = new Date().toISOString().slice(0, 10);
        const documentStatus: DocumentStatus = input.files.length > 0 ? 'Pending Review' : 'Missing Documents';
        const documents =
          input.files.length > 0
            ? input.files.map((fileName) => ({ name: fileName, status: 'Pending Review' as DocumentStatus }))
            : [{ name: 'Supporting Document', status: 'Missing Documents' as DocumentStatus }];

        const newRequest: VisaRequest = {
          id,
          applicantName: input.applicantName,
          email: input.email,
          nationality: input.nationality,
          visaType: input.visaType,
          submittedDate,
          currentStatus: 'Submitted',
          documentStatus,
          assignedOfficer: 'Pending Assignment',
          expectedCompletionDate: 'TBD',
          adminComment:
            input.additionalInfo.trim() ||
            'New submission received from the user portal and is waiting for admin review.',
          documents,
        };

        setRequests((current) => [newRequest, ...current]);
        return newRequest;
      },
    };
  }, [requests]);

  return <VisaRequestContext.Provider value={value}>{children}</VisaRequestContext.Provider>;
}

export function useVisaRequests() {
  const context = useContext(VisaRequestContext);
  if (!context) {
    throw new Error('useVisaRequests must be used within VisaRequestsProvider');
  }

  return context;
}
