import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  VOLUNTEER_IMAGE_URL,
  VOLUNTEER_ROLES,
  type VolunteerApplicationRecord,
} from '../data/rescueData';
import { validateVolunteerApplication, type ValidationErrors } from '../utils/rescueLogic';
import { postApiJson } from '../utils/apiClient';
import { ResilientImage } from '../components/ResilientImage';

interface VolunteerPageProps {
  volunteerCount: number;
  onApplicationSubmitted: (newCount: number) => void;
}

export function VolunteerPage({
  volunteerCount,
  onApplicationSubmitted,
}: VolunteerPageProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleId, setRoleId] = useState(VOLUNTEER_ROLES[0].id);
  const [availability, setAvailability] = useState('');
  const [experience, setExperience] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<VolunteerApplicationRecord | null>(null);

  const handleSelectRole = (id: string) => {
    setRoleId(id);
    const formEl = document.getElementById('volunteer-application-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const payload = {
      fullName,
      email,
      phone,
      roleId,
      availability,
      experience,
      emergencyContact,
    };

    const validationErrors = validateVolunteerApplication(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const result = await postApiJson<{
        application: VolunteerApplicationRecord;
        volunteerCount: number;
      }>('/api/volunteers', payload);
      if (!result.ok || !result.data) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setSubmitError(result.error || 'Could not submit volunteer application.');
        return;
      }
      setConfirmation(result.data.application);
      onApplicationSubmitted(result.data.volunteerCount);
    } catch {
      setSubmitError(
        'Connection issue submitting your application. Please try again or reach us on WhatsApp +256 704 290 817.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10 space-y-10 lg:space-y-12">
      {/* Header Split */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch border-b border-zinc-200 pb-8 lg:pb-10">
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-center">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Volunteer &amp; Flight-Buddy Program
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900">
            Lend a steady hand in Wakiso or from Entebbe
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 leading-relaxed max-w-2xl">
            Our small Ugandan sanctuary team welcomes local Kampala/Wakiso volunteers, visiting veterinary professionals, and travelers departing Entebbe Airport (EBB) who can serve as flight buddies for adopted dogs.
          </p>
          <p className="text-xs text-zinc-500 tabular-nums pt-1">
            {volunteerCount > 0
              ? `${volunteerCount} volunteer ${volunteerCount === 1 ? 'application' : 'applications'} submitted this cycle`
              : 'Currently accepting Q4–Q1 sanctuary, clinic, and flight-buddy placements'}
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-lg overflow-hidden border border-zinc-200 h-full">
            <ResilientImage
              src={VOLUNTEER_IMAGE_URL}
              alt="Ugandan sanctuary director and visiting volunteer smiling while holding two rescued puppies"
              aspectClassName="aspect-[16/10] lg:aspect-auto lg:h-full"
              className="w-full h-full object-cover object-top"
              fallbackTitle="Bunyo Volunteer Team"
            />
          </div>
        </div>
      </header>

      {/* Four Volunteer Tracks */}
      <section className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Available Roles
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-zinc-900">
            Four ways to support our dogs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VOLUNTEER_ROLES.map((role, index) => (
            <article
              key={role.id}
              className="border border-zinc-200 rounded-lg bg-white p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-xs text-zinc-400 tabular-nums">
                    0{index + 1}.
                  </span>
                  <span className="text-xs text-zinc-500 tabular-nums">
                    {role.commitment} <span aria-hidden="true">·</span> {role.minStay}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-medium text-zinc-900">
                  {role.title}
                </h3>
                <p className="text-xs font-medium text-[#14532D]">{role.location}</p>
                <p className="text-sm text-zinc-600 leading-relaxed">{role.description}</p>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-4">
                <span className="text-xs text-zinc-500 truncate max-w-[65%]">
                  Support: {role.supportProvided}
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectRole(role.id)}
                  className="px-4 py-2 text-xs font-medium text-zinc-900 border border-zinc-300 hover:border-[#14532D] hover:text-[#14532D] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Apply for Role
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Schedule & Requirements Table */}
      <section className="space-y-5">
        <h2 className="font-serif text-2xl font-medium text-zinc-900">
          Placement Logistics &amp; Requirements
        </h2>
        <div className="overflow-x-auto border border-zinc-200 rounded-lg">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500">
                <th className="py-3.5 px-4 font-semibold">Program</th>
                <th className="py-3.5 px-4 font-semibold">Location</th>
                <th className="py-3.5 px-4 font-semibold">Time Commitment</th>
                <th className="py-3.5 px-4 font-semibold">Key Requirements</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {VOLUNTEER_ROLES.map((role) => (
                <tr key={role.id}>
                  <td className="py-3.5 px-4 font-medium text-zinc-900">{role.title}</td>
                  <td className="py-3.5 px-4 text-zinc-600">{role.location}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-zinc-700 tabular-nums">
                    {role.commitment} ({role.minStay})
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600">{role.skills}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Application Form */}
      <section
        id="volunteer-application-form"
        className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-zinc-200 pt-12"
      >
        <div className="lg:col-span-5 space-y-4">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Orientation &amp; Onboarding
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-zinc-900">
            Submit a volunteer application
          </h2>
          <p className="text-base text-zinc-600 leading-relaxed">
            Once submitted, our Wakiso volunteer coordinator reviews your schedule and arranges a brief WhatsApp or in-person sanctuary orientation. Rabies pre-exposure vaccination is recommended for clinical roles and required for extended kennel shifts.
          </p>
          <dl className="pt-3 border-t border-zinc-200 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Sanctuary Shuttle</dt>
              <dd className="text-zinc-900">Departs Kampala at 08:15 EAT</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Minimum Age</dt>
              <dd className="text-zinc-900 tabular-nums">18 years (16+ with guardian)</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Program Fee</dt>
              <dd className="text-zinc-900 font-medium text-[#14532D]">Free (no placement fee)</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <div className="border border-zinc-200 rounded-lg bg-zinc-50 p-6 sm:p-8">
            {confirmation ? (
              <div
                className="bg-white border border-emerald-200 rounded-md p-6 space-y-4"
                data-testid="volunteer-confirmation"
              >
                <div className="flex items-center gap-2 text-[#14532D] font-semibold">
                  <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  Volunteer Application Logged
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  Thank you, <span className="font-medium">{confirmation.fullName}</span>. Your application for{' '}
                  <span className="font-medium">{confirmation.roleTitle}</span> has been received by our Bunyo coordinator.
                </p>
                <dl className="text-xs text-zinc-600 space-y-1 border-t border-zinc-100 pt-3">
                  <div className="flex justify-between">
                    <dt>Reference Number</dt>
                    <dd className="font-mono font-semibold text-zinc-900">
                      {confirmation.referenceId}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Availability</dt>
                    <dd className="text-zinc-900">{confirmation.availability}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmation(null);
                    setFullName('');
                    setEmail('');
                    setPhone('');
                    setAvailability('');
                    setExperience('');
                    setEmergencyContact('');
                  }}
                  className="px-4 py-2 text-xs font-medium text-zinc-800 border border-zinc-300 rounded-md hover:bg-zinc-50 cursor-pointer"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {submitError && (
                  <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded p-3">
                    {submitError}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="vol-name" className="block text-xs font-medium text-zinc-800">
                      Full Name
                    </label>
                    <input
                      id="vol-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. David Ssempijja"
                      className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                    />
                    {errors.fullName && <p className="text-xs text-red-700">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="vol-email" className="block text-xs font-medium text-zinc-800">
                      Email Address
                    </label>
                    <input
                      id="vol-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                    />
                    {errors.email && <p className="text-xs text-red-700">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="vol-phone" className="block text-xs font-medium text-zinc-800">
                      Phone / WhatsApp
                    </label>
                    <input
                      id="vol-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+256 772 300 411"
                      className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                    />
                    {errors.phone && <p className="text-xs text-red-700">{errors.phone}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="vol-role" className="block text-xs font-medium text-zinc-800">
                      Preferred Program
                    </label>
                    <select
                      id="vol-role"
                      value={roleId}
                      onChange={(e) => setRoleId(e.target.value)}
                      className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                    >
                      {VOLUNTEER_ROLES.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                    {errors.roleId && <p className="text-xs text-red-700">{errors.roleId}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="vol-availability" className="block text-xs font-medium text-zinc-800">
                    Availability &amp; Dates (or Entebbe Flight Route)
                  </label>
                  <input
                    id="vol-availability"
                    type="text"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="e.g. Weekends Dec–Jan, or EBB to AMS on Dec 18"
                    className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                  />
                  {errors.availability && (
                    <p className="text-xs text-red-700">{errors.availability}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="vol-experience" className="block text-xs font-medium text-zinc-800">
                    Relevant Experience &amp; Skills
                  </label>
                  <textarea
                    id="vol-experience"
                    rows={3}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Share any dog handling, veterinary, teaching, or transport experience..."
                    className="w-full p-3 text-sm bg-white border border-zinc-300 rounded-md"
                  />
                  {errors.experience && <p className="text-xs text-red-700">{errors.experience}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="vol-emergency" className="block text-xs font-medium text-zinc-800">
                    Emergency Contact (Name &amp; Phone)
                  </label>
                  <input
                    id="vol-emergency"
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="e.g. Sarah Nakato — +256 701 888 210"
                    className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                  />
                  {errors.emergencyContact && (
                    <p className="text-xs text-red-700">{errors.emergencyContact}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 text-sm font-medium text-white bg-[#14532D] hover:bg-[#166534] disabled:opacity-60 rounded-md transition-colors cursor-pointer"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Volunteer Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
