<script lang="ts">
  import { peruTime, spainTime, timeDiff } from '$lib/stores/ui';
  import { TRIP_LABEL } from '$lib/config';
  import Icon from '$lib/components/ui/Icon.svelte';

</script>

<header class="app-header">
  <div class="header-top">
    <div class="header-left">
      <a class="header-title" href="/dias">
        <span class="title-main font-serif">{TRIP_LABEL}</span>
        <span class="title-sub">Pepe & Sunta</span>
      </a>
      <a class="info-btn" href="/info" aria-label="Información">
        <Icon name="info" size={22} />
      </a>
    </div>
    <div class="dual-clock">
      <div class="clock-pair">
        <span class="clock-flag">🇵🇪</span>
        <div>
          <div class="clock-label">Perú</div>
          <span class="clock-time">{$peruTime}</span>
        </div>
      </div>
      <div class="clock-pair">
        <span class="clock-flag">🇪🇸</span>
        <div>
          <div class="clock-label">España</div>
          <span class="clock-time">{$spainTime}</span>
        </div>
      </div>
      <span class="clock-diff">{$timeDiff}</span>
    </div>
  </div>
</header>

<style>
  .app-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--card);
    border-bottom: 1px solid var(--line);
    box-shadow: 0 4px 20px -10px rgba(42,26,18,.15);
    padding: 12px 16px;
  }

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .header-title {
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-decoration: none;
  }

  .info-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ink-soft);
    opacity: .5;
    text-decoration: none;
    padding: 4px;
    border-radius: 50%;
    transition: opacity .15s;
    touch-action: manipulation;
  }
  .info-btn:hover  { opacity: .9; }
  .info-btn:active { opacity: 1; color: var(--terra); }

  .title-main {
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1;
    color: var(--ink);
  }

  .title-sub {
    font-size: .72rem;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--ink-soft);
    opacity: .6;
  }

  .dual-clock {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .clock-pair {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .clock-flag { font-size: 1rem; }

  .clock-label {
    color: var(--ink-soft);
    opacity: .6;
    font-size: .7rem;
    line-height: 1;
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .clock-time {
    font-size: .9rem;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: .01em;
    line-height: 1.2;
  }

  .clock-diff {
    font-size: .75rem;
    color: var(--terra-deep);
    font-weight: 700;
    white-space: nowrap;
    background: color-mix(in srgb, var(--terra) 10%, transparent);
    padding: 2px 7px;
    border-radius: 6px;
  }

</style>
