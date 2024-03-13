import * as React from 'react';
import { Box, ThemeProvider } from '@mui/material';

export default function BoxSx({mainColor}) {
  return (
    <ThemeProvider
      theme={{
        palette: {
          primary: {
            main: `${mainColor}`,
            dark: '#0066CC',
          },
        },
      }}
    >
      <Box
        sx={{
          width: 15,
          height: 15,
          margin: 2,
          borderRadius: 1,
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      />
    </ThemeProvider>
  );
}