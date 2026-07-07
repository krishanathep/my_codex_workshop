import { Button, Stack } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

type SidebarItem = {
  label: string;
  to: string;
  match: string;
};

type DashboardSidebarProps = {
  heading: string;
  accent: string;
  items: SidebarItem[];
};

export default function DashboardSidebar({ heading, accent, items }: DashboardSidebarProps) {
  const location = useLocation();

  return (
    <Stack spacing={1} sx={{ mb: 3 }}>
      {items.map((item) => {
        const isActive = item.match.endsWith('/')
          ? location.pathname.startsWith(item.match)
          : location.pathname === item.match;

        return (
          <Button
            key={item.label}
            component={RouterLink}
            to={item.to}
            sx={{
              justifyContent: 'flex-start',
              px: 1.5,
              py: 1,
              borderRadius: 2,
              color: 'white',
              bgcolor: isActive ? accent : 'transparent',
              border: '1px solid',
              borderColor: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );
}
