function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Burning the midnight oil';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function WelcomeHeader({ name }) {
  return (
    <div className="mb-6">
      <p className="text-sm text-purple font-medium mb-1 drop-shadow-sm">{getTimeGreeting()}</p>
      <h1 className="text-2xl sm:text-3xl font-display text-white drop-shadow-md">
        {name ? `Welcome back, ${name.split(' ')[0]}` : 'Welcome back'}
      </h1>
    </div>
  );
}
