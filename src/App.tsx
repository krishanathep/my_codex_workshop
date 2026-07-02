import { HashRouter, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  GlobalStyles,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import { VisaRequestsProvider } from './context/VisaRequestContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#184e77',
    },
    secondary: {
      main: '#3a7ca5',
    },
    background: {
      default: '#f4f7fb',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
  },
});

function Navigation() {
  const location = useLocation();

  const navButtonSx = (path: string) => ({
    color: location.pathname === path ? 'primary.main' : 'text.primary',
    bgcolor: location.pathname === path ? 'rgba(24, 78, 119, 0.08)' : 'transparent',
    fontWeight: 700,
    textTransform: 'none' as const,
    '&:hover': {
      bgcolor: 'rgba(24, 78, 119, 0.12)',
    },
  });

  return (
    <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
          LTR Visa Request Dashboard
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button component={NavLink} to="/admin" sx={navButtonSx('/admin')}>
            Admin Dashboard
          </Button>
          <Button component={NavLink} to="/user" sx={navButtonSx('/user')}>
            User Dashboard
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            background:
              'radial-gradient(circle at top left, rgba(24, 78, 119, 0.08), transparent 28%), linear-gradient(180deg, #f8fbff 0%, #f4f7fb 100%)',
          },
        }}
      />
      <VisaRequestsProvider>
        <HashRouter>
          <Navigation />
          <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
            <Routes>
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/user" element={<UserDashboard />} />
            </Routes>
          </Container>
        </HashRouter>
      </VisaRequestsProvider>
    </ThemeProvider>
  );
}
