import { useState, useEffect } from 'react';
import IOSDevice from './components/IOSDevice.jsx';
import Confetti from './components/Confetti.jsx';
import Wordmark from './components/Wordmark.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import LockNotification from './screens/LockNotification.jsx';
import QuestionScreen from './screens/QuestionScreen.jsx';
import WaitingScreen from './screens/WaitingScreen.jsx';
import CompareScreen from './screens/CompareScreen.jsx';
import { MOOD_OPTIONS, NEED_OPTIONS, DEMO_MOODS, SCENES, compareAnswers } from './data.js';

const TWEAK_DEFAULTS = {
  hColor: '#E6007E',
  mColor: '#00C4C4',
  bgPalette: 'pink',
  confetti: true,
};

const PALETTES = {
  pink:  { bg: '#FFF2EA', g1: '#FFDCD0', g2: '#FFE0EA', g3: '#FFEFD9' },
  mint:  { bg: '#EFFAF2', g1: '#D3F0E0', g2: '#DDF0FF', g3: '#F0FFE8' },
  lav:   { bg: '#F3EFFA', g1: '#E8DBFF', g2: '#FFD9F0', g3: '#EFEFFF' },
  cream: { bg: '#FFF8E8', g1: '#FFEFC5', g2: '#FFE5D6', g3: '#FFF1F0' },
};

function PhoneStage({ who, scene, answers, unlocked, onUnlock, selected, onSelect, onNext, onReveal, onRestart, partnerDone, showConfetti }) {
  let screen;

  if (scene === 'login') {
    screen = unlocked
      ? (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF5EF', color: '#74D99F', fontSize: 54 }}>
          ✓
        </div>
      )
      : <LoginScreen who={who} onUnlock={onUnlock} />;
  } else if (scene === 'notif') {
    screen = <LockNotification who={who} time="6:00" kind="morning" />;
  } else if (scene === 'q1') {
    screen = (
      <QuestionScreen
        who={who}
        question="Hoe voel je je vandaag?"
        options={MOOD_OPTIONS}
        selected={selected}
        onSelect={onSelect}
        onNext={onNext}
        step={1}
        total={2}
      />
    );
  } else if (scene === 'q2') {
    screen = (
      <QuestionScreen
        who={who}
        question="Wat heb jij nodig van mij vandaag?"
        options={NEED_OPTIONS}
        selected={selected}
        onSelect={onSelect}
        onNext={onNext}
        step={2}
        total={2}
      />
    );
  } else if (scene === 'waiting') {
    if (who === 'henoch') {
      screen = <WaitingScreen who="henoch" partnerDone={false} />;
    } else {
      screen = (
        <QuestionScreen
          who="marije"
          question="Wat heb jij nodig van mij vandaag?"
          options={NEED_OPTIONS}
          selected={null}
          onSelect={() => {}}
          onNext={() => {}}
          step={2}
          total={2}
        />
      );
    }
  } else if (scene === 'ready') {
    screen = <LockNotification who={who} time="8:12" kind="ready" />;
  } else if (scene === 'compare') {
    screen = <CompareScreen who={who} answers={answers} onRestart={onRestart} />;
  }

  return (
    <div style={{ position: 'relative' }}>
      <IOSDevice width={340} height={738}>
        {screen}
      </IOSDevice>
      {showConfetti && <Confetti run />}
    </div>
  );
}

