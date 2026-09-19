<script lang="ts">
  import type { TripDay } from '$lib/models/types';
  import { TripDayModel }      from '$lib/models/TripDayModel';
  import { FlightModel }       from '$lib/models/FlightModel';
  import { AccommodationModel } from '$lib/models/AccommodationModel';
  import { ActivityModel }     from '$lib/models/ActivityModel';
  import { activitiesByDay, flightsMap, staysMap, saveDayWarn } from '$lib/stores/trip';
  import { openModal } from '$lib/stores/ui';
  import { slide } from 'svelte/transition';
  import { TRIP_ID } from '$lib/config';

  export let day: TripDay;

  $: model      = new TripDayModel(day);
  $: flightData = day.flightId ? $flightsMap[day.flightId] : undefined;
  $: flight     = flightData ? new FlightModel(flightData) : null;
  $: hotelData  = day.stayId ? $staysMap[day.stayId] : undefined;
  $: hotel      = hotelData ? new AccommodationModel(hotelData) : null;
  $: acts       = ($activitiesByDay[day.d] ?? []).map(a => new ActivityModel(a));

  let expanded   = false;
  let editingWarn = false;
  let warnDraft  = '';

  const toggle = () => (expanded = !expanded);

  function startWarnEdit() {
    warnDraft   = day.warn ?? '';
    editingWarn = true;
  }

  async function saveWarn() {
    await saveDayWarn(day.id, warnDraft.trim());
    editingWarn = false;
  }

  function cancelWarnEdit() { editingWarn = false; }

  function addActivity() {
    openModal('activity', {
      id: '', tripId: TRIP_ID, dayDm: day.d, city: day.city,
      type: 'tour', name: '',
    });
  }
</script>

