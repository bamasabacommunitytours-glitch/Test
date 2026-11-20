export type PlacementStatus = 'Ready for Adoption' | 'Medical Foster';

export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  sex: 'Male' | 'Female';
  location: string;
  intakeDate: string;
  microchipId: string;
  status: PlacementStatus;
  imageUrl: string;
  imageCaption: string;
  imagePosition?: string;
  summary: string;
  story: string;
  temperament: string[];
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  medicalNotes: string;
  localAdoptionFeeUgx: number;
  internationalTransportUsd: number;
  inquiryCount: number;
}

export interface VolunteerRole {
  id: string;
  title: string;
  location: string;
  commitment: string;
  minStay: string;
  skills: string;
  supportProvided: string;
  description: string;
}

export interface FieldProgram {
  index: string;
  title: string;
  summary: string;
  metric: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  amountUsd: number;
  originalAmount: number;
  currency: 'USD' | 'UGX';
  frequency: 'one-time' | 'monthly';
  fund: string;
  methodLabel: string;
  dedication?: string;
  createdAt: string;
}

export interface CampaignSummary {
  title: string;
  subtitle: string;
  goalUsd: number;
  raisedUsd: number;
  supportersCount: number;
}

export interface AdoptionInquiryRecord {
  referenceId: string;
  dogId: string;
  dogName: string;
  applicantName: string;
  email: string;
  phone: string;
  location: string;
  housingType: string;
  experience: string;
  reason: string;
  createdAt: string;
}

export interface VolunteerApplicationRecord {
  referenceId: string;
  fullName: string;
  email: string;
  phone: string;
  roleId: string;
  roleTitle: string;
  availability: string;
  experience: string;
  emergencyContact: string;
  createdAt: string;
}

export interface ContactMessageRecord {
  referenceId: string;
  fullName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  createdAt: string;
}

export const CONTACT_TOPICS = [
  'Adoption & Rehoming Inquiry',
  'Emergency Stray / Injured Dog Report (Wakiso & Kampala)',
  'Volunteering & Entebbe Flight Buddy',
  'Airtel Money Donation & Receipt Support',
  'Sanctuary Visit & General Question',
] as const;

export const HERO_IMAGE_URL = '/src/assets/images/fig.%201.jpeg';
export const CLINIC_IMAGE_URL = '/src/assets/images/field_rescue_vet_1795217209835.jpg';
export const KENNEL_PUPS_IMAGE_URL = '/src/assets/images/kennel_pups_clean_1795217209466.jpg';
export const VOLUNTEER_IMAGE_URL = '/src/assets/images/volunteer_team_edit_1795216566349.jpg';
export const ABOUT_RESCUE_IMAGE_URL = '/src/assets/images/field_rescue_vet_1795217209835.jpg';
export const OUTREACH_CLINIC_IMAGE_URL = '/src/assets/images/community_clinic_outreach_1795217218643.jpg';

