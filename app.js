/**
 * KOINTAKDIR — CORE APPLICATION LOGIC
 * Clean, modular, reliable vanilla JavaScript (Zero AI Slop)
 */

(function () {
    'use strict';

    // --- State Application ---
    const state = {
        userName: '',
        duration: 10,
        optionA: '',
        optionB: '',
        isAudioMuted: false,
        isFlipping: false,
        currentRotation: 0,
        totalFlips: 0,
        winsA: 0,
        winsB: 0,
        lastVerdict: null
    };

    // --- DOM Elements Cache ---
    const elements = {
        // Step 1
        panelStep1: document.getElementById('panelStep1'),
        panelStep2: document.getElementById('panelStep2'),
        stepIndicator1: document.getElementById('stepIndicator1'),
        stepIndicator2: document.getElementById('stepIndicator2'),
        inputUserName: document.getElementById('inputUserName'),
        userNameError: document.getElementById('userNameError'),
        timerSlider: document.getElementById('timerSlider'),
        timerDisplay: document.getElementById('timerDisplay'),
        presetChips: document.querySelectorAll('.preset-chip'),
        btnGoToStep2: document.getElementById('btnGoToStep2'),

        // Step 2
        btnBackToStep1: document.getElementById('btnBackToStep1'),
        summaryUserName: document.getElementById('summaryUserName'),
        summaryDuration: document.getElementById('summaryDuration'),
        inputOptionA: document.getElementById('inputOptionA'),
        inputOptionB: document.getElementById('inputOptionB'),
        optionAError: document.getElementById('optionAError'),
        optionBError: document.getElementById('optionBError'),
        exampleButtons: document.querySelectorAll('.btn-example'),

        // 3D Coin & Arena
        coinWrapper: document.getElementById('coinWrapper'),
        coin: document.getElementById('coin'),
        faceA: document.getElementById('faceA'),
        faceB: document.getElementById('faceB'),
        coinShadow: document.getElementById('coinShadow'),
        statusTicker: document.getElementById('statusTicker'),
        btnFlipCoin: document.getElementById('btnFlipCoin'),
        btnFlipText: document.getElementById('btnFlipText'),

        // Verdict Card
        verdictContainer: document.getElementById('verdictContainer'),
        verdictUser: document.getElementById('verdictUser'),
        verdictSide: document.getElementById('verdictSide'),
        verdictChoice: document.getElementById('verdictChoice'),
        btnCopyVerdict: document.getElementById('btnCopyVerdict'),
        copyButtonText: document.getElementById('copyButtonText'),
        btnReplayFlip: document.getElementById('btnReplayFlip'),

        // Audio & Controls
        soundToggleBtn: document.getElementById('soundToggleBtn'),
        soundLabel: document.getElementById('soundLabel'),
        appShell: document.getElementById('appShell'),
        confettiCanvas: document.getElementById('confettiCanvas'),
        toastMessage: document.getElementById('toastMessage'),

        // Stats
        statTotalCount: document.getElementById('statTotalCount'),
        statCountA: document.getElementById('statCountA'),
        statCountB: document.getElementById('statCountB')
    };

    let audioContext = null;
    let countdownTimer = null;
    let tickerInterval = null;
    let toastTimeout = null;

    // =========================================================================
    // 1. AUDIO ENGINE (Web Audio API: Tension & Crowd Cheer/Applause)
    // =========================================================================

    function getAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        return audioContext;
    }

    function toggleAudio() {
        state.isAudioMuted = !state.isAudioMuted;
        if (state.isAudioMuted) {
            elements.soundLabel.textContent = 'Suara Mati';
            elements.soundToggleBtn.style.opacity = '0.6';
            showToast('Suara dinonaktifkan');
        } else {
            elements.soundLabel.textContent = 'Suara Aktif';
            elements.soundToggleBtn.style.opacity = '1';
            showToast('Suara diaktifkan');
        }
    }

    /**
     * Tension sound during the coin spin
     * Features: Accelerating dual-thump heartbeat + sharp clock ticks + rising cinematic drone
     */
    function playTensionAudio(duration) {
        if (state.isAudioMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Initial coin flick ping
            const pingOsc = ctx.createOscillator();
            const pingGain = ctx.createGain();
            pingOsc.type = 'sine';
            pingOsc.frequency.setValueAtTime(1050, now);
            pingOsc.frequency.exponentialRampToValueAtTime(1750, now + 0.12);
            pingGain.gain.setValueAtTime(0.35, now);
            pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            pingOsc.connect(pingGain);
            pingGain.connect(ctx.destination);
            pingOsc.start(now);
            pingOsc.stop(now + 0.4);

            // Accelerating heartbeat sub-bass thumps (lub-dub)
            let beatTime = 0.25;
            let interval = duration > 8 ? 0.95 : 0.65;
            while (beatTime < duration - 0.25) {
                const t = now + beatTime;
                const progress = beatTime / duration;

                // Lub
                const oscLub = ctx.createOscillator();
                const gainLub = ctx.createGain();
                oscLub.type = 'sine';
                oscLub.frequency.setValueAtTime(80 + progress * 25, t);
                oscLub.frequency.exponentialRampToValueAtTime(26, t + 0.14);
                const vol = 0.35 + progress * 0.35;
                gainLub.gain.setValueAtTime(vol, t);
                gainLub.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
                oscLub.connect(gainLub);
                gainLub.connect(ctx.destination);
                oscLub.start(t);
                oscLub.stop(t + 0.15);

                // Dub
                const tDub = t + 0.11;
                if (tDub < now + duration - 0.15) {
                    const oscDub = ctx.createOscillator();
                    const gainDub = ctx.createGain();
                    oscDub.type = 'sine';
                    oscDub.frequency.setValueAtTime(90 + progress * 30, tDub);
                    oscDub.frequency.exponentialRampToValueAtTime(28, tDub + 0.12);
                    gainDub.gain.setValueAtTime(vol * 0.75, tDub);
                    gainDub.gain.exponentialRampToValueAtTime(0.001, tDub + 0.13);
                    oscDub.connect(gainDub);
                    gainDub.connect(ctx.destination);
                    oscDub.start(tDub);
                    oscDub.stop(tDub + 0.13);
                }

                // Clock tick
                const tickOsc = ctx.createOscillator();
                const tickGain = ctx.createGain();
                tickOsc.type = 'triangle';
                tickOsc.frequency.setValueAtTime(1100 + progress * 1000, t);
                tickGain.gain.setValueAtTime(0.08 + progress * 0.08, t);
                tickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
                tickOsc.connect(tickGain);
                tickGain.connect(ctx.destination);
                tickOsc.start(t);
                tickOsc.stop(t + 0.04);

                interval = Math.max(0.18, interval * 0.88);
                beatTime += interval;
            }

            // Rising drone
            const saw1 = ctx.createOscillator();
            const saw2 = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();

            saw1.type = 'sawtooth';
            saw2.type = 'sawtooth';
            saw1.frequency.setValueAtTime(55, now + 0.1);
            saw2.frequency.setValueAtTime(56.5, now + 0.1);
            saw1.frequency.exponentialRampToValueAtTime(220, now + duration - 0.2);
            saw2.frequency.exponentialRampToValueAtTime(223, now + duration - 0.2);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(100, now + 0.1);
            filter.frequency.linearRampToValueAtTime(1300, now + duration - 0.2);
            filter.Q.setValueAtTime(3.0, now);

            gain.gain.setValueAtTime(0.01, now + 0.1);
            gain.gain.linearRampToValueAtTime(0.14, now + duration * 0.4);
            gain.gain.linearRampToValueAtTime(0.28, now + duration - 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            saw1.connect(filter);
            saw2.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            saw1.start(now + 0.1);
            saw2.start(now + 0.1);
            saw1.stop(now + duration);
            saw2.stop(now + duration);
        } catch (e) {
            console.warn('Audio tension error:', e);
        }
    }

    /**
     * Celebratory sound when the coin lands
     * Features: Deep landing boom + victory brass fanfare + stadium whistles + crowd cheering harmonies + dense applause
     */
    function playCelebrationAudio() {
        if (state.isAudioMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;
            const totalDur = 4.2;

            // 1. Solid Bass Thump
            const boomOsc = ctx.createOscillator();
            const boomGain = ctx.createGain();
            boomOsc.type = 'sine';
            boomOsc.frequency.setValueAtTime(150, now);
            boomOsc.frequency.exponentialRampToValueAtTime(30, now + 0.65);
            boomGain.gain.setValueAtTime(0.55, now);
            boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
            boomOsc.connect(boomGain);
            boomGain.connect(ctx.destination);
            boomOsc.start(now);
            boomOsc.stop(now + 0.7);

            // 2. Brass Fanfare (C Major)
            const fanfare = [
                { f: 523.25, t: 0.00, dur: 0.35, vol: 0.24 },
                { f: 659.25, t: 0.12, dur: 0.35, vol: 0.24 },
                { f: 783.99, t: 0.24, dur: 0.40, vol: 0.26 },
                { f: 1046.50, t: 0.38, dur: 1.25, vol: 0.32 },
                { f: 1318.51, t: 0.42, dur: 1.20, vol: 0.22 }
            ];

            fanfare.forEach(item => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const tStart = now + item.t;
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(item.f, tStart);
                gain.gain.setValueAtTime(0.01, tStart);
                gain.gain.linearRampToValueAtTime(item.vol, tStart + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, tStart + item.dur);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(tStart);
                osc.stop(tStart + item.dur);
            });

            // 3. Piercing Stadium Whistles
            const whistles = [
                { delay: 0.15, fStart: 1800, fPeak: 2600, dur: 1.3, vibRate: 7.2, vibDepth: 35, vol: 0.30 },
                { delay: 0.50, fStart: 2100, fPeak: 2950, dur: 1.4, vibRate: 8.0, vibDepth: 45, vol: 0.32 },
                { delay: 1.10, fStart: 2300, fPeak: 3100, dur: 1.0, vibRate: 9.0, vibDepth: 40, vol: 0.26 }
            ];

            whistles.forEach(w => {
                const wStart = now + w.delay;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const lfo = ctx.createOscillator();
                const lfoGain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(w.fStart, wStart);
                osc.frequency.exponentialRampToValueAtTime(w.fPeak, wStart + 0.35);
                osc.frequency.exponentialRampToValueAtTime(w.fStart + 200, wStart + w.dur);

                lfo.frequency.setValueAtTime(w.vibRate, wStart);
                lfoGain.gain.setValueAtTime(w.vibDepth, wStart);
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                lfo.start(wStart);
                lfo.stop(wStart + w.dur);

                gain.gain.setValueAtTime(0.001, wStart);
                gain.gain.linearRampToValueAtTime(w.vol, wStart + 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, wStart + w.dur);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(wStart);
                osc.stop(wStart + w.dur);
            });

            // 4. Vocal Crowd Shouting Harmonies ("WOOO! YEEAAAY!")
            const crowd = [
                { delay: 0.08, f1: 220, f2: 440, peak: 560, end: 340, dur: 2.8, vol: 0.35 },
                { delay: 0.12, f1: 280, f2: 560, peak: 680, end: 420, dur: 3.0, vol: 0.38 },
                { delay: 0.18, f1: 340, f2: 680, peak: 820, end: 490, dur: 2.7, vol: 0.32 },
                { delay: 0.25, f1: 420, f2: 840, peak: 980, end: 580, dur: 3.1, vol: 0.36 }
            ];

            crowd.forEach(c => {
                const sStart = now + c.delay;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(c.f1, sStart);
                osc.frequency.exponentialRampToValueAtTime(c.peak, sStart + 0.45);
                osc.frequency.exponentialRampToValueAtTime(c.end, sStart + c.dur);

                filter.type = 'peaking';
                filter.frequency.setValueAtTime(c.f2, sStart);
                filter.frequency.linearRampToValueAtTime(1400, sStart + 0.5);
                filter.Q.setValueAtTime(2.0, sStart);
                filter.gain.setValueAtTime(12, sStart);

                gain.gain.setValueAtTime(0.01, sStart);
                gain.gain.linearRampToValueAtTime(c.vol, sStart + 0.3);
                gain.gain.linearRampToValueAtTime(c.vol * 0.8, sStart + c.dur * 0.6);
                gain.gain.exponentialRampToValueAtTime(0.001, sStart + c.dur);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);

                osc.start(sStart);
                osc.stop(sStart + c.dur);
            });

            // 5. Dense Crowd Applause Buffer (850 Claps)
            const sampleRate = ctx.sampleRate;
            const bufferSize = Math.floor(sampleRate * totalDur);
            const buffer = ctx.createBuffer(2, bufferSize, sampleRate);
            const left = buffer.getChannelData(0);
            const right = buffer.getChannelData(1);

            for (let i = 0; i < bufferSize; i++) {
                const t = i / sampleRate;
                let env = 1.0;
                if (t < 0.25) env = t / 0.25;
                else if (t > 2.0) env = Math.max(0, 1 - (t - 2.0) / 2.2);

                const roar = (Math.random() * 2 - 1) * 0.18 * env;
                left[i] = roar;
                right[i] = roar * (0.85 + Math.random() * 0.3);
            }

            const totalClaps = 850;
            for (let c = 0; c < totalClaps; c++) {
                const r = Math.random();
                const clapTime = 0.04 + Math.pow(r, 0.75) * 3.6;
                const startIdx = Math.floor(clapTime * sampleRate);
                const clapDuration = Math.floor((0.018 + Math.random() * 0.025) * sampleRate);
                const pan = Math.random();

                let clapAmp = 0.35 + Math.random() * 0.55;
                if (clapTime > 2.2) {
                    clapAmp *= Math.max(0.15, 1 - (clapTime - 2.2) / 1.8);
                }

                for (let j = 0; j < clapDuration && (startIdx + j) < bufferSize; j++) {
                    const prog = j / clapDuration;
                    const decay = Math.exp(-prog * 9.0) * (1 + 0.35 * Math.sin(prog * 45));
                    const sample = (Math.random() * 2 - 1) * clapAmp * decay;
                    left[startIdx + j] += sample * (1 - pan);
                    right[startIdx + j] += sample * pan;
                }
            }

            const source = ctx.createBufferSource();
            source.buffer = buffer;

            const hpFilter = ctx.createBiquadFilter();
            hpFilter.type = 'highpass';
            hpFilter.frequency.setValueAtTime(600, now);

            const presenceFilter = ctx.createBiquadFilter();
            presenceFilter.type = 'peaking';
            presenceFilter.frequency.setValueAtTime(1800, now);
            presenceFilter.Q.setValueAtTime(1.2, now);
            presenceFilter.gain.setValueAtTime(6, now);

            const appGain = ctx.createGain();
            appGain.gain.setValueAtTime(1.0, now);
            appGain.gain.exponentialRampToValueAtTime(0.01, now + totalDur);

            source.connect(hpFilter);
            hpFilter.connect(presenceFilter);
            presenceFilter.connect(appGain);
            appGain.connect(ctx.destination);

            source.start(now);
        } catch (e) {
            console.warn('Celebration sound error:', e);
        }
    }

    // =========================================================================
    // 2. CONFETTI BURST ANIMATION
    // =========================================================================

    function triggerConfetti() {
        const canvas = elements.confettiCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#f59e0b', '#fbbf24', '#f43f5e', '#38bdf8', '#ffffff', '#cbd5e1'];

        for (let i = 0; i < 70; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.85) * 18,
                size: Math.random() * 6 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rot: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 10,
                alpha: 1
            });
        }

        let animationFrame;
        function update() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.38;
                p.rot += p.vRot;
                p.alpha -= 0.014;

                if (p.alpha > 0) {
                    alive = true;
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.alpha);
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rot * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            });

            if (alive) {
                animationFrame = requestAnimationFrame(update);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animationFrame);
            }
        }
        update();
    }

    // =========================================================================
    // 3. NAVIGATION & VALIDATION
    // =========================================================================

    function setStep(stepNumber) {
        if (state.isFlipping) return;

        if (stepNumber === 1) {
            elements.panelStep2.classList.remove('active');
            elements.panelStep1.classList.add('active');
            elements.stepIndicator2.classList.remove('active');
            elements.stepIndicator1.classList.add('active');
        } else if (stepNumber === 2) {
            elements.panelStep1.classList.remove('active');
            elements.panelStep2.classList.add('active');
            elements.stepIndicator1.classList.remove('active');
            elements.stepIndicator2.classList.add('active');
            
            // Focus on Option A
            setTimeout(() => {
                elements.inputOptionA.focus();
            }, 100);
        }
    }

    function handleStep1Submission() {
        const name = elements.inputUserName.value.trim();
        if (!name) {
            elements.inputUserName.classList.add('is-invalid');
            elements.userNameError.textContent = 'Harap isi nama kamu terlebih dahulu.';
            elements.userNameError.classList.add('visible');
            elements.inputUserName.focus();
            return;
        }

        elements.inputUserName.classList.remove('is-invalid');
        elements.userNameError.classList.remove('visible');

        state.userName = name;
        elements.summaryUserName.textContent = `Peserta: ${state.userName}`;
        elements.summaryDuration.textContent = `${state.duration} Detik`;

        setStep(2);
    }

    function updateDuration(val) {
        state.duration = parseInt(val, 10);
        elements.timerDisplay.textContent = `${state.duration} Detik`;
        elements.timerSlider.value = state.duration;

        elements.presetChips.forEach(chip => {
            const chipTime = parseInt(chip.getAttribute('data-time'), 10);
            if (chipTime === state.duration) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
    }

    function showToast(msg) {
        elements.toastMessage.textContent = msg;
        elements.toastMessage.classList.add('show');

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            elements.toastMessage.classList.remove('show');
        }, 2600);
    }

    // =========================================================================
    // 4. COIN FLIP EXECUTION & VERDICT
    // =========================================================================

    function executeFlip() {
        if (state.isFlipping) return;

        const valA = elements.inputOptionA.value.trim();
        const valB = elements.inputOptionB.value.trim();

        let hasError = false;
        if (!valA) {
            elements.inputOptionA.classList.add('is-invalid');
            elements.optionAError.textContent = 'Harap isi Pilihan A.';
            elements.optionAError.classList.add('visible');
            hasError = true;
        } else {
            elements.inputOptionA.classList.remove('is-invalid');
            elements.optionAError.classList.remove('visible');
        }

        if (!valB) {
            elements.inputOptionB.classList.add('is-invalid');
            elements.optionBError.textContent = 'Harap isi Pilihan B.';
            elements.optionBError.classList.add('visible');
            hasError = true;
        } else {
            elements.inputOptionB.classList.remove('is-invalid');
            elements.optionBError.classList.remove('visible');
        }

        if (hasError) {
            if (!valA) elements.inputOptionA.focus();
            else elements.inputOptionB.focus();
            return;
        }

        state.optionA = valA;
        state.optionB = valB;
        state.isFlipping = true;

        // UI Prep
        elements.btnFlipCoin.disabled = true;
        elements.appShell.classList.add('suspense-active');
        elements.verdictContainer.querySelector('.verdict-card').classList.remove('visible');

        // Ensure both faces are visible during flight
        elements.faceA.style.visibility = 'visible';
        elements.faceB.style.visibility = 'visible';

        const duration = state.duration;
        let timeLeft = duration;

        elements.btnFlipText.textContent = `Menentukan Pilihan (${timeLeft}s)...`;
        elements.statusTicker.textContent = `Koin sedang berputar untuk ${state.userName}...`;
        elements.statusTicker.classList.add('active');

        if (countdownTimer) clearInterval(countdownTimer);
        countdownTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                elements.btnFlipText.textContent = `Menentukan Pilihan (${timeLeft}s)...`;
            } else {
                clearInterval(countdownTimer);
            }
        }, 1000);

        // Sound start
        playTensionAudio(duration);

        // Random determination: 0 = A, 1 = B
        const winner = Math.floor(Math.random() * 2);

        // 3D physics calculations
        const totalSpins = Math.max(10, Math.round(duration * 2.5));
        const extraDegrees = totalSpins * 360;
        const currentMod = state.currentRotation % 360;
        const targetMod = (winner === 0) ? 0 : 180;
        let delta = targetMod - currentMod;
        if (delta < 0) delta += 360;
        state.currentRotation += extraDegrees + delta;

        // Apply CSS transform
        elements.coin.style.transition = `transform ${duration}s cubic-bezier(0.08, 0.95, 0.15, 1)`;
        elements.coinWrapper.style.animationDuration = `${duration}s`;
        elements.coinWrapper.classList.remove('flipping');
        void elements.coinWrapper.offsetWidth; // Reflow
        elements.coinWrapper.classList.add('flipping');
        elements.coin.style.transform = `rotateY(${state.currentRotation}deg)`;

        // Result Reveal
        setTimeout(() => {
            if (countdownTimer) clearInterval(countdownTimer);

            state.isFlipping = false;
            elements.btnFlipCoin.disabled = false;
            elements.btnFlipText.textContent = 'Putar Koin Lagi';
            elements.appShell.classList.remove('suspense-active');
            elements.statusTicker.classList.remove('active');
            elements.statusTicker.textContent = '';

            // Sound celebration & confetti
            playCelebrationAudio();
            triggerConfetti();

            // Stats & Label
            state.totalFlips++;
            let chosenText = '';
            let chosenSide = '';

            if (winner === 0) {
                state.winsA++;
                chosenSide = 'Sisi A (Emas)';
                chosenText = state.optionA;
                elements.faceA.style.visibility = 'visible';
                elements.faceB.style.visibility = 'hidden';
            } else {
                state.winsB++;
                chosenSide = 'Sisi B (Perak)';
                chosenText = state.optionB;
                elements.faceA.style.visibility = 'hidden';
                elements.faceB.style.visibility = 'visible';
            }

            state.lastVerdict = {
                user: state.userName,
                side: chosenSide,
                choice: chosenText
            };

            // Update Verdict Card
            elements.verdictUser.textContent = `Peserta: ${state.userName}`;
            elements.verdictSide.textContent = chosenSide;
            elements.verdictChoice.textContent = chosenText;
            elements.verdictContainer.querySelector('.verdict-card').classList.add('visible');

            // Update Stats Display
            elements.statTotalCount.textContent = state.totalFlips;
            elements.statCountA.textContent = state.winsA;
            elements.statCountB.textContent = state.winsB;
        }, duration * 1000);
    }

    function copyVerdictToClipboard() {
        if (!state.lastVerdict) return;
        const text = `Hasil KoinTakdir untuk ${state.lastVerdict.user}: "${state.lastVerdict.choice}" (${state.lastVerdict.side})`;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('Keputusan berhasil disalin ke clipboard');
                elements.copyButtonText.textContent = 'Tersalin!';
                setTimeout(() => {
                    elements.copyButtonText.textContent = 'Salin Hasil';
                }, 2000);
            }).catch(() => {
                fallbackCopyText(text);
            });
        } else {
            fallbackCopyText(text);
        }
    }

    function fallbackCopyText(text) {
        window.prompt('Salin teks keputusan ini:', text);
    }

    // =========================================================================
    // 5. EVENT LISTENERS ATTACHMENT
    // =========================================================================

    function initEvents() {
        // Step 1 navigation
        elements.btnGoToStep2.addEventListener('click', handleStep1Submission);
        elements.inputUserName.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleStep1Submission();
        });
        elements.inputUserName.addEventListener('input', () => {
            if (elements.inputUserName.value.trim()) {
                elements.inputUserName.classList.remove('is-invalid');
                elements.userNameError.classList.remove('visible');
            }
        });

        // Step 2 back button
        elements.btnBackToStep1.addEventListener('click', () => setStep(1));

        // Duration Slider & Presets
        elements.timerSlider.addEventListener('input', (e) => {
            updateDuration(e.target.value);
        });

        elements.presetChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const time = chip.getAttribute('data-time');
                updateDuration(time);
            });
        });

        // Quick Examples
        elements.exampleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const a = btn.getAttribute('data-a');
                const b = btn.getAttribute('data-b');
                elements.inputOptionA.value = a;
                elements.inputOptionB.value = b;
                elements.inputOptionA.classList.remove('is-invalid');
                elements.inputOptionB.classList.remove('is-invalid');
                elements.optionAError.classList.remove('visible');
                elements.optionBError.classList.remove('visible');
                showToast('Contoh pilihan diterapkan');
            });
        });

        // Audio Toggle
        elements.soundToggleBtn.addEventListener('click', toggleAudio);

        // Coin Flip Trigger (Button or Coin Click)
        elements.btnFlipCoin.addEventListener('click', executeFlip);
        elements.coinWrapper.addEventListener('click', executeFlip);
        elements.coinWrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                executeFlip();
            }
        });

        // Verdict Actions
        elements.btnCopyVerdict.addEventListener('click', copyVerdictToClipboard);
        elements.btnReplayFlip.addEventListener('click', executeFlip);
    }

    // Start
    initEvents();

})();
