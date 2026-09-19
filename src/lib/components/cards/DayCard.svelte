<script lang="ts">
  import type { TripDay } from '$lib/models/types';
  import { TripDayModel }       from '$lib/models/TripDayModel';
  import { FlightModel }        from '$lib/models/FlightModel';
  import { AccommodationModel } from '$lib/models/AccommodationModel';
  import { ActivityModel }      from '$lib/models/ActivityModel';
  import DayRow                 from '$lib/components/cards/DayRow.svelte';
  import { dmToDate }           from '$lib/utils/dates';
  import { activitiesByDay, flightsMap, staysMap, activitiesMap, saveDayWarn } from '$lib/stores/trip';
  import { openModal, flashId } from '$lib/stores/ui';
  import { slide } from 'svelte/transition';
  import { TRIP_ID } from '$lib/config';

  export let day: TripDay;

  $: model      = new TripDayModel(day);
  $: flights = (day.flightIds ?? [])
      .map(id => $flightsMap[id])
      .filter(Boolean)
      .map(f => new FlightModel(f));
  $: hotelData  = day.stayId      ? $staysMap[day.stayId]            : undefined;
  $: hotel      = hotelData       ? new AccommodationModel(hotelData) : null;
  $: excursion  = day.excursionId ? $activitiesMap[day.excursionId]   : undefined;
  $: acts       = ($activitiesByDay[day.d] ?? []).map(a => new ActivityModel(a));

  // Para excursiones multi-día: índice 0-based del día actual dentro del trek
  $: excDayIdx  = excursion?.endDayDm != null
    ? Math.round((dmToDate(day.d).getTime() - dmToDate(excursion.dayDm).getTime()) / 86_400_000)
    : -1;
  $: excDayInfo = excursion?.days?.[excDayIdx] ?? null;

  function timeToMinutes(t: string | undefined): number {
    if (!t) return 840; // sin hora → mediodía como fallback
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  }

  type DayItem =
    | { kind: 'flight';   flight: FlightModel }
    | { kind: 'hotel' }
    | { kind: 'excursion' }
    | { kind: 'activity'; act: ActivityModel };

  $: dayItems = ([
    ...flights.map(f  => ({ kind: 'flight'    as const, sortKey: timeToMinutes(f.data.dep), flight: f })),
    ...(excursion ? [{ kind: 'excursion' as const, sortKey: timeToMinutes(excursion.time) }] : []),
    ...acts.map(a  => ({ kind: 'activity' as const, sortKey: timeToMinutes(a.data.time), act: a })),
    ...(hotel     ? [{ kind: 'hotel'     as const, sortKey: 9999 }] : []),
  ]).sort((a, b) => a.sortKey - b.sortKey);

  let expanded    = false;
  $: if ($flashId === day.id) expanded = true;
  let editingWarn = false;
  let warnDraft   = '';

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

