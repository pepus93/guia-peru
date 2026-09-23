<script lang="ts">
  import type { DayItemProps } from './DayItem.svelte';
  import DayItem from './DayItem.svelte';
  import type { ActivityModel } from '$lib/models/ActivityModel';
  import { DAY_ENTRY_STYLES, ACTIVITY_TYPES } from '$lib/config/ui';

  export let act: ActivityModel;

  const s = DAY_ENTRY_STYLES.plan;

  $: props = {
    href:   `/planes?flash=${act.data.id}`,
    ...s,
    label:  ACTIVITY_TYPES[act.data.type]?.label ?? act.data.type,
    title:  act.data.name,
    detail: act.data.meet ? `📍 ${act.data.meet}` : '',
    time:   act.data.time || undefined,
  } satisfies DayItemProps;
</script>

<DayItem {...props} />
