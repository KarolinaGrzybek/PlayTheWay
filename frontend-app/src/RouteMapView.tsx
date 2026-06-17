import { useEffect, useRef } from 'react';
import type { POI } from './api';

interface RouteMapViewProps {
  visitedPOIs: POI[];
  currentPOI: POI;
  choices: string[];
  availablePOIs: POI[];
  city?: string;
}

export function RouteMapView({ visitedPOIs = [], currentPOI, choices = [], availablePOIs = [], city }: RouteMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    let active = true;

    const L = (window as any).L;
    if (!L) {
      console.warn('Leaflet nie załadowany');
      return;
    }

    // Destroy previous map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.off();
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    }

    // Find first POI with valid coords
    const firstValidPOI = [currentPOI, ...(visitedPOIs || []), ...(availablePOIs || [])].find(p => p && p.lat && p.lon);

    const initMap = (lat: number, lon: number) => {
      if (!active || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [lat, lon],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
      });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Draw visited route
      const visitedCoords = (visitedPOIs || []).filter(p => p !== null && p.lat && p.lon).map(poi => [poi.lat, poi.lon]);
      if (visitedCoords.length > 1) {
        L.polyline(visitedCoords, { color: '#3B82F6', weight: 4, opacity: 0.8 }).addTo(map);
      }

      // Connect last visited to current
      if (visitedCoords.length > 0 && currentPOI && currentPOI.lat && currentPOI.lon) {
        const lastV = visitedCoords[visitedCoords.length - 1];
        if (lastV[0] !== currentPOI.lat || lastV[1] !== currentPOI.lon) {
          L.polyline([lastV, [currentPOI.lat, currentPOI.lon]], { color: '#3B82F6', weight: 4, opacity: 0.8 }).addTo(map);
        }
      }

      // Find option POIs from choices
      const optionPOIs: POI[] = [];
      choices.forEach(targetName => {
        const found = (availablePOIs || []).filter(p => p !== null).find(p => p.name === targetName);
        if (found) optionPOIs.push(found);
      });

      // Draw choice lines
      if (currentPOI && currentPOI.lat && currentPOI.lon) {
        optionPOIs.filter(opt => opt && opt.lat && opt.lon).forEach(opt => {
          L.polyline([[currentPOI.lat, currentPOI.lon], [opt.lat, opt.lon]], {
            color: '#3B82F6', weight: 3, opacity: 0.9, dashArray: '6, 6'
          }).addTo(map);
        });
      }

      // Add markers
      const addMarker = (poi: POI, status: 'visited' | 'current' | 'option', index?: number) => {
        if (!poi.lat || !poi.lon) return;
        const color = status === 'current' ? '#3B82F6' : status === 'visited' ? '#BFDBFE' : '#FCD34D';
        const borderColor = status === 'current' ? '#2563EB' : status === 'visited' ? '#3B82F6' : '#F59E0B';
        const size = status === 'current' ? 36 : 28;
        const text = status === 'option' ? '?' : (index !== undefined ? index + 1 : '✓');

        const svgIcon = `
          <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${color}" stroke="${borderColor}" stroke-width="2"/>
            <text x="${size/2}" y="${size/2 + 1}" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="${status==='current'?13:11}" font-weight="bold" font-family="system-ui">${text}</text>
          </svg>
        `;

        const icon = L.divIcon({ html: svgIcon, className: '', iconSize: [size, size], iconAnchor: [size/2, size/2] });
        const marker = L.marker([poi.lat, poi.lon], { icon }).addTo(map)
          .bindPopup(`<b>${poi.name}</b><br/><span style="font-size:11px; color:#64748b;">${status === 'current' ? 'Obecny punkt' : status === 'option' ? 'Możliwy cel' : 'Odwiedzono'}</span>`);

        if (status === 'current') marker.openPopup();
        markersRef.current.push(marker);
      };

      (visitedPOIs || []).filter(poi => poi !== null && poi.lat && poi.lon).forEach((poi, idx) => addMarker(poi, 'visited', idx));
      if (currentPOI && currentPOI.lat && currentPOI.lon) addMarker(currentPOI, 'current');
      optionPOIs.filter(poi => poi !== null && poi.lat && poi.lon).forEach(poi => addMarker(poi, 'option'));

      // Set view to current POI if has coords
      if (currentPOI && currentPOI.lat && currentPOI.lon) {
        map.setView([currentPOI.lat, currentPOI.lon], 15, { animate: false });
      }

      // Fit bounds to all coords
      const allCoords = [...visitedCoords];
      if (currentPOI && currentPOI.lat && currentPOI.lon) allCoords.push([currentPOI.lat, currentPOI.lon]);
      optionPOIs.filter(opt => opt && opt.lat && opt.lon).forEach(opt => allCoords.push([opt.lat, opt.lon]));

      if (allCoords.length > 1) {
        const bounds = L.latLngBounds(allCoords as [number, number][]);
        map.fitBounds(bounds, { padding: [40, 40], animate: false });
      }
    };

    if (firstValidPOI) {
      // Use existing coords
      initMap(firstValidPOI.lat, firstValidPOI.lon);
    } else if (city) {
      // Geocode city name using Nominatim restricted/prioritized to Europe
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&viewbox=-25,72,45,34`, {
        headers: { 'User-Agent': 'PlayTheWay/1.0 (student project)' }
      })
        .then(r => r.json())
        .then(data => {
          if (!active) return;
          if (data && data.length > 0) {
            initMap(parseFloat(data[0].lat), parseFloat(data[0].lon));
          } else {
            initMap(52.2297, 21.0122); // Warsaw fallback
          }
        })
        .catch(() => {
          if (!active) return;
          initMap(52.2297, 21.0122);
        });
    } else {
      initMap(52.2297, 21.0122); // Warsaw fallback
    }

    return () => {
      active = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [visitedPOIs, currentPOI, choices, availablePOIs, city]);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
      <div ref={mapRef} style={{ height: '280px', width: '100%' }} />
    </div>
  );
}
