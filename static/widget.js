(function () {
  const nodes = document.querySelectorAll('.biswaas-widget[data-business-slug][data-widget]');
  if (!nodes.length) return;

  const baseUrl = window.BISWAAS_WIDGET_BASE_URL || 'https://biswaas.com';

  nodes.forEach((node) => {
    const businessSlug = node.getAttribute('data-business-slug');
    const widget = node.getAttribute('data-widget');

    if (!businessSlug || !widget) return;

    const iframe = document.createElement('iframe');
    iframe.src = `${baseUrl}/embed/${widget}/${businessSlug}`;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.style.border = '0';
    iframe.style.background = 'transparent';

    if (widget === 'badge') {
      iframe.width = '220';
      iframe.height = '72';
    } else if (widget === 'stars') {
      iframe.width = '260';
      iframe.height = '88';
    } else {
      iframe.width = '100%';
      iframe.height = '320';
    }

    node.replaceChildren(iframe);
  });
})();
