<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { tick } from 'svelte';
  import { scrollAndFlash } from '$lib/utils/flash';
  import type { Readable } from 'svelte/store';

  export let loading: Readable<boolean>;

  let pendingId: string | null = null;
  let done = false;

  afterNavigate(({ to }) => {
    pendingId = to?.url.searchParams.get('flash') ?? null;
    done = false;
  });

  $: if (pendingId && !done && !$loading) {
    done = true;
    const id = pendingId;
    tick().then(() => scrollAndFlash(id));
  }
</script>
