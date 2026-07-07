import { Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import StatusChip from '../components/StatusChip';
import { useVisaRequests } from '../context/VisaRequestContext';

const adminSidebarItems = [
  { label: 'Overview', to: '/admin', match: '/admin' },
  { label: 'Queue', to: '/admin/queue', match: '/admin/queue' },
  { label: 'Analytics', to: '/admin/analytics', match: '/admin/analytics' },
  { label: 'Request Detail', to: '/requests/LTR-1001', match: '/requests/' },
];

export default function RequestDetailPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { requests } = useVisaRequests();
  const request = requests.find((item) => item.id === requestId);

  if (!request) {
    return (
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Request not found</Typography>
              <Typography color="text.secondary">The request you tried to open does not exist or has been removed from the current demo data.</Typography>
            </Box>
            <Button variant="contained" onClick={() => navigate('/admin')}>Back to Admin Dashboard</Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '260px minmax(0, 1fr)' }, alignItems: 'start' }}>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', position: { lg: 'sticky' }, top: { lg: 88 }, height: { lg: 'calc(100vh - 136px)' }, overflowY: { lg: 'auto' }, background: 'linear-gradient(180deg, rgba(24,78,119,0.98) 0%, rgba(37,99,235,0.96) 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="overline" sx={{ opacity: 0.75 }}>LTR Visa</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Admin Panel</Typography>
          <DashboardSidebar heading="Admin" accent="rgba(255,255,255,0.14)" items={adminSidebarItems} />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.18)', mb: 2 }} />
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Case Review</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>{request.id}</Typography>
        </CardContent>
      </Card>

      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" color="text.secondary">Request Detail</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{request.applicantName}</Typography>
          <Typography color="text.secondary">Request ID: {request.id}</Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
              <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">Visa Type</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{request.visaType}</Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">Current Status</Typography>
                <StatusChip status={request.currentStatus} />
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">Document Status</Typography>
                <StatusChip status={request.documentStatus} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}><CardContent><Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Applicant Info</Typography><Stack spacing={1}><Typography>Email: {request.email}</Typography><Typography>Nationality: {request.nationality}</Typography><Typography>Submitted: {request.submittedDate}</Typography></Stack></CardContent></Card>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}><CardContent><Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Processing Info</Typography><Stack spacing={1}><Typography>Assigned Officer: {request.assignedOfficer}</Typography><Typography>Expected Completion: {request.expectedCompletionDate}</Typography></Stack></CardContent></Card>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Document Checklist</Typography>
            <Stack spacing={1}>
              {request.documents.map((document) => <Box key={document.name} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}><Typography>{document.name}</Typography><StatusChip status={document.status} /></Box>)}
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Admin Comment</Typography>
            <Typography>{request.adminComment}</Typography>
            <Divider sx={{ my: 2 }} />
            <Button variant="outlined" onClick={() => navigate('/admin')}>Back to Admin Dashboard</Button>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}


