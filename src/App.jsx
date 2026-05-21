import React, { useState, useEffect, useCallback, useRef } from 'react';
import { gamelanEngine } from './audioEngine';

const INSTRUMENTS = [
  { id: 'saron_peking', name: 'Saron Peking', desc: 'High-pitched melodic metallophone' },
  { id: 'saron_barung', name: 'Saron Barung', desc: 'Melodic metallophone (standard)' },
  { id: 'saron_demung', name: 'Saron Demung', desc: 'Lower-pitched melodic metallophone' },
  { id: 'slenthem', name: 'Slenthem', desc: 'Deep, resonant metallophone' },
  { id: 'bonang_barung', name: 'Bonang Barung', desc: 'Small bronze kettles' },
  { id: 'bonang_panerus', name: 'Bonang Panerus', desc: 'High-pitched bronze kettles' },
  { id: 'gambang', name: 'Gambang', desc: 'Wooden xylophone' },
  { id: 'gong', name: 'Gong Ageng', desc: 'Large hanging gongs' },
  { id: 'kempul', name: 'Kempul', desc: 'Smaller hanging gongs' },
  { id: 'kenong', name: 'Kenong', desc: 'Horizontal bronze kettles' },
  { id: 'kendhang', name: 'Kendhang', desc: 'Hand-played rhythmic drum' }
];

const NOTATION_LABELS = {
  slendro: {
    sequence: ['1', '2', '3', '5', '6'],
    getFullRange: (count, startOffset = 0) => {
      const full = [
        '6̣', '1', '2', '3', '5', '6',
        '1̇', '2̇', '3̇', '5̇', '6̇',
        '1̇̇', '2̇̇', '3̇̇', '5̇̇', '6̇̇',
        '1̇̇̇', '2̇̇̇', '3̇̇̇', '5̇̇̇', '6̇̇̇'
      ];
      return full.slice(startOffset, startOffset + count);
    }
  },
  pelog: {
    sequence: ['1', '2', '3', '4', '5', '6', '7'],
    getFullRange: (count, startOffset = 0) => {
      const full = [
        '6̣', '7̣', '1', '2', '3', '4', '5', '6', '7',
        '1̇', '2̇', '3̇', '4̇', '5̇', '6̇', '7̇',
        '1̇̇', '2̇̇', '3̇̇', '4̇̇', '5̇̇', '6̇̇', '7̇̇'
      ];
      return full.slice(startOffset, startOffset + count);
    }
  }
};

function getInstrumentLabels(id, scale) {
  const config = NOTATION_LABELS[scale];
  if (id.includes('saron') || id === 'slenthem') {
    // Standard Saron range usually starts from 1 or low 6
    return scale === 'slendro'
      ? ['1', '2', '3', '5', '6', '1̇', '2̇']
      : ['1', '2', '3', '4', '5', '6', '7'];
  }
  if (id === 'gambang') {
    return config.getFullRange(21, 0);
  }
  if (id.includes('bonang')) {
    return config.getFullRange(14, 2);
  }
  if (id === 'kenong' || id === 'kempul') {
    return config.sequence;
  }
  return config.sequence;
}

function ContextMenu({ instrument, onPlay, onClose, position }) {
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ top: position.y, left: position.x }}
    >
      <h3>{instrument.name}</h3>
      <p>{instrument.desc}</p>
      <div className="menu-actions">
        <button className="btn-primary" onClick={() => onPlay(instrument.id)}>PLAY</button>
        <button className="btn-secondary" onClick={onClose}>CLOSE</button>
      </div>
    </div>
  );
}

