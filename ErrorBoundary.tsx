
import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = { hasError: false };
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: 40, 
          fontFamily: "system-ui", 
          textAlign: "center", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#fafaf9", // stone-50
          color: "#1c1917" // stone-900
        }}>
          <h2 style={{ fontWeight: 300, marginBottom: 16 }}>Something went wrong.</h2>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
