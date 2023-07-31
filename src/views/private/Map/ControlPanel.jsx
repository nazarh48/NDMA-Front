import * as React from 'react';
import area from '@turf/area';

function ControlPanel(props) {
  let polygonArea = 0;
  for (const polygon of props.polygons) {
    polygonArea += area(polygon);
  }

  return (
    <div style={{
      position: 'absolute',
      top: '10rem',
      left: '-1rem',
      maxWidth: '320px',
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      padding: '12px 24px',
      margin: '20px',
      fontSize: '13px',
      lineHeight: '2',
      color: '#6b6b76',
      textTransform: 'uppercase',
      outline: 'none'
    }}>
      <h3>Polygon Area</h3>
      {polygonArea > 0 && (
        <p>
          {Math.round(polygonArea * 100) / 100} <br />
          square meters
        </p>
      )}

    </div>
  );
}

export default React.memo(ControlPanel);