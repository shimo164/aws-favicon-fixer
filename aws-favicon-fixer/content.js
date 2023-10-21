const FAVICON_URL = chrome.runtime.getURL('icons/favicon-xray.svg');

// Functions to get DOM elements
const getFaviconDomEl = () => document.querySelector("link[rel~='icon']");
const getTitleDomEl = () => document.querySelector('head > title');

// Function to set favicon
const setFavicon = () => {
  const linkEl = document.createElement('link');
  linkEl.rel = 'icon';
  linkEl.type = 'image/x-icon';
  linkEl.href = FAVICON_URL;

  const existingFavicon = getFaviconDomEl();
  if (existingFavicon) {
    existingFavicon.remove();
  }

  document.head.appendChild(linkEl);
};

// Function to set title
const setTitle = () => {
  if (document.title !== 'X-Ray') {
    document.title = 'X-Ray';
  }
};

// Title change observer
const titleObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      setTitle();
    }
  });
});

const observeTitleChanges = () => {
  const titleEl = getTitleDomEl();
  if (titleEl) {
    titleObserver.disconnect();
    titleObserver.observe(titleEl, { childList: true });
  }
};

// Handle URL change
const onURLChange = () => {
  if (window.location.href.includes('#xray')) {
    setFavicon();
    setTitle();
    observeTitleChanges();
  } else {
    titleObserver.disconnect();
  }
};

// Event listeners for page load and URL change
window.addEventListener('load', onURLChange);
window.addEventListener('popstate', onURLChange);

// Override pushState method to add custom event
(function (history) {
  const originalPushState = history.pushState;
  history.pushState = function (state) {
    if (typeof history.onpushstate === 'function') {
      history.onpushstate({ state: state });
    }
    return originalPushState.apply(history, arguments);
  };
})(window.history);

window.history.onpushstate = onURLChange;
