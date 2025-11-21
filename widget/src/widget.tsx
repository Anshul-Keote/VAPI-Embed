import React from 'react';
import ReactDOM from 'react-dom/client';
import CourtneyWidget from './components/CourtneyWidget';
import './index.css';

export interface CourtneyWidgetConfig {
  target: string | HTMLElement;
  apiEndpoint: string;
  publicKey: string;
  assistantId: string;
}

class CourtneyWidgetInstance {
  private root: ReactDOM.Root | null = null;
  private container: HTMLElement | null = null;

  init(config: CourtneyWidgetConfig) {
    // Get target element
    let targetElement: HTMLElement | null;

    if (typeof config.target === 'string') {
      targetElement = document.querySelector(config.target);
    } else {
      targetElement = config.target;
    }

    if (!targetElement) {
      throw new Error(`CourtneyWidget: Target element "${config.target}" not found`);
    }

    // Store config in window for components to access
    (window as any).__COURTNEY_WIDGET_CONFIG__ = {
      apiEndpoint: config.apiEndpoint,
      publicKey: config.publicKey,
      assistantId: config.assistantId,
    };

    // Create container
    this.container = targetElement;

    // Mount React app
    this.root = ReactDOM.createRoot(this.container);
    this.root.render(
      <React.StrictMode>
        <CourtneyWidget />
      </React.StrictMode>
    );

    console.log('[CourtneyWidget] Initialized successfully');
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
    delete (window as any).__COURTNEY_WIDGET_CONFIG__;
    console.log('[CourtneyWidget] Destroyed');
  }
}

// Expose to window
declare global {
  interface Window {
    CourtneyWidget: {
      init: (config: CourtneyWidgetConfig) => void;
      destroy: () => void;
    };
  }
}

const widgetInstance = new CourtneyWidgetInstance();

window.CourtneyWidget = {
  init: (config: CourtneyWidgetConfig) => widgetInstance.init(config),
  destroy: () => widgetInstance.destroy(),
};

export default widgetInstance;
