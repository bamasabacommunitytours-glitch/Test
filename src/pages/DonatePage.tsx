import { useState } from 'react';
import { CheckCircle2, Lock, Printer, ShieldCheck } from 'lucide-react';
import type { CampaignSummary, DonationRecord } from '../data/rescueData';
import {
  convertUgxToUsd,
  convertUsdToUgx,
  formatCurrency,
  getImpactStatement,
  validateDonationSubmission,
  type PaymentMethod,
  type ValidationErrors,
} from '../utils/rescueLogic';
import { postApiJson } from '../utils/apiClient';

interface DonatePageProps {
  campaign: CampaignSummary;
  recentDonations: DonationRecord[];
  onDonationComplete: (
    receipt: DonationRecord,
    updatedCampaign: CampaignSummary,
    updatedDonations: DonationRecord[]
  ) => void;
}

const USD_PRESETS = [25, 65, 150, 350];
const UGX_PRESETS = [92500, 240500, 555000, 1295000];
const FUNDS = [
  'Emergency Veterinary Care',
  'General Sanctuary & Food',
  'Community Rabies & Spay Clinics',
  'Flight & Adoption Transport',
];

export function DonatePage({
  campaign,
  recentDonations,
  onDonationComplete,
}: DonatePageProps) {
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [currency, setCurrency] = useState<'USD' | 'UGX'>('USD');
  const [amountInput, setAmountInput] = useState<string>('65');
  const [fund, setFund] = useState<string>(FUNDS[0]);
  const [paymentMethod] = useState<PaymentMethod>('airtel_money');

  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [dedication, setDedication] = useState('');

  // Mobile money field
  const [mobilePhone, setMobilePhone] = useState('');

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<DonationRecord | null>(null);

  const numericAmount = Number(amountInput) || 0;
  const equivalentUsd =
    currency === 'UGX' ? convertUgxToUsd(numericAmount) : numericAmount;
  const progressPct = Math.min(100, Math.round((campaign.raisedUsd / campaign.goalUsd) * 100));

  const handleCurrencySwitch = (nextCurrency: 'USD' | 'UGX') => {
    if (nextCurrency === currency) return;
    if (nextCurrency === 'UGX') {
      setAmountInput(String(convertUsdToUgx(numericAmount || 65)));
    } else {
      setAmountInput(String(Math.max(5, Math.round(convertUgxToUsd(numericAmount || 240500)))));
    }
    setCurrency(nextCurrency);
    setErrors((prev) => ({ ...prev, amount: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const payload = {
      donorName,
      email,
      currency,
      amount: numericAmount,
      frequency,
      fund,
      paymentMethod,
      mobilePhone,
      dedication: dedication.trim() || undefined,
    };

    const validationErrors = validateDonationSubmission(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const result = await postApiJson<{
        receipt: DonationRecord;
        campaign: CampaignSummary;
        donations: DonationRecord[];
      }>('/api/donations', payload);
      if (!result.ok || !result.data) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setSubmitError(result.error || 'Unable to complete donation. Please check your details.');
        return;
      }
      setReceipt(result.data.receipt);
      onDonationComplete(
        result.data.receipt,
        result.data.campaign,
        result.data.donations
      );
      setMobilePhone('');
    } catch {
      setSubmitError(
        'Connection issue processing donation. Please try again or send directly via Airtel Money +256 704 290 817.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const presets = currency === 'USD' ? USD_PRESETS : UGX_PRESETS;

  return (
    <div className="max-w-[1760px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10 space-y-8 lg:space-y-10">
      {/* Header + Campaign Bar */}
      <header className="border-b border-zinc-200 pb-6 lg:pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7 space-y-3">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Online Giving · Airtel Money Uganda (+256 704 290 817)
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900">
            Fund urgent care for Bunyo’s dogs
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 leading-relaxed max-w-2xl">
            100% of online contributions go directly to HSA Bunyo Dog Rescue in Wakiso District. Choose USD or Ugandan Shillings (UGX) and receive an instant itemized sanctuary receipt.
          </p>
        </div>

        <div className="lg:col-span-5 border border-zinc-200 rounded-lg bg-zinc-50 p-5 space-y-3">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-mono font-semibold text-zinc-900 tabular-nums" data-testid="campaign-raised">
              {formatCurrency(campaign.raisedUsd, 'USD')} raised
            </span>
            <span className="font-mono text-zinc-500 tabular-nums">
              Goal: {formatCurrency(campaign.goalUsd, 'USD')} ({progressPct}%)
            </span>
          </div>
          <div
            className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-zinc-200"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Campaign progress"
          >
            <div
              className="h-full bg-[#14532D] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-zinc-600 tabular-nums">
            {campaign.title} · {campaign.supportersCount} supporters
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Checkout Column */}
        <div className="lg:col-span-7">
          {receipt ? (
            <section
              className="border border-emerald-300 rounded-lg bg-white p-7 sm:p-9 space-y-6"
              data-testid="donation-receipt"
            >
              <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#14532D] font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                    Official Donation Receipt
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-zinc-900">
                    Thank you, {receipt.donorName}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 border border-zinc-300 rounded-md hover:bg-zinc-50 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                  Print Receipt
                </button>
              </div>

              <dl className="divide-y divide-zinc-200 text-sm">
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-zinc-500">Receipt Reference</dt>
                  <dd className="font-mono font-semibold text-zinc-900">{receipt.id}</dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-zinc-500">Contribution</dt>
                  <dd className="font-mono font-semibold text-zinc-900 tabular-nums">
                    {formatCurrency(receipt.originalAmount, receipt.currency)} ({receipt.frequency})
                  </dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-zinc-500">Fund Allocation</dt>
                  <dd className="text-zinc-900">{receipt.fund}</dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-zinc-500">Payment Method</dt>
                  <dd className="font-mono text-zinc-900">{receipt.methodLabel}</dd>
                </div>
                {receipt.dedication && (
                  <div className="py-3 flex justify-between gap-4">
                    <dt className="text-zinc-500">Dedication</dt>
                    <dd className="text-zinc-900">{receipt.dedication}</dd>
                  </div>
                )}
              </dl>

              <p className="text-sm text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-md p-4">
                Impact summary: {getImpactStatement(receipt.amountUsd)}
              </p>

              <div className="no-print pt-2">
                <button
                  type="button"
                  onClick={() => setReceipt(null)}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#14532D] hover:bg-[#166534] rounded-md cursor-pointer"
                >
                  Make Another Gift
                </button>
              </div>
            </section>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="border border-zinc-200 rounded-lg bg-white p-6 sm:p-8 space-y-7"
            >
              {submitError && (
                <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded p-3">
                  {submitError}
                </p>
              )}

              {/* Step 1: Frequency & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-zinc-700">Gift Frequency</span>
                  <div className="flex bg-zinc-100 p-1 rounded-md gap-1" role="group" aria-label="Gift frequency">
                    <button
                      type="button"
                      onClick={() => setFrequency('one-time')}
                      aria-pressed={frequency === 'one-time'}
                      className={`flex-1 py-2 text-xs font-medium rounded transition-colors cursor-pointer ${
                        frequency === 'one-time'
                          ? 'bg-white text-zinc-900 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      One-Time Gift
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('monthly')}
                      aria-pressed={frequency === 'monthly'}
                      className={`flex-1 py-2 text-xs font-medium rounded transition-colors cursor-pointer ${
                        frequency === 'monthly'
                          ? 'bg-white text-zinc-900 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      Monthly Sponsor
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-xs font-medium text-zinc-700">Currency</span>
                  <div className="flex bg-zinc-100 p-1 rounded-md gap-1" role="group" aria-label="Donation currency">
                    <button
                      type="button"
                      onClick={() => handleCurrencySwitch('USD')}
                      aria-pressed={currency === 'USD'}
                      className={`flex-1 py-2 text-xs font-medium rounded transition-colors cursor-pointer ${
                        currency === 'USD'
                          ? 'bg-white text-zinc-900 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCurrencySwitch('UGX')}
                      aria-pressed={currency === 'UGX'}
                      className={`flex-1 py-2 text-xs font-medium rounded transition-colors cursor-pointer ${
                        currency === 'UGX'
                          ? 'bg-white text-zinc-900 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      UGX (Shillings)
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2: Amount Selection */}
              <div className="space-y-3">
                <span className="block text-xs font-medium text-zinc-700">Select Amount</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {presets.map((preset) => {
                    const selected = Number(amountInput) === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmountInput(String(preset))}
                        aria-pressed={selected}
                        className={`py-2.5 px-3 text-sm font-mono font-medium rounded-md border transition-colors tabular-nums cursor-pointer ${
                          selected
                            ? 'bg-[#14532D] text-white border-[#14532D]'
                            : 'bg-white text-zinc-800 border-zinc-300 hover:border-zinc-400'
                        }`}
                      >
                        {formatCurrency(preset, currency)}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1 pt-1">
                  <label htmlFor="don-amount" className="block text-xs font-medium text-zinc-700">
                    Or enter custom amount ({currency})
                  </label>
                  <input
                    id="don-amount"
                    type="number"
                    min={currency === 'UGX' ? 18500 : 5}
                    step="any"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full h-10 px-3 font-mono text-sm bg-white border border-zinc-300 rounded-md tabular-nums"
                  />
                  {errors.amount && <p className="text-xs text-red-700">{errors.amount}</p>}
                </div>

                <p className="text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-md p-3">
                  <span className="font-medium text-zinc-900">Direct impact:</span>{' '}
                  {getImpactStatement(equivalentUsd)}
                </p>
              </div>

              {/* Step 3: Fund & Donor Details */}
              <div className="space-y-4 border-t border-zinc-200 pt-6">
                <div className="space-y-1">
                  <label htmlFor="don-fund" className="block text-xs font-medium text-zinc-800">
                    Designate Sanctuary Fund
                  </label>
                  <select
                    id="don-fund"
                    value={fund}
                    onChange={(e) => setFund(e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                  >
                    {FUNDS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="don-name" className="block text-xs font-medium text-zinc-800">
                      Full Name
                    </label>
                    <input
                      id="don-name"
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Samuel Okello"
                      className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                    />
                    {errors.donorName && <p className="text-xs text-red-700">{errors.donorName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="don-email" className="block text-xs font-medium text-zinc-800">
                      Email for Receipt
                    </label>
                    <input
                      id="don-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                    />
                    {errors.email && <p className="text-xs text-red-700">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="don-dedication" className="block text-xs font-medium text-zinc-800">
                    Optional Dedication or Dog Name
                  </label>
                  <input
                    id="don-dedication"
                    type="text"
                    value={dedication}
                    onChange={(e) => setDedication(e.target.value)}
                    placeholder="e.g. For Kato’s paddock or in memory of..."
                    className="w-full h-10 px-3 text-sm bg-white border border-zinc-300 rounded-md"
                  />
                </div>
              </div>

              {/* Step 4: Payment Method */}
              <div className="space-y-4 border-t border-zinc-200 pt-6">
                <span className="block text-xs font-medium text-zinc-800">
                  Payment Method · Airtel Money Uganda
                </span>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#14532D]">
                      Official Airtel Money Donation Number
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Registered to HSA Bunyo Dog Rescue · Wakiso District
                    </p>
                  </div>
                  <p className="font-mono text-base font-semibold text-zinc-900 tabular-nums whitespace-nowrap">
                    +256 704 290 817
                  </p>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-md p-4 space-y-2">
                  <label htmlFor="don-momo-phone" className="block text-xs font-medium text-zinc-800">
                    Your Airtel Money Number (070 / 075 / 074)
                  </label>
                  <input
                    id="don-momo-phone"
                    type="tel"
                    value={mobilePhone}
                    onChange={(e) => setMobilePhone(e.target.value)}
                    placeholder="+256 704 290 817"
                    className="w-full h-10 px-3 font-mono text-sm bg-white border border-zinc-300 rounded-md"
                  />
                  {errors.mobilePhone && (
                    <p className="text-xs text-red-700">{errors.mobilePhone}</p>
                  )}
                  <p className="text-xs text-zinc-500">
                    Contributions settle to Airtel Money +256 704 290 817 and only your last 3 digits appear on receipts.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-zinc-500 pt-1">
                  <Lock className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" aria-hidden="true" />
                  <p>
                    Protected by TLS encryption and masked mobile-number receipts. Sandbox checkout mode is active: Mobile Money numbers are validated without triggering a live carrier charge.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 text-sm font-medium text-white bg-[#14532D] hover:bg-[#166534] disabled:opacity-60 rounded-md transition-colors cursor-pointer"
                >
                  {submitting
                    ? 'Completing Contribution...'
                    : `Complete ${frequency === 'monthly' ? 'Monthly ' : ''}Gift of ${formatCurrency(numericAmount, currency)}`}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Trust Guarantees & Live Recent Supporters */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="border border-zinc-200 rounded-lg bg-zinc-50 p-6 space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold text-sm">
              <ShieldCheck className="w-5 h-5 text-[#14532D]" aria-hidden="true" />
              Sanctuary Giving Guarantees
            </div>
            <ul className="space-y-2.5 text-sm text-zinc-600">
              <li>
                <span className="font-medium text-zinc-900">Direct Ugandan Impact:</span> Funds clear directly into HSA Bunyo’s Wakiso veterinary and kennel supply ledger.
              </li>
              <li>
                <span className="font-medium text-zinc-900">Masked Phone Privacy:</span> Full Mobile Money numbers are never exposed on public supporter listings; only the final 3 digits appear on receipts.
              </li>
              <li>
                <span className="font-medium text-zinc-900">Monthly Flexibility:</span> Recurring sponsorships can be adjusted or paused anytime by emailing care@hsabunyo.space or hsabunyo@gmail.com.
              </li>
            </ul>
          </div>

          <div className="border border-zinc-200 rounded-lg bg-white p-6 space-y-4">
            <h2 className="font-serif text-xl font-medium text-zinc-900">
              Recent Verified Supporters
            </h2>
            <div className="divide-y divide-zinc-200">
              {recentDonations.slice(0, 6).map((item) => (
                <div key={item.id} className="py-3 flex items-start justify-between gap-4 text-sm">
                  <div className="space-y-0.5">
                    <p className="font-medium text-zinc-900">{item.donorName}</p>
                    <p className="text-xs text-zinc-500">
                      {item.fund} <span aria-hidden="true">·</span>{' '}
                      <span className="whitespace-nowrap">{item.methodLabel}</span>
                    </p>
                    {item.dedication && (
                      <p className="text-xs italic text-zinc-500">“{item.dedication}”</p>
                    )}
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#14532D] tabular-nums whitespace-nowrap shrink-0">
                    {formatCurrency(item.originalAmount, item.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
