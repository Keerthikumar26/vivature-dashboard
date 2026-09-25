import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function BoundsFitter({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, map]);
  return null;
}

interface BaseMapProps {
  title: string;
  description: string;
  center: [number, number];
  bounds?: L.LatLngBoundsExpression | null;
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export function BaseMap({ title, description, center, bounds, children, isEmpty, emptyMessage = "No map data available." }: BaseMapProps) {
  if (isEmpty) {
    return (
      <Card className="flex flex-col h-[600px] items-center justify-center bg-slate-50">
        <p className="text-slate-500">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px] overflow-hidden relative border border-slate-200">
      <CardHeader className="absolute top-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-sm border-b rounded-t-lg shadow-sm">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <div className="flex-1 mt-20 relative">
        <MapContainer center={center} zoom={16} style={{ height: '100%', width: '100%' }} zoomControl={true}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {bounds && <BoundsFitter bounds={bounds} />}
          {children}
        </MapContainer>
      </div>
    </Card>
  );
}
