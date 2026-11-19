import { ABOUT_RESCUE_IMAGE_URL } from '../data/rescueData';
import { ResilientImage } from '../components/ResilientImage';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

const TEAM_MEMBERS = [
  {
    name: 'Dr. Grace Namukasa, BVM',
    role: 'Lead Sanctuary Veterinarian',
    bio: 'Makerere University veterinary graduate overseeing surgical sterilization, tick-borne disease recovery, and rural rabies outreach.',
  },
  {
    name: 'Samuel Kizza',
    role: 'Sanctuary Operations Director',
    bio: 'Coordinates daily kennel care, intake triage across Wakiso District, and local Ugandan adopter home visits.',
  },
  {
    name: 'Miriam Nantongo',
    role: 'Volunteer & Flight-Buddy Coordinator',
    bio: 'Manages Entebbe International Airport export documentation, volunteer onboarding, and primary school education days.',
  },
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10 space-y-10 lg:space-y-12">
      <header className="max-w-3xl space-y-4 border-b border-zinc-200 pb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          About HSA Bunyo · Est. 2021
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900">
          Community-rooted animal welfare in Wakiso District
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600 leading-relaxed">
          Humane Sanctuary Alliance (HSA) Bunyo began when local residents and Makerere veterinary alumni banded together to replace inhumane stray culling with vaccination, sterilization, and compassionate rehoming.
        </p>
      </header>

      {/* Editorial Essay + Clinic Image */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-6 space-y-5 max-w-prose">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-zinc-900">
            Why Bunyo &amp; the Entebbe Corridor
          </h2>
          <p className="text-base text-zinc-700 leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:font-medium first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#14532D]">
            Along the fast-growing towns between Kampala and Entebbe, thousands of gentle African village dogs face road accidents, untreated tick fever, and stigma. Our two-acre sanctuary compound in Bunyo provides shaded grass paddocks, clean water, nutritious daily meals, and a dedicated veterinary isolation wing.
          </p>
          <p className="text-base text-zinc-700 leading-relaxed">
            Equally vital is working side-by-side with local families. Rather than taking dogs away from loving owners who simply lack clinic access, our outreach team brings free rabies shots, deworming, and spay/neuter care directly to parish trading centers.
          </p>
        </div>

        <div className="lg:col-span-6 space-y-2 max-w-lg lg:ml-auto w-full">
          <div className="rounded-lg overflow-hidden border border-zinc-200">
            <ResilientImage
              src={ABOUT_RESCUE_IMAGE_URL}
              alt="Rescue veterinarian lifting three puppies alongside their mother from an earthen trench during field emergency response"
              aspectClassName="aspect-[4/5]"
              className="w-full h-full object-cover object-[50%_25%]"
              fallbackTitle="Field Rescue & Emergency Care"
            />
          </div>
          <p className="text-xs text-zinc-500 italic font-serif">
            Fig. 3 — Emergency field rescue of a street mother and her three puppies in Wakiso District.
          </p>
        </div>
      </section>

      {/* Financial Transparency */}
      <section className="border border-zinc-200 rounded-lg bg-zinc-50 p-8 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Annual Allocation
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-zinc-900">
              How every contribution is spent
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/donate')}
            className="px-4 py-2 text-xs font-medium text-white bg-[#14532D] hover:bg-[#166534] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Support Our Work
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-white border border-zinc-200 rounded-md p-5 space-y-2">
            <p className="font-mono text-3xl font-semibold text-[#14532D] tabular-nums">84%</p>
            <h3 className="font-semibold text-zinc-900">Direct Rescue, Food &amp; Vet Care</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Fortified kibble, tick-fever antibiotics, surgical supplies, vaccinations, and clean paddock maintenance.
            </p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-md p-5 space-y-2">
            <p className="font-mono text-3xl font-semibold text-zinc-900 tabular-nums">10%</p>
            <h3 className="font-semibold text-zinc-900">Mobile Community Clinics</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Fuel, cold-chain vaccine coolers, and bilingual humane-education booklets for Wakiso parishes.
            </p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-md p-5 space-y-2">
            <p className="font-mono text-3xl font-semibold text-zinc-900 tabular-nums">6%</p>
            <h3 className="font-semibold text-zinc-900">Administration &amp; Compliance</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Annual Ugandan NGO registration audits, payment gateway fees, and export permit paperwork.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-zinc-900">
          Sanctuary Leadership Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <article key={member.name} className="border border-zinc-200 rounded-lg p-6 space-y-2 bg-white">
              <h3 className="font-serif text-xl font-medium text-zinc-900">{member.name}</h3>
              <p className="text-xs font-medium text-[#14532D]">{member.role}</p>
              <p className="text-sm text-zinc-600 leading-relaxed pt-1">{member.bio}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