<article class="day" class:today={model.isToday()} class:is-past={model.isPast} id={day.id}>

  <!-- HEAD ─────────────────────────────────────────────── -->
  <button class="day-head" on:click={toggle} aria-expanded={expanded}>

    <div class="date-block" style="background:{model.cityGradient}">
      <div class="dow">{model.dow}</div>
      <div class="dnum font-serif">{model.dayNum}</div>
      <div class="mon">oct</div>
    </div>

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

        <!-- Filas ordenadas por hora -->
        {#each dayItems as item}

          {#if item.kind === 'flight'}
            <DayRow
              icon="✈"
              iconBg="rgba(58,110,165,.14)"
              label={item.flight.typeLabel}
              title="{item.flight.data.from} {item.flight.data.dep} → {item.flight.data.to} {item.flight.data.arr}"
              detail={item.flight.data.airline}
              titleSerif={true}
            >
              <svelte:fragment slot="pills">
                {#if item.flight.infoBadges.length}
                  <div class="pill-line">
                    {#each item.flight.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
                  </div>
                {/if}
              </svelte:fragment>
              <svelte:fragment slot="actions">
                <div class="row-actions">
                  <a class="btn-nav" href="/vuelos?flash={item.flight.data.id}">✈ Ver vuelo</a>
                </div>
              </svelte:fragment>
            </DayRow>

          {:else if item.kind === 'excursion' && excursion}
            {#if excDayInfo}
              <DayRow
                icon="🥾"
                iconBg="rgba(120,80,160,.14)"
                label="Trek · Día {excDayIdx + 1} de {excursion.days?.length}"
                title={excDayInfo.title}
                detail={excDayInfo.sub ?? ''}
              >
                <svelte:fragment slot="actions">
                  <div class="row-actions">
                    <a class="call" href="tel:{excursion.providerTel}">📞 {excursion.provider}</a>
                    <a class="btn-nav" href="/planes?flash={excursion.id}">🥾 Ver plan</a>
                  </div>
                </svelte:fragment>
              </DayRow>
            {:else}
              <DayRow
                icon="🥾"
                iconBg="rgba(120,80,160,.14)"
                label="Excursión · {excursion.time} ({excursion.duration})"
                title={excursion.name}
                detail="📍 {excursion.meet}"
              >
                <svelte:fragment slot="pills">
                  <div class="pill-line">
                    <span class="pill pill-green">🎫 {excursion.bookingCode}</span>
                    <span class="pill pill-info">{excursion.price}</span>
                  </div>
                </svelte:fragment>
                <svelte:fragment slot="actions">
                  <div class="row-actions">
                    <a class="call" href="tel:{excursion.providerTel}">📞 {excursion.provider}</a>
                    <a class="btn-nav" href="/planes?flash={excursion.id}">🥾 Ver plan</a>
                  </div>
                </svelte:fragment>
              </DayRow>
            {/if}

          {:else if item.kind === 'activity'}
            <DayRow
              icon={item.act.typeInfo.icon}
              iconBg={item.act.typeInfo.bg}
              label="{item.act.typeInfo.label}{item.act.timeLabel ? ` · ${item.act.timeLabel}` : ''}"
              title={item.act.data.name}
              detail={item.act.data.meet ? `📍 ${item.act.data.meet}` : ''}
            >
              <svelte:fragment slot="pills">
                {#if item.act.infoBadges.length}
                  <div class="pill-line">
                    {#each item.act.infoBadges.slice(0, 2) as b}<span class="pill {b.cls}">{b.label}</span>{/each}
                  </div>
                {/if}
              </svelte:fragment>
              <svelte:fragment slot="actions">
                <div class="row-actions">
                  {#if item.act.meetUrl}<a class="maps" href={item.act.meetUrl} target="_blank" rel="noreferrer">📍 Mapa</a>{/if}
                  {#if item.act.data.tel}<a class="call" href="tel:{item.act.data.tel}">📞</a>{/if}
                  <a class="btn-nav" href="/planes?flash={item.act.data.id}">🎯 Ver plan</a>
                </div>
              </svelte:fragment>
            </DayRow>

          {:else if item.kind === 'hotel' && hotel}
            <DayRow
              icon="🛏"
              iconBg="rgba(63,125,100,.14)"
              label="Dónde dormir"
              title={hotel.data.name}
              detail={hotel.data.addr}
            >
              <svelte:fragment slot="pills">
                {#if hotel.infoBadges.length}
                  <div class="pill-line">
                    {#each hotel.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
                  </div>
                {/if}
              </svelte:fragment>
              <svelte:fragment slot="actions">
                <div class="row-actions">
                  {#if hotel.data.tel}<a class="call" href="tel:{hotel.data.tel}">📞 Llamar</a>{/if}
                  <a class="maps" href={hotel.mapsUrl} target="_blank" rel="noreferrer">📍 Mapa</a>
                  <a class="btn-nav" href="/hoteles?flash={day.stayId}">🏨 Ver alojamiento</a>
                </div>
              </svelte:fragment>
            </DayRow>
          {/if}

        {/each}

        <!-- ⚠ Aviso del día -->
        {#if editingWarn}
          <div class="warn-edit-block">
            <div class="warn-label">⚠ ¡Ojo!</div>
            <textarea
              class="warn-textarea"
              bind:value={warnDraft}
              rows="3"
              placeholder="Escribe una nota de aviso para este día…"
            ></textarea>
            <div class="warn-form-actions">
              <button class="btn-nav" on:click={cancelWarnEdit}>Cancelar</button>
              <button class="btn-nav warn-save-btn" on:click={saveWarn}>Guardar</button>
            </div>
          </div>
        {:else if day.warn}
          <DayRow icon="⚠" iconBg="rgba(224,168,62,.18)" label="¡Ojo!" title={day.warn}>
            <svelte:fragment slot="actions">
              <div class="row-actions">
                <button class="btn-nav" on:click={startWarnEdit}>✏️ Editar aviso</button>
              </div>
            </svelte:fragment>
          </DayRow>
        {:else}
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
  .day.today   { border-color: var(--terra); box-shadow: 0 0 0 2px rgba(198,90,52,.25), var(--shadow); }
  .day.is-past { opacity: .45; filter: grayscale(.4); }

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
  .dow  { font-size: .58rem; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-soft); font-weight: 600; }
  .dnum { font-size: 1.6rem; font-weight: 600; line-height: 1; color: var(--ink); }
  .mon  { font-size: .58rem; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-soft); font-weight: 600; }

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

  .chev { position: absolute; right: 10px; top: 12px; color: var(--ink-soft); transition: .25s; font-size: 1.05rem; line-height: 1; }
  .chev.open { transform: rotate(90deg); }

  /* ── Detail ─────────────────────────────────────────── */
  .detail-inner {
    padding: 2px 12px 14px;
    border-top: 1px dashed var(--line);
  }

  /* ── Warn editing ───────────────────────────────────── */
  .warn-edit-block {
    padding: 10px 0;
    border-bottom: 1px solid var(--line);
  }

  .warn-label {
    font-size: .68rem;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--ink-soft);
    font-weight: 600;
    margin-bottom: 6px;
  }

  .warn-textarea {
    width: 100%;
    font-family: inherit;
    font-size: .84rem;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    padding: 8px 10px;
    outline: none;
    resize: vertical;
    line-height: 1.4;
    transition: .15s;
  }
  .warn-textarea:focus { border-color: var(--gold); }

  .warn-form-actions { display: flex; gap: 6px; margin-top: 6px; justify-content: flex-end; }
  .warn-save-btn { background: rgba(224,168,62,.2) !important; color: #7a5a10 !important; border-color: rgba(224,168,62,.3) !important; }

  /* ── Add warn button ────────────────────────────────── */
  .add-warn-btn {
    display: flex; align-items: center; gap: 6px;
    margin-top: 6px; margin-bottom: 2px;
    padding: 5px 10px;
    border: 1px dashed rgba(224,168,62,.4);
    background: rgba(224,168,62,.06);
    border-radius: var(--radius-sm);
    color: #9a6b12;
    font-family: inherit;
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
    font-size: .78rem; font-weight: 600;
    cursor: pointer; transition: .15s;
  }
  .add-plan-btn:hover { background: var(--paper-2); }
</style>
