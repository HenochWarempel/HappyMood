import Wordmark from '../components/Wordmark.jsx';

export default function WaitingScreen({ who, partnerDone, onReveal }) {
  const partner = who === 'henoch' ? 'Marije' : 'Henoch';
  return (
    <div style={{
      height: '100%',
      background: 'linear-gradient(180deg, #FFF5EF 0%, #FFE0EA 100%)',
      padding: '72px 24px 32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      <Wordmark size={28} />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
      }}>
        {/* Pulsing circle */}
        <div style={{ position: 'relative', width: 140, height: 140 }}>
          {[0, 0.5, 1].map(d => (
            <div key={d} style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 999,
              border: '2px solid #E6007E',
              animation: `pulseRing 2s ease-out ${d}s infinite`,
            }} />
          ))}
          <div style={{
            position: 'absolute',
            inset: 20,
            borderRadius: 999,
            background: 'linear-gradient(135deg, #FFE8DF 0%, #FFD1E0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 54,
            animation: 'floaty 3s ease-in-out infinite',
          }}>
            💌
          </div>
        </div>

        <div style={{
          fontFamily: 'Fraunces',
          fontWeight: 700,
          fontSize: 26,
          color: '#3A2A2A',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}>
          {partnerDone ? `${partner} is klaar!` : 'Jij bent klaar ✓'}
        </div>

        <div style={{ fontSize: 15, color: '#6B5858', maxWidth: 260, lineHeight: 1.5 }}>
          {partnerDone
            ? 'Klik hieronder om samen te kijken hoe jullie erbij zitten.'
            : `We wachten nog even tot ${partner} ook heeft ingevuld. Je krijgt een seintje zodra jullie kunnen vergelijken.`}
        </div>

        {partnerDone && (
          <button onClick={onReveal} style={{
            border: 'none',
            background: '#3A2A2A',
            color: '#fff',
            fontFamily: 'Nunito',
            fontWeight: 800,
            fontSize: 17,
            padding: '16px 32px',
            borderRadius: 999,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(58,42,42,0.25)',
            animation: 'bounceIn 0.5s both',
          }}>
            Bekijk jullie dag →
          </button>
        )}
      </div>
    </div>
  );
}
