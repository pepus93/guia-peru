import type { Trip, TripDay, Activity, Flight, Accommodation, Traveler } from '$lib/models/types';

const TRIP_ID = 'peru-2026';

// ── Trip ───────────────────────────────────────────────────

export const SEED_TRIP: Trip = {
  id:        TRIP_ID,
  name:      'Perú 2026',
  subtitle:  'Pepe & Sunta · 18 días',
  startDm:   1009,
  endDm:     1026,
  totalDays: 18,
};

// ── Travelers ──────────────────────────────────────────────

export const SEED_TRAVELERS: Traveler[] = [
  {
    id: 'pepe', tripId: TRIP_ID,
    name: 'Josep Mercadal Mascaro', nickname: 'Pepe',
    dni: '41745453Q', born: '08/01/1993', dniValid: '09/05/2027',
    passport: 'PAO978322', passportValid: '21/09/2027',
  },
  {
    id: 'sunta', tripId: TRIP_ID,
    name: 'Assumpta Seguí Capó', nickname: 'Sunta',
    dni: '41746538C', born: '01/03/1994', dniValid: '23/05/2034',
    passport: 'PAR893817', passportValid: '01/09/2028',
  },
];

// ── Accommodations ─────────────────────────────────────────

export const SEED_ACCOMMODATIONS: Accommodation[] = [
  {
    id: 'lima1', tripId: TRIP_ID,
    name: 'Hotel Límade ★★★', city: 'lima',
    dates: '9 oct', startDm: 1009, endDm: 1010,
    addr: 'Calle Bellavista 112, Miraflores, 15074 Lima, Perú',
    tel: '+51934017223',
    checkIn: 'desde las 15:00', checkOut: 'hasta las 12:00',
  },
  {
    id: 'arequipa', tripId: TRIP_ID,
    name: 'Bon Repos Boutique ★★★', city: 'arequipa',
    dates: '10 – 13 oct', startDm: 1010, endDm: 1013, stars: 3, rating: 8.6,
    addr: '401 Calle Bolivar, Arequipa, Perú',
    tel: '+51948855727',
    checkIn: '13:00 – 23:30', checkOut: '10:30 – 11:00',
    notes: 'Desayuno incluido',
  },
  {
    id: 'cusco1', tripId: TRIP_ID,
    name: 'Hotel Waynapicchu ★★', city: 'cusco',
    dates: '13 – 16 oct', startDm: 1013, endDm: 1016, stars: 2,
    addr: 'Av. Garcilazo 216-A, Centro de Cusco',
    tel: '+5184248880',
    checkIn: '11:30 – 12:00', checkOut: '10:00 – 10:30',
  },
  {
    id: 'cusco2', tripId: TRIP_ID,
    name: 'Quechua Hostal Recoleta ★★', city: 'cusco',
    dates: '19 – 22 oct', startDm: 1019, endDm: 1022, stars: 2,
    addr: 'Calle Recoleta Angosta - Pasaje Pantac 388, San Blas, Cusco',
    tel: '+51920767982',
    checkIn: 'desde las 11:00', checkOut: 'hasta las 10:00',
  },
  {
    id: 'selva1', tripId: TRIP_ID,
    name: "Majacho's House", city: 'selva',
    dates: '22 – 24 oct', startDm: 1022, endDm: 1024,
    addr: 'Carretera Bajo Tambopata km 5, Puerto Maldonado',
    tel: '+51974780954',
    checkIn: '11:00 – 16:00', checkOut: '9:00 – 10:00',
  },
  {
    id: 'selva2', tripId: TRIP_ID,
    name: "Heliconia's Inn", city: 'selva',
    dates: '24 – 25 oct', startDm: 1024, endDm: 1025,
    addr: 'Jr. Tacna 864, 17001 Puerto Maldonado',
    tel: '+51987089163',
    checkIn: '14:00 – 15:00', checkOut: '10:00 – 11:00',
  },
];

// ── Flights ────────────────────────────────────────────────

