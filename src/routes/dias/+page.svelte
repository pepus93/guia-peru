<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { tripDays, loading } from '$lib/stores/trip';
  import type { TripDay, City } from '$lib/models/types';
  import { CITY_LABELS, CITY_COLORS, PAGE_THEME } from '$lib/config/ui';
  import { applyPageTheme } from '$lib/utils/pageTheme';
  import { useScrollToCurrent } from '$lib/utils/scroll';
  import DayCard      from '$lib/components/cards/DayCard.svelte';
  import FlashHandler from '$lib/components/ui/FlashHandler.svelte';
  import PageTitle    from '$lib/components/ui/PageTitle.svelte';

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

  let cleanup: () => void;
  onMount(() => { cleanup = applyPageTheme(PAGE_THEME.dias.accent, PAGE_THEME.dias.pattern); });
  onDestroy(() => cleanup?.());

  const stopScrollSub = useScrollToCurrent(loading);
</script>

<FlashHandler {loading} />
<PageTitle title="Días" />

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
    padding: 10px 0 14px 46px;
    z-index: 1;
    display: flex;
    align-items: center;
  }

  /* Pin dot on the timeline thread */
  .city-sep::before {
    content: '';
    position: absolute;
    left: 23px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--city-color);
    z-index: 2;
  }

  /* Thread connecting pin to tag */
  .city-sep::after {
    content: '';
    position: absolute;
    left: 35px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 1.5px;
    background: color-mix(in srgb, var(--city-color) 55%, transparent);
  }

  /* Tag body */
  .city-sep-label {
    position: relative;
    display: inline-flex;
    align-items: center;
    background: var(--city-color);
    color: var(--paper);
    font-size: .7rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    padding: 5px 13px 5px 17px;
    border-radius: 3px 7px 7px 3px;
    box-shadow: 0 2px 8px -3px rgba(0,0,0,.35);
    white-space: nowrap;
  }

  /* Ojal — hole at left edge of tag */
  .city-sep-label::before {
    content: '';
    position: absolute;
    left: 6px;
    top: 50%;
    transform: translateY(-50%);
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,.4);
    box-shadow: inset 0 0 0 0.5px rgba(0,0,0,.15);
  }
</style>
