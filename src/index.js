import loadPolyfills from '@open-wc/polyfills-loader';

loadPolyfills().then(() => {
  import('./components/app-root.js');
});