export const INITIAL_DOGS: DogProfile[] = [
  {
    id: 'kato',
    name: 'Kato',
    breed: 'Ugandan Basenji Mix',
    sex: 'Male',
    location: 'Bunyo Sanctuary, Wakiso',
    intakeDate: 'March 2026',
    microchipId: 'UG-BNY-2026-014',
    status: 'Ready for Adoption',
    imageUrl: '/src/assets/images/kato_dog_only_1795216969036.jpg',
    imageCaption: 'Kato resting on the grass lawn at our Wakiso sanctuary compound.',
    imagePosition: 'object-center',
    summary: 'Alert, affectionate black-and-tan Basenji mix who thrives on gentle play, daily walks, and family companionship.',
    story:
      'Rescued near the Kasenyi landing site with an old rope mark around his shoulder, Kato healed quickly with our Wakiso caretakers. He has blossomed into an affectionate, steady companion who enjoys children, walks calmly on a leash, and settles easily beside desks or porches.',
    temperament: ['Leash trained', 'Gentle with children', 'Calm indoors'],
    goodWithKids: true,
    goodWithDogs: true,
    goodWithCats: false,
    medicalNotes: 'Rabies & DHPP vaccinated, tick-borne panel negative, routine deworming completed, microchipped.',
    localAdoptionFeeUgx: 150000,
    internationalTransportUsd: 3650,
    inquiryCount: 2,
  },
  {
    id: 'nambi',
    name: 'Nambi',
    breed: 'Africanis / Ridgeback Mix',
    sex: 'Female',
    location: 'Bunyo Sanctuary, Wakiso',
    intakeDate: 'May 2026',
    microchipId: 'UG-BNY-2026-029',
    status: 'Ready for Adoption',
    imageUrl: '/src/assets/images/nambi.jpg',
    imageCaption: 'Nambi resting on the painted stone verandah at Bunyo Sanctuary.',
    imagePosition: 'object-[50%_68%]',
    summary: 'Graceful, observant companion with a mellow temperament, ideal for a home with a fenced yard or active walker.',
    story:
      'Rescued outside Mpigi town, Nambi quickly showed a remarkably polite and attentive nature. She enjoys morning play across the compound and sits attentively for papaya and peanut treats. She pairs especially well with confident resident dogs or families wanting a loyal walking partner.',
    temperament: ['Good with dogs', 'Enjoys outdoors', 'Quick learner'],
    goodWithKids: true,
    goodWithDogs: true,
    goodWithCats: false,
    medicalNotes: 'Rabies, Parvo & DHPP up to date, routine deworming completed, microchipped.',
    localAdoptionFeeUgx: 150000,
    internationalTransportUsd: 4200,
    inquiryCount: 1,
  },
  {
    id: 'rwenzori',
    name: 'Rwenzori',
    breed: 'Ugandan Village Hound Mix',
    sex: 'Male',
    location: 'Kampala Foster Home',
    intakeDate: 'August 2026',
    microchipId: 'UG-BNY-2026-051',
    status: 'Ready for Adoption',
    imageUrl: '/src/assets/images/rwenzori%20.jpeg',
    imageCaption: 'Rwenzori greeting morning caretakers from the green sanctuary enclosure.',
    imagePosition: 'object-[50%_45%]',
    summary: 'Curious fawn-coated village hound learning house manners and basic cues in foster care; affectionate and eager to bond.',
    story:
      'Rwenzori came into our care during a community outreach clinic near Entebbe Road when his caretaker relocated. Placed with an experienced foster family in Muyenga, he sleeps calmly through the night, gets along happily with children and resident cats, and responds reliably to recall.',
    temperament: ['Good with cats', 'Good with kids', 'Crate comfortable'],
    goodWithKids: true,
    goodWithDogs: true,
    goodWithCats: true,
    medicalNotes: 'Neutered, full Rabies & DHPP vaccine series completed, routine deworming, microchipped.',
    localAdoptionFeeUgx: 120000,
    internationalTransportUsd: 3500,
    inquiryCount: 3,
  },
  {
    id: 'amara',
    name: 'Amara',
    breed: 'Ugandan Shepherd Mix',
    sex: 'Female',
    location: 'Bunyo Sanctuary, Wakiso',
    intakeDate: 'January 2026',
    microchipId: 'UG-BNY-2026-004',
    status: 'Ready for Adoption',
    imageUrl: '/src/assets/images/amara_dog_only_1795216966446.jpg',
    imageCaption: 'Amara relaxing on the concrete verandah step during afternoon sanctuary rounds.',
    imagePosition: 'object-center',
    summary: 'Gentle, observant companion seeking a loving home with quiet daily routines and soft bedding.',
    story:
      'Rescued from a quiet rural compound in Wakiso after being left behind when her owners moved away, Amara quickly won over our caretakers with her calm, observant nature. She is deeply affectionate, wonderfully patient around children and other dogs, and loves resting on a shaded verandah.',
    temperament: ['Gentle nature', 'House-trained', 'Calm indoors'],
    goodWithKids: true,
    goodWithDogs: true,
    goodWithCats: true,
    medicalNotes: 'Rabies & DHPP vaccinated, routine deworming completed, tick-borne panel negative, microchipped.',
    localAdoptionFeeUgx: 100000,
    internationalTransportUsd: 3850,
    inquiryCount: 1,
  },
  {
    id: 'mirembe',
    name: 'Mirembe',
    breed: 'East African Village Hound',
    sex: 'Female',
    location: 'Bunyo Clinic Wing',
    intakeDate: 'September 2026',
    microchipId: 'UG-BNY-2026-063',
    status: 'Medical Foster',
    imageUrl: '/src/assets/images/mirembe_dog_only_1795216966298.jpg',
    imageCaption: 'Mirembe sitting calmly outside the clinic wing at Bunyo Sanctuary.',
    imagePosition: 'object-center',
    summary: 'Sweet-natured dog finishing tick-fever recovery; available for local foster-to-adopt or medical sponsorship.',
    story:
      'Brought to our Saturday mobile clinic by concerned market vendors in Katabi, Mirembe arrived severely anemic from tick fever while caring for her litter. Her pups have since thrived, and Mirembe is completing her final two weeks of iron and doxycycline therapy. She greets every vet technician gently.',
    temperament: ['Affectionate', 'Calm at vet', 'Good with dogs'],
    goodWithKids: true,
    goodWithDogs: true,
    goodWithCats: false,
    medicalNotes: 'Spayed after recovery, finishing Babesia treatment, vaccinated and microchipped.',
    localAdoptionFeeUgx: 120000,
    internationalTransportUsd: 3750,
    inquiryCount: 0,
  },
  {
    id: 'bukenya',
    name: 'Bukenya',
    breed: 'Basenji / Village Hound Mix',
    sex: 'Male',
    location: 'Bunyo Sanctuary, Wakiso',
    intakeDate: 'October 2026',
    microchipId: 'UG-BNY-2026-071',
    status: 'Medical Foster',
    imageUrl: '/src/assets/images/bukenya_dog_only_1795216966770.jpg',
    imageCaption: 'Bukenya in the red-earth sanctuary courtyard after his morning walk.',
    imagePosition: 'object-center',
    summary: 'Playful black-and-tan hound gaining confidence in group play; thrives alongside another friendly dog.',
    story:
      'Rescued from a storm drain near Kajjansi during October rains, Bukenya is agile, curious, and eager to learn. He follows our sanctuary caretaker everywhere and enjoys gentle games in the morning paddock. He is ready for a patient foster-to-adopt family in Kampala or Entebbe.',
    temperament: ['Playful', 'Friendly with dogs', 'Learns quickly'],
    goodWithKids: true,
    goodWithDogs: true,
    goodWithCats: false,
    medicalNotes: 'Vaccinated (Rabies & DHPP), tick and flea treated, routine deworming, microchipped.',
    localAdoptionFeeUgx: 130000,
    internationalTransportUsd: 3500,
    inquiryCount: 1,
  },
];

