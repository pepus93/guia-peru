<script lang="ts">
  import { peruTime, spainTime, timeDiff } from '$lib/stores/ui';
  import { trip } from '$lib/stores/trip';
  import { daysUntil } from '$lib/utils/dates';

</script>

<header class="app-header">
  <div class="header-top">
    <div class="header-title">
      <span class="title-main font-serif">Perú 2026</span>
      <span class="title-sub">Pepe & Sunta</span>
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

  .header-title {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

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
    font-size: .78rem;
  }

  .clock-flag { font-size: .9rem; }

  .clock-label {
    color: rgba(243,233,219,.55);
    font-size: .74rem;
    line-height: 1;
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .clock-time {
    font-size: .82rem;
    font-weight: 700;
    color: var(--paper);
    letter-spacing: .02em;
    line-height: 1.2;
  }

  .clock-diff {
    font-size: .72rem;
    color: var(--gold);
    font-weight: 700;
    white-space: nowrap;
    background: rgba(224,168,62,.18);
    padding: 2px 6px;
    border-radius: 5px;
  }

</style>
