'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ValentinePage() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const messages = [
    "I never went looking for this feeling...",
    "But then you walked into my life 🌸",
    "And something inside me just... shifted ✨",
    "I didn't plan to fall for you...",
    "But here I am, completely helpless 🥺",
    "I have never loved anyone the way I love you...",
    "And I don't want anyone else, ever 💕",
  ];

  // After yes — story messages
  const storyMessages = [
    "Do you remember Haridwar? 🌊",
    "How we hesitated at first...",
    "Then Rishikesh happened ✨",
    "Sitting by the ghat, talking for hours...",
    "That unexpected kiss in the car... 💋",
    "That day felt too short, Baby 🥺",
    "I want a thousand more days like that, with you 💞",
  ];

  const emojis = ['❤️', '🌸', '💫', '💝', '🌊', '💞', '🌹', '✨'];

  const [storyStep, setStoryStep] = useState(0);
  const [showStoryFinal, setShowStoryFinal] = useState(false);

  useEffect(() => {
    if (currentMessage < messages.length) {
      const timer = setTimeout(() => {
        setCurrentMessage(prev => prev + 1);
      }, currentMessage === 0 ? 1000 : 3000);
      return () => clearTimeout(timer);
    } else if (currentMessage === messages.length) {
      setTimeout(() => setShowFinal(true), 800);
    }
  }, [currentMessage, messages.length]);

  // Story auto-advance after yes
  useEffect(() => {
    if (!celebrating) return;
    if (storyStep < storyMessages.length) {
      const timer = setTimeout(() => {
        setStoryStep(prev => prev + 1);
      }, storyStep === 0 ? 800 : 3000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setShowStoryFinal(true), 800);
    }
  }, [celebrating, storyStep, storyMessages.length]);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;

    const animate = (timestamp: number) => {
      if (!lastTime || timestamp - lastTime >= 500) {
        if (particleContainerRef.current) {
          const particle = document.createElement('div');
          particle.className = 'love-particle';
          particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          particle.style.left = Math.random() * 100 + '%';
          particle.style.animationDuration = Math.random() * 3 + 3 + 's';
          particleContainerRef.current.appendChild(particle);
          setTimeout(() => particle.remove(), 6000);
          lastTime = timestamp;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleYesClick = () => {
    setCelebrating(true);
    setShowCelebration(true);
    setShowFinal(false);
  };

  const handleNoHover = () => {
    if (noBtnRef.current) {
      const x = Math.random() * 500 - 100;
      const y = Math.random() * 500 - 100;
      const rotate = Math.random() * 360;
      noBtnRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
      noBtnRef.current.style.transition = 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
    }
  };

  const handlePuzzleClick = () => {
    router.push('/puzzle');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-950 via-pink-900 to-purple-900">
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'52\' height=\'52\' viewBox=\'0 0 52 52\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M26 35.5C17.6 35.5 4 29.5 4 17.5 4 9.5 11.7 3 21.5 3c5.1 0 8.7 2.5 11.5 6 2.8-3.5 6.4-6 11.5-6C40.3 3 48 9.5 48 17.5c0 12-13.6 18-22 18z\' fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        }}
      />

      <div ref={particleContainerRef} className="absolute inset-0 pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-4/5 max-w-3xl">

        {/* ── PHASE 1: Feelings (before yes) ── */}
        {!celebrating && messages.map((msg, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 flex items-center justify-center
              text-3xl md:text-5xl text-white font-mono px-4
              transition-all duration-[1500ms] ease-in-out
              ${currentMessage === index ? 'opacity-100 translate-y-0' : ''}
              ${currentMessage > index ? 'opacity-0 -translate-y-12 scale-75' : ''}
              ${currentMessage < index ? 'opacity-0 translate-y-12' : ''}
            `}
            style={{ textShadow: '0 0 20px rgba(255,100,150,0.6)' }}
          >
            {msg}
          </div>
        ))}

        {/* ── Valentine ask ── */}
        {showFinal && !celebrating && (
          <div className="animate-reveal px-4">
            <p className="text-base md:text-lg text-pink-200 font-mono mb-3 opacity-70 italic">
              — straight from my heart —
            </p>
            <h2 className="text-4xl md:text-6xl text-white font-mono mb-4 leading-tight">
              Rakhi, will you be my Valentine? 💕
            </h2>
            <p className="text-sm md:text-base text-white/50 font-mono mb-8 italic">
              (my happiness is literally in your hands right now 🥺)
            </p>
            <div className="flex gap-4 justify-center mt-4 flex-wrap">
              <button
                onClick={handleYesClick}
                className="px-8 py-4 text-xl md:text-2xl rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-105"
              >
                Yes, always! 🌹
              </button>
              <button
                ref={noBtnRef}
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                className="px-8 py-4 text-xl md:text-2xl rounded-full bg-gray-700/60 text-white transition-all duration-300 relative"
              >
                Still thinking... 💭
              </button>
            </div>
          </div>
        )}

        {/* ── PHASE 2: Story plays after Yes ── */}
        {celebrating && !showStoryFinal && storyMessages.map((msg, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 flex items-center justify-center
              text-3xl md:text-5xl text-white font-mono px-4
              transition-all duration-[1500ms] ease-in-out
              ${storyStep === index ? 'opacity-100 translate-y-0' : ''}
              ${storyStep > index ? 'opacity-0 -translate-y-12 scale-75' : ''}
              ${storyStep < index ? 'opacity-0 translate-y-12' : ''}
            `}
            style={{ textShadow: '0 0 20px rgba(255,100,150,0.6)' }}
          >
            {msg}
          </div>
        ))}

        {/* ── Final celebration screen ── */}
        {showStoryFinal && (
          <div className="animate-reveal px-4">
            <div className="text-5xl mb-4">💍✨</div>
            <h2 className="text-3xl md:text-4xl text-white font-mono mb-3 leading-snug">
              I knew it from that very first day 🎉
            </h2>
            <p className="text-lg md:text-xl text-pink-200 mt-2 font-mono">
              That day was too short, Baby...
            </p>
            <p className="text-base md:text-lg text-white/80 mt-2 font-mono">
              So I made you something to remember it 💞
            </p>

            <button
              onClick={handlePuzzleClick}
              className="mt-8 px-10 py-5 text-xl md:text-2xl rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-105"
            >
              Open your surprise 🎁
            </button>
          </div>
        )}
      </div>

      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-burst"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 0.5 + 's',
              }}
            >
              {['❤️', '💕', '🌹', '✨', '💝'][i % 5]}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes reveal {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes burst {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(5); opacity: 0; }
        }
        :global(.love-particle) {
          position: absolute;
          font-size: 24px;
          opacity: 0;
          animation: float 6s linear infinite;
          will-change: transform;
        }
        :global(.animate-reveal) {
          animation: reveal 1s forwards;
        }
        :global(.animate-burst) {
          animation: burst 1s ease-out forwards;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}