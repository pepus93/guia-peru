<script lang="ts">
  import type { Activity } from '$lib/models/types';
  import DayItem from './DayItem.svelte';

  export let excursion: Activity;
  export let excDayIdx: number;

  $: excDayInfo = excursion.days?.[excDayIdx] ?? null;
  $: isMultiDay = excDayIdx >= 0 && excDayInfo !== null;
</script>

{#if isMultiDay && excDayInfo}
  <DayItem
    href="/planes?flash={excursion.id}"
    icon="🥾"
    iconBg="rgba(120,80,160,.14)"
    label="Trek · Día {excDayIdx + 1} de {excursion.days?.length}"
    title={excDayInfo.title}
    detail={excDayInfo.sub ?? ''}
  />
{:else}
  <DayItem
    href="/planes?flash={excursion.id}"
    icon="🥾"
    iconBg="rgba(120,80,160,.14)"
    label="Excursión · {excursion.time} ({excursion.duration})"
    title={excursion.name}
    detail="📍 {excursion.meet}"
  >
    <svelte:fragment slot="pills">
      {#if excursion.bookingCode || excursion.price}
        <div class="pill-line">
          {#if excursion.bookingCode}<span class="pill pill-green">🎫 {excursion.bookingCode}</span>{/if}
          {#if excursion.price}<span class="pill pill-info">{excursion.price}</span>{/if}
        </div>
      {/if}
    </svelte:fragment>
  </DayItem>
{/if}
