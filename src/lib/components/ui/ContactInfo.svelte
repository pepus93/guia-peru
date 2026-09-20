<script lang="ts">
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
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M2.5 3.5C3 6 5.5 10 12.5 13.5c.5-1 1-2 1-2s-1.5-1-2-1.5c0 0-.5 0-1 1C9 10 7 8 6 6.5c1-.5 1-1 1-1C6.5 5 5.5 3.5 5.5 3.5c0 0-2-1.5-3 0z"/>
        </svg>
        <span class="ci-val">{tel}</span>
      </a>
    {/if}
    {#if providerTel}
      <a class="ci-row" href="tel:{providerTel}">
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M2.5 3.5C3 6 5.5 10 12.5 13.5c.5-1 1-2 1-2s-1.5-1-2-1.5c0 0-.5 0-1 1C9 10 7 8 6 6.5c1-.5 1-1 1-1C6.5 5 5.5 3.5 5.5 3.5c0 0-2-1.5-3 0z"/>
        </svg>
        <span class="ci-val">{providerName ? `${providerName} · ` : ''}{providerTel}</span>
      </a>
      {#if waHref}
        <a class="ci-row ci-wa" href={waHref} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true">
            <path d="M13.5 2.5A7.5 7.5 0 0 0 1.5 11.7L.5 15.5l3.9-1A7.5 7.5 0 1 0 13.5 2.5zm-5.5 11a6 6 0 0 1-3-.8l-.2-.1-2.3.6.6-2.2-.1-.2A6 6 0 1 1 8 13.5zm3.3-4.4c-.2-.1-1-.5-1.1-.5-.1-.1-.2-.1-.4.1-.1.2-.5.6-.6.7-.1.1-.2.1-.4 0-.2-.1-.8-.3-1.5-.9-.5-.5-.9-1-.9-1.1-.1-.2 0-.3.1-.4l.3-.3.1-.2V7l-.5-1.1c-.1-.3-.3-.3-.4-.3h-.3c-.1 0-.3 0-.5.2-.2.2-.7.6-.7 1.5s.7 1.7.8 1.8c.1.1 1.4 2.1 3.3 3 .5.2.8.3 1.1.4.5.1.9.1 1.3.1.4-.1 1.1-.5 1.3-1 .1-.5.1-.9 0-1z"/>
          </svg>
          <span class="ci-val ci-wa-val">WhatsApp</span>
        </a>
      {/if}
    {/if}
    {#if bookingUrl}
      <a class="ci-booking" href={bookingUrl} target="_blank" rel="noreferrer">🎫 Ver reserva</a>
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

  .ci-wa svg { color: #128c4a; }
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
