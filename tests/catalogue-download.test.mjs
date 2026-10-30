import assert from 'node:assert/strict';
import test from 'node:test';
import { GET } from '../app/events/designs/[id]/build-sheet.csv/route.ts';
import { events, inspirationDirections } from '../app/events/event-catalog.ts';
import { profileForDirection } from '../app/events/design-profiles.ts';
import { scheduleCsv } from '../app/events/reference-schedule.ts';

const requestSheet = (id, query = '') => GET(new Request(`https://www.kingsperl.com/events/designs/${encodeURIComponent(id)}/build-sheet.csv${query}`), { params: Promise.resolve({ id }) });
const readCsv = async (response) => Buffer.from(await response.arrayBuffer()).toString('utf8');

test('CSV endpoint serves a UTF-8 attachment with reference defaults and no cache', async () => {
  const response = await requestSheet('apartment-atelier');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/csv; charset=utf-8');
  assert.equal(response.headers.get('content-disposition'), 'attachment; filename="kingsperl-apartment-atelier-12-guests.csv"');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  const csv = await readCsv(response);
  assert.equal(csv.charCodeAt(0), 0xfeff);
  assert.ok(csv.includes('"Reference users / guests","12"'));
  assert.ok(csv.includes('"Reserve on replaceable stock (%)","10"'));
  assert.ok(csv.includes('"Base","Spare","Total"'));
});

test('CSV endpoint exports the selected compatible occasion and normalized quantities', async () => {
  const direction = inspirationDirections.find((item) => item.id === 'apartment-atelier');
  const event = events.find((item) => item.id === 'milestone-birthday');
  const response = await requestSheet(direction.id, `?event=${event.id}&guests=9999&reserve=15`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-disposition'), 'attachment; filename="kingsperl-apartment-atelier-20-guests.csv"');
  assert.equal(await readCsv(response), scheduleCsv(event, direction, 20, 15));
});

test('CSV endpoint rejects unknown designs and incompatible or injected occasion identifiers', async () => {
  const unknown = await requestSheet('../not-a-design');
  assert.equal(unknown.status, 404);
  assert.equal(unknown.headers.get('content-disposition'), null);
  const incompatible = events.find((item) => !profileForDirection('apartment-atelier').occasionIds.includes(item.id));
  assert.equal((await requestSheet('apartment-atelier', `?event=${incompatible.id}`)).status, 400);
  assert.equal((await requestSheet('apartment-atelier', '?event=%3Dmalicious%0D%0AInjected')).status, 400);
});

test('CSV endpoint labels concurrent users correctly and ignores malformed numeric values', async () => {
  const response = await requestSheet('quiet-cove', '?guests=NaN&reserve=101&filename=evil%0D%0AX-Header%3Ayes');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-disposition'), 'attachment; filename="kingsperl-quiet-cove-8-users.csv"');
  const csv = await readCsv(response);
  assert.ok(csv.includes('"Reference users / guests","8"'));
  assert.ok(csv.includes('"Reserve on replaceable stock (%)","10"'));
  assert.ok(!csv.includes('evil'));
  assert.ok(!csv.includes('X-Header'));
});
