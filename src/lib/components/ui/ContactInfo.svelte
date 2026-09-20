<script lang="ts">
  import Icon from '$lib/components/ui/Icon.svelte';
  import IconWhatsApp from '$lib/components/ui/IconWhatsApp.svelte';

  export let tel: string | undefined = undefined;
  export let providerName: string | undefined = undefined;
  export let providerTel: string | undefined = undefined;
  export let waHref: string | undefined = undefined;
  export let bookingUrl: string | undefined = undefined;
</script>

{#if tel || providerTel || bookingUrl}
  <div class="ci">
    {#if tel}
      <a class="ci-row" href="tel:{tel}">
        <Icon name="phone" size={14} />
        <span class="ci-val">{tel}</span>
      </a>
    {/if}
    {#if providerTel}
      <a class="ci-row" href="tel:{providerTel}">
        <Icon name="phone" size={14} />
        <span class="ci-val">{providerName ? `${providerName} · ` : ''}{providerTel}</span>
      </a>
      {#if waHref}
        <a class="ci-row ci-wa" href={waHref} target="_blank" rel="noreferrer">
          <IconWhatsApp size={14} />
          <span class="ci-val ci-wa-val">WhatsApp</span>
        </a>
      {/if}
    {/if}
    {#if bookingUrl}
      <a class="ci-booking" href={bookingUrl} target="_blank" rel="noreferrer">
        <Icon name="credit-card" size={14} />
        Ver reserva
      </a>
    {/if}
  </div>
{/if}

<style>
  .ci {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px solid var(--line);
  }

  .ci-row {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 4px 2px;
    text-decoration: none;
    color: var(--ink-soft);
  }

  .ci-val {
    font-size: .82rem;
    font-weight: 600;
    color: var(--sky);
  }

  .ci-wa { color: #128c4a; }
  .ci-wa-val { color: #128c4a; }

  .ci-booking {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: .8rem;
    font-weight: 600;
    text-decoration: none;
    color: var(--ink-soft);
    border: 1px solid var(--line);
    border-radius: 7px;
    padding: 5px 10px;
    margin-top: 2px;
    background: var(--paper-2);
    transition: background .15s;
    width: fit-content;
  }
</style>
