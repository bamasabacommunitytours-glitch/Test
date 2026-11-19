import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_DOGS } from '../data/rescueData.js';
import {
  convertUgxToUsd,
  convertUsdToUgx,
  filterDogs,
  formatCurrency,
  getImpactStatement,
  validateAdoptionInquiry,
  validateContactMessage,
  validateDonationSubmission,
  validateUgandaMobileMoneyPhone,
  validateVolunteerApplication,
} from './rescueLogic.js';

test('filterDogs filters accurately by size, age, compatibility, and search query', () => {
  const mediumDogs = filterDogs(INITIAL_DOGS, {
    size: 'Medium',
    ageGroup: 'All',
    compatibility: 'All',
    query: '',
  });
  assert.equal(mediumDogs.length, 3);
  assert.ok(mediumDogs.every((d) => d.size === 'Medium'));

  const catFriendlyPuppies = filterDogs(INITIAL_DOGS, {
    size: 'All',
    ageGroup: 'Puppy',
    compatibility: 'Cats',
    query: '',
  });
  assert.equal(catFriendlyPuppies.length, 1);
  assert.equal(catFriendlyPuppies[0].id, 'rwenzori');

  const queryMatch = filterDogs(INITIAL_DOGS, {
    size: 'All',
    ageGroup: 'All',
    compatibility: 'All',
    query: 'basenji',
  });
  assert.equal(queryMatch.length, 2);
});

test('currency conversion and formatting handle USD and UGX accurately', () => {
  assert.equal(convertUsdToUgx(65), 240500);
  assert.equal(convertUgxToUsd(240500), 65);
  assert.equal(formatCurrency(65, 'USD'), '$65');
  assert.equal(formatCurrency(240500, 'UGX'), 'UGX 240,500');
  assert.match(getImpactStatement(65), /spay\/neuter/i);
  assert.match(getImpactStatement(350), /Entebbe/i);
});

test('Ugandan Mobile Money phone validator validates Airtel Money prefixes', () => {
  assert.equal(validateUgandaMobileMoneyPhone('+256 704 290 817', 'airtel_money'), true);
  assert.equal(validateUgandaMobileMoneyPhone('+256 701 419 820', 'airtel_money'), true);
  assert.equal(validateUgandaMobileMoneyPhone('0752987654', 'airtel_money'), true);
  assert.equal(validateUgandaMobileMoneyPhone('0741234567', 'airtel_money'), true);
  assert.equal(validateUgandaMobileMoneyPhone('+256 772 419 820', 'airtel_money'), false);
  assert.equal(validateUgandaMobileMoneyPhone('0784123456', 'airtel_money'), false);
});

test('form validators catch missing/invalid fields and accept complete valid payloads', () => {
  const badAdoption = validateAdoptionInquiry({
    dogId: 'kato',
    applicantName: '',
    email: 'invalid-email',
    phone: '12',
    location: '',
    housingType: '',
    experience: '',
    reason: 'short',
  });
  assert.ok(badAdoption.applicantName);
  assert.ok(badAdoption.email);
  assert.ok(badAdoption.phone);
  assert.ok(badAdoption.reason);

  const goodAdoption = validateAdoptionInquiry({
    dogId: 'kato',
    applicantName: 'Grace Nabwire',
    email: 'grace@example.org',
    phone: '+256 772 555 123',
    location: 'Kampala, Uganda',
    housingType: 'House with fenced compound',
    experience: 'Previous dog owner',
    reason: 'I work from home in Kololo and have a large fenced compound for daily walks.',
  });
  assert.deepEqual(goodAdoption, {});

  const badVolunteer = validateVolunteerApplication({
    fullName: 'A',
    email: 'bad',
    phone: '123',
    roleId: '',
    availability: '',
    experience: 'none',
    emergencyContact: '',
  });
  assert.ok(badVolunteer.fullName);
  assert.ok(badVolunteer.roleId);

  const badDonation = validateDonationSubmission({
    donorName: 'Test Donor',
    email: 'donor@example.com',
    currency: 'UGX',
    amount: 5000,
    frequency: 'one-time',
    fund: 'Emergency Veterinary Care',
    paymentMethod: 'airtel_money',
    mobilePhone: '0772123456',
  });
  assert.ok(badDonation.amount);
  assert.ok(badDonation.mobilePhone);

  const goodDonation = validateDonationSubmission({
    donorName: 'Grace Nabwire',
    email: 'grace@example.org',
    currency: 'USD',
    amount: 65,
    frequency: 'one-time',
    fund: 'Emergency Veterinary Care',
    paymentMethod: 'airtel_money',
    mobilePhone: '+256 704 290 817',
  });
  assert.deepEqual(goodDonation, {});

  const badContact = validateContactMessage({
    fullName: '',
    email: 'invalid',
    phone: '12',
    topic: '',
    message: 'hi',
  });
  assert.ok(badContact.fullName);
  assert.ok(badContact.email);
  assert.ok(badContact.phone);
  assert.ok(badContact.topic);
  assert.ok(badContact.message);

  const goodContact = validateContactMessage({
    fullName: 'Samuel Okello',
    email: 'samuel@example.org',
    phone: '+256 704 290 817',
    topic: 'General Sanctuary Visit',
    message: 'I would like to visit the Bunyo sanctuary this Saturday morning with kibble supplies.',
  });
  assert.deepEqual(goodContact, {});
});
