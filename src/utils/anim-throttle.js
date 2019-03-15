export default function throttle(fn) {
  let inThrottle;
  return function() {
    const context = this,
          args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
    } else {
      requestAnimationFrame(() => {
        inThrottle = false;
        fn.apply(context, args);
      });
    }
  };
};