import React, { useState, useEffect } from "react";
import {
  Wind,
  Trash2,
  Activity,
  Info,
  Layers,
  Scan, 
  Droplets,
  Flame,
  Sparkles,
} from "lucide-react";
 
import { MapContainer, TileLayer, Circle, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Keep Leaflet map below our React UI
const LEAFLET_Z_INDEX_FIX = `
  .leaflet-container { z-index: 5 !important; }
  .leaflet-pane { z-index: 5 !important; }
  .leaflet-control-attribution { display: none; }
`;

const CITY_CENTER = { lat: 30.3165, lng: 78.0322 }; // Dehradun

export default function EarthTwin() {
  const [activeLayer, setActiveLayer] = useState("all");
  const [baseMap, setBaseMap] = useState("dark");
  const [selectedData, setSelectedData] = useState(null);
  const [airData, setAirData] = useState([]);

  // -------- FETCH AQI (with demo fallback) --------
  useEffect(() => {
    async function loadAQI() {
      try {
        const res = await fetch(
          `https://api.openaq.org/v2/latest?coordinates=${CITY_CENTER.lat},${CITY_CENTER.lng}&radius=20000&limit=5`
        );

        if (!res.ok) throw new Error("CORS / Rate limit");

        const data = await res.json();

        const mapped = data.results.map((station, idx) => {
          const pm25 =
            station.measurements.find((m) => m.parameter === "pm25") ||
            station.measurements[0];

          const value = pm25?.value || 0;

          let color = "#22c55e"; // green
          if (value > 150) color = "#ef4444"; // red
          else if (value > 80) color = "#f97316"; // orange

          const coords = station.coordinates || {
            latitude: CITY_CENTER.lat + (idx - 2) * 0.01,
            longitude: CITY_CENTER.lng + (idx - 2) * 0.01,
          };

          return {
            id: station.location || `AQ-${idx}`,
            lat: coords.latitude,
            lng: coords.longitude,
            value,
            type: "Air Quality",
            info: `${station.location} • PM2.5: ${value.toFixed(1)} μg/m³`,
            color,
          };
        });

        setAirData(mapped);
      } catch (err) {
        console.warn("AQI API blocked → using demo AQ data");

        setAirData([
          {
            id: "Demo-1",
            lat: 30.32,
            lng: 78.03,
            value: 165,
            color: "#ef4444",
            type: "Air Quality",
            info: "Clock Tower • PM2.5: 165 μg/m³ (High)",
          },
          {
            id: "Demo-2",
            lat: 30.33,
            lng: 78.05,
            value: 42,
            color: "#22c55e",
            type: "Air Quality",
            info: "Rajpur Road • PM2.5: 42 μg/m³ (Good)",
          },
        ]);
      }
    }

    loadAQI();
  }, []);

  // -------- STATIC ZONES --------
  const wasteZones = [
    { id: 1, lat: 30.2736, lng: 78.0081, info: "ISBT Waste Hotspot" },
    { id: 2, lat: 30.309, lng: 78.0122, info: "Patel Nagar Waste Complaints" },
  ];

  const noiseZones = [
    { id: 3, lat: 30.3245, lng: 78.041, info: "Clock Tower • 92 dB (Severe)" },
    { id: 4, lat: 30.345, lng: 78.06, info: "Rajpur Road • 78 dB (High)" },
  ];

  const cleanlinessZones = [
    {
      id: 5,
      lat: 30.3256,
      lng: 78.0447,
      grade: "A",
      info: "Gandhi Park • Cleanliness A",
    },
    {
      id: 6,
      lat: 30.298,
      lng: 78.02,
      grade: "B",
      info: "Residential Area • Cleanliness B",
    },
    {
      id: 7,
      lat: 30.315,
      lng: 78.03,
      grade: "C",
      info: "Old City Cluster • Cleanliness C",
    },
  ];

  const waterSpots = [
    {
      id: 8,
      lat: 30.282,
      lng: 78.064,
      status: "Warning",
      info: "Rispana River • Pollution Warning",
    },
    {
      id: 9,
      lat: 30.3793,
      lng: 77.6825,
      status: "Safe",
      info: "Asan Lake • Safe Water Quality",
    },
  ];

  const emissionHotspots = [
    {
      id: 10,
      lat: 30.2887,
      lng: 77.879,
      info: "Selaqui Industry Cluster • Emission Hotspot",
    },
    {
      id: 11,
      lat: 30.26,
      lng: 77.98,
      info: "Highway Stretch • Garbage Burning Events",
    },
  ];

  // -------- BASEMAPS --------
  const tileConfig = {
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    },
    light: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}",
    },
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-sans">
      <style>{LEAFLET_Z_INDEX_FIX}</style>

      {/* ---------- MAP LAYER ---------- */}
      <MapContainer
        center={[CITY_CENTER.lat, CITY_CENTER.lng]}
        zoom={12}
        className="absolute inset-0 w-full h-full z-5"
        zoomControl={false}
      >
        <TileLayer url={tileConfig[baseMap].url} />

        {/* AIR */}
        {(activeLayer === "all" || activeLayer === "air") &&
          airData.map((p) => (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={8}
              pathOptions={{
                color: "white",
                weight: 1,
                fillColor: p.color,
                fillOpacity: 0.9,
              }}
              eventHandlers={{ click: () => setSelectedData(p) }}
            />
          ))}

        {/* WASTE */}
        {(activeLayer === "all" || activeLayer === "waste") &&
          wasteZones.map((z) => (
            <Circle
              key={z.id}
              center={[z.lat, z.lng]}
              radius={1500}
              pathOptions={{
                color: "#ef4444",
                fillColor: "rgba(239,68,68,0.4)",
                fillOpacity: 0.6,
              }}
              eventHandlers={{
                click: () => setSelectedData({ type: "Waste Hotspot", ...z }),
              }}
            />
          ))}

        {/* NOISE */}
        {(activeLayer === "all" || activeLayer === "noise") &&
          noiseZones.map((n) => (
            <Circle
              key={n.id}
              center={[n.lat, n.lng]}
              radius={1200}
              pathOptions={{
                color: "#a855f7",
                fillColor: "rgba(168,85,247,0.25)",
                fillOpacity: 0.6,
              }}
              eventHandlers={{
                click: () => setSelectedData({ type: "Noise Zone", ...n }),
              }}
            />
          ))}

        {/* CLEANLINESS */}
        {(activeLayer === "all" || activeLayer === "cleanliness") &&
          cleanlinessZones.map((c) => (
            <Circle
              key={c.id}
              center={[c.lat, c.lng]}
              radius={900}
              pathOptions={{
                color:
                  c.grade === "A"
                    ? "#22c55e"
                    : c.grade === "B"
                    ? "#eab308"
                    : "#ef4444",
                fillColor:
                  c.grade === "A"
                    ? "rgba(34,197,94,0.2)"
                    : c.grade === "B"
                    ? "rgba(234,179,8,0.18)"
                    : "rgba(239,68,68,0.18)",
                fillOpacity: 0.7,
              }}
              eventHandlers={{
                click: () => setSelectedData({ type: "Cleanliness", ...c }),
              }}
            />
          ))}

        {/* WATER */}
        {(activeLayer === "all" || activeLayer === "water") &&
          waterSpots.map((w) => (
            <Circle
              key={w.id}
              center={[w.lat, w.lng]}
              radius={2000}
              pathOptions={{
                color: "#38bdf8",
                fillColor:
                  w.status === "Warning"
                    ? "rgba(56,189,248,0.35)"
                    : "rgba(45,212,191,0.35)",
                fillOpacity: 0.7,
              }}
              eventHandlers={{
                click: () => setSelectedData({ type: "Water Quality", ...w }),
              }}
            />
          ))}

        {/* EMISSIONS */}
        {(activeLayer === "all" || activeLayer === "emissions") &&
          emissionHotspots.map((e) => (
            <Circle
              key={e.id}
              center={[e.lat, e.lng]}
              radius={2500}
              pathOptions={{
                color: "#f97316",
                fillColor: "rgba(248,113,113,0.5)",
                fillOpacity: 0.7,
              }}
              eventHandlers={{
                click: () => setSelectedData({ type: "Emissions", ...e }),
              }}
            />
          ))}
      </MapContainer>

      {/* ---------- HEADER (TOP-LEFT) ---------- */}
      <div className="absolute top-0 left-0 z-30 px-6 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-teal-400/50 bg-teal-500/10 backdrop-blur-sm">
            <Scan className="text-teal-300 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 text-transparent bg-clip-text">
              EarthTwin
            </h1>
            <p className="text-[11px] text-gray-400 tracking-widest uppercase">
              Dehradun Urban Replica
            </p>
          </div>
        </div>
      </div>

      {/* ---------- SEPARATE BASEMAP SWITCHER (TOP-CENTER) ---------- */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50">
        <div className="flex bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2 gap-3 shadow-xl">
          <BaseMapButton
            label="Dark"
            value="dark"
            active={baseMap === "dark"}
            onClick={setBaseMap}
          />
          <BaseMapButton
            label="Light"
            value="light"
            active={baseMap === "light"}
            onClick={setBaseMap}
          />
          <BaseMapButton
            label="Terrain"
            value="terrain"
            active={baseMap === "terrain"}
            onClick={setBaseMap}
          />
          <BaseMapButton
            label="Sat"
            value="satellite"
            active={baseMap === "satellite"}
            onClick={setBaseMap}
          />
        </div>
      </div>

      {/* ---------- POPUP CARD ---------- */}
      {selectedData && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="relative bg-slate-900/95 border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <button
              onClick={() => setSelectedData(null)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white"
            >
              <Info size={18} />
            </button>

            <h3 className="text-xl font-semibold text-teal-300 mb-2">
              {selectedData.type}
            </h3>

            <p className="text-gray-300 text-sm">{selectedData.info}</p>
          </div>
        </div>
      )}

      {/* ---------- LAYER SWITCHER (BOTTOM-CENTER) ---------- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4">
        <div className="bg-black/70 border border-white/10 backdrop-blur-xl rounded-2xl p-2 shadow-xl flex gap-2 justify-center">
          <LayerButton
            label="All"
            active={activeLayer === "all"}
            onClick={() => setActiveLayer("all")}
            icon={<Layers size={16} />}
          />
          <LayerButton
            label="Waste"
            active={activeLayer === "waste"}
            onClick={() => setActiveLayer("waste")}
            icon={<Trash2 size={16} />}
          />
          <LayerButton
            label="Air"
            active={activeLayer === "air"}
            onClick={() => setActiveLayer("air")}
            icon={<Wind size={16} />}
          />
          <LayerButton
            label="Noise"
            active={activeLayer === "noise"}
            onClick={() => setActiveLayer("noise")}
            icon={<Activity size={16} />}
          />
          <LayerButton
            label="Clean"
            active={activeLayer === "cleanliness"}
            onClick={() => setActiveLayer("cleanliness")}
            icon={<Sparkles size={16} />}
          />
          <LayerButton
            label="Water"
            active={activeLayer === "water"}
            onClick={() => setActiveLayer("water")}
            icon={<Droplets size={16} />}
          />
          <LayerButton
            label="Emissions"
            active={activeLayer === "emissions"}
            onClick={() => setActiveLayer("emissions")}
            icon={<Flame size={16} />}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------ HELPER COMPONENTS ------------------ */

function BaseMapButton({ label, value, active, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 rounded-lg text-xs uppercase transition-all ${
        active
          ? "bg-sky-600 text-white shadow-[0_0_10px_rgba(2,132,199,0.5)]"
          : "text-gray-300 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function LayerButton({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs uppercase transition-all ${
        active
          ? "bg-blue-600 text-white shadow-lg scale-105"
          : "text-gray-400 hover:bg-white/10"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
