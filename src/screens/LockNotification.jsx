export default function LockNotification({ who, time = '6:00', kind = 'morning' }) {
  const body = kind === 'morning'
    ? 'Goedemorgen ☀️ Hoe voel je je vandaag?'
    : who === 'henoch'
      ? 'Marije heeft ingevuld 💌 Klik om jullie dag te zien.'
      : 'Henoch heeft ingevuld 💌 Klik om jullie dag te zien.';

  return (
    <div style={{
      height: '100%',
      width: '100%',
      background: `
        radial-gradient(circle at 20% 30%, #FFB7C5 0%, transparent 40%),
        radial-gradient(circle at 80% 20%, #FFD9A0 0%, transparent 40%),
        radial-gradient(circle at 50% 90%, #C5A8E6 0%, transparent 50%),
        linear-gradient(180deg, #6B4A5A 0%, #4A3440 100%)
      `,
      padding: '72px 14px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        color: '#fff',
        fontWeight: 300,
        fontSize: 80,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        textShadow: '0 2px 20px rgba(0,0,0,0.2)',
      }}>
        {time}
      </div>
      <div style={{
        color: 'rgba(255,255,255,0.85)',
        fontWeight: 600,
        fontSize: 19,
        marginTop: 2,
        textShadow: '0 1px 10px rgba(0,0,0,0.2)',
      }}>
        dinsdag 21 april
      </div>

      <div style={{ flex: 1 }} />

      {/* Notification pill */}
      <div style={{
        width: '100%',
        borderRadius: 22,
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        padding: '14px 16px',
        display: 'flex',
        gap: 12,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        animation: 'bounceIn 0.6s cubic-bezier(.34,1.56,.64,1)',
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          flexShrink: 0,
          background: 'linear-gradient(135deg, #FFE8DF 0%, #FFD1E0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Fraunces',
          fontWeight: 900,
          fontSize: 22,
        }}>
          <span style={{ color: '#E6007E', fontStyle: 'italic' }}>H</span>
          <span style={{ color: '#00C4C4', fontStyle: 'italic', marginLeft: -2 }}>M</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#1A1A1A' }}>Happy Mood?</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>nu</div>
          </div>
          <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.82)', lineHeight: 1.35, marginTop: 2 }}>
            {body}
          </div>
        </div>
      </div>

      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 22 }}>
        ↑ tik om te openen
      </div>
    </div>
  );
}
