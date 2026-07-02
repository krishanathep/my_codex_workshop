import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import type { RequestStatus, VisaRequest } from '../data/mockData';
import StatusChip from '../components/StatusChip';
import RequestDetailModal from '../components/RequestDetailModal';
import { useVisaRequests } from '../context/VisaRequestContext';

const summaryStatuses: RequestStatus[] = ['Submitted', 'Under Review', 'Waiting for Documents', 'Approved', 'Rejected'];

const statusVisuals: Record<RequestStatus, { color: string; soft: string; label: string }> = {
  Submitted: { color: '#4f46e5', soft: 'rgba(79, 70, 229, 0.12)', label: 'Submitted' },
  'Under Review': { color: '#a855f7', soft: 'rgba(168, 85, 247, 0.12)', label: 'Under Review' },
  'Waiting for Documents': { color: '#c084fc', soft: 'rgba(192, 132, 252, 0.16)', label: 'Waiting' },
  Approved: { color: '#16a34a', soft: 'rgba(22, 163, 74, 0.12)', label: 'Approved' },
  Rejected: { color: '#dc2626', soft: 'rgba(220, 38, 38, 0.12)', label: 'Rejected' },
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function SmallChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        background: 'background.paper',
        height: '100%',
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
        <Box sx={{ mt: 2 }}>{children}</Box>
      </CardContent>
    </Card>
  );
}

