<script lang="ts">
  interface Props {
    src: string;
    alt: string;
    width: number;
    height: number;
    class?: string;
  }

  let { src, alt, width, height, class: className = '' }: Props = $props();

  const sizes = [320, 640, 768, 1024, 1280];

  function buildSrcset(url: string): string {
    return sizes
      .filter((s) => s <= width * 2)
      .map((s) => {
        const ext = url.split('.').pop();
        const base = url.replace(`.${ext}`, '');
        return `${base}-${s}w.webp ${s}w`;
      })
      .join(', ');
  }

  const srcset = buildSrcset(src);
  const sizesAttr = `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${width}px`;
</script>

<picture>
  <source type="image/webp" {srcset} sizes={sizesAttr} />
  <img
    {src}
    {alt}
    {width}
    {height}
    loading="lazy"
    decoding="async"
    class={className}
    style="aspect-ratio: {width}/{height}; object-fit: cover;"
  />
</picture>
