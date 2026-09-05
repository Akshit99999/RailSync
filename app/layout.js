import './globals.css';
import 'leaflet/dist/leaflet.css';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
