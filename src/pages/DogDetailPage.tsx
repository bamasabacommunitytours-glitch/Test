import { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { AdoptionInquiryRecord, DogProfile } from '../data/rescueData';
import { formatCurrency, validateAdoptionInquiry, type ValidationErrors } from '../utils/rescueLogic';
import { postApiJson } from '../utils/apiClient';
import { ResilientImage } from '../components/ResilientImage';

interface DogDetailPageProps {
  dog: DogProfile | undefined;
  onNavigate: (path: string) => void;
  onInquirySubmitted: (updatedDog: DogProfile) => void;
}

export function DogDetailPage({ dog, onNavigate, onInquirySubmitted }: DogDetailPageProps) {
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [housingType, setHousingType] = useState('House with fenced compound');
  const [experience, setExperience] = useState('Experienced dog owner');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<AdoptionInquiryRecord | null>(null);

  if (!dog) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl font-medium text-zinc-900">Dog profile not found</h1>
        <p className="text-sm text-zinc-600">
          This dog may have already been adopted or the profile link is out of date.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/adopt')}
          className="px-4 py-2 text-sm font-medium text-white bg-[#14532D] rounded-md cursor-pointer"
        >
          Return to Adoption Directory
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const payload = {
      dogId: dog.id,
      applicantName,
      email,
      phone,
      location,
      housingType,
      experience,
      reason,
    };

    const validationErrors = validateAdoptionInquiry(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const result = await postApiJson<{ inquiry: AdoptionInquiryRecord; dog: DogProfile }>(
        '/api/adoptions',
        payload
      );
      if (!result.ok || !result.data) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setSubmitError(result.error || 'Could not submit inquiry. Please review your details.');
        return;
      }
      setConfirmation(result.data.inquiry);
      onInquirySubmitted(result.data.dog);
    } catch {
      setSubmitError(
        'Connection issue submitting your inquiry. Please try again or reach us on WhatsApp +256 704 290 817.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      <div>
        <button
          type="button"
          onClick={() => onNavigate('/adopt')}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-[#14532D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to all dogs
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Portrait + Story + Record */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-[#14532D]">
              {dog.status} · {dog.location}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-900">
              {dog.name}
            </h1>
            <p className="text-sm text-zinc-500">
              {dog.breed} <span aria-hidden="true">·</span> {dog.ageLabel}{' '}
              <span aria-hidden="true">·</span> {dog.sex} <span aria-hidden="true">·</span>{' '}
              {dog.weightKg} kg
            </p>
          </div>

          <div>
            <div className="rounded-lg overflow-hidden border border-zinc-200">
              <ResilientImage
                src={dog.imageUrl}
                alt={`${dog.name} at HSA Bunyo`}
                aspectClassName="aspect-[4/3]"
                className={`w-full h-full object-cover ${dog.imagePosition || 'object-center'}`}
                fallbackTitle={dog.name}
              />
            </div>
            <p className="text-xs text-zinc-500 italic font-serif mt-2">
              {dog.imageCaption}
            </p>
          </div>

          <div className="space-y-4 max-w-prose">
            <h2 className="font-serif text-2xl font-medium text-zinc-900">Rescue Story</h2>
            <p className="text-base text-zinc-700 leading-relaxed">{dog.story}</p>
          </div>

          {/* Institutional Definition List */}
          <div className="border-t border-zinc-200 pt-6 space-y-4">
            <h2 className="font-serif text-2xl font-medium text-zinc-900">
              Medical &amp; Care Record
            </h2>
            <dl className="divide-y divide-zinc-200 border-y border-zinc-200 text-sm">
              <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-zinc-500">Sanctuary ID</dt>
                <dd className="sm:col-span-2 font-mono text-zinc-900">{dog.microchipId}</dd>
              </div>
              <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-zinc-500">Intake Date</dt>
                <dd className="sm:col-span-2 text-zinc-900">{dog.intakeDate}</dd>
              </div>
              <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-zinc-500">Health &amp; Vaccines</dt>
                <dd className="sm:col-span-2 text-zinc-900">{dog.medicalNotes}</dd>
              </div>
              <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-zinc-500">Compatibility</dt>
                <dd className="sm:col-span-2 text-zinc-900">
                  Children: {dog.goodWithKids ? 'Yes' : 'Older kids preferred'} · Dogs:{' '}
                  {dog.goodWithDogs ? 'Yes' : 'Best as only dog'} · Cats:{' '}
                  {dog.goodWithCats ? 'Yes' : 'Untested / No'}
                </dd>
              </div>
              <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-zinc-500">Adoption Contribution</dt>
                <dd className="sm:col-span-2 text-zinc-900 tabular-nums">
                  {formatCurrency(dog.localAdoptionFeeUgx, 'UGX')} (Uganda local) ·{' '}
                  {formatCurrency(dog.internationalTransportUsd, 'USD')} (International export &amp; crate prep)
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right Column: Adoption Inquiry Form */}
        <div className="lg:col-span-5">
          <div className="border border-zinc-200 rounded-lg bg-zinc-50 p-6 sm:p-7 space-y-5 lg:sticky lg:top-24">
            <div className="space-y-1.5 border-b border-zinc-200 pb-4">
              <h2 className="font-serif text-2xl font-medium text-zinc-900">
                Apply to Adopt {dog.name}
              </h2>
              <p className="text-xs text-zinc-600 tabular-nums">
                Current applications on file: {dog.inquiryCount}
              </p>
            </div>

            {confirmation ? (
              <div
                className="bg-white border border-emerald-200 rounded-md p-5 space-y-3"
                data-testid="adoption-confirmation"
              >
                <div className="flex items-center gap-2 text-[#14532D] font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  Adoption Inquiry Received
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  Thank you, <span className="font-medium">{confirmation.applicantName}</span>. Our Bunyo placement coordinator has logged your application for{' '}
                  <span className="font-medium">{confirmation.dogName}</span> and will reach out within 48 hours.
                </p>
                <div className="pt-2 border-t border-zinc-100 text-xs text-zinc-500 space-y-1">
                  <p>
                    Reference ID:{' '}
                    <span className="font-mono font-semibold text-zinc-900">
                      {confirmation.referenceId}
                    </span>
                  </p>
                  <p>Confirmation copy queued for {confirmation.email}</p>
                </div>
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('/adopt')}
                    className="px-4 py-2 text-xs font-medium text-white bg-[#14532D] rounded-md cursor-pointer"
                  >
                    Browse Other Dogs
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {submitError && (
                  <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded p-3">
                    {submitError}
                  </p>
                )}

                <div className="space-y-1">
                  <label htmlFor="adp-name" className="block text-xs font-medium text-zinc-800">
                    Full Name
                  </label>
                  <input
                    id="adp-name"
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Grace Nabwire"
                    className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                  />
                  {errors.applicantName && (
                    <p className="text-xs text-red-700">{errors.applicantName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="adp-email" className="block text-xs font-medium text-zinc-800">
                      Email Address
                    </label>
                    <input
                      id="adp-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                    />
                    {errors.email && <p className="text-xs text-red-700">{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="adp-phone" className="block text-xs font-medium text-zinc-800">
                      Phone / WhatsApp
                    </label>
                    <input
                      id="adp-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+256 772 555 123"
                      className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                    />
                    {errors.phone && <p className="text-xs text-red-700">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="adp-location" className="block text-xs font-medium text-zinc-800">
                    City &amp; Country
                  </label>
                  <input
                    id="adp-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kampala, Uganda or Amsterdam, NL"
                    className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                  />
                  {errors.location && <p className="text-xs text-red-700">{errors.location}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="adp-housing" className="block text-xs font-medium text-zinc-800">
                      Housing Type
                    </label>
                    <select
                      id="adp-housing"
                      value={housingType}
                      onChange={(e) => setHousingType(e.target.value)}
                      className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                    >
                      <option value="House with fenced compound">House with fenced compound</option>
                      <option value="Apartment with nearby park">Apartment with nearby park</option>
                      <option value="Rural homestead">Rural homestead</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="adp-exp" className="block text-xs font-medium text-zinc-800">
                      Dog Experience
                    </label>
                    <select
                      id="adp-exp"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                    >
                      <option value="Experienced dog owner">Experienced dog owner</option>
                      <option value="First-time dog adopter">First-time dog adopter</option>
                      <option value="Currently have another dog">Currently have another dog</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="adp-reason" className="block text-xs font-medium text-zinc-800">
                    Home Routine &amp; Why {dog.name}
                  </label>
                  <textarea
                    id="adp-reason"
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={`Share your daily schedule and why ${dog.name} fits your home...`}
                    className="w-full p-3 text-sm bg-white border border-zinc-300 rounded-md"
                  />
                  {errors.reason && <p className="text-xs text-red-700">{errors.reason}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 text-sm font-medium text-white bg-[#14532D] hover:bg-[#166534] disabled:opacity-60 rounded-md transition-colors cursor-pointer"
                >
                  {submitting ? 'Submitting Inquiry...' : `Submit Adoption Inquiry for ${dog.name}`}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
