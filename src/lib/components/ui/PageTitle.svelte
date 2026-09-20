<script lang="ts">
  export let title: string;
  export let eyebrow: string = '';
</script>

<div class="page-title">
  {#if eyebrow}<span class="pt-eyebrow">{eyebrow}</span>{/if}
  <h1 class="pt-heading font-serif">{title}</h1>
  <div class="pt-rule"></div>
</div>

<style>
  .page-title {
    padding: 22px 16px 16px;
  }

  .pt-eyebrow {
    display: block;
    font-size: .65rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--terra);
    margin-bottom: 4px;
  }

  .pt-heading {
    font-size: 2rem;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
    margin: 0;
  }

  .pt-rule {
    width: 28px;
    height: 3px;
    background: var(--terra);
    border-radius: 2px;
    margin-top: 8px;
    opacity: .7;
  }
</style>
