type EventCallback = (data?: any) => void;

class EventBus {
  private events: Map<string, EventCallback[]>;

  constructor() {
    this.events = new Map();
  }

  // Subscribe to an event
  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    const callbacks = this.events.get(event)!;
    callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  // Emit an event
  emit(event: string, data?: any): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Remove all listeners for an event
  off(event: string): void {
    this.events.delete(event);
  }

  // Clear all events
  clear(): void {
    this.events.clear();
  }
}

// Create singleton instance
const eventBus = new EventBus();

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).eventBus = eventBus;
}

export default eventBus;

// Event types for better type safety
export const EVENTS = {
  NEW_MESSAGE: 'new_message',
  NEW_EMAIL: 'new_email',
  USER_UPDATED: 'user_updated',
  NOTIFICATION: 'notification',
} as const;