export default function App() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [sceneIdx, setSceneIdx] = useState(() => {
    const saved = parseInt(localStorage.getItem('hm_scene') || '0');
    return isNaN(saved) ? 0 : Math.min(saved, SCENES.length - 1);
  });
  const [hUnlocked, setHUnlocked] = useState(false);
  const [mUnlocked, setMUnlocked] = useState(false);
  const [hSel, setHSel] = useState(null);
  const [mSel, setMSel] = useState(null);
  const [demo, setDemo] = useState('dichtbij');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    localStorage.setItem('hm_scene', String(sceneIdx));
  }, [sceneIdx]);

  const scene = SCENES[sceneIdx].key;
  const answers = DEMO_MOODS[demo];

  // Confetti on compare match
  useEffect(() => {
    if (scene === 'compare') {
      const { henoch, marije } = answers;
      const moodCmp = compareAnswers(henoch.mood, marije.mood, MOOD_OPTIONS);
      if (moodCmp.status === 'match' && tweaks.confetti) {
        setShowConfetti(true);
        const t = setTimeout(() => setShowConfetti(false), 2500);
        return () => clearTimeout(t);
      }
    }
    setShowConfetti(false);
  }, [scene, answers, tweaks.confetti]);

  // Apply tweak CSS vars
  useEffect(() => {
    document.documentElement.style.setProperty('--magenta', tweaks.hColor);
    document.documentElement.style.setProperty('--turquoise', tweaks.mColor);
    const p = PALETTES[tweaks.bgPalette] || PALETTES.pink;
    document.body.style.background = `
      radial-gradient(1200px 800px at 10% 0%, ${p.g1} 0%, transparent 55%),
      radial-gradient(1000px 700px at 90% 20%, ${p.g2} 0%, transparent 50%),
      radial-gradient(900px 700px at 50% 100%, ${p.g3} 0%, transparent 55%),
      ${p.bg}
    `;
  }, [tweaks.hColor, tweaks.mColor, tweaks.bgPalette]);

  const setTweak = (k, v) => setTweaks(prev => ({ ...prev, [k]: v }));

  const handleRestart = () => {
    setSceneIdx(0);
    setHUnlocked(false);
    setMUnlocked(false);
    setHSel(null);
    setMSel(null);
  };

  const demoLabels = {
    in_sync:  '🎉 In sync',
    dichtbij: '💛 Dichtbij',
    uit_sync: '🌧 Uit elkaar',
    rough:    '🆘 Zware dag',
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '48px 24px 80px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 28,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Fraunces, serif',
          fontWeight: 900,
          fontSize: 72,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: '#3A2A2A',
        }}>
          <span style={{ color: tweaks.hColor, fontStyle: 'italic' }}>H</span>
          <span>appy </span>
          <span style={{ color: tweaks.mColor, fontStyle: 'italic' }}>M</span>
          <span>ood?</span>
        </div>
        <div style={{ fontFamily: 'Caveat, cursive', fontSize: 26, color: '#6B5858', marginTop: -4 }}>
          een dagelijkse mini-check voor Henoch &amp; Marije
        </div>
      </div>

      {/* Scene controls */}
      <div style={{
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.7)',
        padding: '10px 14px',
        borderRadius: 999,
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        backdropFilter: 'blur(10px)',
      }}>
        {SCENES.map((s, i) => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {i > 0 && <div style={{ width: 1, height: 18, background: 'rgba(0,0,0,0.08)' }} />}
            <button
              onClick={() => setSceneIdx(i)}
              style={{
                border: 'none',
                background: sceneIdx === i ? '#3A2A2A' : 'transparent',
                color: sceneIdx === i ? '#fff' : '#6B5858',
                fontFamily: 'Nunito',
                fontWeight: 700,
                fontSize: 13,
                padding: '8px 12px',
                borderRadius: 999,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {i + 1}. {s.key}
            </button>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#6B5858', textAlign: 'center', maxWidth: 720 }}>
        {SCENES[sceneIdx].caption}
      </div>

      {/* Two phones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: 48, alignItems: 'start' }}>
        {/* Henoch */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#6B5858',
            background: 'rgba(255,255,255,0.6)',
            padding: '8px 16px',
            borderRadius: 999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: tweaks.hColor }} />
            HENOCH
          </div>
          <PhoneStage
            who="henoch"
            scene={scene}
            answers={answers}
            unlocked={hUnlocked}
            onUnlock={() => setHUnlocked(true)}
            selected={hSel}
            onSelect={setHSel}
            onNext={() => {
              if (scene === 'q1') { setHSel(null); setSceneIdx(3); }
              else if (scene === 'q2') { setHSel(null); setSceneIdx(4); }
            }}
            onReveal={() => setSceneIdx(6)}
            onRestart={handleRestart}
            partnerDone={scene === 'ready' || scene === 'compare'}
            showConfetti={scene === 'compare' && showConfetti}
          />
        </div>

        {/* Marije */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#6B5858',
            background: 'rgba(255,255,255,0.6)',
            padding: '8px 16px',
            borderRadius: 999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: tweaks.mColor }} />
            MARIJE
          </div>
          <PhoneStage
            who="marije"
            scene={scene}
            answers={answers}
            unlocked={mUnlocked}
            onUnlock={() => setMUnlocked(true)}
            selected={mSel}
            onSelect={setMSel}
            onNext={() => {
              if (scene === 'q1') { setMSel(null); setSceneIdx(3); }
              else if (scene === 'q2') { setMSel(null); setSceneIdx(4); }
            }}
            onReveal={() => setSceneIdx(6)}
            onRestart={handleRestart}
            partnerDone={scene === 'ready' || scene === 'compare'}
            showConfetti={scene === 'compare' && showConfetti}
          />
        </div>
      </div>

      {/* Prev / Next */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={() => setSceneIdx(Math.max(0, sceneIdx - 1))}
          style={{
            border: 'none',
            background: '#fff',
            color: '#3A2A2A',
            padding: '12px 20px',
            borderRadius: 999,
            fontWeight: 800,
            fontFamily: 'Nunito',
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          ← Vorige
        </button>
        <div style={{ fontFamily: 'Caveat', fontSize: 20, color: '#6B5858' }}>
          scene {sceneIdx + 1} / {SCENES.length}
        </div>
        <button
          onClick={() => setSceneIdx(Math.min(SCENES.length - 1, sceneIdx + 1))}
          style={{
            border: 'none',
            background: '#3A2A2A',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 999,
            fontWeight: 800,
            fontFamily: 'Nunito',
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(58,42,42,0.2)',
          }}
        >
          Volgende →
        </button>
      </div>

      {/* Demo picker (compare/ready only) */}
      {(scene === 'ready' || scene === 'compare') && (
        <div style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.7)',
          padding: '10px 14px',
          borderRadius: 999,
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
          backdropFilter: 'blur(10px)',
          marginTop: 8,
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#9A8A86', padding: '0 8px' }}>demo-dag:</div>
          {Object.entries(demoLabels).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setDemo(k)}
              style={{
                border: 'none',
                background: demo === k ? '#3A2A2A' : 'transparent',
                color: demo === k ? '#fff' : '#6B5858',
                fontFamily: 'Nunito',
                fontWeight: 700,
                fontSize: 13,
                padding: '8px 12px',
                borderRadius: 999,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Tweaks */}
      <details style={{ alignSelf: 'flex-end', marginTop: 8 }}>
        <summary style={{
          cursor: 'pointer',
          fontFamily: 'Nunito',
          fontSize: 13,
          fontWeight: 800,
          color: '#9A8A86',
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.7)',
          borderRadius: 999,
          listStyle: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          🎨 Tweaks
        </summary>
        <div style={{
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          padding: 18,
          marginTop: 8,
          width: 280,
          fontFamily: 'Nunito',
        }}>
          {/* H color */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#9A8A86', fontWeight: 700, marginBottom: 6 }}>H accent</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#E6007E', '#FF5A5F', '#FF9A00', '#8B5CF6', '#06B6D4'].map(c => (
                <div key={c}
                  onClick={() => setTweak('hColor', c)}
                  style={{
                    width: 26, height: 26, borderRadius: 8, background: c, cursor: 'pointer',
                    border: `2px solid ${tweaks.hColor === c ? '#3A2A2A' : 'transparent'}`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* M color */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#9A8A86', fontWeight: 700, marginBottom: 6 }}>M accent</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#00C4C4', '#10B981', '#F59E0B', '#6366F1', '#EC4899'].map(c => (
                <div key={c}
                  onClick={() => setTweak('mColor', c)}
                  style={{
                    width: 26, height: 26, borderRadius: 8, background: c, cursor: 'pointer',
                    border: `2px solid ${tweaks.mColor === c ? '#3A2A2A' : 'transparent'}`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Background palette */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#9A8A86', fontWeight: 700, marginBottom: 6 }}>Achtergrond</div>
            <select
              value={tweaks.bgPalette}
              onChange={e => setTweak('bgPalette', e.target.value)}
              style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)', fontFamily: 'inherit', fontSize: 13 }}
            >
              <option value="pink">Roze / perzik</option>
              <option value="mint">Mint / vers</option>
              <option value="lav">Lavendel</option>
              <option value="cream">Crème</option>
            </select>
          </div>

          {/* Confetti toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#3A2A2A', fontWeight: 700 }}>
            <input
              type="checkbox"
              checked={tweaks.confetti}
              onChange={e => setTweak('confetti', e.target.checked)}
            />
            Confetti bij match
          </label>
        </div>
      </details>
    </div>
  );
}
