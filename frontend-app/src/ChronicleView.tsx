import { useEffect, useRef, useState } from 'react';
import { supabase } from './supabaseClient';
import { Loader2, Compass, AlertCircle } from 'lucide-react';

interface CompletedAdventure {
  id: string;
  city: string;
  lat: number;
  lon: number;
  photo_url: string;
  completed_at: string;
}

interface ChronicleViewProps {
  userId: string;
}

function getCountryColor(name: string) {
  const colors = [
    '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff',
    '#ff85a1', '#fbb1bd', '#f9bec7', '#f7cad0', '#ac92eb', '#4fc1e9', '#a0d468', '#ffce54',
    '#ed5565', '#da4453', '#4a89dc', '#3bafda', '#37bc9b', '#8cc152', '#f6bb42'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % colors.length;
  return colors[idx];
}

export function ChronicleView({ userId }: ChronicleViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [adventures, setAdventures] = useState<CompletedAdventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch completed adventures for the user
  useEffect(() => {
    async function fetchAdventures() {
      try {
        setLoading(true);
        const { data, error: dbError } = await supabase
          .from('completed_adventures')
          .select('*')
          .eq('user_id', userId)
          .order('completed_at', { ascending: false });

        if (dbError) throw dbError;
        setAdventures(data || []);
      } catch (err: any) {
        console.error("Błąd podczas pobierania przygód:", err);
        setError("Nie udało się pobrać historii przygód.");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchAdventures();
    }
  }, [userId]);

  // Initialize and update the Leaflet map
  useEffect(() => {
    if (loading || adventures.length === 0 || !mapRef.current) return;

    let active = true;

    const L = (window as any).L;
    if (!L) {
      console.warn('Leaflet nie załadowany w ChronicleView');
      return;
    }

    // Destroy previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.off();
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Center on Europe
    const map = L.map(mapRef.current, {
      center: [54.5260, 15.2551],
      zoom: 4,
      zoomControl: true,
      scrollWheelZoom: true,
    });
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap, © CartoDB',
      maxZoom: 19,
    }).addTo(map);

    // Fetch and render Europe GeoJSON for stylized borders, colors, and country names
    fetch('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson')
      .then(res => res.json())
      .then(data => {
        if (!active || !mapInstanceRef.current) return;
        const LInstance = (window as any).L;
        if (!LInstance) return;

        LInstance.geoJSON(data, {
          style: (feature: any) => {
            const countryName = feature.properties.NAME || feature.properties.name || "Unknown";
            return {
              fillColor: getCountryColor(countryName),
              fillOpacity: 0.3,
              color: '#334155', // slate-700 thick borders
              weight: 2.2,
              opacity: 0.9
            };
          },
          onEachFeature: (feature: any, layer: any) => {
            const countryName = feature.properties.NAME || feature.properties.name;
            if (countryName) {
              layer.bindTooltip(countryName, {
                permanent: true,
                direction: 'center',
                className: 'country-label-tooltip',
                interactive: false
              });
            }
          }
        }).addTo(mapInstanceRef.current);
      })
      .catch(err => {
        if (active) {
          console.error("Błąd podczas wczytywania granic Europy:", err);
        }
      });

    // Add pins for all completed adventures
    adventures.forEach(adv => {
      if (!adv.lat || !adv.lon) return;

      const dateStr = new Date(adv.completed_at).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // SVG Icon for a gold explorer pin with city name label
      const svgIcon = `
        <div class="flex flex-col items-center select-none" style="pointer-events: none;">
          <div style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.15));">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C10.5 2 6 6.5 6 12C6 19.5 16 30 16 30C16 30 26 19.5 26 12C26 6.5 21.5 2 16 2Z" fill="#ffb703" stroke="#fb8500" stroke-width="2"/>
              <circle cx="16" cy="12" r="5" fill="#fdfbf7"/>
              <polygon points="16,9 17.5,12 20.5,12.5 18,14.5 19,17.5 16,15.5 13,17.5 14,14.5 11.5,12.5 14.5,12" fill="#0d3b66"/>
            </svg>
          </div>
          <div class="bg-[#fdfbf7] dark:bg-[#1e2025] text-[#0d3b66] dark:text-[#f4d35e] border border-[#eadabe] dark:border-[#3c3424] rounded-md px-1.5 py-0.5 mt-0.5 shadow-sm text-[9px] font-extrabold whitespace-nowrap leading-none">
            ${adv.city}
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: svgIcon,
        className: '',
        iconSize: [80, 50],
        iconAnchor: [40, 26],
        popupAnchor: [0, -28]
      });

      const popupContent = `
        <div style="font-family: serif; max-width: 180px; text-align: center; color: #1e293b;">
          <h4 style="margin: 0 0 3px 0; font-size: 14px; font-weight: 800; color: #0d3b66;">🏆 Odkrywca ${adv.city}</h4>
          <p style="margin: 0 0 8px 0; font-size: 9px; color: #64748b;">${dateStr}</p>
          ${adv.photo_url ? `<img src="${adv.photo_url}" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 2px solid #eadabe;" alt="Pamiątka" />` : ''}
        </div>
      `;

      L.marker([adv.lat, adv.lon], { icon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    // Fit map bounds to show all coordinates if there are multiple adventures
    if (adventures.length > 1) {
      const coords = adventures.map(a => [a.lat, a.lon]);
      const bounds = L.latLngBounds(coords as [number, number][]);
      map.fitBounds(bounds, { padding: [50, 50], animate: false });
    } else if (adventures.length === 1) {
      map.setView([adventures[0].lat, adventures[0].lon], 9, { animate: false });
    }

    return () => {
      active = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, adventures]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#0d3b66] dark:text-[#f4d35e] mb-3" />
        <p className="text-xs font-semibold">Wczytywanie Twojej kroniki...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Coś poszło nie tak</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">{error}</p>
      </div>
    );
  }

  if (adventures.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 border border-amber-500/25">
          <Compass className="w-8 h-8" />
        </div>
        <h3 className="font-serif font-extrabold text-[#0d3b66] dark:text-[#f4d35e] text-base mb-1">
          Twoja Kronika jest jeszcze pusta
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Wyrusz w swoją pierwszą podróż, dotrzyj do mety i zrób pamiątkowe zdjęcie odkrywcy, aby przypiąć pierwszą pinezkę na mapie Polski!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 h-full overflow-hidden">
      <div className="mb-4">
        <span className="inline-flex items-center gap-1 bg-[#efdfc3] dark:bg-[#2b271d] text-[#8b6b4c] dark:text-[#c4b5a2] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
          🗺️ Twoja Kronika Odkryć
        </span>
        <h3 className="text-base font-serif font-extrabold text-[#0d3b66] dark:text-[#f4d35e] leading-snug">
          Odwiedzone Miasta i Pamiątki ({adventures.length})
        </h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
          Klikaj pinezki na mapie Polski, aby zobaczyć swoje zdjęcia w przebraniu z końca wypraw!
        </p>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden border border-[#eadabe] dark:border-[#3c3424] shadow-inner relative min-h-[300px]">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
}
