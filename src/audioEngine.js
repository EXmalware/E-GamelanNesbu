import * as Tone from 'tone';

// Base URL for the authentic Javanese Gamelan sample library
const BASE_URL = "https://raw.githubusercontent.com/Digitopia/CDM-GAMELAN-SAMPLE-LIBRARY/master/Gamelao_CdM/WAV/Gamela%CC%83o%20da%20Casa%20Da%20Mu%CC%81sica%20-%20Porto%2C%20Portugal";

/**
 * GamelanEngine manages the loading and triggering of authentic Javanese Gamelan samples.
 */
class GamelanEngine {
    constructor() {
        this.samplers = {};
        this.activeScale = 'slendro';
        this.initialized = false;
        this.loadingProgress = 0;
    }

    async init() {
        if (this.initialized) return;
        await Tone.start();
        this.initialized = true;
    }

    /**
     * Get or create a sampler for a specific instrument
     */
    async getSampler(instrumentId) {
        if (this.samplers[instrumentId]) return this.samplers[instrumentId];

        const config = this.getInstrumentConfig(instrumentId);
        if (!config) throw new Error(`Unknown instrument: ${instrumentId}`);

        return new Promise((resolve, reject) => {
            const sampler = new Tone.Sampler({
                urls: config.samples,
                baseUrl: BASE_URL + "/" + (config.folder ? config.folder + "/" : ""),
                onload: () => {
                    this.samplers[instrumentId] = sampler.toDestination();
                    resolve(this.samplers[instrumentId]);
                },
                onerror: (err) => {
                    console.error(`Error loading samples for ${instrumentId}:`, err);
                    reject(new Error(`Failed to load instrument: ${instrumentId}`));
                }
            });
            
            // Timeout if it takes too long
            setTimeout(() => {
                reject(new Error(`Timeout loading instrument: ${instrumentId}`));
            }, 10000);
        });
    }

    getInstrumentConfig(id) {
        const configs = {
            saron_barung: {
                folder: "SARON",
                samples: {
                    "C4": "SBPL1.wav", "D4": "SBPL2.wav", "E4": "SBPL3.wav", "F4": "SBPL4.wav", "G4": "SBPL5.wav", "A4": "SBPL6.wav", "B4": "SBPL7.wav",
                    "C5": "SBSL1.wav", "D5": "SBSL2.wav", "E5": "SBSL3.wav", "G5": "SBSL5.wav", "A5": "SBSL6.wav"
                }
            },
            saron_demung: {
                folder: "SARON",
                samples: {
                    "C3": "SDPL1.wav", "D3": "SDPL2.wav", "E3": "SDPL3.wav", "F3": "SDPL4.wav", "G3": "SDPL5.wav", "A3": "SDPL6.wav", "B3": "SDPL7.wav",
                    "C4": "SDSL1.wav", "D4": "SDSL2.wav", "E4": "SDSL3.wav", "G4": "SDSL5.wav", "A4": "SDSL6.wav"
                }
            },
            saron_peking: {
                folder: "SARON",
                samples: {
                    "C5": "SPPL1.wav", "D5": "SPPL2.wav", "E5": "SPPL3.wav", "F5": "SPPL4.wav", "G5": "SPPL5.wav", "A5": "SPPL6.wav", "B5": "SPPL7.wav",
                    "C6": "SPSL1.wav", "D6": "SPSL2.wav", "E6": "SPSL3.wav", "G6": "SPSL5.wav", "A6": "SPSL6.wav"
                }
            },
            slenthem: {
                folder: "GENDER",
                samples: {
                    "C3": "GSPL1.wav", "D3": "GSPL2.wav", "E3": "GSPL3.wav", "F3": "GSPL4.wav", "G3": "GSPL5.wav", "A3": "GSPL6.wav", "B3": "GSPL7.wav",
                    "C4": "GSSL1.wav", "D4": "GSSL2.wav", "E4": "GSSL3.wav", "G4": "GSSL5.wav", "A4": "GSSL6.wav"
                }
            },
            bonang_barung: {
                folder: "BONANG",
                samples: {
                    "C4": "BBPL1.wav", "D4": "BBPL2.wav", "E4": "BBPL3.wav", "F4": "BBPL4.wav", "G4": "BBPL5.wav", "A4": "BBPL6.wav", "B4": "BBPL7.wav",
                    "C5": "BBSL1.wav", "D5": "BBSL2.wav", "E5": "BBSL3.wav", "G5": "BBSL5.wav", "A5": "BBSL6.wav"
                }
            },
            bonang_panerus: {
                folder: "BONANG",
                samples: {
                    "C5": "BPPL1.wav", "D5": "BPPL2.wav", "E5": "BPPL3.wav", "F5": "BPPL4.wav", "G5": "BPPL5.wav", "A5": "BPPL6.wav", "B5": "BPPL7.wav",
                    "C6": "BPSL1.wav", "D6": "BPSL2.wav", "E6": "BPSL3.wav", "G6": "BPSL5.wav", "A6": "BPSL6.wav"
                }
            },
            gambang: {
                folder: "GAMBANG",
                samples: {
                    "C4": "GPL1.wav", "D4": "GPL2.wav", "E4": "GPL3.wav", "G4": "GPL5.wav", "A4": "GPL6.wav",
                    "C5": "GSL1.wav", "D5": "GSL2.wav", "E5": "GSL3.wav", "G5": "GSL5.wav", "A5": "GSL6.wav"
                }
            },
            gong_kempul: {
                folder: "", // Paths are absolute from base
                samples: {
                    "C2": "GONG/GAf.wav",    // Gong Ageng
                    "G2": "GONG/GSf.wav",    // Gong Suwukan
                    "C3": "GONG/GKPL1f.wav", // Kenong Pelog 1 (From GONG folder)
                    "D3": "GONG/GKPL2f.wav", // Kenong Pelog 2
                    "E3": "GONG/GKPL3f.wav", // Kenong Pelog 3
                    "G3": "GONG/GKPL5f.wav", // Kenong Pelog 5
                    "A3": "GONG/GKPL6f.wav", // Kenong Pelog 6
                    "B3": "GONG/GKPL7f.wav", // Kenong Pelog 7
                    "C4": "GONG/GKSL1f.wav", // Kenong Slendro 1
                    "D4": "GONG/GKSL2f.wav", // Kenong Slendro 2
                    "E4": "GONG/GKSL3f.wav", // Kenong Slendro 3
                    "G4": "GONG/GKSL5f.wav", // Kenong Slendro 5
                    "A4": "GONG/GKSL6f.wav"  // Kenong Slendro 6
                }
            },
            kenong: {
                folder: "", // Paths are absolute from base
                samples: {
                    "C3": "GONG/GKPL1f.wav", // Kenong Pelog 1
                    "D3": "GONG/GKPL2f.wav", // Kenong Pelog 2
                    "E3": "GONG/GKPL3f.wav", // Kenong Pelog 3
                    "G3": "GONG/GKPL5f.wav", // Kenong Pelog 5
                    "A3": "GONG/GKPL6f.wav", // Kenong Pelog 6
                    "B3": "GONG/GKPL7f.wav", // Kenong Pelog 7
                    "C4": "GONG/GKSL1f.wav", // Kenong Slendro 1
                    "D4": "GONG/GKSL2f.wav", // Kenong Slendro 2
                    "E4": "GONG/GKSL3f.wav", // Kenong Slendro 3
                    "G4": "GONG/GKSL5f.wav", // Kenong Slendro 5
                    "A4": "GONG/GKSL6f.wav"  // Kenong Slendro 6
                }
            },
            kendhang: {
                folder: "DRUMS", // Paths are absolute from base
                samples: {
                    "C4": "KENDHANG%20AGENG/DHA.wav",
                    "D4": "KETIPUNG_TAMBOR%20PEQUENO/DHUNG.wav",
                    "E4": "KETIPUNG_TAMBOR%20PEQUENO/TAK.wav",
                    "F4": "KENDHANG%20AGENG/DHA.wav",
                    "G4": "CIBLON_TAMBOR_MEDIO/DLANG.wav"
                }
            }
        };
        return configs[id];
    }

