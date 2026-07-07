import { useMemo, useState } from 'react';
import { Box, Card, CardContent, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material';
import DashboardSidebar from '../components/DashboardSidebar';
import { useVisaRequests } from '../context/VisaRequestContext';
import type { DocumentStatus } from '../data/mockData';
import StatusChip from '../components/StatusChip';

const documentFilters: Array<'All' | DocumentStatus> = ['All', 'Complete', 'Pending Review', 'Missing Documents'];
const userSidebarItems = [
  { label: 'My Status', to: '/user', match: '/user' },
  { label: 'My Requests', to: '/applications', match: '/applications' },
  { label: 'Documents', to: '/documents', match: '/documents' },
];

export default function DocumentCenterPage() {
  const { requests } = useVisaRequests();
  const [statusFilter, setStatusFilter] = useState<'All' | DocumentStatus>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch = request.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || request.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || request.documentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '260px minmax(0, 1fr)' }, alignItems: 'start' }}>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', position: { lg: 'sticky' }, top: { lg: 88 }, height: { lg: 'calc(100vh - 136px)' }, overflowY: { lg: 'auto' }, background: 'linear-gradient(180deg, rgba(88, 28, 135, 0.98) 0%, rgba(124, 58, 237, 0.96) 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="overline" sx={{ opacity: 0.75 }}>LTR Visa</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>User Panel</Typography>
          <DashboardSidebar heading="User" accent="rgba(255,255,255,0.14)" items={userSidebarItems} />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.18)', mb: 2 }} />
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Document Tracking</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>Review file readiness</Typography>
        </CardContent>
      </Card>

      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" color="text.secondary">Documents</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Document Center</Typography>
          <Typography color="text.secondary">Track document readiness and follow-up status across all requests.</Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField label="Search request" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} fullWidth />
              <TextField select label="Document status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'All' | DocumentStatus)} sx={{ minWidth: 220 }}>
                {documentFilters.map((filter) => <MenuItem key={filter} value={filter}>{filter}</MenuItem>)}
              </TextField>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}><CardContent><Typography variant="body2" color="text.secondary">Complete</Typography><Typography variant="h4" sx={{ fontWeight: 800 }}>{requests.filter((request) => request.documentStatus === 'Complete').length}</Typography></CardContent></Card>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}><CardContent><Typography variant="body2" color="text.secondary">Pending Review</Typography><Typography variant="h4" sx={{ fontWeight: 800 }}>{requests.filter((request) => request.documentStatus === 'Pending Review').length}</Typography></CardContent></Card>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}><CardContent><Typography variant="body2" color="text.secondary">Missing Documents</Typography><Typography variant="h4" sx={{ fontWeight: 800 }}>{requests.filter((request) => request.documentStatus === 'Missing Documents').length}</Typography></CardContent></Card>
        </Box>

        <Stack spacing={2}>
          {filteredRequests.map((request) => {
            const completedCount = request.documents.filter((document) => document.status === 'Complete').length;
            return (
              <Card key={request.id} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{request.applicantName}</Typography>
                      <Typography color="text.secondary">{request.id}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>{completedCount}/{request.documents.length} documents complete</Typography>
                    </Box>
                    <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                      <StatusChip status={request.documentStatus} />
                      <Typography variant="body2" color="text.secondary">Document readiness is summarized below for quick follow-up.</Typography>
                    </Stack>
                  </Stack>
                  <Box sx={{ mt: 2, display: 'grid', gap: 1 }}>
                    {request.documents.map((document) => (
                      <Box key={document.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, p: 1.25, borderRadius: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2">{document.name}</Typography>
                        <StatusChip status={document.status} />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
          {filteredRequests.length === 0 ? <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}><CardContent><Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>No document records found</Typography><Typography color="text.secondary">Try another search term or clear the document status filter.</Typography></CardContent></Card> : null}
        </Stack>
      </Stack>
    </Box>
  );
}

