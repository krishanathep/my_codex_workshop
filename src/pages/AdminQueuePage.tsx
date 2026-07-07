import { useMemo } from 'react';
import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import DashboardSidebar from '../components/DashboardSidebar';
import { useVisaRequests } from '../context/VisaRequestContext';
import StatusChip from '../components/StatusChip';

const adminSidebarItems = [
  { label: 'Overview', to: '/admin', match: '/admin' },
  { label: 'Queue', to: '/admin/queue', match: '/admin/queue' },
  { label: 'Analytics', to: '/admin/analytics', match: '/admin/analytics' },
];

export default function AdminQueuePage() {
  const { requests } = useVisaRequests();
  const queue = useMemo(() => requests.filter((request) => request.currentStatus !== 'Approved').slice(0, 10), [requests]);

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '260px minmax(0, 1fr)' }, alignItems: 'start' }}>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', position: { lg: 'sticky' }, top: { lg: 88 }, height: { lg: 'calc(100vh - 136px)' }, overflowY: { lg: 'auto' }, background: 'linear-gradient(180deg, rgba(24,78,119,0.98) 0%, rgba(37,99,235,0.96) 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="overline" sx={{ opacity: 0.75 }}>LTR Visa</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Admin Panel</Typography>
          <DashboardSidebar heading="Admin" accent="rgba(255,255,255,0.14)" items={adminSidebarItems} />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.18)', mb: 2 }} />
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Operations Queue</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>Review active requests</Typography>
        </CardContent>
      </Card>

      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" color="text.secondary">Admin Operations</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Admin Queue</Typography>
          <Typography color="text.secondary">Requests that still need review, document follow-up, or assignment.</Typography>
        </Box>

        <Stack spacing={2}>
          {queue.map((request) => (
            <Card key={request.id} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{request.applicantName}</Typography>
                    <Typography color="text.secondary">{request.id}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>Assigned: {request.assignedOfficer}</Typography>
                  </Box>
                  <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                    <StatusChip status={request.currentStatus} />
                    <Typography variant="body2" color="text.secondary">Expected completion: {request.expectedCompletionDate}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

