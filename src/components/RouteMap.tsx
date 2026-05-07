import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';

const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const ORS_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjZhOThmZWI0MmUwODdkY2FiNjdkNjQxZDgxMTg3N2Y5NDgyZGY1MWQxOTkyZDlhMjUyMzk5ZTlmIiwiaCI6Im11cm11cjY0In0=";

type Props = { from?: string; to?: string; };

export default function RouteMap({ from, to }: Props) {
    const [route, setRoute] = useState<[number, number][]>([]);
    const [points, setPoints] = useState<[number, number][]>([]);
    const [status, setStatus] = useState('');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const geocode = async (text: string): Promise<[number, number] | null> => {
        const r = await fetch(
            `https://localhost:56782/api/geo/search?q=${encodeURIComponent(text)}`,
            { credentials: 'include' }
        );
        const j = await r.json();
        if (!j.length) return null;
        return [parseFloat(j[0].lon), parseFloat(j[0].lat)];
    };

    const buildRoute = async () => {
        if (!from || !to || from.length < 5 || to.length < 5) return;
        setStatus('Строим маршрут...');
        try {
            const [start, end] = await Promise.all([geocode(from), geocode(to)]);
            if (!start || !end) { setStatus('Адрес не найден'); return; }
            
            console.log('start:', start, 'end:', end);
            
            setPoints([[start[1], start[0]], [end[1], end[0]]]);
            
            const res = await fetch('https://localhost:56782/api/geo/route', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ coordinates: [start, end] }),
            });
            
            const data = await res.json();
            console.log('route response:', data);
            
            if (!data.features) {
                setStatus(`Ошибка ORS: ${JSON.stringify(data)}`);
                return;
            }
            
            setRoute(data.features[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]));
            setStatus('');
        } catch (e) {
            console.error(e);
            setStatus('Ошибка маршрута');
        }
    };

    // Дебаунс — запрос через 1.5 сек после остановки печати
    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!from && !to) return;
        timerRef.current = setTimeout(buildRoute, 1500);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [from, to]);

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            {status && (
                <div style={{
                    position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '6px 16px',
                    borderRadius: 20, fontSize: 13, zIndex: 1000, pointerEvents: 'none'
                }}>
                    {status}
                </div>
            )}
            <MapContainer center={[62.0, 45.0]} zoom={4} style={{ height: '100%', width: '100%', borderRadius: 16 }} attributionControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {points.map((p, i) => <Marker key={i} position={p} icon={icon} />)}
                {route.length > 0 && <Polyline positions={route} color="#f59e0b" weight={4} opacity={0.8} />}
            </MapContainer>
        </div>
    );
}