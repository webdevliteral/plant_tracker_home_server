// ==================================================
// src/components/BarcodePrintView.jsx
// ==================================================
import { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

function BarcodePrintView({ plants, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(0,0,0,0.95)',
          padding: '10px 0',
          zIndex: 10
        }}>
          <h2 style={{ color: 'white', margin: 0 }}>
            <i className="fas fa-print" style={{ marginRight: '10px' }}></i>
            Print Plant Barcodes
          </h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => window.print()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#5a8a5e',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              <i className="fas fa-print" style={{ marginRight: '8px' }}></i>
              Print
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Close
            </button>
          </div>
        </div>

        <div className="barcode-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          padding: '20px 0'
        }}>
          {plants.map(plant => (
            <BarcodeLabel key={plant.id} plant={plant} />
          ))}
        </div>

        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .barcode-grid, .barcode-grid * {
              visibility: visible;
            }
            .barcode-grid {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10mm;
              padding: 10mm;
            }
            button {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

function BarcodeLabel({ plant }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      try {
        JsBarcode(svgRef.current, plant.id.toString(), {
          format: 'CODE128',
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 14,
          margin: 10
        });
      } catch (err) {
        console.error('Barcode generation error:', err);
      }
    }
  }, [plant.id]);

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      border: '2px dashed #5a8a5e',
      pageBreakInside: 'avoid'
    }}>
      <div style={{
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#2d5016',
        textAlign: 'center'
      }}>
        {plant.name}
      </div>
      {plant.strain && (
        <div style={{
          fontSize: '12px',
          color: '#666',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          {plant.strain}
        </div>
      )}
      <svg ref={svgRef} style={{ width: '100%', height: 'auto' }}></svg>
      <div style={{
        fontSize: '11px',
        color: '#999',
        marginTop: '10px',
        textAlign: 'center'
      }}>
        Stage: {plant.stage || 'Growing'}
      </div>
    </div>
  );
}

export { BarcodePrintView, BarcodeLabel };