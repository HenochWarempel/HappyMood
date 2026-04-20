import Wordmark from '../components/Wordmark.jsx';

export default function QuestionScreen({ who, question, options, selected, onSelect, onNext, step, total }) {
  return (
    <div style={{
      height: '100%',
      background: '#FFF5EF',
      padding: '64px 20px 24px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Wordmark size={22} />
        <div style={{
          background: '#fff',
          borderRadius: 999,
          padding: '6px 12px',
          fontSize: 12,
          fontWeight: 800,
          color: '#9A8A86',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        }}>
          {who === 'henoch' ? '🧑 Henoch' : '👩 Marije'}
        </div>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{
            flex: 1,
            height: 6,
            borderRadius: 999,
            background: i < step ? '#E6007E' : '#FFE0D4',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Question */}
      <div style={{
        fontFamily: 'Fraunces',
        fontWeight: 700,
        fontSize: 28,
        color: '#3A2A2A',
        lineHeight: 1.15,
        marginBottom: 4,
        letterSpacing: '-0.02em',
      }}>
        {question}
      </div>
      <div style={{ fontFamily: 'Caveat', fontSize: 20, color: '#9A8A86', marginBottom: 20 }}>
        kies één die het best je mood beschrijft
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflowY: 'auto' }}>
        {options.map(opt => {
          const active = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 18,
                border: `2px solid ${active ? '#E6007E' : 'transparent'}`,
                background: active ? '#fff' : 'rgba(255,255,255,0.6)',
                boxShadow: active ? '0 8px 20px rgba(230,0,126,0.15)' : '0 2px 6px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'Nunito',
                transition: 'all 0.15s',
                transform: active ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div style={{ fontSize: 30, lineHeight: 1 }}>{opt.emoji}</div>
              <div style={{ flex: 1, fontSize: 17, fontWeight: 700, color: '#3A2A2A' }}>
                {opt.label}
              </div>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                border: `2px solid ${active ? '#E6007E' : '#E6D5CD'}`,
                background: active ? '#E6007E' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                {active && <div style={{ color: '#fff', fontSize: 14, fontWeight: 900 }}>✓</div>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!selected}
        style={{
          marginTop: 16,
          border: 'none',
          background: selected ? '#3A2A2A' : '#D9CBC6',
          color: '#fff',
          fontFamily: 'Nunito',
          fontWeight: 800,
          fontSize: 17,
          padding: '16px',
          borderRadius: 999,
          cursor: selected ? 'pointer' : 'not-allowed',
          boxShadow: selected ? '0 8px 20px rgba(58,42,42,0.25)' : 'none',
          transition: 'all 0.15s',
        }}
      >
        {step === total ? 'Klaar →' : 'Volgende →'}
      </button>
    </div>
  );
}
