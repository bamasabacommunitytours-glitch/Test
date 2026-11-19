import { ArrowRight } from 'lucide-react';
import {
  CLINIC_IMAGE_URL,
  FIELD_PROGRAMS,
  HERO_IMAGE_URL,
  type CampaignSummary,
  type DogProfile,
} from '../data/rescueData';
import { formatCurrency } from '../utils/rescueLogic';
import { ResilientImage } from '../components/ResilientImage';

interface HomePageProps {
  dogs: DogProfile[];
  campaign: CampaignSummary;
  onNavigate: (path: string) => void;
}

export function HomePage({ dogs, campaign, onNavigate }: HomePageProps) {
  const featuredDogs = dogs.slice(0, 4);
  const progressPct = Math.min(100, Math.round((campaign.raisedUsd / campaign.goalUsd) * 100));

  return (
    <div>
      {/* Hero Split */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col justify-center py-2">
              <div className="space-y-5">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Bunyo Sanctuary · Wakiso District, Uganda
                </p>
                <h1 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1] font-medium tracking-tight text-zinc-900">
                  Every Ugandan street dog deserves safety, care, and a home.
                </h1>
                <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl">
                  HSA Bunyo rescues abandoned and injured dogs along the Kampala–Entebbe corridor, delivers community rabies clinics, and connects healed dogs with loving families locally and abroad.
                </p>
              </div>

              <div className="pt-7 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={() => onNavigate('/adopt')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#14532D] hover:bg-[#166534] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Meet Adoptable Dogs
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/volunteer')}
                  className="text-sm font-medium text-zinc-800 hover:text-[#14532D] underline underline-offset-4 decoration-zinc-300 hover:decoration-[#14532D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Volunteer in Bunyo
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col">
              <div className="rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100">
                <ResilientImage
                  src={HERO_IMAGE_URL}
                  alt="Ugandan rescue team members smiling with clinic paperwork and a gentle village dog at HSA Bunyo"
                  aspectClassName="aspect-[16/10]"
                  className="w-full h-full object-cover object-top"
                  fallbackTitle="Bunyo Sanctuary Morning Care"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2.5 italic font-serif">
                Fig. 1 — Intake documentation and community outreach with our Wakiso team at HSA Bunyo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Utility Ribbon (Full-width 4-column strip below hero split) */}
      <section aria-label="Sanctuary operational metrics" className="border-b border-zinc-200 bg-zinc-50">
        <div className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-zinc-200">
            <div className="py-5 pr-4 border-b border-r lg:border-b-0 lg:border-r-0 border-zinc-200">
              <p className="font-mono text-2xl font-semibold text-zinc-900 tabular-nums">42</p>
              <p className="text-xs text-zinc-600 mt-1">Rescued dogs currently in sanctuary care</p>
            </div>
            <div className="py-5 pl-4 lg:px-6 border-b lg:border-b-0 border-zinc-200">
              <p className="font-mono text-2xl font-semibold text-zinc-900 tabular-nums">186</p>
              <p className="text-xs text-zinc-600 mt-1">Dogs permanently rehomed since 2021</p>
            </div>
            <div className="py-5 pr-4 lg:px-6 border-r lg:border-r-0 border-zinc-200">
              <p className="font-mono text-2xl font-semibold text-zinc-900 tabular-nums">320+</p>
              <p className="text-xs text-zinc-600 mt-1">Community rabies &amp; spay treatments</p>
            </div>
            <div className="py-5 pl-4 lg:pl-6">
              <p className="font-mono text-base sm:text-lg font-semibold text-zinc-900 tabular-nums">
                Tue–Sun · 09:00–17:00
              </p>
              <p className="text-xs text-zinc-600 mt-1">Sanctuary visiting hours (EAT)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Adoption Profiles */}
      <section className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Adoption Profiles
            </p>
            <h2 className="font-serif text-3xl font-medium text-zinc-900">
              Dogs waiting for a home
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/adopt')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#14532D] hover:text-[#166534] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Browse all {dogs.length} profiles
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {featuredDogs.map((dog) => (
            <article
              key={dog.id}
              className="group border border-zinc-200 rounded-lg bg-white overflow-hidden flex flex-col justify-between hover:border-zinc-300 transition-colors"
            >
              <div>
                <ResilientImage
                  src={dog.imageUrl}
                  alt={`${dog.name}, ${dog.breed} at HSA Bunyo`}
                  aspectClassName="aspect-[4/3]"
                  className={`w-full h-full object-cover ${dog.imagePosition || 'object-center'} group-hover:scale-[1.02] transition-transform duration-200`}
                  fallbackTitle={dog.name}
                />
                <div className="p-5 space-y-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl font-medium text-zinc-900">
                      {dog.name}
                    </h3>
                    <span className="text-xs font-medium text-[#14532D]">
                      {dog.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {dog.ageLabel} <span aria-hidden="true">·</span> {dog.sex}{' '}
                    <span aria-hidden="true">·</span> {dog.size}
                  </p>
                  <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">
                    {dog.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate(`/adopt/${dog.id}`)}
                  className="w-full py-2 px-4 text-xs font-medium text-zinc-900 border border-zinc-300 rounded-md hover:border-[#14532D] hover:text-[#14532D] transition-colors cursor-pointer"
                >
                  View {dog.name}’s Profile
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Field Programs + Community Clinic Story */}
      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Field Operations
              </p>
              <h2 className="font-serif text-3xl font-medium text-zinc-900">
                Sanctuary care paired with community prevention
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                Long-term change in Wakiso District requires more than kennels. Our Ugandan veterinary team travels monthly to nearby trading centers to treat tick fever, vaccinate against rabies, and offer free spay and neuter surgeries.
              </p>
              <div className="pt-2 rounded-lg overflow-hidden border border-zinc-200 bg-white">
                <ResilientImage
                  src={CLINIC_IMAGE_URL}
                  alt="Caretaker in medical gloves applying antiseptic wound care to a rescued tan dog at HSA Bunyo"
                  aspectClassName="aspect-[16/10]"
                  className="w-full h-full object-cover object-center"
                  fallbackTitle="Wakiso Community Vet Clinic"
                />
              </div>
              <p className="text-xs text-zinc-500 italic font-serif">
                Fig. 2 — Topical wound treatment and daily nutrition at our Bunyo Sanctuary clinic.
              </p>
            </div>

            <div className="lg:col-span-7 divide-y divide-zinc-200 border-t border-b border-zinc-200 bg-white rounded-lg px-6">
              {FIELD_PROGRAMS.map((program) => (
                <div key={program.index} className="py-5 space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-zinc-400 tabular-nums">
                      {program.index}.
                    </span>
                    <h3 className="text-lg font-semibold text-zinc-900">
                      {program.title}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed pl-7">
                    {program.summary}
                  </p>
                  <p className="text-xs font-medium text-[#14532D] pl-7 pt-1">
                    {program.metric}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Medical & Sanctuary Appeal */}
      <section className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-12">
        <div className="border border-zinc-200 rounded-lg bg-white p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Active Sanctuary Appeal
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-zinc-900">
              {campaign.title}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl">
              {campaign.subtitle}
            </p>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                {formatCurrency(campaign.raisedUsd, 'USD')} raised
              </span>
              <span className="font-mono text-zinc-500 tabular-nums">
                of {formatCurrency(campaign.goalUsd, 'USD')} goal ({progressPct}%)
              </span>
            </div>
            <div
              className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Campaign fundraising progress"
            >
              <div
                className="h-full bg-[#14532D] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <span className="text-xs text-zinc-500 tabular-nums">
                Supported by {campaign.supportersCount} donors via Airtel Money
              </span>
              <button
                type="button"
                onClick={() => onNavigate('/donate')}
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#14532D] hover:bg-[#166534] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Contribute Online
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
