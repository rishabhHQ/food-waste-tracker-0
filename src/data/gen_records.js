// Run with: node gen_records.js
// Generates records.json for Sep 1 – Oct 31, 2026 (61 days × 3 meals = 183 records)

const fs = require('fs');

// Sep has 30 days, Oct has 31 days → 61 days total

function isWeekend(dateStr) {
  const d = new Date(dateStr);
  const dow = d.getDay(); // 0=Sun,1=Mon,...,5=Fri,6=Sat
  return dow === 0 || dow === 5 || dow === 6; // Fri/Sat/Sun
}

// Deterministic pseudo-random based on seed (avoid true randomness for reproducibility)
function seededRand(seed, min, max) {
  const x = Math.sin(seed) * 10000;
  const r = x - Math.floor(x); // 0..1
  return +(min + r * (max - min)).toFixed(1);
}

// High-waste note pool
const hwNotes = [
  "Event cancelled last minute",
  "Catering overestimated for corporate visit",
  "Holiday menu change led to surplus",
  "Headcount dropped by 40 after RSVP revision",
  "Vendor delivered 20% more than ordered",
  "Kitchen prepared backup batch unnecessarily",
  "Department outing reduced lunch attendance",
  "Training session ran over — many skipped meal",
  "Weather advisory kept staff away from campus",
  "Double preparation due to miscommunication between shifts",
  "Festive special menu over-produced",
  "Guest lecture attendance lower than anticipated",
  "Public holiday confusion — partial attendance",
  "Supply surplus from previous day re-cooked incorrectly",
];

const records = [];
let id = 1;
let hwCount = 0;

// Sep 1 – Sep 30: 30 days
// Oct 1 – Oct 31: 31 days
const days = [];
for (let m = 9; m <= 10; m++) {
  const maxDay = m === 9 ? 30 : 31;
  for (let d = 1; d <= maxDay; d++) {
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    days.push(`2026-${mm}-${dd}`);
  }
}
// Should be 61 days

const meals = ['breakfast', 'lunch', 'dinner'];
// lunch multiplier = 1.0, breakfast = 0.5, dinner = 0.7

for (let di = 0; di < days.length; di++) {
  const date = days[di];
  const weekend = isWeekend(date);

  // Base people count
  const peopleSeed = di * 31 + 7;
  const people = weekend
    ? Math.round(seededRand(peopleSeed, 180, 240))
    : Math.round(seededRand(peopleSeed, 120, 160));

  // Base lunch prepared (highest)
  const lunchBaseSeed = di * 17 + 3;
  const lunchPrepared = weekend
    ? seededRand(lunchBaseSeed, 70, 110)
    : seededRand(lunchBaseSeed, 40, 70);

  for (let mi = 0; mi < meals.length; mi++) {
    const meal = meals[mi];
    const mealMult = meal === 'breakfast' ? 0.5 : meal === 'dinner' ? 0.7 : 1.0;

    const preparedKg = +(lunchPrepared * mealMult).toFixed(1);

    // Predicted: ±5-10% variance from prepared
    const predSeed = di * 53 + mi * 11 + 1;
    const predVariance = seededRand(predSeed, -0.10, 0.10);
    const predictedKg = +(preparedKg * (1 + predVariance)).toFixed(1);

    // Determine high-waste spike (~15% of records)
    // Use a deterministic check: if (di*3+mi) % 7 === 4, it's a spike
    const recIndex = di * 3 + mi;
    const isHighWaste = (recIndex % 7 === 4) && hwCount < 28; // cap at ~28 high-waste events

    let consumedKg, wastedKg, notes;

    if (isHighWaste) {
      // High waste: 15-25% wasted
      const hwSeed = di * 41 + mi * 13 + 5;
      const wasteFrac = seededRand(hwSeed, 0.15, 0.25);
      wastedKg = +(preparedKg * wasteFrac).toFixed(1);
      consumedKg = +(preparedKg - wastedKg).toFixed(1);
      notes = hwNotes[(recIndex) % hwNotes.length];
      hwCount++;
    } else {
      // Normal: consumed 85-95% (weekday) or 80-90% (weekend) of prepared
      const consSeed = di * 29 + mi * 7 + 2;
      const minFrac = weekend ? 0.80 : 0.85;
      const maxFrac = weekend ? 0.90 : 0.95;
      const consFrac = seededRand(consSeed, minFrac, maxFrac);
      consumedKg = +(preparedKg * consFrac).toFixed(1);
      wastedKg = +(preparedKg - consumedKg).toFixed(1);
      notes = "";
    }

    // Ensure non-negative
    if (wastedKg < 0) wastedKg = 0.0;
    if (consumedKg < 0) consumedKg = 0.0;

    records.push({
      id: `rec-${String(id).padStart(3, '0')}`,
      date,
      mealType: meal,
      preparedKg,
      consumedKg,
      wastedKg,
      people,
      predictedKg,
      notes,
    });

    id++;
  }
}

fs.writeFileSync(
  'records.json',
  JSON.stringify(records, null, 2),
  'utf8'
);

console.log(`Generated ${records.length} records (${days.length} days × 3 meals).`);