export const SEED_FLIGHTS: Flight[] = [
  {
    id: 'f1', tripId: TRIP_ID,
    date: '9 oct', dm: 1009, dow: 'Vie', intl: true,
    from: 'BCN', fromCity: 'Barcelona',
    to: 'LIM', toCity: 'Lima',
    dep: '13:55', arr: '19:50',
    airline: 'LEVEL', code: 'LL2611',
    note: 'Duración 12h 55m',
    transport: {
      how: 'Metro L9 Sur desde Pl. Catalunya (4,90€, ~35 min) o Aerobus T1/T2 (6,75€, ~35 min). Taxi ~30-40€.',
    },
  },
  {
    id: 'f2', tripId: TRIP_ID,
    date: '10 oct', dm: 1010, dow: 'Sáb',
    from: 'LIM', fromCity: 'Lima',
    to: 'AQP', toCity: 'Arequipa',
    dep: '14:30', arr: '16:02',
    airline: 'JetSmart', code: 'VGDC3R',
    price: '159,09€',
    note: 'JA 7013 · 1h 32 min',
    transport: {
      how: 'Taxi desde Miraflores (~35 min, 35-45 S/). Usar Cabify o inDriver para mayor seguridad.',
    },
  },
  {
    id: 'f3', tripId: TRIP_ID,
    date: '13 oct', dm: 1013, dow: 'Mar',
    from: 'AQP', fromCity: 'Arequipa',
    to: 'CUZ', toCity: 'Cusco',
    dep: '17:05', arr: '21:10',
    airline: 'JetSmart', code: 'EE73XX',
    price: '78,02€',
    stops: '1 escala en Lima',
    note: 'AQP→LIM JA 7006 (17:05-18:45) · Escala 1h (cambio de avión) · LIM→CUZ JA 7023 (19:45-21:10)',
    transport: {
      how: 'Taxi desde el centro de Arequipa (~20 min, 15-20 S/).',
    },
  },
  {
    id: 'f4', tripId: TRIP_ID,
    date: '22 oct', dm: 1022, dow: 'Jue',
    from: 'CUZ', fromCity: 'Cusco',
    to: 'PEM', toCity: 'P. Maldonado',
    dep: '08:45', arr: '09:45',
    airline: 'Sky Airline', code: 'AILHSM',
    price: '82,69€',
    note: 'H2 5721 · 1h directo',
    transport: {
      how: 'Taxi desde el centro de Cusco (~15 min, 8-12 S/). El aeropuerto está muy cerca.',
    },
  },
  {
    id: 'f5', tripId: TRIP_ID,
    date: '25 oct', dm: 1025, dow: 'Dom',
    from: 'PEM', fromCity: 'P. Maldonado',
    to: 'LIM', toCity: 'Lima',
    dep: '08:45', arr: '10:25',
    airline: 'Latam', code: 'SZXDEV',
    price: '216,58€',
    note: 'LA 2193 · 1h 40 min',
    transport: {
      how: 'Taxi desde la ciudad (~10 min, 10-15 S/). El aeropuerto está muy cerca.',
    },
  },
  {
    id: 'f6', tripId: TRIP_ID,
    date: '25 oct', dm: 1025, dow: 'Dom', intl: true,
    from: 'LIM', fromCity: 'Lima',
    to: 'BCN', toCity: 'Barcelona',
    dep: '22:10', arr: '16:45',
    airline: 'LEVEL', code: 'LL2610',
    note: '11h 35m · llega +1 día (26 oct)',
    transport: {
      how: 'Taxi desde Miraflores o Barranco (~35 min, 35-45 S/). Usar Cabify o inDriver. Confirmar la noche antes.',
    },
  },
];

// ── Trip Days ──────────────────────────────────────────────

