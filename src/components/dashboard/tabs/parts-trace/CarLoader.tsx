import React from 'react';

const CarLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 w-full">
    <div className="relative w-72 mb-8">
      {/* Circuit board background */}
      <div className="absolute inset-0 -z-10 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(150,202,56,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(150,202,56,0.5) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }} />

      {/* Car SVG */}
      <svg
        viewBox="0 0 280 110"
        className="w-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse cx="140" cy="104" rx="100" ry="6" fill="rgba(0,0,0,0.08)" />

        {/* Car body */}
        <path
          d="M 20,75 L 20,58 C 20,58 45,35 75,32 L 170,32 C 200,32 240,52 250,62 L 260,75 Z"
          fill="url(#carGrad)"
          stroke="#5a7a32"
          strokeWidth="2"
        />
        {/* Roof */}
        <path
          d="M 70,32 C 70,32 85,12 110,10 L 165,10 C 185,10 200,24 205,32"
          fill="url(#roofGrad)"
          stroke="#5a7a32"
          strokeWidth="1.5"
        />
        {/* Windows */}
        <path d="M 80,32 L 88,14 L 148,14 L 148,32 Z" fill="rgba(150,202,56,0.15)" stroke="#96ca38" strokeWidth="1" />
        <path d="M 153,32 L 155,14 L 200,20 L 202,32 Z" fill="rgba(150,202,56,0.15)" stroke="#96ca38" strokeWidth="1" />
        {/* Door line */}
        <line x1="150" y1="32" x2="148" y2="75" stroke="#5a7a32" strokeWidth="1" />
        {/* Headlights */}
        <rect x="248" y="60" width="14" height="8" rx="3" fill="#fef08a" opacity="0.9" />
        <rect x="18" y="60" width="8" height="6" rx="2" fill="#fca5a5" opacity="0.8" />
        {/* Door handle detail */}
        <rect x="170" y="55" width="12" height="3" rx="1.5" fill="#5a7a32" opacity="0.6" />
        <rect x="105" y="55" width="12" height="3" rx="1.5" fill="#5a7a32" opacity="0.6" />

        {/* Wheels */}
        <circle cx="68" cy="78" r="18" fill="#1e293b" stroke="#5a7a32" strokeWidth="2" />
        <circle cx="68" cy="78" r="10" fill="#334155" />
        <circle cx="68" cy="78" r="4" fill="#96ca38" />
        <circle cx="202" cy="78" r="18" fill="#1e293b" stroke="#5a7a32" strokeWidth="2" />
        <circle cx="202" cy="78" r="10" fill="#334155" />
        <circle cx="202" cy="78" r="4" fill="#96ca38" />

        {/* Scanning beam */}
        <line
          x1="0" y1="10" x2="0" y2="100"
          stroke="#96ca38"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
          style={{ animation: 'carScan 1.8s ease-in-out infinite' }}
        />
        {/* Beam glow */}
        <line
          x1="0" y1="10" x2="0" y2="100"
          stroke="#96ca38"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.1"
          style={{ animation: 'carScan 1.8s ease-in-out infinite' }}
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="carGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0f8e8" />
            <stop offset="100%" stopColor="#d9efc0" />
          </linearGradient>
          <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e8f5d4" />
            <stop offset="100%" stopColor="#c8e8a0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Data trace lines */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-around pointer-events-none">
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((pos, i) => (
          <div
            key={i}
            className="w-0.5 bg-[#96ca38] rounded-full"
            style={{
              height: '40px',
              opacity: 0,
              animation: `traceUp 1.5s ease-out ${i * 0.18}s infinite`
            }}
          />
        ))}
      </div>
    </div>

    {/* Text + Progress */}
    <div className="text-center space-y-3 max-w-sm">
      <h3 className="text-xl font-bold text-slate-700 tracking-tight">
        Tracing Vehicle Parts
        <span style={{ animation: 'ellipsis 1.5s steps(3, end) infinite' }}>...</span>
      </h3>
      <p className="text-sm text-slate-500">Connecting MatNEXT traceability chain across suppliers, batches and assembly lines</p>

      {/* Progress bar */}
      <div className="w-64 mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden mt-4">
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #5a7a32, #96ca38)',
            animation: 'barSweep 1.6s ease-in-out infinite'
          }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-center gap-6 mt-2">
        {['BOM Fetch', 'Supplier Link', 'QC Logs', 'Compliance'].map((step, i) => (
          <div
            key={step}
            className="text-[10px] text-slate-400 font-medium flex flex-col items-center gap-1"
            style={{ animation: `stepFade 2s ease-in-out ${i * 0.4}s infinite alternate` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#96ca38]" />
            {step}
          </div>
        ))}
      </div>
    </div>

    <style>{`
      @keyframes carScan {
        0%   { transform: translateX(0px);   opacity: 0; }
        5%   { opacity: 0.9; }
        90%  { opacity: 0.9; }
        100% { transform: translateX(280px); opacity: 0; }
      }
      @keyframes traceUp {
        0%   { opacity: 0; transform: translateY(20px); }
        40%  { opacity: 0.6; }
        100% { opacity: 0; transform: translateY(-20px); }
      }
      @keyframes barSweep {
        0%   { width: 0%;   margin-left: 0%;   }
        50%  { width: 60%;  margin-left: 20%;  }
        100% { width: 0%;   margin-left: 100%; }
      }
      @keyframes stepFade {
        from { opacity: 0.3; }
        to   { opacity: 1;   }
      }
      @keyframes ellipsis {
        0%   { content: ''; }
        33%  { content: '.'; }
        66%  { content: '..'; }
        100% { content: '...'; }
      }
    `}</style>
  </div>
);

export default CarLoader;
