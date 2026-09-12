import { Component } from 'react';
import Button from './Button.jsx';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Life RPG crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-void px-6">
          <div className="card-raised p-8 max-w-md text-center">
            <p className="text-3xl mb-3" aria-hidden="true">⚔</p>
            <h1 className="font-display text-xl text-ink mb-2">The realm hit a snag</h1>
            <p className="text-sm text-ink-muted mb-6">
              Something broke on this screen. Your quest data is safe — try reloading.
            </p>
            <Button onClick={() => window.location.reload()}>Reload</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
