import Chip from '@mui/material/Chip';
import type { DocumentStatus, RequestStatus } from '../data/mockData';

type StatusValue = RequestStatus | DocumentStatus;

const statusMap: Record<StatusValue, { color: 'default' | 'success' | 'warning' | 'error' | 'info'; label: string }> = {
  Submitted: { color: 'info', label: 'Submitted' },
  'Under Review': { color: 'warning', label: 'Under Review' },
  'Waiting for Documents': { color: 'warning', label: 'Waiting for Documents' },
  Approved: { color: 'success', label: 'Approved' },
  Rejected: { color: 'error', label: 'Rejected' },
  Complete: { color: 'success', label: 'Complete' },
  'Missing Documents': { color: 'error', label: 'Missing Documents' },
  'Pending Review': { color: 'info', label: 'Pending Review' },
};

type StatusChipProps = {
  status: StatusValue;
};

export default function StatusChip({ status }: StatusChipProps) {
  const config = statusMap[status];

  return <Chip size="small" label={config.label} color={config.color} sx={{ fontWeight: 600 }} />;
}
