import { useMemo } from 'react';
import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import DashboardSidebar from '../components/DashboardSidebar';
import { useVisaRequests } from '../context/VisaRequestContext';
import type { DocumentStatus, RequestStatus } from '../data/mockData';

const adminSidebarItems = [
  { label: 'Overview', to: '/admin', match: '/admin' },
  { label: 'Queue', to: '/admin/queue', match: '/admin/queue' },
  { label: 'Analytics', to: '/admin/analytics', match: '/admin/analytics' },
];

const statusColors: Record<RequestStatus, string> = {
  Submitted: '#4f46e5',
  'Under Review': '#8b5cf6',
  'Waiting for Documents': '#f97316',
  Approved: '#16a34a',
  Rejected: '#dc2626',
};

const documentColors: Record<DocumentStatus, string> = {
  Complete: '#16a34a',
  'Pending Review': '#8b5cf6',
  'Missing Documents': '#f97316',
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}><CardContent><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h4" sx={{ fontWeight: 800 }}>{value}</Typography></CardContent></Card>;
}

function HorizontalMetricList({ items }: { items: Array<{ label: string; value: number; color: string }> }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  return (
    <Stack spacing={1.75} sx={{ mt: 2 }}>
      {items.map((item) => (
        <Box key={item.label}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.label}</Typography>
            <Typography variant="body2" color="text.secondary">{item.value}</Typography>
          </Stack>
          <Box sx={{ height: 16, bgcolor: 'rgba(148, 163, 184, 0.18)', overflow: 'hidden' }}>
            <Box sx={{ width: `${(item.value / maxValue) * 100}%`, height: '100%', bgcolor: item.color }} />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

export default function AdminAnalyticsPage() {
  const { requests } = useVisaRequests();
  const stats = useMemo(() => {
    const total = requests.length;
    const approved = requests.filter((request) => request.currentStatus === 'Approved').length;
    const pending = requests.filter((request) => request.currentStatus === 'Under Review' || request.currentStatus === 'Waiting for Documents').length;
    const missingDocs = requests.filter((request) => request.documentStatus === 'Missing Documents').length;

    const statusBreakdown: Array<{ label: string; value: number; color: string }> = [
      { label: 'Submitted', value: requests.filter((request) => request.currentStatus === 'Submitted').length, color: statusColors.Submitted },
      { label: 'Review', value: requests.filter((request) => request.currentStatus === 'Under Review').length, color: statusColors['Under Review'] },
      { label: 'Waiting', value: requests.filter((request) => request.currentStatus === 'Waiting for Documents').length, color: statusColors['Waiting for Documents'] },
      { label: 'Approved', value: approved, color: statusColors.Approved },
      { label: 'Rejected', value: requests.filter((request) => request.currentStatus === 'Rejected').length, color: statusColors.Rejected },
    ];

    const documentHealth: Array<{ label: string; value: number; color: string }> = [
      { label: 'Complete', value: requests.filter((request) => request.documentStatus === 'Complete').length, color: documentColors.Complete },
      { label: 'Pending Review', value: requests.filter((request) => request.documentStatus === 'Pending Review').length, color: documentColors['Pending Review'] },
      { label: 'Missing Documents', value: missingDocs, color: documentColors['Missing Documents'] },
    ];

    const officerWorkload = Object.entries(
      requests.reduce<Record<string, number>>((acc, request) => {
        acc[request.assignedOfficer] = (acc[request.assignedOfficer] ?? 0) + 1;
        return acc;
      }, {}),
    )
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const upcomingDeadlines = [...requests]
      .sort((a, b) => new Date(a.expectedCompletionDate).getTime() - new Date(b.expectedCompletionDate).getTime())
      .slice(0, 5);

    return {
      total,
      approvedRate: total === 0 ? 0 : Math.round((approved / total) * 100),
      pending,
      missingDocs,
      statusBreakdown,
      documentHealth,
      officerWorkload,
      upcomingDeadlines,
    };
  }, [requests]);

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '260px minmax(0, 1fr)' }, alignItems: 'start' }}>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', position: { lg: 'sticky' }, top: { lg: 88 }, height: { lg: 'calc(100vh - 136px)' }, overflowY: { lg: 'auto' }, background: 'linear-gradient(180deg, rgba(24,78,119,0.98) 0%, rgba(37,99,235,0.96) 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="overline" sx={{ opacity: 0.75 }}>LTR Visa</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Admin Panel</Typography>
          <DashboardSidebar heading="Admin" accent="rgba(255,255,255,0.14)" items={adminSidebarItems} />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.18)', mb: 2 }} />
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Reporting</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>Track request health</Typography>
        </CardContent>
      </Card>

      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" color="text.secondary">Reporting</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Admin Analytics</Typography>
          <Typography color="text.secondary">A quick, data-driven view of request health, document quality, workload balance, and upcoming deadlines.</Typography>
        </Box>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' } }}>
          <MetricCard label="Total Requests" value={stats.total} />
          <MetricCard label="Approval Rate" value={`${stats.approvedRate}%`} />
          <MetricCard label="Pending Review" value={stats.pending} />
          <MetricCard label="Missing Documents" value={stats.missingDocs} />
        </Box>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' } }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Status Breakdown</Typography>
              <Typography variant="body2" color="text.secondary">Shows where the current request volume is sitting in the workflow.</Typography>
              <HorizontalMetricList items={stats.statusBreakdown} />
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Document Health</Typography>
              <Typography variant="body2" color="text.secondary">Highlights whether document readiness is clean, waiting for review, or still incomplete.</Typography>
              <HorizontalMetricList items={stats.documentHealth} />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', xl: '1.05fr 1.35fr' } }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Officer Workload</Typography>
              <Typography variant="body2" color="text.secondary">Shows how many requests are currently assigned to each officer.</Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {stats.officerWorkload.map((officer) => (
                  <Box key={officer.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid', borderColor: 'divider' }}>
                    <Typography sx={{ fontWeight: 700 }}>{officer.name}</Typography>
                    <Typography color="text.secondary">{officer.count} requests</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Upcoming Deadlines</Typography>
              <Typography variant="body2" color="text.secondary">Brings the nearest expected completion dates to the top for faster follow-up.</Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {stats.upcomingDeadlines.map((request) => (
                  <Box key={request.id} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{request.applicantName}</Typography>
                        <Typography variant="body2" color="text.secondary">{request.id} • {request.visaType}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">Due {request.expectedCompletionDate}</Typography>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
                      <Typography variant="body2">Officer: {request.assignedOfficer}</Typography>
                      <Typography variant="body2">Status: {request.currentStatus === 'Under Review' ? 'Review' : request.currentStatus}</Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}

