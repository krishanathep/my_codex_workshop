import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { useVisaRequests } from '../context/VisaRequestContext';
import type { RequestStatus } from '../data/mockData';
import StatusChip from '../components/StatusChip';

const statusOptions: Array<'All' | RequestStatus> = ['All', 'Submitted', 'Under Review', 'Waiting for Documents', 'Approved', 'Rejected'];
const userSidebarItems = [
  { label: 'My Status', to: '/user', match: '/user' },
  { label: 'My Applications', to: '/applications', match: '/applications' },
  { label: 'Documents', to: '/documents', match: '/documents' },
];

type FormState = {
  applicantName: string;
  email: string;
  nationality: string;
  visaType: string;
  additionalInfo: string;
};

const emptyForm: FormState = {
  applicantName: '',
  email: '',
  nationality: '',
  visaType: '',
  additionalInfo: '',
};

export default function MyApplicationsPage() {
  const { requests, addRequest } = useVisaRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RequestStatus>('All');
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submittedId, setSubmittedId] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.visaType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || request.currentStatus === statusFilter;
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
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Application Workspace</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>Create and track requests</Typography>
        </CardContent>
      </Card>

      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" color="text.secondary">Applicant Workspace</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>My Requests</Typography>
          <Typography color="text.secondary">Submit a new request and review the full request history in the current demo dataset.</Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>New Request</Typography>
            {formError ? <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert> : null}
            {isSubmitted ? <Alert severity="success" sx={{ mb: 2 }}>{submittedId ? `Request ${submittedId} has been submitted and sent to Admin.` : 'Request submitted successfully.'}</Alert> : null}
            <Box component="form" sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }} onSubmit={(event) => {
              event.preventDefault();
              const requiredFields = [formData.applicantName, formData.email, formData.nationality, formData.visaType];
              if (requiredFields.some((value) => value.trim() === '')) {
                setFormError('Please fill in applicant name, email, nationality, and visa type before submitting.');
                setIsSubmitted(false);
                return;
              }
              const newRequest = addRequest({ applicantName: formData.applicantName.trim(), email: formData.email.trim(), nationality: formData.nationality.trim(), visaType: formData.visaType.trim(), additionalInfo: formData.additionalInfo.trim(), files: selectedFiles.map((file) => file.name) });
              setSubmittedId(newRequest.id);
              setFormError('');
              setIsSubmitted(true);
              setFormData(emptyForm);
              setSelectedFiles([]);
            }}>
              <TextField label="Applicant Name" value={formData.applicantName} onChange={(event) => setFormData((current) => ({ ...current, applicantName: event.target.value }))} fullWidth />
              <TextField label="Email" type="email" value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} fullWidth />
              <TextField label="Nationality" value={formData.nationality} onChange={(event) => setFormData((current) => ({ ...current, nationality: event.target.value }))} fullWidth />
              <TextField label="Visa Type" value={formData.visaType} onChange={(event) => setFormData((current) => ({ ...current, visaType: event.target.value }))} fullWidth />
              <TextField label="Additional Info" value={formData.additionalInfo} onChange={(event) => setFormData((current) => ({ ...current, additionalInfo: event.target.value }))} multiline minRows={3} fullWidth sx={{ gridColumn: { xs: 'auto', md: '1 / -1' } }} />
              <Box sx={{ gridColumn: { xs: 'auto', md: '1 / -1' } }}>
                <Button variant="outlined" component="label">Upload Files<input hidden type="file" multiple onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))} /></Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Accepted as demo only. Selected files stay in your browser session.</Typography>
              </Box>
              <Stack direction="row" spacing={1.5} sx={{ gridColumn: { xs: 'auto', md: '1 / -1' } }}>
                <Button type="submit" variant="contained">Submit Request</Button>
                <Button type="button" variant="text" onClick={() => { setFormData(emptyForm); setSelectedFiles([]); setSubmittedId(''); setFormError(''); setIsSubmitted(false); }}>Reset</Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField label="Search requests" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} fullWidth />
              <TextField select label="Filter status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'All' | RequestStatus)} sx={{ minWidth: 220 }}>
                {statusOptions.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
              </TextField>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          {filteredRequests.map((request) => (
            <Card key={request.id} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{request.visaType}</Typography>
                    <Typography color="text.secondary">{request.id}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>Submitted on {request.submittedDate}</Typography>
                  </Box>
                  <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                    <StatusChip status={request.currentStatus} />
                    <Typography variant="body2" color="text.secondary">Expected completion: {request.expectedCompletionDate}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
          {filteredRequests.length === 0 ? (
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}><CardContent><Stack spacing={2} alignItems="flex-start"><Typography variant="h6" sx={{ fontWeight: 700 }}>No requests found</Typography><Typography color="text.secondary">Try a different search term or clear the status filter.</Typography><Button component={RouterLink} to="/user" variant="contained">Back to User Dashboard</Button></Stack></CardContent></Card>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}

