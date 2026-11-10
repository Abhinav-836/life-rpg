import { Link } from 'react-router-dom';

const CONTACT = 'ashutoshabhinavbachra0009@gmail.com';
const UPDATED = '10 November 2026';

function Shell({ title, children }) {
  return (
    <div className="min-h-screen bg-surface px-6 py-12 text-gray-300">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="font-display text-xl font-bold tracking-wider text-white">
          Life RPG
        </Link>
        <h1 className="mt-10 font-display text-3xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-gray-400">Last updated {UPDATED}</p>
        <article className="mt-8 leading-relaxed [&_a]:text-gold-bright [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_strong]:text-white [&_ul]:mt-3 [&_ul]:space-y-1.5">
          {children}
        </article>
        <p className="mt-12 flex gap-5 text-sm">
          <Link to="/" className="text-gold-bright hover:text-white">Home</Link>
          <Link to="/privacy" className="text-gold-bright hover:text-white">Privacy</Link>
          <Link to="/terms" className="text-gold-bright hover:text-white">Terms</Link>
        </p>
      </div>
    </div>
  );
}

export function Privacy() {
  return (
    <Shell title="Privacy policy">
      <p>
        Life RPG is a free habit tracker built as a game, made by Abhinav Ashutosh (Kavorin Tech). This page explains
        what we store and why. We don&rsquo;t sell your data or use it for advertising.
      </p>

      <h2>What we store</h2>
      <ul>
        <li><strong>Your account:</strong> email address, display name, time zone, and a bcrypt hash of your password (never the password itself).</li>
        <li><strong>Your game:</strong> your character, quests (tasks you write), streaks, stats, rewards and badges.</li>
        <li><strong>Signing in:</strong> a sign-in token kept in your browser&rsquo;s local storage until you log out.</li>
        <li><strong>Server logs:</strong> your IP address and request times, used to keep the service running and stop abuse.</li>
        <li><strong>Visit statistics:</strong> Vercel Web Analytics counts page views without cookies and without storing personal information.</li>
      </ul>
      <p>Don&rsquo;t put sensitive personal information in quest titles or descriptions.</p>

      <h2>Who else handles it</h2>
      <p>Render runs the server, a hosted Postgres database stores your data, and Vercel hosts the website. Nobody else receives your data.</p>

      <h2>Deleting your account</h2>
      <p>
        You can delete your account at any time from <strong>Settings</strong>. That permanently removes your account
        and all its progress. You can also email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> to ask for a copy or
        deletion of your data.
      </p>

      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. If this policy changes, the date at the top changes too.
      </p>
    </Shell>
  );
}

export function Terms() {
  return (
    <Shell title="Terms of service">
      <p>
        These terms cover your use of Life RPG, a free app made by Abhinav Ashutosh (Kavorin Tech). By creating an
        account, you agree to them.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>Keep your password secret. You&rsquo;re responsible for what happens in your account.</li>
        <li>One account per person. Don&rsquo;t sign up with someone else&rsquo;s email.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>
        Don&rsquo;t use Life RPG to break the law, store offensive content, attack or overload the service, or try to
        get into other people&rsquo;s accounts. We may suspend accounts that do.
      </p>

      <h2>The service</h2>
      <p>
        Life RPG is free and provided &ldquo;as is&rdquo;, without any guarantee that it will always be available or
        that your progress will never be lost. It&rsquo;s a motivation tool, not medical, fitness or professional
        advice. To the extent the law allows, we are not liable for losses that come from using it. These terms are
        governed by the laws of India.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. If these terms change, the date at the top changes too. See also
        the <Link to="/privacy">privacy policy</Link>.
      </p>
    </Shell>
  );
}