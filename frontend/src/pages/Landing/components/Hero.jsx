import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button.jsx';

export default function Hero() {
  return (
    <section className="relative px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 overflow-hidden">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.1] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
          Turn your real life into an epic adventure.
        </h1>
        <p className="text-gray-100 text-base sm:text-lg mt-6 max-w-xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] font-medium">
          Life RPG turns the tasks you already have to do — the workout, the reading, the inbox — into quests
          with real XP, gold, and a character that actually grows when you show up.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
          <Link to="/signup">
            <Button size="lg" className="min-w-[180px] shadow-xl shadow-purple/30">Start your quest</Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="ghost" className="min-w-[180px] backdrop-blur-md bg-black/35 hover:bg-black/55 border border-white/30 text-white shadow-xl">Log in</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
