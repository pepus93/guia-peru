export function applyPageTheme(accent: string | null, pattern: string): () => void {
  if (accent) {
    document.body.style.setProperty('--page-bg', `color-mix(in srgb, ${accent} 8%, var(--paper))`);
    document.body.style.setProperty('--tab-accent', accent);
  }
  document.body.style.backgroundImage = `url("${pattern}")`;
  document.body.style.backgroundRepeat = 'repeat';

  return () => {
    document.body.style.removeProperty('--page-bg');
    document.body.style.removeProperty('--tab-accent');
    document.body.style.backgroundImage = '';
    document.body.style.backgroundRepeat = '';
  };
}
