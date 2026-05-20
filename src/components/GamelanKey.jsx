import React, { useState, useEffect } from 'react';

const GamelanKey = ({ note, instrument, onPlay, activeKey }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (activeKey === note.id) {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), 100);
      return () => clearTimeout(timer);
    }
  }, [activeKey, note.id]);

  const handleMouseDown = () => {
    setIsActive(true);
    onPlay(note.freq);
  };

  const handleMouseUp = () => {
    setIsActive(false);
  };

  const isBonang = instrument === 'bonang';
  const isDrum = instrument === 'kendhang';

  if (isDrum) {
    return (
      <div 
        className={`drum-pad ${isActive ? 'active' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        <span>{note.name}</span>
        <small style={{ fontSize: '0.8rem', opacity: 0.6 }}>({note.id})</small>
      </div>
    );
  }

  if (isBonang) {
    return (
      <div 
        className={`bonang-kettle ${isActive ? 'active' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        <div style={{ position: 'absolute', bottom: '-25px', fontSize: '0.9rem', fontWeight: 600 }}>
          {note.id}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`gamelan-key ${isActive ? 'active' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {note.id}
    </div>
  );
};

export default GamelanKey;
