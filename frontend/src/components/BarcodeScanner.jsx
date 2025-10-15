// src/components/BarcodeScanner.jsx - Using html5-qrcode library
import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function BarcodeScanner({ onScan, onClose }) {
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [cameras, setCameras] = useState([]);
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);

  useEffect(() => {
    initScanner();
    return () => {
      stopScanning();
    };
  }, []);

  const initScanner = async () => {
    try {
      // Get available cameras
      const devices = await Html5Qrcode.getCameras();
      
      if (devices && devices.length > 0) {
        setCameras(devices);
        
        // Find back camera or use first available
        const backCamera = devices.find(d => 
          d.label.toLowerCase().includes('back') || 
          d.label.toLowerCase().includes('rear') ||
          d.label.toLowerCase().includes('environment')
        ) || devices[0];
        
        console.log('Available cameras:', devices);
        console.log('Using camera:', backCamera.label);
        
        startScanning(backCamera.id);
      } else {
        throw new Error('No cameras found');
      }
    } catch (err) {
      console.error('Scanner initialization error:', err);
      setError('Unable to access camera. Please check permissions.');
      setManualEntry(true);
    }
  };

  const startScanning = async (cameraId) => {
    try {
      const scanner = new Html5Qrcode("barcode-reader");
      scannerInstanceRef.current = scanner;

      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 150 }
        },
        (decodedText) => {
          console.log('Barcode detected:', decodedText);
          setScanning(false);
          stopScanning();
          onScan(decodedText);
        },
        (errorMessage) => {
          // Ignore scanning errors - they happen continuously while searching
        }
      );

      setScanning(true);
      setError(null);
    } catch (err) {
      console.error('Failed to start scanning:', err);
      setError('Failed to start camera. ' + err.message);
      setManualEntry(true);
    }
  };

  const stopScanning = async () => {
    if (scannerInstanceRef.current) {
      try {
        if (scannerInstanceRef.current.isScanning) {
          await scannerInstanceRef.current.stop();
        }
        scannerInstanceRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const handleManualEntry = () => {
    setManualEntry(true);
    stopScanning();
  };

  const handleManualSubmit = (e) => {
    e?.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
    }
  };

  if (manualEntry) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.95)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          padding: '20px',
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          margin: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{ color: 'white', margin: 0 }}>
              <i className="fas fa-keyboard" style={{ marginRight: '10px' }}></i>
              Enter Plant ID
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '5px 10px'
              }}
            >
              ×
            </button>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#c62828',
              color: 'white',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
              {error}
            </div>
          )}

          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '2px solid #5a8a5e'
          }}>
            <p style={{ color: '#aaa', fontSize: '14px', margin: '0 0 15px 0' }}>
              <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
              Find the plant ID on the barcode label or in the plant list
            </p>
            
            <form onSubmit={handleManualSubmit}>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter plant ID (e.g., 1759790820277)"
                autoFocus
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '18px',
                  border: '2px solid #444',
                  borderRadius: '6px',
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  boxSizing: 'border-box'
                }}
              />
            </form>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleManualSubmit}
              disabled={!manualCode.trim()}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: manualCode.trim() ? '#5a8a5e' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: manualCode.trim() ? 'pointer' : 'not-allowed',
                fontSize: '16px'
              }}
            >
              <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
              Find Plant
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.95)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: 'white', margin: 0 }}>
            <i className="fas fa-barcode" style={{ marginRight: '10px' }}></i>
            Scan Plant Barcode
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px 10px'
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#c62828',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
            {error}
          </div>
        )}

        <div style={{
          position: 'relative',
          backgroundColor: '#000',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div id="barcode-reader" style={{ width: '100%' }}></div>
          
          {scanning && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontSize: '14px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: '8px 16px',
              borderRadius: '4px',
              whiteSpace: 'nowrap'
            }}>
              <i className="fas fa-camera" style={{ marginRight: '8px' }}></i>
              Position barcode in the green box
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '20px'
        }}>
          <button
            onClick={handleManualEntry}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#5a8a5e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <i className="fas fa-keyboard" style={{ marginRight: '8px' }}></i>
            Manual Entry
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Cancel
          </button>
        </div>

        <div style={{
          color: '#aaa',
          fontSize: '14px',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <i className="fas fa-info-circle" style={{ marginRight: '5px' }}></i>
          {scanning ? 'Scanning active...' : 'Initializing camera...'}
        </div>
      </div>
    </div>
  );
}

export default BarcodeScanner;