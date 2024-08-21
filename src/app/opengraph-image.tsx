import { ImageResponse } from 'next/og';
import { TbMapPinBolt } from 'react-icons/tb';

export const runtime = 'edge';

// Image metadata
export const alt = 'Voltfinder';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: '#3b82f6',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 50,
        }}
      >
        <TbMapPinBolt color='#fff' size={200} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h1 style={{ color: '#fff', margin: 0 }}>Voltfinder</h1>
          <p style={{ color: '#dbeafe', opacity: 50, margin: 0 }}>by Bálint Berente</p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
