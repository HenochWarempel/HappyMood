export default function Confetti({ run }) {
  if (!run) return null;
  const colors = ['#E6007E', '#00C4C4', '#FFB547', '#74D99F', '#C5A8E6', '#FFE0EA'];
  const pieces = Array.from({ length: 60 }, (_, i) => {
    const dx = (Math.random() - 0.5) * 500;
    const rot = (Math.random() - 0.5) * 720;
    const size = 6 + Math.random() * 8;
    const left = 50 + (Math.random() - 0.5) * 40;
    return (
      <div key={i} style={{
        position: 'absolute',
        top: 120,
        left: `${left}%`,
        width: size,
        height: size * 0.4,
        background: colors[i % colors.length],
        borderRadius: 2,
        '--dx': `${dx}px`,
        '--rot': `${rot}deg`,
        animation: `confettiDrop ${1.2 + Math.random() * 1.2}s ease-out ${Math.random() * 0.3}s forwards`,
      }} />
    );
  });
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pieces}
    </div>
  );
}
