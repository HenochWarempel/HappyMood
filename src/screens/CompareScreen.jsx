import { useState, useEffect } from 'react';
import Wordmark from '../components/Wordmark.jsx';
import { MOOD_OPTIONS, NEED_OPTIONS, compareAnswers, overallMatchScore, fallbackTips } from '../data.js';

function StatusPill({ status }) {
  const map = {
    match:    { bg: '#D4F4DD', ink: '#1F6B42', label: '✓ match' },
    close:    { bg: '#FFF0D4', ink: '#8A6A1F', label: '≈ dichtbij' },
    mismatch: { bg: '#FFD4D4', ink: '#8A2A2A', label: '⚠ uit elkaar' },
    neutral:  { bg: '#EEE',    ink: '#555',    label: '—' },
  };
  const s = map[status] || map.neutral;
  return (
    <span style={{
      background: s.bg,
      color: s.ink,
      fontWeight: 800,
      fontSize: 11,
      padding: '3px 9px',
      borderRadius: 999,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
    }}>{s.label}</span>
  );
}

function AnswerChip({ person, option, highlight }) {
  const bg =
    highlight === 'match'    ? '#D4F4DD' :
    highlight === 'mismatch' ? '#FFD4D4' :
    highlight === 'close'    ? '#FFF5E0' : '#fff';
  const border =
    highlight === 'match'    ? '#74D99F' :
    highlight === 'mismatch' ? '#FF8A8A' :
    highlight === 'close'    ? '#FFD58A' : '#EEE';
  return (
    <div style={{
      background: bg,
      border: `2px solid ${border}`,
      borderRadius: 16,
      padding: '12px 12px',
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{ fontSize: 28, lineHeight: 1 }}>{option.emoji}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 10, color: '#9A8A86', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {person}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#3A2A2A', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {option.label}
        </div>
      </div>
    </div>
  );
}

function MatchScoreRing({ score, animate }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!animate) { setProgress(score); return; }
    setProgress(0);
    const t = setTimeout(() => setProgress(score), 100);
    return () => clearTimeout(t);
  }, [score, animate]);

  const dash = (progress / 100) * c;
  const color = score >= 70 ? '#74D99F' : score >= 40 ? '#FFB547' : '#FF8A8A';
  const label =
    score >= 80 ? 'jullie vibe-en ✨' :
    score >= 60 ? 'best dichtbij 💛' :
    score >= 40 ? 'beetje uit sync 🌤' :
    'ver uit elkaar 🌧';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: 128, height: 128 }}>
        <svg width="128" height="128" viewBox="0 0 128 128" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="64" cy="64" r={r} fill="none" stroke="#FFE8DF" strokeWidth="10" />
          <circle
            cx="64" cy="64" r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ fontFamily: 'Fraunces', fontWeight: 900, fontSize: 34, color: '#3A2A2A', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {progress}
          </div>
          <div style={{ fontSize: 10, color: '#9A8A86', fontWeight: 800, letterSpacing: '0.08em' }}>
            MATCH
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Caveat', fontSize: 26, color: '#3A2A2A', lineHeight: 1.05 }}>
          {label}
        </div>
        <div style={{ fontSize: 13, color: '#6B5858', marginTop: 4, lineHeight: 1.4 }}>
          {score >= 70 && 'Jullie voelen hetzelfde, vandaag gaat vanzelf.'}
          {score >= 40 && score < 70 && 'Ietsje werk, maar zeker te doen samen.'}
          {score < 40 && 'Wees vandaag extra zacht en geduldig met elkaar.'}
        </div>
      </div>
    </div>
  );
}

