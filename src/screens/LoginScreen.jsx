import { useState } from 'react';
import Wordmark from '../components/Wordmark.jsx';

export default function LoginScreen({ who, onUnlock }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = () => {
    if (pw.trim().toLowerCase() === 'vlindermug') {
      onUnlock();
    } else {
      setErr(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      height: '100%',
      width: '100%',
      background: 'linear-gradient(180deg, #FFE8DF 0%, #FFD1E0 100%)',
      padding: '80px 28px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
      }}>
        <div style={{ animation: 'floaty 3s ease-in-out infinite' }}>
          <Wordmark size={52} />
        </div>

        <div style={{ textAlign: 'center', color: '#6B5858', fontSize: 15, maxWidth: 260, lineHeight: 1.4 }}>
          Alleen voor <b>Henoch &amp; Marije</b>.<br />Vul het geheime woord in.
        </div>

        <div style={{
          width: '100%',
          background: '#fff',
          borderRadius: 22,
          padding: 18,
          boxShadow: '0 10px 30px rgba(230,0,126,0.08)',
          animation: shake ? 'shake 0.4s' : 'none',
        }}>
          <div style={{
            fontSize: 12,
            color: '#9A8A86',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            {who === 'henoch' ? '🧑 Henoch' : '👩 Marije'}
          </div>
          <input
            type="password"
            placeholder="geheim woord"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(false); }}
            onKeyDown={e => e.key === 'Enter' && submit()}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontFamily: 'Nunito',
              fontSize: 22,
              fontWeight: 700,
              background: 'transparent',
              color: '#3A2A2A',
              borderBottom: `2px solid ${err ? '#E6007E' : '#FFD9CE'}`,
              padding: '4px 0 8px',
            }}
          />
          {err && (
            <div style={{ marginTop: 6, color: '#E6007E', fontSize: 12, fontWeight: 700 }}>
              oei, verkeerd. probeer het vlinder-wat-voor-dier?
            </div>
          )}
        </div>

        <button onClick={submit} style={{
          border: 'none',
          background: '#3A2A2A',
          color: '#fff',
          fontFamily: 'Nunito',
          fontWeight: 800,
          fontSize: 17,
          padding: '16px 36px',
          borderRadius: 999,
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(58,42,42,0.25)',
          transition: 'transform 0.1s',
        }}>
          Open Happy Mood?
        </button>
      </div>
    </div>
  );
}
