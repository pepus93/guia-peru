<script lang="ts">
  import type { AccommodationModel } from '$lib/models/AccommodationModel';
  import { dmToDate } from '$lib/utils/dates';
  import DayItem from './DayItem.svelte';

  export let hotel: AccommodationModel;
  export let dayDm: number;

  $: nightNum = Math.round(
    (dmToDate(dayDm).getTime() - dmToDate(hotel.data.startDm).getTime()) / 86_400_000
  ) + 1;
</script>

<DayItem
  href="/hoteles?flash={hotel.data.id}"
  icon="🛏"
  iconBg="rgba(63,125,100,.14)"
  label="Dónde dormir · Noche {nightNum}/{hotel.nights}"
  title={hotel.data.name}
  detail={hotel.data.addr}
>
  <svelte:fragment slot="pills">
    {#if hotel.infoBadges.length}
      <div class="pill-line">
        {#each hotel.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
      </div>
    {/if}
  </svelte:fragment>
</DayItem>
