import loadPolyfills from '@open-wc/polyfills-loader';
import 'babel-polyfill';

loadPolyfills().then(() => import('./components/app-root.js'));