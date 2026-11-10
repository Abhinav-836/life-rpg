import { useEffect, useState } from 'react';
import Skeleton from './Skeleton.jsx';

/*
 * Skeleton placeholders shaped like each page, shown while its data loads,
 * instead of a centred spinner. The shape tells people what's coming and
 * the layout doesn't jump when the data arrives.
 */

function Status({ label }) {
  return <span className="sr-only" role="status" aria-live="polite">{label}</span>;
}

const Card = ({ className = '', children }) => <div className={`card p-5 ${className}`}>{children}</div>;

function HeaderSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-56 mb-3" />
      <Skeleton className="h-4 w-80 max-w-full" />
    </div>
  );
}

function StatTiles({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-6 w-16" />
        </Card>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div>
      <Status label="Tallying the ledger…" />
      <HeaderSkeleton />
      <StatTiles />
      <StatTiles />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card><Skeleton className="h-4 w-32 mb-4" /><Skeleton className="h-48 w-full" /></Card>
        <Card><Skeleton className="h-4 w-32 mb-4" /><Skeleton className="h-48 w-full" /></Card>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div>
      <Status label="Loading profile…" />
      <HeaderSkeleton />
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <StatTiles />
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {[0, 1].map((i) => (
          <Card key={i} className="space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-32" />
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div>
      <Status label="Loading settings…" />
      <HeaderSkeleton />
      <div className="space-y-6 max-w-2xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64 max-w-full" />
            </div>
            <Skeleton className="h-6 w-12 rounded-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}

export function StreakSkeleton() {
  return (
    <div>
      <Status label="Checking your streak…" />
      <HeaderSkeleton />
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2"><Skeleton className="h-4 w-28 mb-4" /><Skeleton className="h-16 w-40" /></Card>
        <Card><Skeleton className="h-4 w-28 mb-4" /><Skeleton className="h-16 w-24" /></Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
          </div>
        </Card>
        <div className="space-y-6">
          <Card><Skeleton className="h-4 w-32 mb-4" /><Skeleton className="h-24 w-full" /></Card>
          <Card><Skeleton className="h-4 w-32 mb-4" /><Skeleton className="h-16 w-full" /></Card>
        </div>
      </div>
    </div>
  );
}

/** Character page body (the page header is already on screen). */
export function CharacterSkeleton() {
  return (
    <div className="space-y-6">
      <Status label="Summoning your character…" />
      <Card className="flex items-center gap-6">
        <Skeleton className="h-28 w-28 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </Card>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
        </Card>
        <div className="space-y-6">
          <Card><Skeleton className="h-5 w-32 mb-4" /><Skeleton className="h-20 w-full" /></Card>
          <Card><Skeleton className="h-5 w-32 mb-4" /><Skeleton className="h-12 w-full" /></Card>
        </div>
      </div>
    </div>
  );
}

/**
 * First load of the signed-in app: sidebar + page outline. The backend runs
 * on a free server that sleeps when idle, so after a few seconds we say so,
 * instead of leaving people staring at a page that seems stuck.
 */
export function AppShellSkeleton() {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex bg-surface text-ink">
      <Status label="Loading your character…" />
      <aside className="hidden md:flex w-64 flex-col gap-4 p-6 border-r border-white/10" aria-hidden="true">
        <Skeleton className="h-7 w-32 mb-6" />
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
      </aside>
      <div className="flex-1 min-w-0">
        <div className="h-16 border-b border-white/10 px-6 flex items-center justify-between" aria-hidden="true">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-6xl mx-auto">
          {slow && (
            <p className="mb-6 rounded-lg border border-white/10 bg-white/5 text-ink-muted text-sm px-4 py-3">
              Waking up the game server. It sleeps when nobody&rsquo;s playing, so the first load can take up to a minute.
            </p>
          )}
          <HeaderSkeleton />
          <StatTiles />
          <div className="grid lg:grid-cols-2 gap-6">
            <Card><Skeleton className="h-4 w-32 mb-4" /><Skeleton className="h-32 w-full" /></Card>
            <Card><Skeleton className="h-4 w-32 mb-4" /><Skeleton className="h-32 w-full" /></Card>
          </div>
        </div>
      </div>
    </div>
  );
}
