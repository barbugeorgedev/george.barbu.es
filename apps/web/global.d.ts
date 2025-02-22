export {};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void; // Declare the gtag function on the window object
  }
}
