import { useMemo, useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { DogProfile, PlacementStatus } from '../data/rescueData';
import { filterDogs } from '../utils/rescueLogic';
import { ResilientImage } from '../components/ResilientImage';

interface AdoptPageProps {
  dogs: DogProfile[];
  onNavigate: (path: string) => void;
}

const STATUS_OPTIONS: Array<PlacementStatus | 'All'> = [
  'All',
  'Ready for Adoption',
  'Medical Foster',
];

export function AdoptPage({ dogs, onNavigate }: AdoptPageProps) {
  const [status, setStatus] = useState<PlacementStatus | 'All'>('All');
  const [compatibility, setCompatibility] = useState<'All' | 'Kids' | 'Dogs' | 'Cats'>('All');
  const [query, setQuery] = useState('');

  const filteredDogs = useMemo(
    () => filterDogs(dogs, { status, compatibility, query }),
    [dogs, status, compatibility, query]
  );

  const hasActiveFilters =
    status !== 'All' || compatibility !== 'All' || query.trim() !== '';

  const resetFilters = () => {
    setStatus('All');
    setCompatibility('All');
    setQuery('');
  };

  return (
    <div className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10 space-y-8">
      {/* Page Header */}
      <header className="border-b border-zinc-200 pb-6 space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          Adoption &amp; Foster Directory
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900">
          Meet our dogs in Uganda
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600 max-w-3xl leading-relaxed">
          Every dog at HSA Bunyo receives full tick-borne screening, Rabies and DHPP vaccinations, microchipping, and spay or neuter care. We place dogs across Kampala, Entebbe, and internationally with verified flight-buddy transport.
        </p>
      </header>

      {/* Interactive Filter Controls */}
      <section aria-label="Filter adoptable dogs" className="bg-zinc-50 border border-zinc-200 rounded-lg p-5 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Placement Status segmented control */}
          <div className="lg:col-span-5 space-y-1.5">
            <span className="block text-xs font-medium text-zinc-700">Placement Status</span>
            <div className="inline-flex w-full bg-white border border-zinc-200 rounded-md p-1 gap-1" role="group" aria-label="Filter by placement status">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStatus(opt)}
                  aria-pressed={status === opt}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    status === opt
                      ? 'bg-[#14532D] text-white'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Household Compatibility select */}
          <div className="lg:col-span-3 space-y-1.5">
            <label htmlFor="adopt-compat-filter" className="block text-xs font-medium text-zinc-700">
              Good With
            </label>
            <select
              id="adopt-compat-filter"
              value={compatibility}
              onChange={(e) =>
                setCompatibility(e.target.value as 'All' | 'Kids' | 'Dogs' | 'Cats')
              }
              className="w-full h-9 px-3 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900"
            >
              <option value="All">Any household</option>
              <option value="Kids">Children</option>
              <option value="Dogs">Other dogs</option>
              <option value="Cats">Cats</option>
            </select>
          </div>

          {/* Search input */}
          <div className="lg:col-span-4 space-y-1.5">
            <label htmlFor="adopt-search" className="block text-xs font-medium text-zinc-700">
              Search Name or Trait
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="adopt-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Kato, calm, Basenji"
                className="w-full h-9 pl-9 pr-3 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs text-zinc-600">
          <p className="tabular-nums" data-testid="adopt-results-count">
            Showing {filteredDogs.length} of {dogs.length} dogs
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 font-medium text-[#14532D] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset filters
            </button>
          )}
        </div>
      </section>

      {/* Dog Profile Grid or Empty State */}
      {filteredDogs.length === 0 ? (
        <div className="border border-zinc-200 rounded-lg p-12 text-center space-y-4 bg-white">
          <h2 className="font-serif text-2xl font-medium text-zinc-900">
            No dogs match those filters
          </h2>
          <p className="text-sm text-zinc-600 max-w-md mx-auto">
            Try clearing one of your filters or searching more broadly—we also welcome general adoption inquiries for incoming rescues.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-medium text-white bg-[#14532D] hover:bg-[#166534] rounded-md transition-colors cursor-pointer"
          >
            Show All Dogs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredDogs.map((dog) => (
            <article
              key={dog.id}
              className="border border-zinc-200 rounded-lg bg-white overflow-hidden flex flex-col justify-between hover:border-zinc-300 transition-colors"
            >
              <div>
                <ResilientImage
                  src={dog.imageUrl}
                  alt={`${dog.name} — ${dog.breed}`}
                  aspectClassName="aspect-[4/3]"
                  className={`w-full h-full object-cover ${dog.imagePosition || 'object-center'}`}
                  fallbackTitle={dog.name}
                />
                <div className="p-6 space-y-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="font-serif text-2xl font-medium text-zinc-900">
                      {dog.name}
                    </h2>
                    <span className="text-xs font-medium text-[#14532D]">
                      {dog.status}
                    </span>
                  </div>

                  {/* Clean unboxed metadata */}
                  <p className="text-xs text-zinc-500">
                    {dog.breed} <span aria-hidden="true">·</span> {dog.sex}
                  </p>

                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {dog.summary}
                  </p>

                  <p className="text-xs text-zinc-500 pt-1">
                    Traits: {dog.temperament.join(' · ')}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-zinc-100 flex items-center justify-between gap-4">
                <span className="text-xs text-zinc-500 tabular-nums">
                  {dog.inquiryCount === 0
                    ? 'Be first to inquire'
                    : `${dog.inquiryCount} active ${dog.inquiryCount === 1 ? 'inquiry' : 'inquiries'}`}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate(`/adopt/${dog.id}`)}
                  aria-label={`View profile and apply to adopt ${dog.name}`}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#14532D] hover:bg-[#166534] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Profile &amp; Apply
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
