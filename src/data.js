export const MOOD_OPTIONS = [
  { id: 'zinin',  label: '#zinin',  emoji: '🤩', score: 6 },
  { id: 'prima',  label: 'prima',   emoji: '☺️', score: 5 },
  { id: 'oke',    label: 'wel oké', emoji: '🤷', score: 4 },
  { id: 'meh',    label: 'meh',     emoji: '😐', score: 3 },
  { id: 'vlak',   label: 'vlak',    emoji: '🫥', score: 2 },
  { id: 'kut',    label: 'kut',     emoji: '😞', score: 1 },
  { id: 'error',  label: '#error',  emoji: '😩', score: 0 },
];

export const NEED_OPTIONS = [
  { id: 'zoek_op',  label: 'Niks, ik zoek je op',          emoji: '🤩', score: 5 },
  { id: 'jezelf',   label: 'Niks, wees gewoon jezelf',      emoji: '😚', score: 4 },
  { id: 'aandacht', label: 'Een beetje aandacht en geduld', emoji: '🙏', score: 3 },
  { id: 'er_voor',  label: 'Wees er alsjeblieft voor mij',  emoji: '🥺', score: 2 },
  { id: 'help',     label: 'Ik weet het niet, help!',       emoji: '😭', score: 1 },
];

export function compareAnswers(mineId, theirsId, options) {
  const mine = options.find(o => o.id === mineId);
  const theirs = options.find(o => o.id === theirsId);
  if (!mine || !theirs) return { gap: null, status: 'neutral' };
  const gap = Math.abs(mine.score - theirs.score);
  if (mineId === theirsId) return { gap: 0, status: 'match' };
  if (gap >= 3) return { gap, status: 'mismatch' };
  return { gap, status: 'close' };
}

export function overallMatchScore(moodGap, needGap) {
  const moodPct = Math.max(0, 100 - (moodGap / 6) * 100);
  const needPct = Math.max(0, 100 - (needGap / 4) * 100);
  return Math.round(moodPct * 0.6 + needPct * 0.4);
}

export function fallbackTips(henochMood, marijeMood, henochNeed, marijeNeed) {
  const hM = MOOD_OPTIONS.find(o => o.id === henochMood);
  const mM = MOOD_OPTIONS.find(o => o.id === marijeMood);
  const hN = NEED_OPTIONS.find(o => o.id === henochNeed);
  const mN = NEED_OPTIONS.find(o => o.id === marijeNeed);
  if (!hM || !mM || !hN || !mN) return [];

  const tips = [];
  const moodGap = Math.abs(hM.score - mM.score);
  const lowest = hM.score < mM.score
    ? { name: 'Henoch', m: hM, n: hN }
    : { name: 'Marije', m: mM, n: mN };
  const highest = hM.score < mM.score
    ? { name: 'Marije', m: mM, n: mN }
    : { name: 'Henoch', m: hM, n: hN };

  if (hM.id === mM.id && hM.score >= 5) {
    tips.push(`Jullie zitten allebei op ${hM.emoji} — pak samen iets leuks, dit is een cadeau-dag. 💛`);
    tips.push(`Bel elkaar rond lunch, deel één klein hoogtepunt van je ochtend.`);
  } else if (moodGap >= 3) {
    tips.push(`${highest.name}, houd vandaag een zachte toon — ${lowest.name} zit op ${lowest.m.emoji} en heeft ruimte nodig.`);
    tips.push(`${lowest.name}, je hoeft niets te presteren vandaag. Eén ding tegelijk is genoeg.`);
    tips.push(`Spreek vanavond 15 minuten af zonder telefoon. Gewoon bijpraten, geen oplossingen.`);
  } else {
    tips.push(`Jullie zitten dicht bij elkaar vandaag — check in tussendoor met een korte spraakmemo.`);
    tips.push(`Stuur elkaar vanmiddag een klein dingetje: een foto, een memory, een lief bericht.`);
  }

  if (mN.id === 'er_voor' || hN.id === 'er_voor') {
    const who = mN.id === 'er_voor' ? 'Marije' : 'Henoch';
    tips.push(`${who} vraagt om aanwezigheid. Kies vanavond iets samen — kookshow, wandelingetje, onder één deken.`);
  }
  if (mN.id === 'help' || hN.id === 'help') {
    const who = mN.id === 'help' ? 'Marije' : 'Henoch';
    tips.push(`${who} weet het even niet. Stel één concrete vraag: "Wat zou nu een klein beetje helpen?"`);
  }

  return tips.slice(0, 4);
}

export const DEMO_MOODS = {
  in_sync:  { henoch: { mood: 'zinin', need: 'zoek_op' },  marije: { mood: 'zinin', need: 'zoek_op' } },
  dichtbij: { henoch: { mood: 'prima', need: 'jezelf' },   marije: { mood: 'oke',   need: 'aandacht' } },
  uit_sync: { henoch: { mood: 'prima', need: 'jezelf' },   marije: { mood: 'kut',   need: 'er_voor' } },
  rough:    { henoch: { mood: 'meh',   need: 'aandacht' }, marije: { mood: 'error', need: 'help' } },
};

export const SCENES = [
  { key: 'login',   caption: 'Eerst even inloggen met het geheime woord: vlindermug.' },
  { key: 'notif',   caption: 'Om 6:00 ochtends — een zacht pingetje op beide telefoons.' },
  { key: 'q1',      caption: 'Vraag 1 — Hoe voel je je vandaag?' },
  { key: 'q2',      caption: 'Vraag 2 — Wat heb jij nodig van mij vandaag?' },
  { key: 'waiting', caption: 'Henoch is klaar; Marije doet er nog even over.' },
  { key: 'ready',   caption: 'Allebei ingevuld — een seintje komt binnen.' },
  { key: 'compare', caption: 'In één oogopslag: match-score, antwoorden, en tips voor vandaag.' },
];
