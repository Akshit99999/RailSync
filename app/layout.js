import './globals.css';
import 'leaflet/dist/leaflet.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  title: 'RailSync — Indian Railways Live Tracker & PNR Status',
  description: 'Live train running status, physical permanent way track view, and coach reservation chart status for Indian Railways.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const urlTheme = new URLSearchParams(window.location.search).get('theme');
                  const stored = (urlTheme === 'light' || urlTheme === 'dark') ? urlTheme : localStorage.getItem('railsync_theme');
                  if (stored === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.style.colorScheme = 'light';
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.style.colorScheme = 'dark';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
