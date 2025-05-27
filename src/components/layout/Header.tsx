import { AppBar, Box, Toolbar, Typography, styled } from '@mui/material';
import { DatePicker } from './DatePicker';

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <AppTitle variant="h5">Task Timer</AppTitle>
        <DatePickerBox>
          <DatePicker />
        </DatePickerBox>
      </Toolbar>
    </AppBar>
  );
};

const AppTitle = styled(Typography)(() => ({
  flexGrow: 1,
  fontWeight: 'bold',
}));

const DatePickerBox = styled(Box)`
  ${(props) => props.theme.breakpoints.up('xs')} {
    display: none;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    display: block;
  }
`;
