// src/components/BarcodePrintView.jsx - Improved print layout
import { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

function BarcodePrintView({ plants, onClose }) {
  return (
    <div className="print-container" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      <div className="screen-only" style={{
        maxWidth: '900px',
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
            Print Plant Barcodes ({plants.length} plants)
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

        <div style={{
          backgroundColor: '#2a2a2a',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#aaa',
          fontSize: '14px'
        }}>
          <p style={{ margin: '0 0 10px 0' }}>
            <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#5a8a5e' }}></i>
            <strong>Print Tips:</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: '30px' }}>
            <li>Use adhesive label paper (2" x 4" labels work great)</li>
            <li>Or print on regular paper and use clear tape</li>
            <li>Print in black & white for best barcode scanning</li>
            <li>Cut along the dashed lines</li>
          </ul>
        </div>
      </div>

      <div className="barcode-grid">
        {plants.map(plant => (
          <BarcodeLabel key={plant.id} plant={plant} />
        ))}
      </div>

      <style>{`
        @media screen {
          .barcode-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            padding: 20px;
            max-width: 900px;
            margin: 0 auto;
          }
        }

        @media print {
          /* Hide everything except barcodes */
          body * {
            visibility: hidden;
          }
          
          .print-container {
            position: static !important;
            background: white !important;
          }
          
          .screen-only {
            display: none !important;
          }
          
          .barcode-grid,
          .barcode-grid * {
            visibility: visible;
          }
          
          .barcode-grid {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5cm;
            padding: 0.5cm;
            page-break-after: auto;
          }
          
          .barcode-label {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Ensure all pages print */
          @page {
            margin: 0.5cm;
            size: letter;
          }
        }
      `}</style>
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
          height: 60,
          displayValue: true,
          fontSize: 14,
          margin: 5,
          background: '#ffffff',
          lineColor: '#000000'
        });
      } catch (err) {
        console.error('Barcode generation error:', err);
      }
    }
  }, [plant.id]);

  return (
    <div className="barcode-label" style={{
      backgroundColor: 'white',
      padding: '12px',
      borderRadius: '8px',
      border: '2px dashed #5a8a5e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '140px'
    }}>
      <div style={{
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '8px',
        color: '#2d5016',
        textAlign: 'center',
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {plant.name}
      </div>
      
      {plant.strain && (
        <div style={{
          fontSize: '12px',
          color: '#666',
          marginBottom: '8px',
          textAlign: 'center',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {plant.strain}
        </div>
      )}
      
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
      }}>
        <svg ref={svgRef} style={{ 
          maxWidth: '100%',
          height: 'auto'
        }}></svg>
      </div>
      
      <div style={{
        fontSize: '10px',
        color: '#999',
        marginTop: '5px',
        textAlign: 'center'
      }}>
        {plant.stage || 'Growing'}
      </div>
    </div>
  );
}

export { BarcodePrintView, BarcodeLabel };