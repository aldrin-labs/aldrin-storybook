import { createMuiTheme } from '@material-ui/core/styles';
import { blueGrey, cyan, green, red } from '@material-ui/core/colors';

const createcustomTheme = themeMode =>
  createMuiTheme({
    useNextVariants: true,
    palette: {
      type: themeMode,
      red: {
        main: red[400],
      },
      green: {
        main: green['500'],
      },
      primary: blueGrey,
      secondary: {
        ...cyan,
        main: '#4ed8da',
      },
      action: {
        selected: 'rgba(255, 255, 255, 0.05)',
      },
      background: {
        default: themeMode === 'light' ? '#fafafa' : '#303030',
        paper: themeMode === 'light' ? '#fff' : '#393e44',
      },
    },
  });

export const customThemes = {
  light: createcustomTheme('light'),
  dark: createcustomTheme('dark'),
};
