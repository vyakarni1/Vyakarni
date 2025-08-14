/// <reference types="vite/client" />

declare global {
  interface Window {
    gtag_report_conversion?: (url?: string) => boolean;
    gtag: (...args: any[]) => void;
  }
}

declare const gtag_report_conversion: ((url?: string) => boolean) | undefined;
