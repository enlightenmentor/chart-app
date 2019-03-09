import loadPolyfills from '@open-wc/polyfills-loader';

loadPolyfills().then(() => {
  import('./components/chart-app.js');
});