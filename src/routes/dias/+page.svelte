<script lang="ts">
  import { tick } from 'svelte';
  import { tripDays, loading } from '$lib/stores/trip';
  import DayCard      from '$lib/components/cards/DayCard.svelte';
  import FlashHandler from '$lib/components/ui/FlashHandler.svelte';
  import PageTitle    from '$lib/components/ui/PageTitle.svelte';
  import { todayDm } from '$lib/utils/dates';

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
  {#each $tripDays as day (day.id)}
    <DayCard {day} />
  {/each}
{/if}

