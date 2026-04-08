(function() {
  var BISWAAS_URL = 'https://biswaas.pages.dev';

  function init() {
    var widgets = document.querySelectorAll('.biswaas-widget');
    for (var i = 0; i < widgets.length; i++) {
      var el = widgets[i];
      if (el.dataset.loaded) continue;
      var type = el.dataset.type || 'badge';
      var businessId = el.dataset.businessId || '';
      var theme = el.dataset.theme || 'light';
      var iframe = document.createElement('iframe');
      iframe.src = BISWAAS_URL + '/embed/' + type + '/' + businessId + '?theme=' + theme;
      iframe.style.border = 'none';
      iframe.style.width = el.dataset.width || '100%';
      iframe.style.height = el.dataset.height || (type === 'carousel' ? '320px' : type === 'stars' ? '80px' : type === 'mini' ? '40px' : '60px');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('title', 'Biswaas Trust Score');
      el.appendChild(iframe);
      el.dataset.loaded = 'true';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init for SPA
  if (window.MutationObserver) {
    new MutationObserver(init).observe(document.body, { childList: true, subtree: true });
  }
})();
