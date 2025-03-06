/**
 * WebSocket client with fallback for environments that don't support WebSockets
 */

class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.listeners = {
      message: [],
      open: [],
      close: [],
      error: []
    };
    
    this.connect();
  }
  
  connect() {
    try {
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = (event) => {
        console.log('WebSocket connected');
        this.connected = true;
        this.reconnectAttempts = 0;
        this.notifyListeners('open', event);
      };
      
      this.socket.onmessage = (event) => {
        this.notifyListeners('message', event);
      };
      
      this.socket.onclose = (event) => {
        console.log('WebSocket disconnected');
        this.connected = false;
        this.notifyListeners('close', event);
        this.attemptReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.notifyListeners('error', error);
        
        // If we're in Vercel, don't attempt to reconnect
        if (window.location.hostname.includes('vercel.app')) {
          console.log('Running in Vercel environment, WebSockets not supported');
          this.fallbackToPolling();
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.fallbackToPolling();
    }
  }
  
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect();
      }, 2000 * this.reconnectAttempts); // Exponential backoff
    } else {
      console.log('Max reconnect attempts reached, falling back to polling');
      this.fallbackToPolling();
    }
  }
  
  fallbackToPolling() {
    console.log('Falling back to polling for updates');
    // Implement polling logic here if needed
    // For example, fetch updates every 5 seconds
    
    // Notify listeners that we're using polling instead
    this.notifyListeners('error', {
      message: 'WebSocket not supported, falling back to polling',
      type: 'fallback'
    });
  }
  
  send(data) {
    if (this.connected) {
      this.socket.send(typeof data === 'string' ? data : JSON.stringify(data));
    } else {
      console.warn('Cannot send message, WebSocket not connected');
    }
  }
  
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
    return this;
  }
  
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
    return this;
  }
  
  notifyListeners(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
  
  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

// Create a singleton instance with graceful fallback
let wsClient = null;

export const getWebSocketClient = (url) => {
  // If we're in Vercel, don't even try to connect to WebSocket
  if (window.location.hostname.includes('vercel.app')) {
    console.log('Running in Vercel environment, WebSockets not supported');
    return {
      on: () => {},
      off: () => {},
      send: () => console.warn('WebSockets not supported in this environment'),
      close: () => {}
    };
  }
  
  // Otherwise, create or return the WebSocket client
  if (!wsClient && url) {
    try {
      wsClient = new WebSocketClient(url);
    } catch (error) {
      console.error('Failed to initialize WebSocket client:', error);
      // Return a dummy client that does nothing
      return {
        on: () => {},
        off: () => {},
        send: () => console.warn('WebSocket initialization failed'),
        close: () => {}
      };
    }
  }
  
  return wsClient;
};

export default WebSocketClient; 