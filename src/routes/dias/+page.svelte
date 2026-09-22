<script lang="ts">
  import { tick } from 'svelte';
  import { tripDays, loading } from '$lib/stores/trip';
  import type { TripDay, City } from '$lib/models/types';
  import { CITY_LABELS } from '$lib/models/types';
  import DayCard      from '$lib/components/cards/DayCard.svelte';
  import FlashHandler from '$lib/components/ui/FlashHandler.svelte';
  import PageTitle    from '$lib/components/ui/PageTitle.svelte';
  import { todayDm } from '$lib/utils/dates';

  const CITY_COLORS: Record<string, string> = {
    lima:     'var(--sky)',
    arequipa: 'var(--terra)',
    cusco:    'var(--jade)',
    selva:    '#5a9a4a',
  };

  type DisplayItem =
    | { type: 'city'; city: City; count: number }
    | { type: 'day';  day: TripDay };

  $: displayItems = (() => {
    const items: DisplayItem[] = [];
    const days = $tripDays;
    let i = 0;
    while (i < days.length) {
      const city = days[i].city;
      let j = i;
      while (j < days.length && days[j].city === city) j++;
      items.push({ type: 'city', city, count: j - i });
      for (let k = i; k < j; k++) items.push({ type: 'day', day: days[k] });
      i = j;
    }
    return items;
  })();

  let scrolled = false;
  $: if (!$loading && !scrolled) {
    scrolled = true;
    tick().then(() => {
      const today = $tripDays.find(d => d.d === todayDm());
      if (today) document.getElementById(today.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
</script>

<FlashHandler {loading} />
<PageTitle title="Días" eyebrow="Perú 2026" />

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else}
  <div class="days-list">
    {#each displayItems as item, i (item.type === 'day' ? item.day.id : 'city-' + i)}
      {#if item.type === 'city'}
        <div class="city-sep" style="--city-color: {CITY_COLORS[item.city] ?? 'var(--ink-soft)'}">
          <span class="city-sep-label">
            {CITY_LABELS[item.city] ?? item.city} · {item.count} {item.count === 1 ? 'día' : 'días'}
          </span>
        </div>
      {:else}
        <DayCard day={item.day} />
      {/if}
    {/each}
  </div>
{/if}

<style>
  /* ── Timeline container ─────────────────────────── */
  .days-list {
    position: relative;
  }

  /* Hilo vertical que une todos los días */
  .days-list::before {
    content: '';
    position: absolute;
    left: 29px; /* centro del date-block de 58px */
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--line);
    pointer-events: none;
    z-index: 0;
  }

  /* ── City section header ─────────────────────────── */
  .city-sep {
    position: relative;
    padding: 8px 0 12px 70px; /* 58px date-block + 12px gap */
    z-index: 1;
  }

  /* Dot de ciudad sobre el hilo */
  .city-sep::before {
    content: '';
    position: absolute;
    left: 23px; /* 29px centro - 6px radio */
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--city-color);
  }

  .city-sep-label {
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--city-color);
  }
</style>
