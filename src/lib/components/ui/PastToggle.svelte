<script lang="ts">
  export let count: number;
  export let label: string;
  export let open = false;
</script>

<button class="past-toggle" on:click={() => (open = !open)}>
  <span>{label} ({count})</span>
  <span class="chev" class:open>›</span>
</button>

<style>
  .past-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 4px;
    background: none;
    border: none;
    border-top: 1px solid var(--line);
    margin-top: 4px;
    font-family: inherit;
    font-size: .72rem;
    font-weight: 700;
    color: var(--ink-soft);
    letter-spacing: .06em;
    text-transform: uppercase;
    cursor: pointer;
  }
  .chev {
    font-size: 1rem;
    transition: transform .2s;
    display: inline-block;
  }
  .chev.open { transform: rotate(90deg); }
</style>
