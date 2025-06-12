// src/index.js
// React հավելվածի մուտքակետ

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
// Performance monitoring (պրոդակշնի համար)
// import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

/**
 * Հիմնական React հավելվածի գործարկում
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

/**
 * Performance մոնիթորինգ (ընդլայնական)
 * Կարող է օգտագործվել հավելվածի արագության գնահատման համար
 */
// function sendToAnalytics(metric) {
//   console.log('Performance metric:', metric);
//   // Կարող է ուղարկվել Google Analytics-ին կամ այլ ծառայության
// }

// // Core Web Vitals-ի մոնիթորինգ
// getCLS(sendToAnalytics);
// getFID(sendToAnalytics);
// getFCP(sendToAnalytics);
// getLCP(sendToAnalytics);
// getTTFB(sendToAnalytics);

/**
 * Service Worker գրանցում (PWA-ի համար)
 * Offline աշխատանքի և կեշավորման համար
 */
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('SW registered: ', registration);
//       })
//       .catch((registrationError) => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }

/**
 * Չմշակված սխալների հսկում
 */
window.addEventListener('error', (event) => {
  console.error('Չմշակված JavaScript սխալ:', event.error);
  // Կարող է ուղարկվել սխալների հավաքման ծառայության (Sentry, LogRocket, etc.)
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Չմշակված Promise rejection:', event.reason);
  // Promise-ների սխալների հսկում
});

/**
 * Console-ի ողջույնի հաղորդագրություն (կարող է հեռացվել պրոդակշնից)
 */
if (process.env.NODE_ENV === 'development') {
  console.log(
    '%c🔬 Տվյալների վերլուծության համակարգ v1.0.0',
    'color: #667eea; font-size: 16px; font-weight: bold;'
  );
  console.log(
    '%cՄշակված է React-ով և Tailwind CSS-ով',
    'color: #6366f1; font-size: 12px;'
  );
}