import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { mockRequests } from '../data/mockData';
import StatusChip from '../components/StatusChip';

const sampleRequest = mockRequests[0];
const steps = ['Submitted', 'Under Review', 'Waiting for Documents', 'Final Decision'];

function getActiveStep(status: string) {
  if (status === 'Submitted') return 0;
  if (status === 'Under Review') return 1;
  if (status === 'Waiting for Documents') return 2;
  return 3;
}

export default function UserDashboard() {
  const location = useLocation();
  const activeStep = getActiveStep(sampleRequest.currentStatus);
  const finalStepLabel = sampleRequest.currentStatus === 'Approved' || sampleRequest.currentStatus === 'Rejected' ? sampleRequest.currentStatus : 'Final Decision';

  const sidebarItems = [
    { label: 'My Status', to: '/user', match: '/user' },
    { label: 'My Applications', to: '/applications', match: '/applications' },
    { label: 'Documents', to: '/documents', match: '/documents' },
  ];

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '260px minmax(0, 1fr)' }, alignItems: 'start' }}>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', position: { lg: 'sticky' }, top: { lg: 88 }, height: { lg: 'calc(100vh - 136px)' }, overflowY: { lg: 'auto' }, background: 'linear-gradient(180deg, rgba(88, 28, 135, 0.98) 0%, rgba(124, 58, 237, 0.96) 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="overline" sx={{ opacity: 0.75 }}>LTR Visa</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>User Panel</Typography>
          <Stack spacing={1} sx={{ mb: 3 }}>
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.match;
              return (
                <Button key={item.label} component={RouterLink} to={item.to} sx={{ justifyContent: 'flex-start', px: 1.5, py: 1, borderRadius: 2, color: 'white', bgcolor: isActive ? 'rgba(255,255,255,0.14)' : 'transparent', border: '1px solid', borderColor: isActive ? 'rgba(255,255,255,0.18)' : 'transparent', textTransform: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}>
                  {item.label}
                </Button>
              );
            })}
          </Stack>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.18)', mb: 2 }} />
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Current Status</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{sampleRequest.currentStatus}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Expected Completion</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{sampleRequest.expectedCompletionDate}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>User Dashboard</Typography>
          <Typography color="text.secondary">A compact summary of one applicant&apos;s current visa request, linked into the full application flow.</Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, alignItems: 'center' }}>
              <Box>
                <Typography variant="overline" color="text.secondary">My Visa Status</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{sampleRequest.visaType}</Typography>
                <Typography sx={{ mt: 1 }}>{sampleRequest.applicantName}</Typography>
                <Typography color="text.secondary">{sampleRequest.email}</Typography>
              </Box>
              <Box>
                <Stack spacing={1}>
                  <StatusChip status={sampleRequest.currentStatus} />
                  <Typography color="text.secondary">Expected completion: {sampleRequest.expectedCompletionDate}</Typography>
                  <Typography color="text.secondary">Assigned officer: {sampleRequest.assignedOfficer}</Typography>
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Application Progress</Typography>
            <Box sx={{ overflowX: 'auto', pb: 1 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                  <Step key={step} completed={index < activeStep}>
                    <StepLabel>{index === 3 ? finalStepLabel : step}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Document Checklist</Typography>
              <Stack spacing={1}>
                {sampleRequest.documents.map((document) => (
                  <Box key={document.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography>{document.name}</Typography>
                    <StatusChip status={document.status} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Admin Comment</Typography>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider' }}>
                <Typography>{sampleRequest.adminComment}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">Request ID: {sampleRequest.id}</Typography>
              <Typography variant="body2" color="text.secondary">Submitted Date: {sampleRequest.submittedDate}</Typography>
              <Typography variant="body2" color="text.secondary">Document Status: {sampleRequest.documentStatus}</Typography>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}

