// Polyfill for process in the browser
if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: {},
    browser: true,
    version: '',
    platform: 'browser',
    nextTick: function(fn) {
      setTimeout(fn, 0);
    }
  };
} 