'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';

export default function TrackMap({ trainData }) {
  const { theme } = useTheme();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const trainMarkerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let L;
    let isMounted = true;

    const initMap = async () => {
      L = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default center: Central India / Route midpoint
      const defaultCenter = trainData?.coordinates
        ? [trainData.coordinates.lat, trainData.coordinates.lng]
        : [23.5, 78.0];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      const isDark = theme === 'dark';

      tileLayerRef.current = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors • Indian Railways Telemetry',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;

      // Plot route stations and polyline
      if (trainData?.route && trainData.route.length > 0) {
        const latLngs = [];
        markersRef.current = [];

        trainData.route.forEach((stn) => {
          if (stn.lat && stn.lng) {
            const point = [stn.lat, stn.lng];
            latLngs.push(point);

            const isCurrent = trainData.lastReportedStation === stn.code;
            const isNext = trainData.nextStation === stn.code;

            // Station Marker HTML
            const stationIcon = L.divIcon({
              className: 'custom-station-icon',
              html: `
                <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
                  <div style="
                    width: ${isCurrent ? '18px' : isNext ? '14px' : '10px'};
                    height: ${isCurrent ? '18px' : isNext ? '14px' : '10px'};
                    border-radius: 50%;
                    background: ${isCurrent ? '#ffd200' : isNext ? '#0284c7' : (stn.status === 'departed' ? '#10b981' : (isDark ? '#52525b' : '#94a3b8'))};
                    border: 2px solid ${isDark ? '#000000' : '#ffffff'};
                    box-shadow: 0 0 ${isCurrent ? '14px #ffd200' : isNext ? '10px #0284c7' : '4px rgba(0,0,0,0.4)'};
                  "></div>
                  <div style="
                    margin-top: 3px;
                    background: ${isDark ? '#09090b' : '#ffffff'};
                    border: 1px solid ${isCurrent ? '#ffd200' : isNext ? '#0284c7' : (isDark ? '#27272a' : '#cbd5e1')};
                    color: ${isCurrent ? (isDark ? '#ffd200' : '#854d0e') : isNext ? '#0284c7' : (isDark ? '#f4f4f5' : '#0f172a')};
                    font-family: monospace;
                    font-weight: 800;
                    font-size: 10px;
                    padding: 1px 5px;
                    border-radius: 3px;
                    white-space: nowrap;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                  ">
                    ${stn.code}
                  </div>
                </div>
              `,
              iconSize: [44, 32],
              iconAnchor: [22, 9]
            });

            const marker = L.marker(point, { icon: stationIcon }).addTo(map);
            marker.bindPopup(`
              <div style="font-family: system-ui, sans-serif; font-size: 12px; color: ${isDark ? '#f4f4f5' : '#0f172a'}; min-width: 200px;">
                <div style="font-weight: 800; font-size: 13px; color: ${isDark ? '#ffd200' : '#854d0e'}; border-bottom: 1px solid ${isDark ? '#27272a' : '#e2e8f0'}; padding-bottom: 4px; margin-bottom: 4px;">
                  ${stn.name} (${stn.code})
                </div>
                <div>Platform: <strong style="color: ${isDark ? '#ffd200' : '#b45309'};">${stn.platform || 'TBD'}</strong> ${stn.halt ? `• Halt: <strong style="color: #0284c7;">${stn.halt}</strong>` : ''}</div>
                <div>Sch Arr: <strong>${stn.scheduledArrival}</strong> | Sch Dep: <strong>${stn.scheduledDeparture}</strong></div>
                <div>Status: <span style="color: ${stn.status === 'departed' ? '#10b981' : '#f59e0b'}; font-weight: bold; text-transform: uppercase;">${stn.status}</span></div>
                ${stn.delay > 0 ? `<div style="color: #f59e0b; font-weight: bold; margin-top: 2px;">Delay: +${stn.delay} mins</div>` : '<div style="color: #10b981; font-weight: bold;">Right Time (RT)</div>'}
              </div>
            `);
            markersRef.current.push(marker);
          }
        });

        // Add track polyline
        if (latLngs.length > 1) {
          polylineRef.current = L.polyline(latLngs, {
            color: isDark ? '#ffd200' : '#d97706',
            weight: 3.5,
            opacity: 0.9,
            dashArray: '8, 6',
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);

          map.fitBounds(latLngs, { padding: [40, 40] });
        }
      }

      // Add Glowing Active Locomotive Marker with Directional Bearing
      if (trainData?.coordinates) {
        const trainPos = [trainData.coordinates.lat, trainData.coordinates.lng];
        const bearing = trainData.bearing || 180;
        
        const locomotiveIcon = L.divIcon({
          className: 'custom-loco-icon',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <!-- Radar Ping Effect -->
              <div style="
                position: absolute;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: ${isDark ? 'rgba(255, 210, 0, 0.25)' : 'rgba(234, 179, 8, 0.25)'};
                border: 1.5px solid #ffd200;
                animation: signalPulse 2s infinite ease-in-out;
              "></div>
              <!-- Engine Cabin Badge with Directional Compass -->
              <div style="
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: #ffd200;
                color: #000000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 15px;
                box-shadow: 0 0 16px rgba(255, 210, 0, 0.9), inset 0 0 4px #fff;
                border: 2.5px solid ${isDark ? '#000000' : '#ffffff'};
                z-index: 10;
                transform: rotate(${bearing - 90}deg);
                transition: transform 0.5s ease;
              ">
                🚂
              </div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        trainMarkerRef.current = L.marker(trainPos, { icon: locomotiveIcon, zIndexOffset: 1000 }).addTo(map);
        trainMarkerRef.current.bindPopup(`
          <div style="font-family: system-ui, sans-serif; font-size: 12px; color: ${isDark ? '#f4f4f5' : '#0f172a'}; min-width: 200px;">
            <div style="font-weight: bold; color: ${isDark ? '#ffd200' : '#854d0e'}; font-size: 13px;">${trainData.trainName}</div>
            <div style="margin-top: 4px; font-weight: 600;">Speed: <span style="color: #10b981;">${trainData.speed || '112 km/h'}</span></div>
            <div>Bearing: <span style="color: #0284c7;">${bearing}° heading</span></div>
            <div style="margin-top: 2px;">Status: <span>${trainData.currentStatus}</span></div>
          </div>
        `);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [trainData, theme]);

  return (
    <div className="relative w-full h-[400px] lg:h-[540px] rounded-lg overflow-hidden border-2 border-slate-200 dark:border-zinc-800 shadow-md transition-colors">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Railway Map HUD Overlay */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 dark:bg-black/90 backdrop-blur-sm border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono flex items-center gap-2 shadow-lg">
        <span className="signal-lamp green signal-pulse"></span>
        <span className="font-semibold">CORRIDOR MAP • GPS TRACK VIEW</span>
      </div>

      <div className="absolute bottom-3 right-3 z-[400] bg-white/95 dark:bg-black/90 backdrop-blur-sm border border-slate-200 dark:border-zinc-800 rounded px-2.5 py-1 text-[11px] text-slate-600 dark:text-zinc-400 font-mono shadow-lg">
        LEAFLET.JS RAIL NETWORK
      </div>
    </div>
  );
}
