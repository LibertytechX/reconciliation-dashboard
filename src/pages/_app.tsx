import '@/styles/globals.css';
import '@/styles/date-picker.css';
import 'react-datepicker/dist/react-datepicker.css';

import { ClientOnly } from '@/components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { AppProps } from 'next/app';
const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: twentyFourHoursInMs,
        cacheTime: 0,
      },
    },
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: 'rgb(8, 145, 178)',
      },
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
