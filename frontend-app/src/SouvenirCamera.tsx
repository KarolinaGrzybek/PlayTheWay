import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, ZoomIn, RotateCw, Save, AlertCircle } from 'lucide-react';
import { supabase } from './supabaseClient';

// SVG Assets in Base64/DataURIs for overlay drawing on canvas
const FILTERS = {
  hat: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 70" width="120" height="70"><defs><linearGradient id="hatGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%238b5a2b"/><stop offset="40%" stop-color="%23704214"/><stop offset="100%" stop-color="%234a2511"/></linearGradient><linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23d90429"/><stop offset="50%" stop-color="%23ef233c"/><stop offset="100%" stop-color="%23d90429"/></linearGradient><linearGradient id="brimGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%23a06a38"/><stop offset="100%" stop-color="%235c3818"/></linearGradient></defs><path d="M30,42 L35,15 C37,8 83,8 85,15 L90,42 Z" fill="url(%23hatGrad)" stroke="%23301608" stroke-width="1"/><path d="M45,15 C55,10 65,10 75,15 C65,18 55,18 45,15 Z" fill="%23301608" opacity="0.3"/><path d="M30,37 C45,35 75,35 90,37 L91,42 C75,40 45,40 29,42 Z" fill="url(%23bandGrad)" stroke="%23301608" stroke-width="0.5"/><rect x="56" y="35" width="8" height="7" rx="1" fill="%23ffd700" stroke="%23b8860b" stroke-width="0.5"/><rect x="58" y="37" width="4" height="3" rx="0.5" fill="%23704214"/><path d="M5,47 C15,41 35,39 60,39 C85,39 105,41 115,47 C121,50 115,55 90,55 C60,55 30,55 5,55 C-1,55 -5,50 5,47 Z" fill="url(%23brimGrad)" stroke="%23301608" stroke-width="1"/></svg>`,
  medal: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" width="80" height="120"><defs><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fff275"/><stop offset="30%" stop-color="%23ffcc00"/><stop offset="70%" stop-color="%23e5a900"/><stop offset="100%" stop-color="%23996500"/></linearGradient><linearGradient id="ribbonGradL" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%2303045e"/><stop offset="50%" stop-color="%230077b6"/><stop offset="100%" stop-color="%2303045e"/></linearGradient><linearGradient id="ribbonGradR" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23d90429"/><stop offset="50%" stop-color="%23ef233c"/><stop offset="100%" stop-color="%23d90429"/></linearGradient></defs><path d="M22,5 L38,5 L35,45 L15,45 Z" fill="url(%23ribbonGradL)" stroke="%23023e8a" stroke-width="0.5"/><path d="M38,5 L58,5 L65,45 L45,45 Z" fill="url(%23ribbonGradR)" stroke="%23b3001e" stroke-width="0.5"/><path d="M35,5 L45,5 L43,45 L37,45 Z" fill="%23ffd700"/><circle cx="40" cy="46" r="6" fill="none" stroke="url(%23goldGrad)" stroke-width="2.5"/><circle cx="40" cy="78" r="28" fill="url(%23goldGrad)" stroke="%23805300" stroke-width="1"/><circle cx="40" cy="78" r="23" fill="none" stroke="%23ffffff" stroke-width="1.5" stroke-dasharray="2.5 1.5" opacity="0.6"/><circle cx="40" cy="78" r="21" fill="none" stroke="%23805300" stroke-width="0.5"/><polygon points="40,60 44,72 56,72 47,80 50,92 40,84 30,92 33,80 24,72 36,72" fill="%23ffffff" stroke="%23805300" stroke-width="0.5"/><polygon points="40,60 40,84 30,92 33,80 24,72 36,72" fill="%23e5a900" opacity="0.4"/></svg>`,
  trophy: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="trophyGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fff275"/><stop offset="40%" stop-color="%23ffcc00"/><stop offset="85%" stop-color="%23d4af37"/><stop offset="100%" stop-color="%23aa7c11"/></linearGradient><linearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%232d3748"/><stop offset="100%" stop-color="%231a202c"/></linearGradient><linearGradient id="highlight" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.6"/><stop offset="30%" stop-color="%23ffffff" stop-opacity="0"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></linearGradient></defs><path d="M25,20 C10,20 10,40 25,43 L25,35" fill="none" stroke="url(%23trophyGrad)" stroke-width="4.5" stroke-linecap="round"/><path d="M75,20 C90,20 90,40 75,43 L75,35" fill="none" stroke="url(%23trophyGrad)" stroke-width="4.5" stroke-linecap="round"/><path d="M25,10 H75 V40 C75,55 63,65 50,65 C37,65 25,55 25,40 Z" fill="url(%23trophyGrad)" stroke="%23805300" stroke-width="1"/><path d="M28,12 H42 V38 C42,48 37,55 28,52 Z" fill="url(%23highlight)"/><path d="M44,65 H56 V78 H44 Z" fill="url(%23trophyGrad)" stroke="%23805300" stroke-width="0.5"/><circle cx="50" cy="71" r="5" fill="url(%23trophyGrad)"/><path d="M32,78 H68 V86 H32 Z" fill="url(%23trophyGrad)" stroke="%23805300" stroke-width="0.5"/><rect x="25" y="86" width="50" height="10" rx="2" fill="url(%23baseGrad)"/><polygon points="50,88 51.5,91 54.5,91 52,93 53,96 50,94 47,96 48,93 45.5,91 48.5,91" fill="%23ffd700"/></svg>`
};

interface SouvenirCameraProps {
  userId: string;
  city: string;
  lat?: number;
  lon?: number;
  onPhotoSaved: (photoUrl: string) => void;
}

const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  warszawa: { lat: 52.2297, lon: 21.0122 },
  krakow: { lat: 50.0647, lon: 19.9450 },
  kraków: { lat: 50.0647, lon: 19.9450 },
  gdansk: { lat: 54.3520, lon: 18.6466 },
  gdańsk: { lat: 54.3520, lon: 18.6466 },
  wroclaw: { lat: 51.1079, lon: 17.0385 },
  wrocław: { lat: 51.1079, lon: 17.0385 },
  poznan: { lat: 52.4064, lon: 16.9252 },
  poznań: { lat: 52.4064, lon: 16.9252 },
  katowice: { lat: 50.2649, lon: 19.0238 },
  lodz: { lat: 51.7592, lon: 19.4560 },
  łódź: { lat: 51.7592, lon: 19.4560 },
  lublin: { lat: 51.2465, lon: 22.5684 },
  szczecin: { lat: 53.4285, lon: 14.5528 },
  bydgoszcz: { lat: 53.1235, lon: 18.0084 },
  torun: { lat: 53.0138, lon: 18.5984 },
  toruń: { lat: 53.0138, lon: 18.5984 },
  gdynia: { lat: 54.5189, lon: 18.5305 },
  sopot: { lat: 54.4418, lon: 18.5601 }
};

export function SouvenirCamera({ userId, city, lat, lon, onPhotoSaved }: SouvenirCameraProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeFilter, setActiveFilter] = useState<'hat' | 'medal' | 'trophy'>('hat');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Overlay position/scale/rotation states
  const [overlayPos, setOverlayPos] = useState({ x: 0, y: -20 });
  const [overlayScale, setOverlayScale] = useState(1.0);
  const [overlayRotation, setOverlayRotation] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<boolean>(false);
  const startDragPos = useRef({ x: 0, y: 0 });

  // Start Camera Stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then(s => {
        setStream(s);
        activeStream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(err => {
        console.error("Błąd kamery:", err);
        setCameraError("Brak dostępu do kamery. Upewnij się, że zezwoliłeś na dostęp i używasz połączenia HTTPS.");
      });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [capturedPhoto]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = true;
    startDragPos.current = { x: e.clientX - overlayPos.x, y: e.clientY - overlayPos.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    setOverlayPos({
      x: e.clientX - startDragPos.current.x,
      y: e.clientY - startDragPos.current.y
    });
  };

  const handleMouseUpOrLeave = () => {
    dragRef.current = false;
  };

  // Touch drag for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      dragRef.current = true;
      startDragPos.current = {
        x: e.touches[0].clientX - overlayPos.x,
        y: e.touches[0].clientY - overlayPos.y
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current || e.touches.length !== 1) return;
    setOverlayPos({
      x: e.touches[0].clientX - startDragPos.current.x,
      y: e.touches[0].clientY - startDragPos.current.y
    });
  };

  // Take Snapshot & render to canvas
  const captureSnapshot = () => {
    if (!videoRef.current || !containerRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center crop the video to a square matching the preview aspect ratio
    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;
    const size = Math.min(videoWidth, videoHeight);
    
    canvas.width = size;
    canvas.height = size;

    const sx = (videoWidth - size) / 2;
    const sy = (videoHeight - size) / 2;

    // Draw mirrored centered video snapshot (matching the CSS -scale-x-100 preview)
    ctx.save();
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    ctx.restore();

    // Calculate dimensions of overlay relative to scale of the preview area
    const container = containerRef.current;
    const scale = size / container.clientWidth;

    const img = new Image();
    img.src = FILTERS[activeFilter];
    img.onload = () => {
      // Draw overlay
      ctx.save();
      
      // Target position on canvas
      const targetX = (container.clientWidth / 2 + overlayPos.x) * scale;
      const targetY = (container.clientHeight / 2 + overlayPos.y) * scale;
      
      ctx.translate(targetX, targetY);
      ctx.rotate((overlayRotation * Math.PI) / 180);
      
      // Draw maintaining aspect ratio (object-contain inside a bounding box of 112px * overlayScale)
      const boxSize = 112 * overlayScale * scale;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      
      let drawW = boxSize;
      let drawH = boxSize;
      
      if (imgRatio > 1) {
        // Wider than tall (e.g. hat)
        drawH = boxSize / imgRatio;
      } else {
        // Taller than wide (e.g. medal)
        drawW = boxSize * imgRatio;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Export canvas
      const dataUrl = canvas.toDataURL('image/webp', 0.85);
      setCapturedPhoto(dataUrl);

      // Stop camera
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
  };

  // Helper: DataURL to Blob
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Save/Upload to Supabase Storage
  const uploadAndSave = async () => {
    if (!capturedPhoto) return;
    setIsUploading(true);
    try {
      const blob = dataURLtoBlob(capturedPhoto);
      const fileName = `souvenir_${userId}_${Date.now()}.webp`;

      // Upload file to bucket 'souvenir_photos'
      const { error: uploadError } = await supabase.storage
        .from('souvenir_photos')
        .upload(fileName, blob, { contentType: 'image/webp' });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('souvenir_photos')
        .getPublicUrl(fileName);

      // Save to 'completed_adventures' table
      const { error: dbError } = await supabase
        .from('completed_adventures')
        .insert({
          user_id: userId,
          city: city,
          photo_url: publicUrl,
          lat: lat ?? CITY_COORDS[city.toLowerCase().trim()]?.lat ?? 52.2297,
          lon: lon ?? CITY_COORDS[city.toLowerCase().trim()]?.lon ?? 21.0122
        });

      if (dbError) throw dbError;

      // Trigger success callback
      onPhotoSaved(publicUrl);
    } catch (err: any) {
      console.error("Zapis zdjęć błąd:", err);
      alert("Błąd podczas zapisywania zdjęcia: " + (err.message || err));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-[#fdfbf7] dark:bg-[#1e2025] p-5 rounded-2xl border border-[#eadabe] dark:border-[#3c3424] max-w-sm mx-auto shadow-sm">
      <h3 className="font-serif font-extrabold text-[#0d3b66] dark:text-[#f4d35e] text-sm text-center">
        🏆 Pamiątkowe Zdjęcie Odkrywcy!
      </h3>
      <p className="text-[10px] text-slate-500 text-center leading-snug">
        Wybierz rekwizyt, dopasuj go przeciągając palcem/myszką i zrób zdjęcie!
      </p>

      {/* Camera Error Message */}
      {cameraError && !capturedPhoto && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 text-rose-700 dark:text-rose-400 text-[10px] rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Snapshot Preview Screen */}
      <div 
        ref={containerRef}
        className="w-72 h-72 rounded-2xl overflow-hidden border border-[#eadabe] dark:border-[#3c3424] relative bg-slate-900 flex items-center justify-center select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUpOrLeave}
      >
        {capturedPhoto ? (
          <img src={capturedPhoto} className="w-full h-full object-cover" alt="Podgląd" />
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover transform -scale-x-100" 
            />
            {/* Live Filter Overlay */}
            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{
                transform: `translate(${overlayPos.x}px, ${overlayPos.y}px) rotate(${overlayRotation}deg) scale(${overlayScale})`,
                cursor: 'move',
                touchAction: 'none'
              }}
              className="absolute w-28 h-28 flex items-center justify-center pointer-events-auto"
            >
              <img 
                src={FILTERS[activeFilter]} 
                alt="Filtr" 
                className="w-full h-full object-contain pointer-events-none" 
              />
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      {!capturedPhoto ? (
        <div className="w-full space-y-3">
          {/* Filter Choice Row */}
          <div className="flex justify-center gap-2">
            {[
              { id: 'hat', label: '🤠 Kapelusz' },
              { id: 'medal', label: '🏅 Medal' },
              { id: 'trophy', label: '🏆 Puchar' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[#0d3b66] border-[#0d3b66] text-white'
                    : 'bg-white dark:bg-slate-900 border-[#eadabe] dark:border-[#3c3424] text-slate-700 dark:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Scale & Rotate Sliders */}
          <div className="space-y-1 text-[10px] font-bold text-[#8b6b4c] dark:text-[#c4b5a2]">
            <div className="flex items-center gap-2">
              <ZoomIn className="w-3.5 h-3.5" />
              <span className="w-12">Skala:</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={overlayScale}
                onChange={e => setOverlayScale(parseFloat(e.target.value))}
                className="flex-1 accent-[#0d3b66]"
              />
            </div>
            <div className="flex items-center gap-2">
              <RotateCw className="w-3.5 h-3.5" />
              <span className="w-12">Obrót:</span>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={overlayRotation}
                onChange={e => setOverlayRotation(parseInt(e.target.value))}
                className="flex-1 accent-[#0d3b66]"
              />
            </div>
          </div>

          <button
            onClick={captureSnapshot}
            className="w-full py-2.5 bg-[#0d3b66] hover:bg-[#0f5379] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" /> Zrób Zdjęcie
          </button>
        </div>
      ) : (
        <div className="w-full flex gap-2">
          <button
            disabled={isUploading}
            onClick={() => setCapturedPhoto(null)}
            className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Powtórz
          </button>
          <button
            disabled={isUploading}
            onClick={uploadAndSave}
            className="flex-1 py-2.5 bg-[#0d3b66] hover:bg-[#0f5379] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" /> {isUploading ? 'Zapisywanie...' : 'Zapisz Wpis'}
          </button>
        </div>
      )}
    </div>
  );
}
