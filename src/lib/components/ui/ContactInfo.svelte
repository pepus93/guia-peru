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
      <div class="ci-row">
        <span class="ci-label">{tel}</span>
        <div class="ci-actions">
          <a class="ci-btn" href="tel:{tel}" aria-label="Llamar">
            <Icon name="phone" size={15} />
          </a>
        </div>
      </div>
    {/if}

    {#if providerTel}
      <div class="ci-row">
        <span class="ci-label">{providerName ? `${providerName} · ` : ''}{providerTel}</span>
        <div class="ci-actions">
          <a class="ci-btn" href="tel:{providerTel}" aria-label="Llamar">
            <Icon name="phone" size={15} />
          </a>
          {#if waHref}
            <a class="ci-btn ci-btn-wa" href={waHref} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <IconWhatsApp size={15} />
            </a>
          {/if}
        </div>
      </div>
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
    gap: 4px;
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px solid var(--line);
  }

  .ci-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  .ci-label {
    font-size: .82rem;
    font-weight: 600;
    color: var(--sky);
    white-space: nowrap;
  }

  .ci-actions {
    display: flex;
    gap: 5px;
    flex-shrink: 0;
  }

  .ci-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--sky) 12%, transparent);
    color: var(--sky);
    text-decoration: none;
    transition: background .15s;
    -webkit-tap-highlight-color: transparent;
  }
  .ci-btn:active { background: color-mix(in srgb, var(--sky) 28%, transparent); }
  @media (hover: hover) { .ci-btn:hover { background: color-mix(in srgb, var(--sky) 22%, transparent); } }

  .ci-btn-wa {
    background: color-mix(in srgb, var(--whatsapp) 12%, transparent);
    color: var(--whatsapp);
  }
  .ci-btn-wa:active { background: color-mix(in srgb, var(--whatsapp) 28%, transparent); }
  @media (hover: hover) { .ci-btn-wa:hover { background: color-mix(in srgb, var(--whatsapp) 22%, transparent); } }

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
