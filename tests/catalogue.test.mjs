import assert from 'node:assert/strict';
import test from 'node:test';
import { access } from 'node:fs/promises';
import { events, inspirationDirections, eventCollections } from '../app/events/event-catalog.ts';
import { designProfiles, designMatchesFilters, profileForDirection } from '../app/events/design-profiles.ts';
import { referenceSchedule, normalizeGuestCount, scheduleCsv } from '../app/events/reference-schedule.ts';

const direction = (id) => inspirationDirections.find((item) => item.id === id);
const occasion = (fragment) => events.find((item) => item.title.includes(fragment));

test('every design has one collection, a real image and a complete compatible profile', async () => {
  assert.equal(inspirationDirections.length, 48);
  assert.equal(new Set(inspirationDirections.map((item) => item.id)).size, 48);
  assert.equal(new Set(inspirationDirections.map((item) => item.image)).size, 48);
  const assigned = eventCollections.flatMap((item) => item.directionIds);
  assert.equal(assigned.length, 48);
  assert.equal(new Set(assigned).size, 48);
  for (const item of inspirationDirections) {
    const profile = profileForDirection(item);
    assert.ok(profile.description && profile.materials.length >= 3 && profile.signatureItems.length >= 2, item.id);
    assert.ok(profile.occasionIds.length > 0, item.id);
    assert.ok(profile.occasionIds.every((id) => events.some((event) => event.id === id)), item.id);
    assert.ok(profile.minGuests <= profile.referenceGuests && profile.referenceGuests <= profile.maxGuests, item.id);
    await access(new URL(`../public${item.image}`, import.meta.url));
  }
});

test('every occasion has a matching visual and setting/search filters affect designs', () => {
  for (const event of events) {
    assert.ok(inspirationDirections.some((item) => profileForDirection(item).capacityBasis === 'event' && designMatchesFilters(item, { occasionId: event.id })), event.title);
  }
  assert.equal(designMatchesFilters(direction('apartment-atelier'), { setting: 'Outdoor' }), false);
  assert.equal(designMatchesFilters(direction('apartment-atelier'), { query: 'apartment' }), true);
  assert.equal(designMatchesFilters(direction('apartment-atelier'), { query: 'zzz-no-such-design' }), false);
});

test('combined wedding schedule covers reception and reserves without double reserve', () => {
  const rows = referenceSchedule(occasion('Wedding ceremony'), direction('pearl-sage'), 100, 10);
  const table = rows.find((item) => item.item.includes('72-inch round'));
  const linen = rows.find((item) => item.item === 'Floor-length table linen');
  const settings = rows.find((item) => item.item === 'Complete styled place setting');
  assert.equal(table.quantity, 10);
  assert.equal(linen.quantity, 10);
  assert.equal(settings.quantity, 100);
  assert.equal(settings.spare, 10);
  assert.equal(settings.totalQuantity, 110);
  assert.ok(linen.measurement.includes('132'));
  assert.ok(rows.every((item) => item.totalQuantity === item.quantity + item.spare));
  assert.ok(rows.filter((item) => item.zone === 'Logistics').every((item) => item.spare === 0));
  assert.ok(!rows.some((item) => item.zone === 'Weather'), 'an indoor glasshouse should not inherit outdoor ballast from hybrid wedding occasion');
});

test('specialized formats retain their scope and clamp invalid guest counts', () => {
  const sample = occasion('Birthday party');
  const quiet = direction('quiet-cove');
  assert.equal(normalizeGuestCount(quiet, 200), 12);
  assert.equal(normalizeGuestCount(quiet, NaN), profileForDirection(quiet).referenceGuests);
  const quietRows = referenceSchedule(sample, quiet, 200, 0);
  assert.ok(!quietRows.some((item) => /place setting|table linen|welcome portal|programmable LED/i.test(item.item)));
  assert.ok(quietRows.every((item) => item.spare === 0));
  assert.ok(referenceSchedule(occasion('Seminar'), direction('makers-workshop'), 24).some((item) => item.item === 'Individual activity kits' && item.quantity === 24));
  assert.ok(referenceSchedule(occasion('AGM'), direction('screen-salon'), 16).some((item) => item.item === 'Screen, camera and speakerphone package'));
});

test('CSV quotes content safely and exports the same normalized totals', () => {
  const csv = scheduleCsv({ ...occasion('Birthday party'), title: '=malicious, "formula"' }, direction('apartment-atelier'), 100, 15);
  assert.equal(csv.charCodeAt(0), 0xfeff);
  assert.ok(csv.includes('"\'=malicious, ""formula"""'));
  assert.ok(csv.includes('"Reference users / guests","20"'));
  assert.ok(csv.includes('"Base","Spare","Total"'));
});

test('conference, gallery and indoor public formats use suitable reference packages', () => {
  const conference = referenceSchedule(occasion('Conference or convention'), direction('future-forum'), 100);
  assert.ok(conference.some((item) => item.item === 'Conference audience chairs'));
  assert.ok(!conference.some((item) => item.item === 'Modular exhibitor / content bays'));
  const market = referenceSchedule(occasion('Community market'), direction('water-street-market'), 100);
  assert.ok(market.some((item) => item.item === 'Indoor vendor / activity tables'));
  assert.ok(!market.some((item) => /wind-rated canopy/i.test(item.note)));
  const gallery = referenceSchedule(occasion('Art exhibition'), direction('winter-chrome'), 100);
  assert.ok(gallery.some((item) => item.item === 'Freestanding display easels / plinths'));
  assert.ok(!gallery.some((item) => /truss/i.test(item.item)));
  const gaming = referenceSchedule(occasion('Esports'), direction('harbour-blue'), 100);
  assert.ok(gaming.some((item) => item.item === 'Gaming station tables'));
  assert.ok(!gaming.some((item) => /canopy|barrier/i.test(item.item)));
});
