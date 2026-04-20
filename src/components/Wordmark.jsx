export default function Wordmark({ size = 48, hColor = '#E6007E', mColor = '#00C4C4' }) {
  return (
    <div style={{
      fontFamily: 'Fraunces, serif',
      fontWeight: 900,
      fontSize: size,
      letterSpacing: '-0.03em',
      lineHeight: 1,
      color: '#3A2A2A',
    }}>
      <span style={{ color: hColor, fontStyle: 'italic' }}>H</span>
      <span>appy </span>
      <span style={{ color: mColor, fontStyle: 'italic' }}>M</span>
      <span>ood?</span>
    </div>
  );
}