    playNote(instrumentId, note, time = Tone.now()) {
        const sampler = this.samplers[instrumentId];
        if (sampler) {
            sampler.triggerAttack(note, time);
        }
    }

    stopNote(instrumentId, time = Tone.now()) {
        const sampler = this.samplers[instrumentId];
        if (sampler) {
            sampler.releaseAll(time);
        }
    }

    // Map numeric keys to Gamelan notes based on scale
    getNoteForKey(keyIndex, scaleType, instrumentType) {
        if (instrumentType === 'kendhang') {
            const kendhangNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4'];
            return kendhangNotes[keyIndex % kendhangNotes.length];
        }

        const slendro = ['C', 'D', 'E', 'G', 'A']; // Ji, Ro, Lu, Mo, Nem
        const pelog = ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // Ji, Ro, Lu, Pat, Mo, Nem, Pi
        
        const scale = scaleType === 'slendro' ? slendro : pelog;
        const noteBase = scale[keyIndex % scale.length];
        
        // Octave logic based on instrument mapping
        let octave = 4;
        if (instrumentType === 'saron_demung' || instrumentType === 'slenthem') octave = 3;
        if (instrumentType === 'saron_peking' || instrumentType === 'bonang_panerus') octave = 5;
        
        // Specific mapping for Gong/Kempul & Kenong
        if (instrumentType === 'gong_kempul') {
            if (keyIndex === 0) return 'C2'; // Gong Ageng
            if (keyIndex === 1) return 'G2'; // Gong Suwukan
            
            // Kempul mapping (shifted down an octave relative to Kenong samples for heavier sound)
            if (scaleType === 'slendro') {
                return `${noteBase}3`; // Shifted down from 4 to 3
            } else {
                return `${noteBase}2`; // Shifted down from 3 to 2
            }
        }
        
        if (instrumentType === 'kenong') {
            if (scaleType === 'slendro') {
                return `${noteBase}4`; // Kenong Slendro samples mapped to C4-A4
            } else {
                return `${noteBase}3`; // Kenong Pelog samples mapped to C3-B3
            }
        }

        // Shift Slendro to higher octave for sample mapping if needed
        if (scaleType === 'slendro' && (instrumentType.includes('saron') || instrumentType === 'slenthem' || instrumentType === 'bonang_barung' || instrumentType === 'gambang')) {
            if (instrumentType === 'saron_peking' || instrumentType === 'bonang_panerus') {
                octave = 6;
            } else {
                octave += 1;
            }
        }
        
        if (instrumentType === 'gambang' && scaleType === 'pelog') {
            octave = keyIndex < 7 ? 4 : 5;
        }

        return `${noteBase}${octave}`;
    }
}

export const gamelanEngine = new GamelanEngine();