export const VOLUNTEER_ROLES: VolunteerRole[] = [
  {
    id: 'sanctuary-care',
    title: 'Sanctuary Care & Socialization',
    location: 'Bunyo Compound, Wakiso',
    commitment: '12–20 hrs / week',
    minStay: '2 weeks',
    skills: 'Patience, basic dog handling, comfort working outdoors',
    supportProvided: 'Orientation, lunch on-site, Kampala–Bunyo shuttle coordination',
    description:
      'Assist our Ugandan caretakers with morning feeding, kennel sanitation, leash training, and confidence-building walks for shy street rescues.',
  },
  {
    id: 'vet-assistant',
    title: 'Veterinary & Clinic Support',
    location: 'Bunyo Clinic & Mobile Units',
    commitment: '16–24 hrs / week',
    minStay: '3 weeks',
    skills: 'Licensed Vet, Vet Tech, or pre-vet student',
    supportProvided: 'Medical supply kit, transport to rural clinics, supervisor sign-off',
    description:
      'Work alongside Dr. Grace Namukasa during spay/neuter surgeries, rabies vaccination drives, wound dressing, and tick-fever recovery monitoring.',
  },
  {
    id: 'community-outreach',
    title: 'Community Education & Fostering',
    location: 'Wakiso & Entebbe Schools',
    commitment: '6–10 hrs / week',
    minStay: '4 weeks (or ongoing local)',
    skills: 'Luganda or English fluency, teaching or community organizing',
    supportProvided: 'Printed bilingual booklets, outreach transport',
    description:
      'Help deliver humane dog-safety workshops in primary schools and coordinate temporary Kampala foster homes for recovering puppies.',
  },
  {
    id: 'flight-buddy',
    title: 'Entebbe Flight Buddy & Transport',
    location: 'Entebbe Airport (EBB) → Europe / North America',
    commitment: 'Single flight',
    minStay: 'One-way trip',
    skills: 'Confirmed passenger ticket from EBB to EU, UK, US, or Canada',
    supportProvided: 'Export permits, IATA crate prep & Entebbe customs clearance coordinated by HSA',
    description:
      'Link an adopted Bunyo dog to your existing passenger itinerary out of Entebbe International Airport so they can travel safely in climate-controlled cargo to their awaiting family.',
  },
];