function TipsCard({ tips, loading, aiSource }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 22,
      padding: 16,
      boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontFamily: 'Fraunces', fontWeight: 700, fontSize: 18, color: '#3A2A2A' }}>
          Tips voor vandaag
        </div>
        <span style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '0.08em',
          color: aiSource === 'claude' ? '#00C4C4' : '#9A8A86',
          background: aiSource === 'claude' ? 'rgba(0,196,196,0.12)' : '#F5F0EC',
          padding: '3px 8px',
          borderRadius: 999,
        }}>
          {aiSource === 'claude' ? '✨ LIVE' : 'BASIS'}
        </span>
      </div>

      {loading ? (
        <div style={{ padding: '14px 0' }}>
          {[1, 0.8, 0.6].map((w, i) => (
            <div key={i} style={{
              height: 14,
              borderRadius: 4,
              marginBottom: 8,
              width: `${w * 100}%`,
              background: 'linear-gradient(90deg, #FFE8DF 0%, #FFF5EF 50%, #FFE8DF 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s infinite',
            }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tips.map((t, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              animation: `bounceIn 0.4s ${i * 0.08}s both`,
            }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                flexShrink: 0,
                background: '#FFE0EA',
                color: '#E6007E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 12,
              }}>{i + 1}</div>
              <div style={{ fontSize: 14, color: '#3A2A2A', lineHeight: 1.4, flex: 1 }}>
                {t}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CompareScreen({ who, answers, onRestart }) {
  const { henoch, marije } = answers;
  const moodCmp = compareAnswers(henoch.mood, marije.mood, MOOD_OPTIONS);
  const needCmp = compareAnswers(henoch.need, marije.need, NEED_OPTIONS);
  const score = overallMatchScore(moodCmp.gap ?? 0, needCmp.gap ?? 0);

  const hMood = MOOD_OPTIONS.find(o => o.id === henoch.mood);
  const mMood = MOOD_OPTIONS.find(o => o.id === marije.mood);
  const hNeed = NEED_OPTIONS.find(o => o.id === henoch.need);
  const mNeed = NEED_OPTIONS.find(o => o.id === marije.need);

  const [tips, setTips] = useState(null);
  const [aiSource, setAiSource] = useState('basis');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const basis = fallbackTips(henoch.mood, marije.mood, henoch.need, marije.need);

    (async () => {
      try {
        const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
        if (!apiKey) throw new Error('no key');

        const prompt = `Je bent een liefdevolle relatie-coach. Henoch en Marije hebben vanochtend hun mood ingevuld.

Henoch voelt zich: ${hMood.label} ${hMood.emoji}
Henoch heeft nodig: "${hNeed.label}" ${hNeed.emoji}

Marije voelt zich: ${mMood.label} ${mMood.emoji}
Marije heeft nodig: "${mNeed.label}" ${mNeed.emoji}

Geef 3 tot 4 korte (max 20 woorden), concrete, liefdevolle tips in het Nederlands voor hoe ze vandaag met elkaar om kunnen gaan. Tutoyeer. Noem hun namen. Geen intro, geen slot. Antwoord als JSON array van strings, zo: ["tip 1", "tip 2", "tip 3"]`;

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 400,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (!res.ok) throw new Error('api error');
        const data = await res.json();
        const text = data.content?.[0]?.text ?? '';
        const match = text.match(/\[[\s\S]*\]/);
        if (!match) throw new Error('no json');
        const parsed = JSON.parse(match[0]);
        if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('empty');
        if (!cancelled) { setTips(parsed.slice(0, 4)); setAiSource('claude'); setLoading(false); }
      } catch {
        if (!cancelled) { setTips(basis); setAiSource('basis'); setLoading(false); }
      }
    })();

    return () => { cancelled = true; };
  }, [henoch.mood, henoch.need, marije.mood, marije.need]);

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: 'linear-gradient(180deg, #FFF5EF 0%, #FFE0EA 60%, #FFEEE0 100%)',
      padding: '58px 18px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Wordmark size={22} />
        <div style={{ fontFamily: 'Caveat', fontSize: 18, color: '#9A8A86' }}>di 21 apr</div>
      </div>

      {/* Match ring */}
      <div style={{ background: '#fff', borderRadius: 22, padding: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.04)' }}>
        <MatchScoreRing score={score} animate />
      </div>

      {/* Mood row */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 4px 8px' }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#3A2A2A' }}>Hoe voelen jullie je?</div>
          <StatusPill status={moodCmp.status} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <AnswerChip person="Henoch 🧑" option={hMood} highlight={moodCmp.status} />
          <AnswerChip person="Marije 👩" option={mMood} highlight={moodCmp.status} />
        </div>
      </div>

      {/* Need row */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 4px 8px' }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#3A2A2A' }}>Wat hebben jullie nodig?</div>
          <StatusPill status={needCmp.status} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <AnswerChip person="Henoch 🧑" option={hNeed} highlight={needCmp.status} />
          <AnswerChip person="Marije 👩" option={mNeed} highlight={needCmp.status} />
        </div>
      </div>

      {/* Tips */}
      <TipsCard tips={tips || []} loading={loading} aiSource={aiSource} />

      {/* Restart */}
      <button onClick={onRestart} style={{
        marginTop: 4,
        border: 'none',
        background: 'transparent',
        color: '#9A8A86',
        fontFamily: 'Nunito',
        fontWeight: 700,
        fontSize: 13,
        padding: '8px',
        cursor: 'pointer',
        textDecoration: 'underline',
      }}>
        ↺ reset demo
      </button>
    </div>
  );
}