<article class="day" class:today={model.isToday(-1)} id="day-{day.d}">
  <!-- HEAD ─────────────────────────────────────────────── -->
  <button class="day-head" on:click={toggle} aria-expanded={expanded}>

    <!-- Date block: colored left column per city -->
    <div class="date-block" style="background:{model.cityGradient}">
      <div class="dow">{model.dow}</div>
      <div class="dnum font-serif">{model.dayNum}</div>
      <div class="mon">oct</div>
    </div>

    <!-- Main content -->
    <div class="day-main">
      <div class="day-title font-serif">{day.title}</div>
      <div class="day-sub">{day.sub}</div>
      <div class="badges">
        {#each model.badgeInfos as b}
          <span class="badge {b.cls}">{b.label}</span>
        {/each}
      </div>
    </div>

    <div class="chev" class:open={expanded}>›</div>
  </button>

  <!-- DETAIL ───────────────────────────────────────────── -->
  {#if expanded}
    <div class="detail" role="region" transition:slide={{ duration: 220 }}>
      <div class="detail-inner">

        {#if flight}
          <div class="row">
            <div class="ic fly">✈</div>
            <div class="row-body">
              <div class="rt">{flight.typeLabel}</div>
              <div class="rv flight-time">
                {flight.data.from} {flight.data.dep} → {flight.data.to} {flight.data.arr}
              </div>
              <div class="rd">{flight.data.airline}</div>
              {#if flight.infoBadges.length}
                <div class="pill-line">
                  {#each flight.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
                </div>
              {/if}
              <div class="row-actions">
                <a class="btn-nav" href="/vuelos?flash={day.flightId}">✈ Ver vuelo</a>
              </div>
            </div>
          </div>
        {/if}

        {#if hotel}
          <div class="row">
            <div class="ic bed">🛏</div>
            <div class="row-body">
              <div class="rt">Dónde dormir</div>
              <div class="rv">{hotel.data.name}</div>
              <div class="rd addr">{hotel.data.addr}</div>
              {#if hotel.infoBadges.length}
                <div class="pill-line">
                  {#each hotel.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
                </div>
              {/if}
              <div class="row-actions">
                {#if hotel.data.tel}
                  <a class="call" href="tel:{hotel.data.tel}">📞 Llamar</a>
                {/if}
                <a class="maps" href={hotel.mapsUrl} target="_blank" rel="noreferrer">📍 Mapa</a>
                <a class="btn-nav" href="/hoteles?flash={day.stayId}">🏨 Ver alojamiento</a>
              </div>
            </div>
          </div>
        {/if}

        {#each acts as act}
          <div class="row">
            <div class="ic act" style="background:{act.typeInfo.bg}">{act.typeInfo.icon}</div>
            <div class="row-body">
              <div class="rt">{act.typeInfo.label}{act.timeLabel ? ` · ${act.timeLabel}` : ''}</div>
              <div class="rv">{act.data.name}</div>
              {#if act.data.meet}
                <div class="rd">📍 {act.data.meet}{act.data.end ? ` → 🏁 ${act.data.end}` : ''}</div>
              {/if}
              {#if act.infoBadges.length}
                <div class="pill-line">
                  {#each act.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
                </div>
              {/if}
              <div class="row-actions">
                {#if act.meetUrl}
                  <a class="maps" href={act.meetUrl} target="_blank" rel="noreferrer">📍 Mapa inicio</a>
                {/if}
                {#if act.endUrl}
                  <a class="maps" href={act.endUrl} target="_blank" rel="noreferrer">🏁 Mapa fin</a>
                {/if}
                {#if act.mapsUrl && !act.meetUrl}
                  <a class="maps" href={act.mapsUrl} target="_blank" rel="noreferrer">📍 Mapa</a>
                {/if}
                {#if act.data.tel}
                  <a class="call" href="tel:{act.data.tel}">📞 Llamar</a>
                {/if}
                {#if act.data.bookingUrl}
                  <a class="btn-nav" href={act.data.bookingUrl} target="_blank" rel="noreferrer">🎫 Ver reserva</a>
                {/if}
                <button class="btn-nav" on:click={() => openModal('activity', act.data)}>✏️ Editar</button>
              </div>
            </div>
          </div>
        {/each}

        <!-- ⚠ Warn / OJO block -->
        {#if day.warn || editingWarn}
          <div class="row">
            <div class="ic note">⚠</div>
            <div class="row-body">
              <div class="rt warn-header">
                ¡Ojo!
                {#if !editingWarn}
                  <button class="warn-edit-btn" on:click={startWarnEdit} title="Editar nota">✏️</button>
                {/if}
              </div>

              {#if editingWarn}
                <textarea class="warn-textarea" bind:value={warnDraft} rows="3" placeholder="Escribe una nota de aviso para este día…"></textarea>
                <div class="warn-form-actions">
                  <button class="btn-nav" on:click={cancelWarnEdit}>Cancelar</button>
                  <button class="btn-nav warn-save-btn" on:click={saveWarn}>Guardar</button>
                </div>
              {:else}
                <div class="rv">{day.warn}</div>
              {/if}
            </div>
          </div>
        {:else}
          <!-- Botón para añadir warn si no hay ninguno -->
          <button class="add-warn-btn" on:click={startWarnEdit}>⚠ Añadir nota de aviso</button>
        {/if}

        <button class="add-plan-btn" on:click={addActivity}>+ Añadir plan</button>
      </div>
    </div>
  {/if}
</article>

<style>
  /* ── Card shell ─────────────────────────────────────── */
  .day {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    margin-bottom: 10px;
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: .2s;
  }
  .day.today { border-color: var(--terra); box-shadow: 0 0 0 2px rgba(198,90,52,.25), var(--shadow); }

  /* ── Head ───────────────────────────────────────────── */
  .day-head {
    display: flex;
    align-items: stretch;
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
    padding: 0;
    position: relative;
    text-align: left;
  }

  /* ── Date block ─────────────────────────────────────── */
  .date-block {
    flex: 0 0 58px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 4px;
    gap: 1px;
  }
  .dow { font-size: .58rem; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-soft); font-weight: 600; }
  .dnum { font-size: 1.6rem; font-weight: 600; line-height: 1; color: var(--ink); }
  .mon { font-size: .58rem; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-soft); font-weight: 600; }

  /* ── Day main ───────────────────────────────────────── */
  .day-main { flex: 1; padding: 12px 32px 12px 12px; min-width: 0; }

  .day-title { font-size: 1.08rem; font-weight: 600; line-height: 1.15; letter-spacing: -.01em; }
  .day-sub   { font-size: .77rem; color: var(--ink-soft); margin-top: 1px; }

  .badges { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 7px; }
  .badge  { font-size: .64rem; font-weight: 600; padding: 2px 7px; border-radius: 6px; display: inline-flex; align-items: center; gap: 3px; }
  :global(.b-fly)  { background: rgba(58,110,165,.14);  color: var(--sky); }
  :global(.b-bed)  { background: rgba(63,125,100,.14);  color: var(--jade); }
  :global(.b-act)  { background: rgba(198,90,52,.13);   color: var(--terra-deep); }
  :global(.b-warn) { background: rgba(224,168,62,.2);   color: #9a6b12; }

  .chev {
    position: absolute;
    right: 10px; top: 12px;
    color: var(--ink-soft);
    transition: .25s;
    font-size: 1.05rem;
    line-height: 1;
  }
  .chev.open { transform: rotate(90deg); }

  /* ── Detail ─────────────────────────────────────────── */
  .detail-inner {
    padding: 2px 12px 14px;
    border-top: 1px dashed var(--line);
  }

  .row {
    display: flex;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid var(--line);
  }
  .row:last-of-type { border-bottom: 0; }

  /* ── Icon cell ──────────────────────────────────────── */
  .ic {
    flex: 0 0 32px;
    height: 32px;
    border-radius: 9px;
    display: grid;
    place-items: center;
    font-size: .95rem;
    background: var(--paper-2);
  }
  .ic.fly  { background: rgba(58,110,165,.14); }
  .ic.bed  { background: rgba(63,125,100,.14); }
  .ic.act  { background: rgba(198,90,52,.13); }
  .ic.note { background: rgba(224,168,62,.18); }

  /* ── Row body ───────────────────────────────────────── */
  .row-body { flex: 1; min-width: 0; }
  .rt  { font-size: .68rem; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-soft); font-weight: 600; }
  .rv  { font-size: .9rem; font-weight: 500; margin-top: 4px; line-height: 1.3; }
  .rd  { font-size: .78rem; color: var(--ink-soft); margin-top: 3px; line-height: 1.35; }
  .addr { font-size: .78rem; color: var(--ink-soft); margin-top: 3px; line-height: 1.35; }
  .flight-time { font-family: 'Fraunces', serif; font-weight: 600; }

  /* ── Warn editing ───────────────────────────────────── */
  .warn-header { display: flex; align-items: center; gap: 6px; }
  .warn-edit-btn {
    background: none; border: none; cursor: pointer;
    font-size: .8rem; padding: 0 2px; opacity: .6; transition: .15s;
  }
  .warn-edit-btn:hover { opacity: 1; }

  .warn-textarea {
    width: 100%; margin-top: 6px;
    font-family: inherit; font-size: .84rem;
    background: var(--paper); border: 1px solid var(--line);
    border-radius: var(--radius-sm); padding: 8px 10px;
    outline: none; resize: vertical; line-height: 1.4; transition: .15s;
  }
  .warn-textarea:focus { border-color: var(--gold); }

  .warn-form-actions { display: flex; gap: 6px; margin-top: 6px; justify-content: flex-end; }
  .warn-save-btn { background: rgba(224,168,62,.2) !important; color: #7a5a10 !important; border-color: rgba(224,168,62,.3) !important; }

  .add-warn-btn {
    display: flex; align-items: center; gap: 6px;
    margin-top: 6px; margin-bottom: 2px;
    padding: 5px 10px;
    border: 1px dashed rgba(224,168,62,.4);
    background: rgba(224,168,62,.06);
    border-radius: var(--radius-sm);
    color: #9a6b12; font-family: inherit;
    font-size: .73rem; font-weight: 600;
    cursor: pointer; transition: .15s; width: 100%;
  }
  .add-warn-btn:hover { background: rgba(224,168,62,.12); }

  /* ── Add plan button ────────────────────────────────── */
  .add-plan-btn {
    margin-top: 12px;
    width: 100%;
    padding: 8px;
    border: 1px dashed var(--line);
    background: transparent;
    border-radius: var(--radius-sm);
    color: var(--ink-soft);
    font-family: inherit;
    font-size: .78rem;
    font-weight: 600;
    cursor: pointer;
    transition: .15s;
  }
  .add-plan-btn:hover { background: var(--paper-2); }
</style>
