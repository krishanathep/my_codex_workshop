import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { mockRequests } from '../data/mockData';
import StatusChip from '../components/StatusChip';
import { useVisaRequests } from '../context/VisaRequestContext';

const sampleRequest = mockRequests[0];
const steps = ['Submitted', 'Under Review', 'Waiting for Documents', 'Final Decision'];

function getActiveStep(status: string) {
  if (status === 'Submitted') return 0;
  if (status === 'Under Review') return 1;
  if (status === 'Waiting for Documents') return 2;
  return 3;
}

export default function UserDashboard() {
  const { addRequest } = useVisaRequests();
  const activeStep = getActiveStep(sampleRequest.currentStatus);
  const finalStepLabel =
    sampleRequest.currentStatus === 'Approved' || sampleRequest.currentStatus === 'Rejected'
      ? sampleRequest.currentStatus
      : 'Final Decision';

  const [formData, setFormData] = useState({
    applicantName: sampleRequest.applicantName,
    email: sampleRequest.email,
    nationality: sampleRequest.nationality,
    visaType: sampleRequest.visaType,
    additionalInfo: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [saved, setSaved] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const sidebarItems = [
    { label: 'My Status', active: true },
    { label: 'Documents', active: false },
    { label: 'Timeline', active: false },
    { label: 'Comments', active: false },
    { label: 'Application Form', active: false },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: '1fr', lg: '260px minmax(0, 1fr)' },
        alignItems: 'start',
      }}
    >
      <Card
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          position: { lg: 'sticky' },
          top: { lg: 88 },
          height: { lg: 'calc(100vh - 176px)' },
          overflowY: { lg: 'auto' },
          background: 'linear-gradient(180deg, rgba(88, 28, 135, 0.98) 0%, rgba(124, 58, 237, 0.96) 100%)',
          color: 'white',
        }}
      >
        <CardContent>
          <Typography variant="overline" sx={{ opacity: 0.75 }}>
            LTR Visa
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
            User Panel
          </Typography>

          <Stack spacing={1} sx={{ mb: 3 }}>
            {sidebarItems.map((item) => (
              <Box
                key={item.label}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: item.active ? 'rgba(255,255,255,0.14)' : 'transparent',
                  border: '1px solid',
                  borderColor: item.active ? 'rgba(255,255,255,0.18)' : 'transparent',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.18)', mb: 2 }} />

          <Stack spacing={1.5}>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Current Status
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {sampleRequest.currentStatus}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Expected Completion
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {sampleRequest.expectedCompletionDate}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            User Dashboard
          </Typography>
          <Typography color="text.secondary">
            This view shows one applicant&apos;s visa request status using the first mock record.
          </Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="overline" color="text.secondary">
                  My Visa Status
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {sampleRequest.visaType}
                </Typography>
                <Typography sx={{ mt: 1 }}>{sampleRequest.applicantName}</Typography>
                <Typography color="text.secondary">{sampleRequest.email}</Typography>
              </Box>
              <Box>
                <Stack spacing={1}>
                  <StatusChip status={sampleRequest.currentStatus} />
                  <Typography color="text.secondary">
                    Expected completion: {sampleRequest.expectedCompletionDate}
                  </Typography>
                  <Typography color="text.secondary">Assigned officer: {sampleRequest.assignedOfficer}</Typography>
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Application Progress
            </Typography>
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

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Application Form
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Demo-only form. You can update details and pick files locally, but nothing is sent to a server.
            </Typography>

            {saved ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                {submittedId ? `Request ${submittedId} has been added and sent to Admin.` : 'Draft saved locally for this demo.'}
              </Alert>
            ) : null}

            <Box
              component="form"
              sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}
              onSubmit={(event) => {
                event.preventDefault();
                const newRequest = addRequest({
                  applicantName: formData.applicantName,
                  email: formData.email,
                  nationality: formData.nationality,
                  visaType: formData.visaType,
                  additionalInfo: formData.additionalInfo,
                  files: selectedFiles.map((file) => file.name),
                });
                setSubmittedId(newRequest.id);
                setSaved(true);
              }}
            >
              <TextField
                label="Applicant Name"
                value={formData.applicantName}
                onChange={(event) => {
                  setSaved(false);
                  setSubmittedId('');
                  setFormData((current) => ({ ...current, applicantName: event.target.value }));
                }}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(event) => {
                  setSaved(false);
                  setSubmittedId('');
                  setFormData((current) => ({ ...current, email: event.target.value }));
                }}
                fullWidth
              />
              <TextField
                label="Nationality"
                value={formData.nationality}
                onChange={(event) => {
                  setSaved(false);
                  setSubmittedId('');
                  setFormData((current) => ({ ...current, nationality: event.target.value }));
                }}
                fullWidth
              />
              <TextField
                label="Visa Type"
                value={formData.visaType}
                onChange={(event) => {
                  setSaved(false);
                  setSubmittedId('');
                  setFormData((current) => ({ ...current, visaType: event.target.value }));
                }}
                fullWidth
              />
              <TextField
                label="Additional Info"
                value={formData.additionalInfo}
                onChange={(event) => {
                  setSaved(false);
                  setSubmittedId('');
                  setFormData((current) => ({ ...current, additionalInfo: event.target.value }));
                }}
                multiline
                minRows={3}
                fullWidth
                sx={{ gridColumn: { xs: 'auto', md: '1 / -1' } }}
              />

              <Box sx={{ gridColumn: { xs: 'auto', md: '1 / -1' } }}>
                <Button variant="outlined" component="label">
                  Upload Files
                  <input
                    hidden
                    type="file"
                    multiple
                    onChange={(event) => {
                      setSaved(false);
                      setSubmittedId('');
                      setSelectedFiles(Array.from(event.target.files ?? []));
                    }}
                  />
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Accepted as demo only. Selected files stay in your browser session.
                </Typography>
              </Box>

              <Box sx={{ gridColumn: { xs: 'auto', md: '1 / -1' } }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Selected Files
                </Typography>
                <Stack spacing={1}>
                  {selectedFiles.length > 0 ? (
                    selectedFiles.map((file) => (
                      <Box
                        key={file.name}
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'grey.50',
                        }}
                      >
                        <Typography variant="body2">{file.name}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No files selected yet.
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Stack direction="row" spacing={1.5} sx={{ gridColumn: { xs: 'auto', md: '1 / -1' } }}>
                <Button type="submit" variant="contained">
                  Submit Request
                </Button>
                <Button
                  type="button"
                  variant="text"
                  onClick={() => {
                    setFormData({
                      applicantName: sampleRequest.applicantName,
                      email: sampleRequest.email,
                      nationality: sampleRequest.nationality,
                      visaType: sampleRequest.visaType,
                      additionalInfo: '',
                    });
                    setSelectedFiles([]);
                    setSaved(false);
                    setSubmittedId('');
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          }}
        >
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Document Checklist
              </Typography>
              <Stack spacing={1}>
                {sampleRequest.documents.map((document) => (
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
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Admin Comment
              </Typography>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider' }}>
                <Typography>{sampleRequest.adminComment}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Request ID: {sampleRequest.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Submitted Date: {sampleRequest.submittedDate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Document Status: {sampleRequest.documentStatus}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}
