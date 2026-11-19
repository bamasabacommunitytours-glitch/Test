import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type RoutePath = '/' | '/adopt' | '/volunteer' | '/about' | '/contact' | '/donate' | string;

interface NavbarProps {
  currentPath: RoutePath;
  onNavigate: (path: string) => void;
}

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Adopt', path: '/adopt' },
  { label: 'Volunteer', path: '/volunteer' },
  { label: 'Our Work', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
      <div className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="font-serif text-2xl font-bold tracking-tight text-zinc-900 whitespace-nowrap shrink-0 hover:text-[#14532D] transition-colors"
        >
          HSA Bunyo
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleLinkClick(e, item.path)}
                className={`text-[15px] font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  active
                    ? 'text-[#14532D] border-[#14532D]'
                    : 'text-zinc-600 border-transparent hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action (+ mobile menu trigger on small screens) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/donate"
            onClick={(e) => handleLinkClick(e, '/donate')}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#14532D] hover:bg-[#166534] rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            Donate Now
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-zinc-200 bg-white px-4 py-3 space-y-1"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleLinkClick(e, item.path)}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-emerald-50 text-[#14532D]'
                    : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}
