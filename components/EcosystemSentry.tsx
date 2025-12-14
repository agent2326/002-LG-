import React, { Component, useState, useEffect, ReactNode, ErrorInfo } from 'react';

// --- Types ---
interface Warning {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

interface SentryProps {
  children: React.ReactNode;
}

interface SentryState {
  hasError: boolean;
  errorInfo: string | null;
  warnings: Warning[];
  generation: number;
}

// --- LEVEL 1: PROGNOSTIC ENGINE ---
const usePulseDiagnostics = (onRiskDetected: (warning: Warning) => void) => {
  useEffect(() => {
    let lastFrameTime = performance.now();
    let frameDrops = 0;
    let animationId: number;

    const checkPulse = () => {
      const now = performance.now();
      const delta = now - lastFrameTime;
      lastFrameTime = now;

      // If frame takes longer than 50ms, the system is struggling
      if (delta > 50) {
        frameDrops++;
        // Pattern: Fatigue accumulation. 3 consecutive lags = high crash risk.
        if (frameDrops > 3) {
          onRiskDetected({
            type: 'PERFORMANCE_ENTROPY',
            message: 'Rendering arrhythmia detected. UI freeze likely.',
            severity: 'medium'
          });
          frameDrops = 0; // Reset counter
        }
      } else {
        frameDrops = Math.max(0, frameDrops - 1); // Recovery
      }
      animationId = requestAnimationFrame(checkPulse);
    };

    animationId = requestAnimationFrame(checkPulse);
    return () => cancelAnimationFrame(animationId);
  }, [onRiskDetected]);
};

// --- LEVEL 2: SYSTEM HUD ---
const SystemHUD: React.FC<{ warnings: Warning[]; onDismiss: () => void }> = ({ warnings, onDismiss }) => {
  if (warnings.length === 0) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)', color: '#00ff9d', padding: '15px',
      borderRadius: '8px', fontFamily: 'monospace', border: '1px solid #00ff9d',
      boxShadow: '0 0 15px rgba(0, 255, 157, 0.2)', maxWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 10px', fontSize: '14px' }}>👁️ Sentry Alert</h4>
      {warnings.map((w, i) => (
        <div key={i} style={{ marginBottom: '5px', fontSize: '12px', lineHeight: '1.4' }}>
          <span style={{ fontWeight: 'bold' }}>[{w.type}]:</span> {w.message}
        </div>
      ))}
      <button onClick={onDismiss} style={{
        marginTop: '10px', background: 'transparent', border: '1px solid #00ff9d',
        color: '#00ff9d', cursor: 'pointer', padding: '5px 10px', fontSize: '12px', borderRadius: '4px'
      }}>
        Dismiss
      </button>
    </div>
  );
};

// Helper component to use hooks inside class
const PulseMonitor: React.FC<{ onRisk: (w: Warning) => void }> = ({ onRisk }) => {
  usePulseDiagnostics(onRisk);
  return null;
};

// --- LEVEL 3: SELF-HEALING CORE ---
class EcosystemSentry extends React.Component<SentryProps, SentryState> {
  constructor(props: SentryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: null,
      warnings: [],
      generation: 0 // "Rebirth" counter
    };
  }

  static getDerivedStateFromError(_: Error): Partial<SentryState> {
    // Block complete crash
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Reading the error "natal chart"
    console.error("🔥 [Sentry] Critical Failure Intercepted:", error, errorInfo);
    this.setState({ errorInfo: error.toString() });
    
    // In real integration, telemetry is sent here
  }

  addWarning = (warning: Warning) => {
    // Avoid noise duplicates
    this.setState(prev => {
      if (prev.warnings.some(w => w.message === warning.message)) return null;
      return { warnings: [...prev.warnings, warning] };
    });
  }

  attemptSelfHealing = () => {
    // Cleansing ritual: Soft component tree restart without page reload
    console.log("🌱 [Sentry] Initiating Self-Healing protocols...");
    this.setState(prev => ({
      hasError: false,
      errorInfo: null,
      warnings: [],
      generation: prev.generation + 1
    }));
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px', background: '#1a1a1a', color: '#e0e0e0',
          height: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif'
        }}>
          <h2 style={{ color: '#ff4d4d', marginBottom: '10px' }}>⚠️ System Integrity Violation</h2>
          <p style={{ marginBottom: '20px', opacity: 0.8 }}>The module encountered critical entropy.</p>
          <pre style={{ 
            background: '#000', padding: '20px', borderRadius: '8px', 
            maxWidth: '800px', overflowX: 'auto', border: '1px solid #333',
            color: '#ff8080', fontFamily: 'monospace', fontSize: '14px'
          }}>
            {this.state.errorInfo}
          </pre>
          <button
            onClick={this.attemptSelfHealing}
            style={{
              marginTop: '30px', padding: '12px 24px', fontSize: '16px', fontWeight: 'bold',
              background: '#00ff9d', color: '#000', border: 'none', borderRadius: '6px', 
              cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0, 255, 157, 0.3)'
            }}
          >
            ♻️ Initiate Self-Healing Protocol
          </button>
        </div>
      );
    }

    return (
      <React.Fragment>
        {/* Integration of prognostic probe */}
        <PulseMonitor onRisk={this.addWarning} />
        
        {/* Alert system rendering */}
        <SystemHUD 
          warnings={this.state.warnings} 
          onDismiss={() => this.setState({ warnings: [] })} 
        />
        
        {/* Key for forced re-render during "healing" */}
        <div key={this.state.generation} style={{ height: '100%' }}>
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

export default EcosystemSentry;