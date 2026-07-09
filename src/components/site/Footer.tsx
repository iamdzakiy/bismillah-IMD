import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-space-900 border-t border-space-700 py-12 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-gradient mb-4">IMD 2026</h3>
          <p className="text-white/40 text-sm">
            International Microorganism Day — Program Studi Mikrobiologi ITB
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Competitions</h4>
          <ul className="space-y-2 text-sm text-white/40">
            <li><Link href="/competitions/olympiad" className="hover:text-bio-cyan transition">Microbiology Olympiad</Link></li>
            <li><Link href="/competitions/spc" className="hover:text-bio-emerald transition">Science Project Competition</Link></li>
            <li><Link href="/competitions/nec" className="hover:text-bio-purple transition">National Essay Competition</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Events</h4>
          <ul className="space-y-2 text-sm text-white/40">
            <li><Link href="#" className="hover:text-white">Symposium</Link></li>
            <li><Link href="#" className="hover:text-white">Workshop</Link></li>
            <li><Link href="#" className="hover:text-white">Exhibition</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <ul className="space-y-2 text-sm text-white/40">
            <li><a href="https://instagram.com/imd.itb" className="hover:text-white">Instagram @imd.itb</a></li>
            <li><a href="https://instagram.com/archaea_itb" className="hover:text-white">Instagram @archaea_itb</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-space-700 text-center text-sm text-white/30">
        © 2026 International Microorganism Day — HIMAMIKRO "Archaea" ITB
      </div>
    </footer>
  );
}