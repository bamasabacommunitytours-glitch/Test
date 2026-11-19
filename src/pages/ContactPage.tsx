import { useState } from 'react';
import { CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { CONTACT_TOPICS, type ContactMessageRecord } from '../data/rescueData';
import { validateContactMessage, type ValidationErrors } from '../utils/rescueLogic';
import { postApiJson } from '../utils/apiClient';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState<string>(CONTACT_TOPICS[0]);
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ContactMessageRecord | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const payload = {
      fullName,
      email,
      phone,
      topic,
      message,
    };

    const validationErrors = validateContactMessage(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const result = await postApiJson<{ contact: ContactMessageRecord }>(
        '/api/contact',
        payload
      );
      if (!result.ok || !result.data) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setSubmitError(result.error || 'Could not send your message. Please try again.');
        return;
      }
      setConfirmation(result.data.contact);
    } catch {
      setSubmitError(
        'Connection issue sending your message. Reach our rescue desk directly on WhatsApp +256 704 290 817 or hsabunyo@gmail.com.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-10 lg:space-y-12">
      <header className="border-b border-zinc-200 pb-8">
        <div className="max-w-4xl space-y-4">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Direct Contact · Bunyo Sanctuary, Uganda
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900">
            Reach our Wakiso rescue desk
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 leading-relaxed max-w-3xl">
            Whether you are reporting an injured street dog along Entebbe Road, scheduling a sanctuary visit in Bunyo, coordinating an Entebbe flight buddy, or checking an Airtel Money receipt, our team responds promptly.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Direct Channels */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="border border-zinc-200 rounded-lg bg-zinc-50 p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-zinc-900">
              Sanctuary Contact Channels
            </h2>

            <dl className="space-y-5 text-sm sm:text-base">
              <div className="flex items-start gap-3.5 border-b border-zinc-200 pb-4">
                <Phone className="w-5 h-5 text-[#14532D] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Rescue WhatsApp &amp; Airtel Money Donations
                  </dt>
                  <dd className="font-mono text-base font-semibold text-zinc-900 tabular-nums">
                    <a
                      href="https://wa.me/256704290817"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#14532D] underline underline-offset-4 decoration-zinc-300 transition-colors"
                    >
                      +256 704 290 817
                    </a>
                  </dd>
                  <p className="text-xs text-zinc-600">
                    24-hour emergency street rescue triage and direct Airtel Money giving line.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-b border-zinc-200 pb-4">
                <Mail className="w-5 h-5 text-[#14532D] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Official Sanctuary Email
                  </dt>
                  <dd className="space-y-1">
                    <div>
                      <a
                        href="mailto:hsabunyo@gmail.com"
                        className="font-medium text-zinc-900 hover:text-[#14532D] underline underline-offset-4 decoration-zinc-300 transition-colors"
                      >
                        hsabunyo@gmail.com
                      </a>
                    </div>
                    <div>
                      <a
                        href="mailto:care@hsabunyo.space"
                        className="font-medium text-zinc-900 hover:text-[#14532D] underline underline-offset-4 decoration-zinc-300 transition-colors"
                      >
                        care@hsabunyo.space
                      </a>
                    </div>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-b border-zinc-200 pb-4">
                <MapPin className="w-5 h-5 text-[#14532D] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Sanctuary Address
                  </dt>
                  <dd className="text-zinc-900">
                    Plot 14, Bunyo–Entebbe Road, Wakiso District, Central Uganda
                  </dd>
                  <dd className="text-xs font-mono text-zinc-500">hsabunyo.space</dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#14532D] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Visiting Hours (EAT)
                  </dt>
                  <dd className="font-mono text-sm font-medium text-zinc-900 tabular-nums">
                    Tue–Sun · 09:00–17:00 EAT
                  </dd>
                  <p className="text-xs text-zinc-600">
                    Please message ahead before visiting so a caretaker can greet you at the gate.
                  </p>
                </div>
              </div>
            </dl>
          </div>

          <div className="border border-zinc-200 rounded-lg bg-white p-6 space-y-3">
            <h3 className="font-serif text-xl font-medium text-zinc-900">
              Looking for a specific program?
            </h3>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('/adopt')}
                className="px-4 py-2 text-xs font-medium text-zinc-900 border border-zinc-300 hover:border-[#14532D] hover:text-[#14532D] rounded-md transition-colors cursor-pointer"
              >
                Browse Adoptable Dogs
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/donate')}
                className="px-4 py-2 text-xs font-medium text-white bg-[#14532D] hover:bg-[#166534] rounded-md transition-colors cursor-pointer"
              >
                Give via Airtel Money
              </button>
            </div>
          </div>
        </aside>

        {/* Right Column: Contact Form */}
        <section className="lg:col-span-7">
          <div className="border border-zinc-200 rounded-lg bg-white p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5 border-b border-zinc-200 pb-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-zinc-900">
                Send a message to HSA Bunyo
              </h2>
              <p className="text-sm text-zinc-600">
                Typical response time is within 24 hours for general inquiries and immediate triage on WhatsApp for urgent rescues.
              </p>
            </div>

            {confirmation ? (
              <div
                className="border border-emerald-200 bg-emerald-50/40 rounded-md p-6 space-y-4"
                data-testid="contact-confirmation"
              >
                <div className="flex items-center gap-2 text-[#14532D] font-semibold">
                  <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  Message Received by Sanctuary Desk
                </div>
                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                  Thank you, <span className="font-medium">{confirmation.fullName}</span>. Your message regarding{' '}
                  <span className="font-medium">{confirmation.topic}</span> has been logged for our Wakiso team.
                </p>
                <dl className="text-xs text-zinc-600 space-y-1 border-t border-emerald-200 pt-3">
                  <div className="flex justify-between gap-4">
                    <dt>Reference Number</dt>
                    <dd className="font-mono font-semibold text-zinc-900">
                      {confirmation.referenceId}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Reply Email</dt>
                    <dd className="text-zinc-900">{confirmation.email}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmation(null);
                    setFullName('');
                    setEmail('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="px-4 py-2 text-xs font-medium text-zinc-800 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 cursor-pointer"
                >
                  Send Another Message
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
                    <label htmlFor="cnt-name" className="block text-xs font-medium text-zinc-800">
                      Full Name
                    </label>
                    <input
                      id="cnt-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Samuel Okello"
                      className="w-full h-11 px-3.5 text-sm bg-white border border-zinc-300 rounded-md"
                    />
                    {errors.fullName && <p className="text-xs text-red-700">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="cnt-email" className="block text-xs font-medium text-zinc-800">
                      Email Address
                    </label>
                    <input
                      id="cnt-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-11 px-3.5 text-sm bg-white border border-zinc-300 rounded-md"
                    />
                    {errors.email && <p className="text-xs text-red-700">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="cnt-phone" className="block text-xs font-medium text-zinc-800">
                      Phone / WhatsApp (Optional)
                    </label>
                    <input
                      id="cnt-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+256 704 290 817"
                      className="w-full h-11 px-3.5 text-sm bg-white border border-zinc-300 rounded-md"
                    />
                    {errors.phone && <p className="text-xs text-red-700">{errors.phone}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="cnt-topic" className="block text-xs font-medium text-zinc-800">
                      Inquiry Topic
                    </label>
                    <select
                      id="cnt-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm bg-white border border-zinc-300 rounded-md"
                    >
                      {CONTACT_TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {errors.topic && <p className="text-xs text-red-700">{errors.topic}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="cnt-message" className="block text-xs font-medium text-zinc-800">
                    Message or Rescue Location Details
                  </label>
                  <textarea
                    id="cnt-message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your question, sanctuary visit dates, or exact location details for an urgent rescue..."
                    className="w-full p-3.5 text-sm bg-white border border-zinc-300 rounded-md"
                  />
                  {errors.message && <p className="text-xs text-red-700">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 text-sm font-medium text-white bg-[#14532D] hover:bg-[#166534] disabled:opacity-60 rounded-md transition-colors cursor-pointer"
                >
                  {submitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
