export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="px-6 py-10 border-t border-white/10 text-center text-xs text-gray-300">
      <p className="drop-shadow-sm">
        © {year} Life RPG · Built by{' '}
        <a
          href="https://github.com/Abhinav-836"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-white"
        >
          Abhinav Ashutosh
        </a>
      </p>
    </footer>
  );
}