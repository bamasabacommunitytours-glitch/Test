interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleLink = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 text-zinc-600 mt-8">
      <div className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
        <div className="md:col-span-5 space-y-3">
          <p className="font-serif text-lg font-semibold text-zinc-900">
            HSA Bunyo Dog Rescue
          </p>
          <p className="text-sm leading-relaxed max-w-sm">
            Registered community animal welfare sanctuary in Wakiso District, Uganda. Dedicated to emergency street rescue, humane sterilization, and permanent local and international rehoming.
          </p>
          <p className="text-xs text-zinc-500 pt-1">
            Plot 14, Bunyo–Entebbe Road, Wakiso District, Central Uganda
          </p>
        </div>

        <div className="md:col-span-3 space-y-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
            Sanctuary Pages
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/adopt"
                onClick={(e) => handleLink(e, '/adopt')}
                className="hover:text-[#14532D] transition-colors"
              >
                Adoptable Dogs
              </a>
            </li>
            <li>
              <a
                href="/volunteer"
                onClick={(e) => handleLink(e, '/volunteer')}
                className="hover:text-[#14532D] transition-colors"
              >
                Volunteer & Flight Buddies
              </a>
            </li>
            <li>
              <a
                href="/about"
                onClick={(e) => handleLink(e, '/about')}
                className="hover:text-[#14532D] transition-colors"
              >
                Our Work & Clinics
              </a>
            </li>
            <li>
              <a
                href="/donate"
                onClick={(e) => handleLink(e, '/donate')}
                className="hover:text-[#14532D] transition-colors"
              >
                Donate Online
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4 space-y-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
            Visiting & Direct Contact
          </h3>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between gap-4 border-b border-zinc-200 pb-1.5">
              <dt className="text-zinc-500">Sanctuary Hours</dt>
              <dd className="text-zinc-900 font-medium tabular-nums">Tue–Sun · 09:00–17:00 EAT</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-zinc-200 pb-1.5">
              <dt className="text-zinc-500">Rescue WhatsApp</dt>
              <dd className="text-zinc-900 font-mono text-xs pt-0.5">
                <a
                  href="https://wa.me/256704290817"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#14532D] transition-colors"
                >
                  +256 704 290 817
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-zinc-200 pb-1.5">
              <dt className="text-zinc-500">Airtel Money Donations</dt>
              <dd className="text-zinc-900 font-mono text-xs pt-0.5">+256 704 290 817</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-zinc-200 pb-1.5">
              <dt className="text-zinc-500">Care Coordinator</dt>
              <dd className="text-zinc-900">
                <a
                  href="mailto:care@hsabunyo.space"
                  className="hover:text-[#14532D] transition-colors"
                >
                  care@hsabunyo.space
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-zinc-200 pb-1.5">
              <dt className="text-zinc-500">Sanctuary Email</dt>
              <dd className="text-zinc-900">
                <a
                  href="mailto:hsabunyo@gmail.com"
                  className="hover:text-[#14532D] transition-colors"
                >
                  hsabunyo@gmail.com
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Official Domain</dt>
              <dd className="text-zinc-900 font-mono text-xs pt-0.5">
                <a
                  href="https://hsabunyo.space"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#14532D] transition-colors"
                >
                  hsabunyo.space
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-zinc-200">
        <div className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} HSA Bunyo Dog Rescue Uganda. Non-profit community sanctuary.</p>
          <p>NGO Reg. WKS-8841 · Wakiso District</p>
        </div>
      </div>
    </footer>
  );
}
