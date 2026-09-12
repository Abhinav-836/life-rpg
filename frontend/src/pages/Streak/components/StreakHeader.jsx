import streakBanner from '../../../assets/images/streak-banner.png';

export default function StreakHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 shadow-xl mb-8 group">
      {/* Background panoramic image */}
      <img
        src={streakBanner}
        alt="Consistency Streak Banner"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Dark to translucent gradient overlay for contrast and glowing castle reveal */}
      <div className="absolute inset-0 bg-gradient-to-r from-void/90 via-void/65 to-void/35 backdrop-blur-[1px] pointer-events-none" />

      {/* Header Content */}
      <div className="relative z-10 px-6 py-6 sm:px-8 sm:py-8">
        <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-gold drop-shadow-md flex items-center gap-2 mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse" />
          Consistency
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-wide drop-shadow-lg">
          Streak
        </h1>
        <p className="text-gray-200 mt-2 text-sm sm:text-base max-w-xl drop-shadow">
          Showing up daily compounds. Here&apos;s the record of it.
        </p>
      </div>
    </div>
  );
}
