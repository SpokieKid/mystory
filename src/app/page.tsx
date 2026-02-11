'use client';

import Link from 'next/link';
import { SCRIPTS } from '@/data/scripts';
import { useTranslation } from '@/i18n';

function KnifeIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-red-500"
    >
      <path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-1.414-1.414l7.91-7.912" />
      <path d="M12.992 10.93 20 3.923c.55-.55.546-1.467-.01-2.024a1.384 1.384 0 0 0-2.01-.01L10.97 8.904" />
      <path d="m13.8 11.7-1.6-1.6" />
    </svg>
  );
}

function ScriptCard({ script, index }: { script: typeof SCRIPTS[number]; index: number }) {
  const { t } = useTranslation();
  const delayClass = index === 0 ? 'delay-400' : index === 1 ? 'delay-500' : 'delay-600';

  const title = t(`script.${script.id}.title`);
  const description = t(`script.${script.id}.description`);

  return (
    <Link
      href={`/room?script=${script.id}`}
      className={`group relative glass-card p-6 animate-fade-in-up ${delayClass} hover:border-red-500/30 active:scale-[0.98]`}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-red-500/5 via-transparent to-purple-500/5" />

      <div className="relative flex items-start gap-5">
        {/* Cover emoji with atmospheric ring */}
        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl group-hover:border-red-500/30 group-hover:bg-red-500/5 transition-all duration-300">
          {script.cover}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors duration-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h3>
          <p className="text-zinc-400 text-sm mt-1 leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* Meta tags */}
          <div className="flex items-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 bg-white/5 rounded-full px-2.5 py-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              {t('home.players', { min: script.playerCount.min, max: script.playerCount.max })}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 bg-white/5 rounded-full px-2.5 py-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {t('home.scenes', { count: script.scenes.length })}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 bg-white/5 rounded-full px-2.5 py-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
              {t('home.roles', { count: script.characters.length })}
            </span>
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-red-400 group-hover:bg-red-500/10 transition-all duration-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 md:px-8 relative overflow-hidden">
      {/* Atmospheric orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-900/20 rounded-full blur-[128px] animate-breathe pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[150px] animate-breathe pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-950/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-14">
          {/* Animated knife icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 mb-8 animate-fade-in-down animate-pulse-glow">
            <KnifeIcon />
          </div>

          {/* Title with dramatic typography */}
          <h1 className="animate-fade-in-up delay-100">
            <span className="block text-5xl md:text-6xl font-black tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t('home.title.ai')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-600">{t('home.title.murder-mystery')}</span>
            </span>
          </h1>

          <p className="text-zinc-400 text-lg mt-4 animate-fade-in-up delay-200 leading-relaxed">
            {t('home.subtitle')}
            <br className="hidden sm:block" />
            <span className="text-zinc-500">{t('home.subtitle2')}</span>
          </p>
        </div>

        {/* Script Selection */}
        <div className="space-y-4 mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-600 font-medium ml-1 animate-fade-in delay-300">
            {t('home.choose-script')}
          </p>
          {SCRIPTS.map((script, i) => (
            <ScriptCard key={script.id} script={script} index={i} />
          ))}
        </div>

        {/* How it works - refined */}
        <div className="glass-card p-6 animate-fade-in-up delay-700">
          <h3 className="text-sm uppercase tracking-[0.15em] text-zinc-500 font-medium mb-5 text-center">
            {t('home.how-it-works')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: '01', labelKey: 'home.step.01', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg> },
              { step: '02', labelKey: 'home.step.02', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg> },
              { step: '03', labelKey: 'home.step.03', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15.536 11.293a1 1 0 0 1 0 1.414l-4.243 4.243a1 1 0 0 1-1.414 0 1 1 0 0 1 0-1.414L14.122 12l-4.243-4.536a1 1 0 0 1 1.414-1.414z"/><circle cx="12" cy="12" r="10"/></svg> },
              { step: '04', labelKey: 'home.step.04', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> },
            ].map(({ step, labelKey, icon }) => (
              <div key={step} className="text-center group">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-zinc-500 mb-3 group-hover:text-red-400 group-hover:border-red-500/30 transition-all duration-300">
                  {icon}
                </div>
                <div className="text-[10px] text-red-500/60 font-mono mb-1">{step}</div>
                <div className="text-zinc-400 text-sm">{t(labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center animate-fade-in delay-1000">
        <p className="text-zinc-700 text-xs tracking-wider">
          {t('home.footer')}
        </p>
      </footer>
    </main>
  );
}
