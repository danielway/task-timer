import { AppBar, Toolbar, Typography } from '@mui/material';
import { DatePicker } from './DatePicker';

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          py: { xs: 1, sm: 0 },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            mb: { xs: 1, sm: 0 },
          }}
        >
          Task Timer
        </Typography>
        <DatePicker />
      </Toolbar>
    </AppBar>
  );
};
