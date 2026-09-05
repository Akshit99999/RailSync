'use client';

import { useEffect, useRef } from 'react';

export default function TrackMap({ trainData }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
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

      // CartoDB Dark Matter / High Contrast Railway Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; Indian Railways Open Data',
        subdomains: 'abcd',
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

            // Determine signal aspect color
            let signalClass = 'green';
            if (stn.status === 'upcoming') {
              signalClass = stn.delay > 20 ? 'red' : (stn.delay > 5 ? 'amber' : 'green');
            }

            const isCurrent = trainData.lastReportedStation === stn.code;

            // Station Marker HTML
            const stationIcon = L.divIcon({
              className: 'custom-station-icon',
              html: `
                <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
                  <div style="
                    width: ${isCurrent ? '16px' : '10px'};
                    height: ${isCurrent ? '16px' : '10px'};
                    border-radius: 50%;
                    background: ${isCurrent ? '#ffd200' : (stn.status === 'departed' ? '#10b981' : '#64748b')};
                    border: 2px solid #050d1c;
                    box-shadow: 0 0 ${isCurrent ? '12px #ffd200' : '6px rgba(0,0,0,0.8)'};
                  "></div>
                  <div style="
                    margin-top: 3px;
                    background: #091730;
                    border: 1px solid ${isCurrent ? '#ffd200' : '#1e3a6d'};
                    color: ${isCurrent ? '#ffd200' : '#f1f5f9'};
                    font-family: monospace;
                    font-weight: 700;
                    font-size: 10px;
                    padding: 1px 4px;
                    border-radius: 2px;
                    white-space: nowrap;
                    text-shadow: 0 1px 2px #000;
                  ">
                    ${stn.code}
                  </div>
                </div>
              `,
              iconSize: [40, 30],
              iconAnchor: [20, 8]
            });

            const marker = L.marker(point, { icon: stationIcon }).addTo(map);
            marker.bindPopup(`
              <div style="font-family: system-ui, sans-serif; font-size: 12px; color: #f1f5f9; min-width: 180px;">
                <div style="font-weight: 800; font-size: 13px; color: #ffd200; border-bottom: 1px solid #1e3a6d; padding-bottom: 4px; margin-bottom: 4px;">
                  ${stn.name} (${stn.code})
                </div>
                <div>Platform: <strong style="color: #ffd200;">${stn.platform || 'TBD'}</strong></div>
                <div>Sch Arrival: <strong>${stn.scheduledArrival}</strong> | Sch Dep: <strong>${stn.scheduledDeparture}</strong></div>
                <div>Status: <span style="color: ${stn.status === 'departed' ? '#10b981' : '#f59e0b'}; font-weight: bold; text-transform: uppercase;">${stn.status}</span></div>
                ${stn.delay > 0 ? `<div style="color: #f59e0b; font-weight: bold; margin-top: 2px;">Delay: ${stn.delay} mins</div>` : '<div style="color: #10b981;">Right Time</div>'}
              </div>
            `);
            markersRef.current.push(marker);
          }
        });

        // Add track polyline
        if (latLngs.length > 1) {
          polylineRef.current = L.polyline(latLngs, {
            color: '#ffd200',
            weight: 3.5,
            opacity: 0.85,
            dashArray: '8, 6',
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);

          map.fitBounds(latLngs, { padding: [40, 40] });
        }
      }

      // Add Glowing Active Locomotive Marker
      if (trainData?.coordinates) {
        const trainPos = [trainData.coordinates.lat, trainData.coordinates.lng];
        
        const locomotiveIcon = L.divIcon({
          className: 'custom-loco-icon',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <!-- Radar Ping Effect -->
              <div style="
                position: absolute;
                width: 38px;
                height: 38px;
                border-radius: 50%;
                background: rgba(255, 210, 0, 0.25);
                border: 1.5px solid #ffd200;
                animation: signalPulse 2s infinite ease-in-out;
              "></div>
              <!-- Engine Cabin Badge -->
              <div style="
                width: 26px;
                height: 26px;
                border-radius: 50%;
                background: #ffd200;
                color: #050d1c;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                box-shadow: 0 0 16px rgba(255, 210, 0, 0.9), inset 0 0 4px #fff;
                border: 2px solid #050d1c;
                z-index: 10;
              ">
                🚂
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        trainMarkerRef.current = L.marker(trainPos, { icon: locomotiveIcon, zIndexOffset: 1000 }).addTo(map);
        trainMarkerRef.current.bindPopup(`
          <div style="font-family: system-ui, sans-serif; font-size: 12px; color: #f1f5f9;">
            <div style="font-weight: bold; color: #ffd200; font-size: 14px;">${trainData.trainName}</div>
            <div style="margin-top: 4px; font-weight: 600;">Speed: <span style="color: #10b981;">${trainData.speed || '110 km/h'}</span></div>
            <div>Status: <span style="color: #f1f5f9;">${trainData.currentStatus}</span></div>
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
  }, [trainData]);

  return (
    <div className="relative w-full h-[400px] lg:h-[540px] rounded overflow-hidden border-2 border-[#1e3a6d]">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Railway Map HUD Overlay */}
      <div className="absolute top-3 left-3 z-[400] bg-[#091730]/90 backdrop-blur-sm border border-[#1e3a6d] rounded px-3 py-1.5 text-xs text-white font-mono flex items-center gap-2 shadow-lg">
        <span className="signal-lamp green signal-pulse"></span>
        <span>CORRIDOR MAP • GPS TELEMETRY</span>
      </div>

      <div className="absolute bottom-3 right-3 z-[400] bg-[#091730]/90 backdrop-blur-sm border border-[#1e3a6d] rounded px-2.5 py-1 text-[11px] text-[#94a3b8] font-mono shadow-lg">
        LEAFLET.JS RAIL NETWORK
      </div>
    </div>
  );
}
