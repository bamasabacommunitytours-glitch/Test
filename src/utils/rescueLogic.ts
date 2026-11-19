import type { DogAgeGroup, DogProfile, DogSize } from '../data/rescueData';

export const USD_TO_UGX_RATE = 3700;

export interface DogFilterCriteria {
  size: DogSize | 'All';
  ageGroup: DogAgeGroup | 'All';
  compatibility: 'All' | 'Kids' | 'Dogs' | 'Cats';
  query: string;
}

export function filterDogs(dogs: DogProfile[], criteria: DogFilterCriteria): DogProfile[] {
  const normalizedQuery = criteria.query.trim().toLowerCase();

  return dogs.filter((dog) => {
    if (criteria.size !== 'All' && dog.size !== criteria.size) {
      return false;
    }
    if (criteria.ageGroup !== 'All' && dog.ageGroup !== criteria.ageGroup) {
      return false;
    }
    if (criteria.compatibility === 'Kids' && !dog.goodWithKids) {
      return false;
    }
    if (criteria.compatibility === 'Dogs' && !dog.goodWithDogs) {
      return false;
    }
    if (criteria.compatibility === 'Cats' && !dog.goodWithCats) {
      return false;
    }
    if (normalizedQuery.length > 0) {
      const searchable = [
        dog.name,
        dog.breed,
        dog.location,
        dog.summary,
        ...dog.temperament,
      ]
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });
}

export function convertUsdToUgx(amountUsd: number): number {
  return Math.round(amountUsd * USD_TO_UGX_RATE);
}

export function convertUgxToUsd(amountUgx: number): number {
  return Math.round((amountUgx / USD_TO_UGX_RATE) * 100) / 100;
}

export function formatCurrency(amount: number, currency: 'USD' | 'UGX'): string {
  if (currency === 'UGX') {
    return `UGX ${Math.round(amount).toLocaleString('en-US')}`;
  }
  const hasCents = Math.abs(amount - Math.round(amount)) > 0.001;
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export function getImpactStatement(amountUsd: number): string {
  if (amountUsd >= 350) {
    return 'Funds an Entebbe flight-ready IATA travel crate, export veterinary clearance, and customs paperwork for an adopted dog.';
  }
  if (amountUsd >= 150) {
    return 'Covers emergency tick-fever diagnostics, IV fluids, antibiotics, and 10 days of clinic recovery care.';
  }
  if (amountUsd >= 65) {
    return 'Sponsors a complete humane spay/neuter surgery, pain relief, and rabies + DHPP vaccinations.';
  }
  if (amountUsd >= 25) {
    return 'Provides 1 month of fortified kibble, clean straw bedding, and flea/tick prevention for one sanctuary dog.';
  }
  return 'Helps supply deworming tablets, wound antiseptic, and sterile clinic dressings for street rescue outreach.';
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateUgandaMobileMoneyPhone(
  phone: string,
  _provider: 'airtel_money' = 'airtel_money'
): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  let localNine = '';
  if (cleaned.startsWith('+256')) {
    localNine = cleaned.slice(4);
  } else if (cleaned.startsWith('256')) {
    localNine = cleaned.slice(3);
  } else if (cleaned.startsWith('0')) {
    localNine = cleaned.slice(1);
  } else {
    return false;
  }

  if (!/^\d{9}$/.test(localNine)) {
    return false;
  }

  const prefix = localNine.slice(0, 2);
  return prefix === '70' || prefix === '75' || prefix === '74';
}

export interface ValidationErrors {
  [field: string]: string;
}

export interface AdoptionInquiryInput {
  dogId: string;
  applicantName: string;
  email: string;
  phone: string;
  location: string;
  housingType: string;
  experience: string;
  reason: string;
}

export function validateAdoptionInquiry(input: AdoptionInquiryInput): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!input.dogId?.trim()) errors.dogId = 'Dog selection is required.';
  if (!input.applicantName?.trim() || input.applicantName.trim().length < 2) {
    errors.applicantName = 'Please enter your full name.';
  }
  if (!validateEmail(input.email || '')) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!input.phone?.trim() || input.phone.replace(/\D/g, '').length < 7) {
    errors.phone = 'Please enter a reachable phone or WhatsApp number.';
  }
  if (!input.location?.trim()) {
    errors.location = 'Please provide your city and country.';
  }
  if (!input.housingType?.trim()) {
    errors.housingType = 'Please select your living arrangement.';
  }
  if (!input.reason?.trim() || input.reason.trim().length < 12) {
    errors.reason = 'Please share a brief note about your home and daily routine (min. 12 characters).';
  }
  return errors;
}

export interface VolunteerApplicationInput {
  fullName: string;
  email: string;
  phone: string;
  roleId: string;
  availability: string;
  experience: string;
  emergencyContact: string;
}

export function validateVolunteerApplication(input: VolunteerApplicationInput): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!input.fullName?.trim() || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }
  if (!validateEmail(input.email || '')) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!input.phone?.trim() || input.phone.replace(/\D/g, '').length < 7) {
    errors.phone = 'Please enter a valid phone or WhatsApp number.';
  }
  if (!input.roleId?.trim()) {
    errors.roleId = 'Please choose a volunteer program.';
  }
  if (!input.availability?.trim()) {
    errors.availability = 'Please specify your available dates or weekly schedule.';
  }
  if (!input.experience?.trim() || input.experience.trim().length < 10) {
    errors.experience = 'Please describe any relevant animal care, medical, or outreach skills.';
  }
  if (!input.emergencyContact?.trim()) {
    errors.emergencyContact = 'Emergency contact name and phone number are required.';
  }
  return errors;
}

export type PaymentMethod = 'airtel_money';

export interface DonationSubmissionInput {
  donorName: string;
  email: string;
  currency: 'USD' | 'UGX';
  amount: number;
  frequency: 'one-time' | 'monthly';
  fund: string;
  paymentMethod: PaymentMethod;
  mobilePhone?: string;
  dedication?: string;
}

export function validateDonationSubmission(input: DonationSubmissionInput): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!input.donorName?.trim() || input.donorName.trim().length < 2) {
    errors.donorName = 'Please enter your full name for the receipt.';
  }
  if (!validateEmail(input.email || '')) {
    errors.email = 'Please enter a valid email address for receipt delivery.';
  }
  const minAmount = input.currency === 'UGX' ? 18500 : 5;
  if (!Number.isFinite(input.amount) || input.amount < minAmount) {
    errors.amount =
      input.currency === 'UGX'
        ? 'Minimum gift is UGX 18,500.'
        : 'Minimum gift is $5.';
  }
  if (!input.fund?.trim()) {
    errors.fund = 'Please choose a sanctuary fund allocation.';
  }

  if (input.paymentMethod !== 'airtel_money') {
    errors.paymentMethod = 'Airtel Money Uganda is currently the supported payment method.';
  } else if (!validateUgandaMobileMoneyPhone(input.mobilePhone || '', 'airtel_money')) {
    errors.mobilePhone =
      'Enter a valid Ugandan Airtel Money number (e.g. +256 704 290 817).';
  }

  return errors;
}