function MiniDonut({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 132,
          height: 132,
          borderRadius: '50%',
          background: `conic-gradient(${color} 0 ${value}%, rgba(148, 163, 184, 0.18) ${value}% 100%)`,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Box
          sx={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            bgcolor: 'background.paper',
            display: 'grid',
            placeItems: 'center',
            boxShadow: 'inset 0 0 0 1px rgba(148,163,184,0.18)',
          }}
        >
          <Stack alignItems="center" spacing={0.25}>
            <Typography variant="h5" sx={{ fontWeight: 800, color }}>
              {value}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

function HorizontalBars({
  items,
}: {
  items: Array<{ label: string; value: number; color: string }>;
}) {
  return (
    <Stack spacing={1.4}>
      {items.map((item) => (
        <Box key={item.label}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.6 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {item.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.value}
            </Typography>
          </Stack>
          <Box sx={{ height: 12, borderRadius: 999, bgcolor: 'rgba(148, 163, 184, 0.18)', overflow: 'hidden' }}>
            <Box sx={{ width: `${item.value}%`, height: '100%', borderRadius: 999, bgcolor: item.color }} />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

function VerticalBars({
  items,
}: {
  items: Array<{ label: string; value: number; color: string }>;
}) {
  return (
    <Box
      sx={{
        height: 180,
        display: 'grid',
        gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        alignItems: 'end',
        gap: 1.25,
      }}
    >
      {items.map((item) => (
        <Stack key={item.label} alignItems="center" spacing={1} sx={{ height: '100%' }}>
          <Box sx={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <Box
              sx={{
                width: '100%',
                height: `${item.value}%`,
                minHeight: 16,
                borderRadius: 2,
                background: item.color,
                boxShadow: 'none',
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}

function BubbleMap({
  points,
}: {
  points: Array<{ x: string; y: string; size: number; label: string }>;
}) {
  return (
    <Box
      sx={{
        height: 180,
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 20% 20%, rgba(168,85,247,0.08), transparent 28%), radial-gradient(circle at 85% 25%, rgba(79,70,229,0.08), transparent 26%), linear-gradient(180deg, rgba(249,250,251,0.9), rgba(255,255,255,0.95))',
        border: '1px solid',
        borderColor: 'rgba(148,163,184,0.18)',
      }}
    >
      {points.map((point, index) => {
        const left = `${15 + index * 17}%`;
        const top = `${20 + ((index * 13) % 55)}%`;
        return (
          <Box
            key={point.label}
            sx={{
              position: 'absolute',
              left,
              top,
              transform: 'translate(-50%, -50%)',
              width: point.size,
              height: point.size,
              borderRadius: '50%',
              bgcolor: 'rgba(168, 85, 247, 0.65)',
              boxShadow: '0 0 0 8px rgba(148, 163, 184, 0.12)',
              display: 'grid',
              placeItems: 'center',
              color: 'white',
              fontSize: 11,
              fontWeight: 800,
              textAlign: 'center',
              px: 0.5,
            }}
          >
            {point.label}
          </Box>
        );
      })}
    </Box>
  );
}

export default function AdminDashboard() {
  const { requests } = useVisaRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RequestStatus>('All');
  const [selectedRequest, setSelectedRequest] = useState<VisaRequest | null>(null);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesName = request.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || request.currentStatus === statusFilter;
      return matchesName && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  const counts = useMemo(() => {
    return requests.reduce(
      (acc, request) => {
        acc.total += 1;
        acc[request.currentStatus] += 1;
        return acc;
      },
      {
        total: 0,
        Submitted: 0,
        'Under Review': 0,
        'Waiting for Documents': 0,
        Approved: 0,
        Rejected: 0,
      } as Record<'total' | RequestStatus, number>,
    );
  }, [requests]);

  const approvedRate = Math.round((counts.Approved / counts.total) * 100);
  const reviewRate = Math.round((counts['Under Review'] / counts.total) * 100);
  const waitingRate = Math.round((counts['Waiting for Documents'] / counts.total) * 100);
  const rejectedRate = Math.round((counts.Rejected / counts.total) * 100);

  const sidebarItems = [
    { label: 'Overview', active: true },
    { label: 'Requests', active: false },
    { label: 'Documents', active: false },
    { label: 'Approvals', active: false },
    { label: 'Reports', active: false },
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
          background:
            'linear-gradient(180deg, rgba(24,78,119,0.98) 0%, rgba(37,99,235,0.96) 100%)',
          color: 'white',
        }}
      >
        <CardContent>
          <Typography variant="overline" sx={{ opacity: 0.75 }}>
            LTR Visa
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
            Admin Panel
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
                Total Requests
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {counts.total}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Pending Review
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {counts['Under Review'] + counts['Waiting for Documents']}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography color="text.secondary">
            Track all LTR visa requests, review document readiness, and open each request for details.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
            },
          }}
        >
          <StatCard label="Total Requests" value={counts.total} />
          <StatCard label="Under Review" value={counts['Under Review']} />
          <StatCard label="Approved" value={counts.Approved} />
          <StatCard label="Rejected" value={counts.Rejected} />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, minmax(0, 1fr))',
              xl: 'repeat(3, minmax(0, 1fr))',
            },
          }}
        >
          <SmallChartCard title="Status Distribution" subtitle="Donut chart">
            <MiniDonut value={approvedRate} color={statusVisuals.Approved.color} label="Approved" />
          </SmallChartCard>

          <SmallChartCard title="Review Mix" subtitle="Horizontal bars">
            <HorizontalBars
              items={[
                { label: 'Under Review', value: reviewRate, color: statusVisuals['Under Review'].color },
                { label: 'Waiting', value: waitingRate, color: statusVisuals['Waiting for Documents'].color },
                { label: 'Rejected', value: rejectedRate, color: statusVisuals.Rejected.color },
              ]}
            />
          </SmallChartCard>

          <SmallChartCard title="Status Trends" subtitle="Vertical bars">
            <VerticalBars
              items={summaryStatuses.map((status) => ({
                label: statusVisuals[status].label,
                value: counts.total === 0 ? 0 : Math.max(16, Math.round((counts[status] / counts.total) * 100)),
                color: statusVisuals[status].color,
              }))}
            />
          </SmallChartCard>

          <SmallChartCard title="Request Activity" subtitle="Monthly-style bars">
            <VerticalBars
              items={[
                { label: 'W1', value: 42, color: '#8b5cf6' },
                { label: 'W2', value: 63, color: '#a855f7' },
                { label: 'W3', value: 52, color: '#c084fc' },
                { label: 'W4', value: 74, color: '#7c3aed' },
                { label: 'W5', value: 58, color: '#9333ea' },
              ]}
            />
          </SmallChartCard>

          <SmallChartCard title="Completed vs Pending" subtitle="Stacked feel">
            <Stack spacing={1.5}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.6 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Completed
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {counts.Approved}
                  </Typography>
                </Stack>
                <Box sx={{ height: 12, borderRadius: 999, bgcolor: 'rgba(148, 163, 184, 0.18)' }}>
                  <Box sx={{ width: `${approvedRate}%`, height: '100%', borderRadius: 999, bgcolor: '#16a34a' }} />
                </Box>
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.6 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Pending
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {counts['Under Review'] + counts['Waiting for Documents']}
                  </Typography>
                </Stack>
                <Box sx={{ height: 12, borderRadius: 999, bgcolor: 'rgba(148, 163, 184, 0.18)' }}>
                  <Box
                    sx={{
                      width: `${Math.min(100, reviewRate + waitingRate)}%`,
                      height: '100%',
                      borderRadius: 999,
                      bgcolor: '#a855f7',
                    }}
                  />
                </Box>
              </Box>
            </Stack>
          </SmallChartCard>

          <SmallChartCard title="Map Style View" subtitle="Bubble layout">
            <BubbleMap
              points={[
                { label: 'A', size: 34, x: '15%', y: '20%' },
                { label: 'B', size: 48, x: '30%', y: '55%' },
                { label: 'C', size: 40, x: '58%', y: '28%' },
                { label: 'D', size: 58, x: '78%', y: '62%' },
              ]}
            />
          </SmallChartCard>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Stack
              spacing={2}
              direction={{ xs: 'column', md: 'row' }}
              alignItems={{ xs: 'stretch', md: 'center' }}
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Visa Requests
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Search by applicant"
                  size="small"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <TextField
                  select
                  label="Filter status"
                  size="small"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as 'All' | RequestStatus)}
                  sx={{ minWidth: 220 }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {summaryStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Request ID</TableCell>
                    <TableCell>Applicant Name</TableCell>
                    <TableCell>Visa Type</TableCell>
                    <TableCell>Submitted Date</TableCell>
                    <TableCell>Current Status</TableCell>
                    <TableCell>Document Status</TableCell>
                    <TableCell>Assigned Officer</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id} hover>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.applicantName}</TableCell>
                      <TableCell>{request.visaType}</TableCell>
                      <TableCell>{request.submittedDate}</TableCell>
                      <TableCell>
                        <StatusChip status={request.currentStatus} />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={request.documentStatus} />
                      </TableCell>
                      <TableCell>{request.assignedOfficer}</TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" onClick={() => setSelectedRequest(request)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No requests match your search or filter.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>

      <RequestDetailModal
        open={selectedRequest !== null}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </Box>
  );
}
