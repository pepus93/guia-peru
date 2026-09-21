<script lang="ts">
  import type { DayItemProps } from './DayItem.svelte';
  import DayItem from './DayItem.svelte';
  import type { Activity } from '$lib/models/types';
  import { DAY_ENTRY_STYLES } from '$lib/models/types';

  export let excursion: Activity;
  export let excDayIdx: number;

  const s = DAY_ENTRY_STYLES.plan;

  $: excDayInfo = excursion.days?.[excDayIdx] ?? null;

  $: props = (excDayIdx >= 0 && excDayInfo)
    ? {
        href:   `/planes?flash=${excursion.id}`,
        ...s,
        label:  `Trek · Día ${excDayIdx + 1} de ${excursion.days?.length}`,
        title:  excDayInfo.title,
        detail: excDayInfo.sub ?? '',
      } satisfies DayItemProps
    : {
        href:   `/planes?flash=${excursion.id}`,
        ...s,
        label:  'Excursión',
        title:  excursion.name,
        detail: excursion.meet ? `📍 ${excursion.meet}` : '',
        time:   excursion.time || undefined,
      } satisfies DayItemProps;
</script>

<DayItem {...props} />
