import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import type { VisaRequest } from '../data/mockData';
import StatusChip from './StatusChip';

type RequestDetailModalProps = {
  open: boolean;
  request: VisaRequest | null;
  onClose: () => void;
};

export default function RequestDetailModal({ open, request, onClose }: RequestDetailModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Request Details</DialogTitle>
      <DialogContent dividers>
        {request ? (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {request.applicantName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Request ID: {request.id}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Applicant Info
                </Typography>
                <Typography>Email: {request.email}</Typography>
                <Typography>Nationality: {request.nationality}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Visa Info
                </Typography>
                <Typography>Visa Type: {request.visaType}</Typography>
                <Typography>Submitted: {request.submittedDate}</Typography>
                <Typography>Expected Completion: {request.expectedCompletionDate}</Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <StatusChip status={request.currentStatus} />
                <StatusChip status={request.documentStatus} />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Document Checklist
              </Typography>
              <Stack spacing={1}>
                {request.documents.map((document) => (
                  <Box
                    key={document.name}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      p: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <Typography>{document.name}</Typography>
                    <StatusChip status={document.status} />
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Admin Comment
              </Typography>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider' }}>
                <Typography>{request.adminComment}</Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Assigned Officer
              </Typography>
              <Typography>{request.assignedOfficer}</Typography>
            </Box>
          </Stack>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