function RoomHub({ onSelect }) {
  const [activeMenu, setActiveMenu] = useState(null);

  const hotspots = [
    { id: 'gambang', label: 'Gambang', icon: '🪵' },
    { id: 'slenthem', label: 'Slenthem', icon: '🎹' },
    { id: 'saron_demung', label: 'Saron Demung', icon: '🎹' },
    { id: 'saron_peking', label: 'Saron Peking', icon: '🎹' },
    { id: 'saron_barung', label: 'Saron Barung', icon: '🎹' },
    { id: 'kenong', label: 'Kenong', icon: '🏺' },
    { id: 'kendhang', label: 'Kendhang', icon: '🥁' },
    { id: 'gong', label: 'Gong Ageng', icon: '🔔' },
    { id: 'kempul', label: 'Kempul', icon: '🔔' },
    { id: 'bonang_barung', label: 'Bonang Barung', icon: '🥣' },
    { id: 'bonang_panerus', label: 'Bonang Panerus', icon: '🥣' },
  ];

  const leftColumn = hotspots.slice(0, 5);
  const rightColumn = hotspots.slice(5);

  const handleHotspotClick = (e, spot) => {
    e.stopPropagation();
    setActiveMenu({
      spot,
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <div className="room-hub">
      <div className="room-overlay"></div>
      <img
        src="/assets/room_bg.png"
        className="room-background"
        alt="Gamelan Room"
      />

      <div className="room-title-overlay">
        <h1>RUANG GAMELAN</h1>
        <p>E-MUSIK VIRTUAL ENSEMBLE</p>
      </div>

      <div className="structured-hotspots">
        <div className="hotspot-column left">
          {leftColumn.map(spot => (
            <div key={spot.id} className="list-hotspot" onClick={(e) => handleHotspotClick(e, spot)}>
              <div className="hotspot-point">
                <div className="hotspot-ring"></div>
                <div className="hotspot-dot"></div>
              </div>
              <div className="hotspot-info">
                <span className="badge-icon">{spot.icon}</span>
                <span className="badge-label">{spot.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="hotspot-column right">
          {rightColumn.map(spot => (
            <div key={spot.id} className="list-hotspot" onClick={(e) => handleHotspotClick(e, spot)}>
              <div className="hotspot-info">
                <span className="badge-label">{spot.label}</span>
                <span className="badge-icon">{spot.icon}</span>
              </div>
              <div className="hotspot-point">
                <div className="hotspot-ring"></div>
                <div className="hotspot-dot"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeMenu && (
        <ContextMenu
          instrument={INSTRUMENTS.find(i => i.id === activeMenu.spot.id)}
          position={{ x: activeMenu.x, y: activeMenu.y }}
          onPlay={onSelect}
          onClose={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [scale, setScale] = useState('slendro');
  const [loading, setLoading] = useState(false);
  const [activeNotes, setActiveNotes] = useState({});
  const [kendhangView, setKendhangView] = useState('pad'); // 'pad' or 'simple'

  useEffect(() => {
    if (!window.hasShownAlert) {
      alert("© Malware X David Faizal");
      window.hasShownAlert = true;
    }
  }, []);

  const handleSelectInstrument = async (id) => {
    setLoading(true);
    try {
      await gamelanEngine.init();
      await gamelanEngine.getSampler(id);
      setSelectedId(id);
    } catch (err) {
      console.error("Failed to load instrument:", err);
    } finally {
      setLoading(false);
    }
  };

  const playNote = useCallback((index) => {
    if (!selectedId) return;
    const note = gamelanEngine.getNoteForKey(index, scale, selectedId);
    gamelanEngine.playNote(selectedId, note);

    setActiveNotes(prev => ({ ...prev, [index]: 'play' }));
    setTimeout(() => {
      setActiveNotes(prev => ({ ...prev, [index]: false }));
    }, 150);
  }, [selectedId, scale]);

  const stopNote = useCallback((index) => {
    if (!selectedId) return;
    const note = gamelanEngine.getNoteForKey(index, scale, selectedId);
    gamelanEngine.stopNote(selectedId, note);

    setActiveNotes(prev => ({ ...prev, [index]: 'pepet' }));
    setTimeout(() => {
      setActiveNotes(prev => ({ ...prev, [index]: false }));
    }, 150);
  }, [selectedId, scale]);

  const useGamelanGesture = (index, isEmpty = false) => {
    const startY = useRef(null);
    const activePointerId = useRef(null);
    const isPepetTriggered = useRef(false);

    const handleMove = useCallback((e) => {
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;
      if (startY.current === null || isPepetTriggered.current) return;
      const currentY = e.clientY;
      if (currentY === null) return;

      const diffY = currentY - startY.current;
      if (diffY > 35) {
        isPepetTriggered.current = true;
        stopNote(index);
      }
    }, [index, stopNote]);

    const handleEnd = useCallback((e) => {
      if (activePointerId.current !== null && e?.pointerId !== activePointerId.current) return;
      startY.current = null;
      activePointerId.current = null;
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleEnd);
      window.removeEventListener('pointercancel', handleEnd);
    }, [handleMove]);

    return {
      onPointerDown: (e) => {
        if (isEmpty) return;
        e.preventDefault();
        startY.current = e.clientY;
        activePointerId.current = e.pointerId;
        isPepetTriggered.current = false;
        playNote(index);
        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleEnd);
        window.addEventListener('pointercancel', handleEnd);
      },
      onPointerUp: handleEnd,
      onPointerCancel: handleEnd
    };
  };

  useEffect(() => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', 'q', 'w', 'e', 'r', 't', 'y'];
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      const idx = keys.indexOf(e.key.toLowerCase());
      if (idx !== -1) playNote(idx);
      if (e.key.toLowerCase() === 'p') setScale('pelog');
      if (e.key.toLowerCase() === 's') setScale('slendro');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playNote]);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>LOADING INSTRUMENT</p>
        <div className="loading-bar"></div>
        <footer className="app-footer">© Malware X David Faizal</footer>
      </div>
    );
  }

  if (!selectedId) {
    return (
      <>
        <RoomHub onSelect={handleSelectInstrument} />
        <footer className="app-footer">© Malware X David Faizal</footer>
      </>
    );
  }

  const currentInstrument = INSTRUMENTS.find(i => i.id === selectedId);
  const labels = getInstrumentLabels(selectedId, scale);

  // Helper to generate props for each key
  const InstrumentKey = ({ index, children, className, style, ...props }) => {
    const { isEmpty, ...restProps } = props;
    const gestures = useGamelanGesture(index, isEmpty);
    const state = activeNotes[index];
    const activeClass = state === 'play' ? 'active' : state === 'pepet' ? 'pepet-active' : '';

    return (
      <div
        className={`${className} ${activeClass}`}
        style={style}
        {...gestures}
        {...restProps}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="instrument-view">
      <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); setSelectedId(null); }}>
        ← BACK TO ROOM
      </a>

      <header className="view-header">
        <h1>{currentInstrument.name}</h1>
        <div className="scale-toggle">
          <button className={scale === 'slendro' ? 'active' : ''} onClick={() => setScale('slendro')}>SLENDRO</button>
          <button className={scale === 'pelog' ? 'active' : ''} onClick={() => setScale('pelog')}>PELOG</button>
        </div>
      </header>

      <div className="play-area">
        {selectedId.includes('saron') || selectedId === 'slenthem' ? (
          <div className="saron-top-down">
            <div className="saron-keys-grid">
              {labels.map((label, i) => (
                <InstrumentKey
                  key={i}
                  index={i}
                  className="saron-key-realistic"
                  data-note={label}
                />
              ))}
            </div>
          </div>
        ) : selectedId.includes('bonang') ? (
          <div className="bonang-top-down">
            {[...Array(14)].map((_, i) => {
              const label = labels[i];
              const isEmpty = !label;

              return (
                <InstrumentKey
                  key={i}
                  index={i}
                  isEmpty={isEmpty}
                  className={`kettle-realistic ${isEmpty ? 'empty' : ''}`}
                >
                  <div className="kettle-boss"></div>
                  {!isEmpty && <span className="kettle-label-overlay">{label}</span>}
                </InstrumentKey>
              );
            })}
          </div>
        ) : selectedId === 'kenong' ? (
          <div className="kenong-top-down">
            <div className="kenong-rack">
              {labels.map((label, i) => (
                <InstrumentKey
                  key={i}
                  index={i}
                  className="kenong-kettle-realistic"
                >
                  <div className="kettle-boss Large"></div>
                  <span className="kettle-label">{label}</span>
                </InstrumentKey>
              ))}
            </div>
          </div>
        ) : selectedId === 'gambang' ? (
          <div className="gambang-top-down">
            <div className="gambang-keys-grid">
              {labels.map((label, i) => (
                <InstrumentKey
                  key={i}
                  index={i}
                  className="gambang-key-realistic"
                  style={{ height: `${350 - (i * 6)}px` }}
                  data-note={label}
                />
              ))}
            </div>
          </div>
        ) : selectedId === 'gong' || selectedId === 'kempul' ? (
          <div className="gong-focus">
            {selectedId === 'gong' ? (
              <>
                <InstrumentKey index={0} className="gong-large">
                  <div className="kettle-boss" style={{ width: '60px', height: '60px' }}></div>
                  <span className="gong-label">GONG AGENG</span>
                </InstrumentKey>
                <InstrumentKey index={1} className="gong-large" style={{ width: '300px', height: '300px' }}>
                  <div className="kettle-boss" style={{ width: '45px', height: '45px' }}></div>
                  <span className="gong-label">SUWUKAN</span>
                </InstrumentKey>
              </>
            ) : (
              <div className="kempul-rack">
                {labels.map((label, i) => (
                  <InstrumentKey key={i} index={i} className="gong-large kempul">
                    <div className="kettle-boss" style={{ width: '35px', height: '35px' }}></div>
                    <span className="gong-label">{label}</span>
                  </InstrumentKey>
                ))}
              </div>
            )}
          </div>
        ) : selectedId === 'kendhang' ? (
          <div className="kendhang-realistic-view">
                <div className={`kendhang-panel ${kendhangView === 'simple' ? 'simple-view' : 'pad-view'}`}>
                <div className="kendhang-panel-header">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                    <div>
                      <div className="kendhang-title">Kendhang Tradisional</div>
                      <div className="kendhang-subtitle">Sentuh sisi kulit kendang untuk bunyi yang lebih nyata.</div>
                    </div>

                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <div
                        className={`view-mode-toggle ${kendhangView === 'pad' ? 'on' : ''}`}
                        role="switch"
                        aria-checked={kendhangView === 'pad'}
                        tabIndex={0}
                        onClick={() => setKendhangView(kendhangView === 'pad' ? 'simple' : 'pad')}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setKendhangView(kendhangView === 'pad' ? 'simple' : 'pad'); } }}
                      >
                        <span className="vm-icon vm-icon-simple" aria-hidden>🔹</span>
                        <div className="vm-track">
                          <div className="vm-knob" />
                        </div>
                        <span className="vm-icon vm-icon-pad" aria-hidden>🥁</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="kendhang-hud">
                  <span className="hud-chip">TRADISI</span>
                  <span className="hud-text">Setiap pad merepresentasikan pukulan tradisional kendhang.</span>
                </div>

              <div className="kendhang-grid">
                <InstrumentKey index={0} className="kendhang-pad pad-dah" title="DAH" role="button" tabIndex={0} aria-label="DAH" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playNote(0); } }}>
                  <div className="pad-ring"></div>
                  <div className="pad-inner">
                    <span className="pad-label">DAH</span>
                    <span className="pad-note">Low</span>
                  </div>
                </InstrumentKey>

                <InstrumentKey index={1} className="kendhang-pad pad-dhung" title="DHUNG" role="button" tabIndex={0} aria-label="DHUNG" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playNote(1); } }}>
                  <div className="pad-ring"></div>
                  <div className="pad-inner">
                    <span className="pad-label">DHUNG</span>
                    <span className="pad-note">Deep</span>
                  </div>
                </InstrumentKey>

                <InstrumentKey index={3} className="kendhang-pad pad-ket" title="KET" role="button" tabIndex={0} aria-label="KET" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playNote(3); } }}>
                  <div className="pad-ring"></div>
                  <div className="pad-inner">
                    <span className="pad-label">KET</span>
                    <span className="pad-note">Snappy</span>
                  </div>
                </InstrumentKey>

                <InstrumentKey index={2} className="kendhang-pad pad-tak" title="TAK" role="button" tabIndex={0} aria-label="TAK" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playNote(2); } }}>
                  <div className="pad-ring"></div>
                  <div className="pad-inner">
                    <span className="pad-label">TAK</span>
                    <span className="pad-note">Sharp</span>
                  </div>
                </InstrumentKey>

                <InstrumentKey index={4} className="kendhang-pad pad-tong" title="TONG" role="button" tabIndex={0} aria-label="TONG" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playNote(4); } }}>
                  <div className="pad-ring"></div>
                  <div className="pad-inner">
                    <span className="pad-label">TONG</span>
                    <span className="pad-note">Tone</span>
                  </div>
                </InstrumentKey>
              </div>
            </div>

            <div className="kendhang-instructions">
              Digital kendhang dengan pad interaktif dan kontrol pepet. Tap pad untuk bunyi dan tarik ke bawah untuk mematikan.
            </div>
          </div>
        ) : (
          <div className="saron-top-down">
            <p>INSTRUMENT VIEW IN DEVELOPMENT</p>
          </div>
        )}
      </div>

      <div className="keyboard-hint-overlay">
        USE KEYS 1-8 / Q-Y TO PLAY • DRAG DOWN TO PEPET (DAMP) • S: SLENDRO • P: PELOG
      </div>
      <footer className="app-footer">© Malware X David Faizal</footer>
    </div>
  );
}

export default App;