export const SEED_DAYS: TripDay[] = [
  {
    id: 'd09', tripId: TRIP_ID, d: 1009, city: 'lima',
    place: 'Barcelona → Lima',
    title: 'Vuelo de ida',
    sub: 'BCN 13:55 → Lima 19:50 · noche en Miraflores',
    flightId: 'f1', stayId: 'lima1',
    badges: ['fly', 'bed'],
  },
  {
    id: 'd10', tripId: TRIP_ID, d: 1010, city: 'arequipa',
    place: 'Lima → Arequipa',
    title: 'Vuelo a Arequipa',
    sub: 'Mañana: free tour · Mediodía: vuelo a Arequipa',
    flightId: 'f2', stayId: 'arequipa',
    badges: ['fly', 'bed', 'act'],
  },
  {
    id: 'd11', tripId: TRIP_ID, d: 1011, city: 'arequipa',
    place: 'Arequipa',
    title: 'Visitar Arequipa',
    sub: 'Ciudad Blanca · aclimatación a 2.335m',
    stayId: 'arequipa',
    badges: ['act', 'bed'],
  },
  {
    id: 'd12', tripId: TRIP_ID, d: 1012, city: 'arequipa',
    place: 'Arequipa → Colca',
    title: 'Valle del Colca',
    sub: 'Cañón y cóndores · mirador Cruz del Cóndor (3.900m)',
    stayId: 'arequipa',
    badges: ['act', 'bed'],
  },
  {
    id: 'd13', tripId: TRIP_ID, d: 1013, city: 'cusco',
    place: 'Arequipa → Cusco',
    title: 'Vuelo a Cusco',
    sub: 'Vuelo tarde · llegada a 3.400m · cuidado con la altitud',
    flightId: 'f3', stayId: 'cusco1',
    badges: ['fly', 'bed'],
    warn: 'Al llegar a Cusco (3.400m): no correr, no comer mucho, beber agua, tomar mate de coca. El cuerpo necesita unas horas.',
  },
  {
    id: 'd14', tripId: TRIP_ID, d: 1014, city: 'cusco',
    place: 'Cusco',
    title: 'Cusco: visita tranquila',
    sub: 'Aclimatación · San Blas · Plaza de Armas',
    stayId: 'cusco1',
    badges: ['act', 'bed'],
  },
  {
    id: 'd15', tripId: TRIP_ID, d: 1015, city: 'cusco',
    place: 'Cusco → Valle Sagrado',
    title: 'Valle Sagrado de los Incas',
    sub: 'Pisac · Ollantaytambo · Moray/Maras',
    stayId: 'cusco1',
    badges: ['act', 'bed'],
  },
  {
    id: 'd16', tripId: TRIP_ID, d: 1016, city: 'cusco',
    place: 'Trek · Día 1',
    title: 'Salkantay — Lago Humantay',
    sub: 'Challacancha → Lago Humantay (4.200m) → Soraypampa',
    badges: ['act', 'warn'],
    warn: 'Check-out del Hotel Waynapicchu esta mañana. Noches 16, 17, 18 incluidas en el trek.',
  },
  {
    id: 'd17', tripId: TRIP_ID, d: 1017, city: 'cusco',
    place: 'Trek · Día 2',
    title: 'Salkantay — El Paso (4.650m)',
    sub: 'El punto más alto y más épico del trek',
    badges: ['act'],
  },
  {
    id: 'd18', tripId: TRIP_ID, d: 1018, city: 'cusco',
    place: 'Trek · Día 3',
    title: 'Salkantay — Llactapata → Aguas Calientes',
    sub: 'Ruinas incas · tren a Aguas Calientes',
    badges: ['act', 'bed'],
  },
  {
    id: 'd19', tripId: TRIP_ID, d: 1019, city: 'cusco',
    place: 'Trek · Día 4',
    title: '¡Machu Picchu! → Cusco',
    sub: 'La gran jornada · tren de vuelta a Cusco',
    stayId: 'cusco2',
    badges: ['act', 'warn', 'bed'],
    warn: 'Huayna Picchu: reservar con SAM Travel por WhatsApp +51 992 126 224. Cupos muy limitados.',
  },
  {
    id: 'd20', tripId: TRIP_ID, d: 1020, city: 'cusco',
    place: 'Cusco',
    title: '7 Lagunas de Ausangate',
    sub: 'Excursión de día completo · 4.600m',
    stayId: 'cusco2',
    badges: ['act', 'bed'],
  },
  {
    id: 'd21', tripId: TRIP_ID, d: 1021, city: 'cusco',
    place: 'Cusco',
    title: 'Montaña de 7 Colores',
    sub: 'Vinicunca (5.200m) · el punto más alto del viaje',
    stayId: 'cusco2',
    badges: ['act', 'bed'],
  },
  {
    id: 'd22', tripId: TRIP_ID, d: 1022, city: 'selva',
    place: 'Cusco → P. Maldonado',
    title: 'A la selva amazónica',
    sub: 'Vuelo mañana temprano · entrada a Tambopata',
    flightId: 'f4', stayId: 'selva1',
    badges: ['fly', 'act', 'bed'],
  },
  {
    id: 'd23', tripId: TRIP_ID, d: 1023, city: 'selva',
    place: 'Tambopata · Selva',
    title: 'Día completo en la Amazonia',
    sub: 'Fauna, flora y selva virgen',
    stayId: 'selva1',
    badges: ['act', 'bed'],
  },
  {
    id: 'd24', tripId: TRIP_ID, d: 1024, city: 'selva',
    place: 'Selva → P. Maldonado',
    title: 'Último día de selva',
    sub: 'Noche en Puerto Maldonado ciudad',
    stayId: 'selva2',
    badges: ['act', 'bed'],
  },
  {
    id: 'd25', tripId: TRIP_ID, d: 1025, city: 'selva',
    place: 'P. Maldonado → Lima → Barcelona',
    title: 'Regreso a casa',
    sub: 'Vuelo mañana · día en Lima · vuelo a Barcelona',
    flightId: 'f5',
    badges: ['fly', 'act', 'warn'],
    warn: 'Vuelo LEVEL LL2610 a las 22:10 desde Lima. Llega a Barcelona el día 26 a las 16:45. ¡No perderlo!',
  },
  {
    id: 'd26', tripId: TRIP_ID, d: 1026, city: 'lima',
    place: 'Barcelona · llegada',
    title: 'Llegada a Barcelona',
    sub: '16:45 · fin del viaje · bienvenidos a casa',
    badges: ['fly'],
  },
];

// ── Activities ─────────────────────────────────────────────

export const SEED_ACTIVITIES: Activity[] = [
  {
    id: 'a1010_0', tripId: TRIP_ID, dayDm: 1010, city: 'arequipa',
    type: 'tour',
    name: 'Free Tour Miraflores',
    time: '10:00', duration: '~2h',
    note: 'Civitatis · propina voluntaria',
    meet: 'Óvalo de Miraflores',
    end: 'Parque del Amor',
    meetQuery: 'Óvalo de Miraflores, Miraflores, Lima',
    endQuery: 'Parque del Amor, Miraflores, Lima',
  },
];
