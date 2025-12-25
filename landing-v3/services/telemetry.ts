export class TelemetryService {
  private static instance: TelemetryService;
  private isEnabled: boolean = true;

  private constructor() {
    // In a real app, you'd initialize AppInsights or Plausible here
    console.log('[Telemetry] Initialized for Global Hub');
  }

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  public trackEvent(name: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;
    
    // Log to console for dev, in prod this would go to a real endpoint
    const eventData = {
      event: name,
      timestamp: new Date().toISOString(),
      properties: {
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`
      }
    };

    console.log('%c[Telemetry Event]', 'color: #10b981; font-weight: bold', eventData);
    
    // Example: send to backend
    // fetch('/api/telemetry', { method: 'POST', body: JSON.stringify(eventData) });
  }

  public trackPageView(pageName: string) {
    this.trackEvent('page_view', { page: pageName });
  }

  public trackError(error: Error, info?: string) {
    console.error('[Telemetry Error]', error, info);
    this.trackEvent('error', { message: error.message, stack: error.stack, info });
  }
}

export const telemetry = TelemetryService.getInstance();