export const FIELD_PROGRAMS: FieldProgram[] = [
  {
    index: '01',
    title: 'Emergency Street Rescue & Rehabilitation',
    summary:
      '24-hour field response across Wakiso, Kajjansi, and Entebbe Road for injured, abandoned, or critically ill street dogs, followed by quarantine and trauma recovery.',
    metric: '42 dogs currently housed in clean, shaded family-group paddocks',
  },
  {
    index: '02',
    title: 'Community Rabies & Spay Clinics',
    summary:
      'Monthly mobile veterinary camps partnering with village leaders to provide free rabies vaccinations, tick-borne disease treatment, and humane sterilization.',
    metric: '320+ dogs vaccinated and treated across 14 Wakiso parishes since 2024',
  },
  {
    index: '03',
    title: 'Local Ugandan & Flight-Buddy Rehoming',
    summary:
      'Careful home matching across Kampala and Entebbe alongside vetted international placements via Entebbe flight volunteers and EU/North America partner rescues.',
    metric: '186 rescued dogs placed in permanent homes since 2021',
  },
];

export const INITIAL_CAMPAIGN: CampaignSummary = {
  title: 'Q4 Medical Wing & Shaded Paddock Expansion',
  subtitle:
    'Funding emergency tick-fever treatment, rabies clinic cold-chain supplies, and solar-lit isolation kennels at our Bunyo sanctuary.',
  goalUsd: 7500,
  raisedUsd: 4250,
  supportersCount: 64,
};

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'HSA-DON-8421',
    donorName: 'Sarah K. Mukasa',
    amountUsd: 65,
    originalAmount: 240500,
    currency: 'UGX',
    frequency: 'one-time',
    fund: 'Community Rabies & Spay Clinics',
    methodLabel: 'Airtel Money ••• 819',
    dedication: 'In gratitude for Nambi’s clinic team',
    createdAt: '2026-11-18T14:20:00.000Z',
  },
  {
    id: 'HSA-DON-8419',
    donorName: 'Daniel Lindqvist',
    amountUsd: 150,
    originalAmount: 150,
    currency: 'USD',
    frequency: 'monthly',
    fund: 'Emergency Veterinary Care',
    methodLabel: 'Airtel Money ••• 618',
    createdAt: '2026-11-17T09:15:00.000Z',
  },
  {
    id: 'HSA-DON-8414',
    donorName: 'Prossy Nabirye',
    amountUsd: 30,
    originalAmount: 111000,
    currency: 'UGX',
    frequency: 'one-time',
    fund: 'General Sanctuary & Food',
    methodLabel: 'Airtel Money ••• 304',
    createdAt: '2026-11-15T17:45:00.000Z',
  },
];
