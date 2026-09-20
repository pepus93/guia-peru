<script lang="ts">
  import type { DayItemProps } from './DayItem.svelte';
  import DayItem from './DayItem.svelte';
  import type { AccommodationModel } from '$lib/models/AccommodationModel';
  import { dmToDate } from '$lib/utils/dates';

  export let hotel: AccommodationModel;
  export let dayDm: number;

  $: nightNum = Math.round(
    (dmToDate(dayDm).getTime() - dmToDate(hotel.data.startDm).getTime()) / 86_400_000
  ) + 1;

  $: props = {
    href:   `/hoteles?flash=${hotel.data.id}`,
    icon:   'bed',
    iconBg: 'rgba(63,125,100,.14)',
    label:  `Dónde dormir · Noche ${nightNum}/${hotel.nights}`,
    title:  hotel.data.name,
    detail: hotel.data.addr,
  } satisfies DayItemProps;
</script>

<DayItem {...props} />
