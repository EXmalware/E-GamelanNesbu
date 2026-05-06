import React, { useState, useEffect, useCallback } from 'react';
import { gamelanEngine } from './audioEngine';

const INSTRUMENTS = [
  { id: 'saron_peking', name: 'Saron Peking', desc: 'High-pitched melodic metallophone', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Gamelan_Jawa_-_Saron_Peking.jpg' },
  { id: 'saron_barung', name: 'Saron Barung', desc: 'Melodic metallophone (standard)', icon: 'https://diasraka.wordpress.com/wp-content/uploads/2011/01/saron-barung.png' },
  { id: 'saron_demung', name: 'Saron Demung', desc: 'Lower-pitched melodic metallophone', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/34/COLLECTIE_TROPENMUSEUM_Metallofoon_met_zes_toetsen_onderdeel_van_gamelan_Slendro_TMnr_500-11.jpg' },
  { id: 'slenthem', name: 'Slenthem', desc: 'Deep, resonant metallophone', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/COLLECTIE_TROPENMUSEUM_Metallofoon_bestaande_uit_zeven_toetsen_en_een_onderstel_onderdeel_van_gamelan_Slendro_TMnr_500-1.jpg' },
  { id: 'bonang_barung', name: 'Bonang Barung', desc: 'Collection of small bronze kettles', icon: 'https://cdn-jpr.jawapos.com/images/43/2025/05/30/bonang-barung-1209434633.jpeg' },
  { id: 'bonang_panerus', name: 'Bonang Panerus', desc: 'Higher-pitched bronze kettles', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Bonang_Penerus_Pelog.jpg' },
  { id: 'gambang', name: 'Gambang', desc: 'Wooden xylophone with 18-21 keys', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Gambang_koleksi_Jurusan_Karawitan_ISBI_Bandung.jpg' },
  { id: 'gong_kempul', name: 'Gong Kempul', desc: 'Hanging gongs on a large gayor frame', icon: 'https://www.nadaindonesia.com/wp-content/uploads/2024/06/19-GONG-KEMPUL-PELOG-350x201.png' },
  { id: 'kenong', name: 'Kenong', desc: 'Punctuating kettle gongs in a horizontal rancakan', icon: 'https://id-live-01.slatic.net/p/a301e75166bf68f360406e31df934a7d.jpg' },
  { id: 'kendhang', name: 'Kendhang', desc: 'Hand-played rhythmic drum', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Traditional_indonesian_drums.jpg' }
];

const NOTATION = {
  slendro: ['1', '2', '3', '5', '6'],
  pelog: ['1', '2', '3', '4', '5', '6', '7']
};

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [scale, setScale] = useState('slendro');
  const [loading, setLoading] = useState(false);
  const [activeNotes, setActiveNotes] = useState({});
  const [error, setError] = useState(null);

  const handleSelectInstrument = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await gamelanEngine.init();
      await gamelanEngine.getSampler(id);
      setSelectedId(id);
    } catch (err) {
      console.error("Failed to load instrument:", err);
      setError(`Gagal memuat ${INSTRUMENTS.find(i => i.id === id)?.name}. Periksa koneksi internet Anda.`);
    } finally {
      setLoading(false);
    }
  };

  const playNote = useCallback((index) => {
    if (!selectedId) return;
    const note = gamelanEngine.getNoteForKey(index, scale, selectedId);
    gamelanEngine.playNote(selectedId, note);

    setActiveNotes(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setActiveNotes(prev => ({ ...prev, [index]: false }));
    }, 150);
  }, [selectedId, scale]);

  // Keyboard mapping
  useEffect(() => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', 'q', 'w', 'e', 'r', 't', 'y'];
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        if (selectedId) gamelanEngine.stopNote(selectedId);
        return;
      }
      
      const idx = keys.indexOf(e.key.toLowerCase());
      if (idx !== -1) playNote(idx);
      if (e.key.toLowerCase() === 'p') setScale('pelog');
      if (e.key.toLowerCase() === 's') setScale('slendro');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playNote, selectedId]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (selectedId) gamelanEngine.stopNote(selectedId);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <p>Memuat Suara Gamelan Jawa...</p>
        <p className="loading-subtext">Mengunduh sampel berkualitas tinggi...</p>
      </div>
    );
  }

  if (!selectedId) {
    return (
      <div className="selection-container">
        <header className="instrument-header">
          <h1>E-MUSIK GAMELAN</h1>
          <p>Pilih instrumen untuk dimainkan dalam ansambel</p>
        </header>

        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="selection-grid">
          {INSTRUMENTS.map(inst => (
            <div key={inst.id} className="instrument-card" onClick={() => handleSelectInstrument(inst.id)}>
              <div className="card-image-wrapper">
                <img src={inst.icon} alt={inst.name} />
              </div>
              <h3>{inst.name}</h3>
              <p>{inst.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentInstrument = INSTRUMENTS.find(i => i.id === selectedId);
  const currentNotes = NOTATION[scale];

  return (
    <div className="instrument-view" onContextMenu={handleContextMenu}>
      <button className="back-button" onClick={() => setSelectedId(null)}>
        ← Kembali
      </button>

      <header className="instrument-header">
        <h1>{currentInstrument.name}</h1>
        <div className="scale-switcher">
          <button className={scale === 'slendro' ? 'active' : ''} onClick={() => setScale('slendro')}>Slendro (S)</button>
          <button className={scale === 'pelog' ? 'active' : ''} onClick={() => setScale('pelog')}>Pelog (P)</button>
        </div>
      </header>

      <div className="instrument-stage">
        {selectedId.includes('saron') || selectedId === 'slenthem' ? (
          <div className="saron-rancakan">
            <div className="saron-layout">
              {currentNotes.map((noteNum, i) => (
                <div
                  key={i}
                  className={`saron-key ${activeNotes[i] ? 'active' : ''} ${selectedId === 'saron_peking' ? 'peking' : ''}`}
                  onMouseDown={() => playNote(i)}
                  onTouchStart={(e) => { e.preventDefault(); playNote(i); }}
                >
                  <div className="key-pin top"></div>
                  <span className="key-label">{noteNum}</span>
                  <span className="key-hint">{i + 1}</span>
                  <div className="key-pin bottom"></div>
                </div>
              ))}
            </div>
            <div className="rancakan-front-carving"></div>
          </div>
        ) : selectedId.includes('bonang') ? (
          <div className="bonang-rancakan">
            <div className={`bonang-layout ${selectedId === 'bonang_panerus' ? 'panerus' : ''}`}>
              {[...Array(14)].map((_, i) => {
                const noteIndex = i % 7;
                const isTopRow = i < 7;
                const noteDisplay = scale === 'slendro' ? (noteIndex < 5 ? NOTATION.slendro[noteIndex] : '') : NOTATION.pelog[noteIndex];

                return (
                  <div className="bonang-slot" key={i}>
                    <div className="rope cross-1"></div>
                    <div className="rope cross-2"></div>
                    <div
                      className={`bonang-kettle ${activeNotes[i] ? 'active' : ''} ${selectedId === 'bonang_panerus' ? 'small-kettle' : ''} ${!noteDisplay ? 'empty' : ''}`}
                      onMouseDown={() => noteDisplay && playNote(i)}
                      onTouchStart={(e) => { e.preventDefault(); noteDisplay && playNote(i); }}
                    >
                      {noteDisplay && <span className="key-label">{noteDisplay}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : selectedId === 'gambang' ? (
          <div className="gambang-rancakan">
            <div className="gambang-layout">
              {[...Array(18)].map((_, i) => {
                const noteNum = (i % currentNotes.length) + 1;
                const displayNote = currentNotes[i % currentNotes.length];
                return (
                  <div
                    key={i}
                    className={`gambang-key ${activeNotes[i] ? 'active' : ''}`}
                    onMouseDown={() => playNote(i)}
                    onTouchStart={(e) => { e.preventDefault(); playNote(i); }}
                  >
                    <span className="key-label">{displayNote}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : selectedId === 'gong_kempul' ? (
          <div className="gong-kenong-stage">
            <div className="gayor-stand full-width">
              {/* Kempul hanging */}
              {currentNotes.map((num, i) => (
                <div className="hanging-group" key={i}>
                  <div className="gong-rope"></div>
                  <div
                    className={`gong-hanging kempul ${activeNotes[i + 2] ? 'active vibrating' : ''}`}
                    onMouseDown={() => playNote(i + 2)}
                    onTouchStart={(e) => { e.preventDefault(); playNote(i + 2); }}
                  >
                    <span className="key-label">{num}</span>
                  </div>
                </div>
              ))}
              
              {/* Suwukan */}
              <div className="hanging-group">
                <div className="gong-rope"></div>
                <div
                  className={`gong-hanging suwukan ${activeNotes[1] ? 'active vibrating' : ''}`}
                  onMouseDown={() => playNote(1)}
                  onTouchStart={(e) => { e.preventDefault(); playNote(1); }}
                >
                  <span className="key-label">SUWUKAN</span>
                </div>
              </div>
              
              {/* Gong Ageng */}
              <div className="hanging-group">
                <div className="gong-rope"></div>
                <div
                  className={`gong-hanging ${activeNotes[0] ? 'active vibrating' : ''}`}
                  onMouseDown={() => playNote(0)}
                  onTouchStart={(e) => { e.preventDefault(); playNote(0); }}
                >
                  <span className="key-label">GONG</span>
                </div>
              </div>
            </div>
          </div>
        ) : selectedId === 'kenong' ? (
          <div className="gong-kenong-stage">
            <div className="kenong-rancakan">
              <div className="kenong-row">
                {currentNotes.map((num, i) => (
                  <div className="kenong-slot" key={i}>
                    <div className="rope cross-1"></div>
                    <div className="rope cross-2"></div>
                    <div
                      className={`bonang-kettle kenong-kettle ${activeNotes[i + 2] ? 'active' : ''}`}
                      onMouseDown={() => playNote(i + 2)}
                      onTouchStart={(e) => { e.preventDefault(); playNote(i + 2); }}
                    >
                      <span className="key-label">{num}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="kendhang-plangkan enhanced">
            <div className="kendhang-interactive">
              <div className="drum-zone-container">
                <div className="drum-head-complex large" onMouseDown={() => playNote(0)} onTouchStart={(e) => { e.preventDefault(); playNote(0); }}>
                  <div className="head-leather"></div>
                  <div className="ukiran-overlay"></div>
                  <span className="head-label">DAH</span>
                </div>

                <div className="drum-head-complex medium" onMouseDown={() => playNote(1)} onTouchStart={(e) => { e.preventDefault(); playNote(1); }}>
                  <div className="head-leather"></div>
                  <div className="ukiran-overlay"></div>
                  <span className="head-label">DHUNG</span>
                </div>

                <div className="drum-head-complex small" onMouseDown={() => playNote(2)} onTouchStart={(e) => { e.preventDefault(); playNote(2); }}>
                  <div className="head-leather"></div>
                  <div className="ukiran-overlay"></div>
                  <span className="head-label">TAK</span>
                </div>

                <div className="drum-head-complex small" onMouseDown={() => playNote(3)} onTouchStart={(e) => { e.preventDefault(); playNote(3); }}>
                  <div className="head-leather"></div>
                  <div className="ukiran-overlay"></div>
                  <span className="head-label">KET</span>
                </div>

                <div className="drum-head-complex small" onMouseDown={() => playNote(4)} onTouchStart={(e) => { e.preventDefault(); playNote(4); }}>
                  <div className="head-leather"></div>
                  <div className="ukiran-overlay"></div>
                  <span className="head-label">TONG</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="keyboard-guide">
        <p>Gunakan tombol <b>1-8, Q, W, E, R, T, Y</b> untuk bermain</p>
        <p>Tekan <b>S</b> untuk Slendro, <b>P</b> untuk Pelog</p>
      </div>
    </div>
  );
}

export default App;
