import type { BusinessRecord } from '$lib/data/businesses';

export type EmbedWidget = {
  id: 'badge' | 'stars' | 'carousel';
  name: string;
  description: string;
  width: string;
  height: string;
};

export const embedWidgets: EmbedWidget[] = [
  {
    id: 'badge',
    name: 'Trust Badge',
    description: 'Show your Biswaas trust score as a compact badge.',
    width: '220',
    height: '72'
  },
  {
    id: 'stars',
    name: 'Star Rating',
    description: 'Display your star rating together with review volume.',
    width: '260',
    height: '88'
  },
  {
    id: 'carousel',
    name: 'Review Carousel',
    description: 'Showcase recent reviews in a horizontally scrollable card strip.',
    width: '100%',
    height: '320'
  }
];

export function buildIframeCode(origin: string, business: BusinessRecord, widget: EmbedWidget) {
  return `<iframe src="${origin}/embed/${widget.id}/${business.slug}" width="${widget.width}" height="${widget.height}" frameborder="0" loading="lazy" title="${business.name} ${widget.name}"></iframe>`;
}
