import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Phase5Data } from '@/types';
import { createDivIcon } from './MarkerFactory';

interface SprayMarkerProps {
  data: Phase5Data;
  maxSprayRate: number;
}

export function SprayMarker({ data, maxSprayRate }: SprayMarkerProps) {
  let color = '#22c55e'; // Low (Green)
  const rate = data.spray_rate || 0;
  
  if (maxSprayRate > 0) {
    const ratio = rate / maxSprayRate;
    if (ratio > 0.66) color = '#ef4444'; // High (Red)
    else if (ratio > 0.33) color = '#f97316'; // Medium (Orange)
  }

  const icon = createDivIcon(color, 12);

  return (
    <Marker position={[data.lat, data.lon]} icon={icon}>
      <Popup>
        <div className="text-sm">
          <strong>Sequence:</strong> {data.sequence}<br/>
          <strong>Lat:</strong> {data.lat.toFixed(6)}<br/>
          <strong>Lon:</strong> {data.lon.toFixed(6)}<br/>
          <strong>Alt:</strong> {data.alt?.toFixed(2) ?? 'N/A'} m<br/>
          <strong>Spray Rate:</strong> {rate.toFixed(2)} L/ha<br/>
          <strong>Flow Rate:</strong> {data.flow_rate?.toFixed(2)} L/min<br/>
          <strong>PWM:</strong> {data.pwm}<br/>
          <strong>Duration:</strong> {data.duration?.toFixed(1)} s<br/>
          <strong>Target Zone:</strong> {data.target_zone}
        </div>
      </Popup>
    </Marker>
  );
}
