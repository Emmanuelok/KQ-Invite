# Catalogue expansion

This update extends the existing Kingsperl Events website in `Emmanuelok/KQ-Invite`, deployed by Vercel project `kq-invite`. It preserves all 42 original concept IDs and images, all 83 occasion labels, and the six existing collections.

## Six distinct additions

| Concept | Gap addressed | Planning capacity |
|---|---|---|
| Apartment Atelier | Compact residential celebrations with household furniture reuse | 8–20 guests |
| Quiet Cove | A separate low-stimulation rest room alongside an event | 6–12 concurrent users, not whole-event attendance |
| Rain Garden | A concrete indoor alternative to a garden event, paired with Orchard Vow | 10–200 guests |
| Open Circle | Floor-level ceremony with integrated companion spaces and clear routes | 10–80 guests |
| Makers’ Workshop | Hands-on learning with practical workstations | 12–48 participants |
| Screen & Salon | Small hybrid meeting with remote participation | 6–24 participants |

These are concept recipes, not surveyed venue capacities or completed client events. New concept imagery is AI-generated and labelled. Prompt provenance is recorded in `brand/catalogue-expansion-images.json`. New concepts have no published price; each is quoted after venue review.

## Functional changes

- Forty-eight canonical design pages at `/events/designs/{id}`, linked from the homepage and searchable visual catalogue.
- Design search, actual depicted setting, collection and occasion filters; six-new-concepts shortcut and empty/reset states.
- Per-design materials, distinct focal pieces, layout and weather notes, plus compatible occasions.
- Build sheets with guest controls, separate base/spare/total columns, and 0/5/10/15% reserve on eligible replaceable stock. Structural and service packages do not receive an automatic reserve.
- CSV download, print/PDF layout, shareable query parameters and dynamic SEO/sitemap entries.
- Combined ceremony/reception schedules now include dining tables, linens and serviceware. Chair reuse is explicit. A 72-inch round table uses 132-inch floor-length linen in these references.
- Indoor settings no longer inherit outdoor ballast figures or weather canopies from an occasion label. Conferences, exhibitions, galleries and gaming use different format schedules.
- Studio handoff retains the canonical design, capacity and spare context, links back to its catalogue build sheet, and identifies the generic full-event estimator as a separate scope. Quiet Cove's concurrent users are not substituted for full-event attendance.

## Remaining opportunities

The original catalogue already contains corporate/conference, community market, Iftar/Eid, Diwali, Lunar New Year, Ghanaian/West African, Indigenous and seasonal occasion coverage. Those are not missing categories. Potential future distinct scenes include a garden wellness retreat and a family Play & Pause layout. A future editorial pass could give existing Pride and fundraising visuals more explicit occasion labels.

## Verification

`npm test` passes 21 tests, including catalogue integrity, image existence, primary-scene coverage for all 83 occasions, filtering, correct combined wedding scope, reserves, specialized capacity bounds and safe CSV serialization. `npm run build` and TypeScript pass.

Desktop browser checks confirm 48 cards, five outdoor scenes, search, six-new-concepts filtering, empty/reset states, detail navigation, guest/spare changes and parameter handoff. Browser download-event capture timed out; CSV serialization is tested, but downloaded-file capture is not verified. Do not claim the production domain has changed until a release is separately confirmed.

The remaining mobile browser inspection is incomplete: a delegated browser action was reported as awaiting approval, and its pending target/reason were not exposed to this thread. It was not repeated. Existing desktop screenshots are in the task evidence folder.
