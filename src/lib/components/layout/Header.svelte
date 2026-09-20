<script lang="ts">
  import { peruTime, spainTime, timeDiff } from '$lib/stores/ui';
  import { trip } from '$lib/stores/trip';
  import { daysUntil } from '$lib/utils/dates';

</script>

<header class="app-header">
  <div class="header-top">
    <div class="header-left">
      <a class="header-title" href="/dias">
        <span class="title-main font-serif">Perú 2026</span>
        <span class="title-sub">Pepe & Sunta</span>
      </a>
      <a class="info-btn" href="/info" aria-label="Información">
        <svg viewBox="0 0 20 20" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="10" cy="10" r="8.5"/>
          <line x1="10" y1="9" x2="10" y2="14"/>
          <circle cx="10" cy="6.5" r=".8" fill="currentColor" stroke="none"/>
        </svg>
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
    background: var(--ink);
    color: var(--paper);
    padding: 14px 16px 0;
  }

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 12px;
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
    color: rgba(243,233,219,.55);
    text-decoration: none;
    padding: 4px;
    border-radius: 50%;
    transition: color .15s;
    touch-action: manipulation;
  }
  .info-btn:hover  { color: var(--paper); }
  .info-btn:active { color: var(--gold); }

  .title-main {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    color: var(--paper);
  }

  .title-sub {
    font-size: .8rem;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: rgba(243,233,219,.6);
  }

  .dual-clock {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .clock-pair {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: .9rem;
  }

  .clock-flag { font-size: 1.1rem; }

  .clock-label {
    color: rgba(243,233,219,.55);
    font-size: .82rem;
    line-height: 1;
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .clock-time {
    font-size: .96rem;
    font-weight: 700;
    color: var(--paper);
    letter-spacing: .02em;
    line-height: 1.2;
  }

  .clock-diff {
    font-size: .8rem;
    color: var(--gold);
    font-weight: 700;
    white-space: nowrap;
    background: rgba(224,168,62,.18);
    padding: 2px 6px;
    border-radius: 5px;
  }

</style>
