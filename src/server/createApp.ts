import express from 'express';
import fs from 'fs';
import path from 'path';
import {
  INITIAL_CAMPAIGN,
  INITIAL_DOGS,
  INITIAL_DONATIONS,
  VOLUNTEER_ROLES,
  type AdoptionInquiryRecord,
  type CampaignSummary,
  type ContactMessageRecord,
  type DogProfile,
  type DonationRecord,
  type VolunteerApplicationRecord,
} from '../data/rescueData.js';
import {
  convertUgxToUsd,
  validateAdoptionInquiry,
  validateContactMessage,
  validateDonationSubmission,
  validateVolunteerApplication,
} from '../utils/rescueLogic.js';

interface PersistedRescueState {
  dogs: DogProfile[];
  campaign: CampaignSummary;
  donations: DonationRecord[];
  adoptions: AdoptionInquiryRecord[];
  volunteers: VolunteerApplicationRecord[];
  contacts: ContactMessageRecord[];
}

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'hsa-bunyo-data')
  : path.resolve(process.cwd(), '.data');
const STATE_FILE = path.join(DATA_DIR, 'rescue-state.json');

function loadInitialState(): PersistedRescueState {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as PersistedRescueState;
      if (parsed && Array.isArray(parsed.dogs) && parsed.campaign) {
        return {
          ...parsed,
          adoptions: Array.isArray(parsed.adoptions) ? parsed.adoptions : [],
          volunteers: Array.isArray(parsed.volunteers) ? parsed.volunteers : [],
          contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
        };
      }
    }
  } catch {
    // Fallback cleanly to seed state if file is unreadable
  }
  return {
    dogs: structuredClone(INITIAL_DOGS),
    campaign: structuredClone(INITIAL_CAMPAIGN),
    donations: structuredClone(INITIAL_DONATIONS),
    adoptions: [],
    volunteers: [],
    contacts: [],
  };
}

function saveState(state: PersistedRescueState): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch {
    // Keep operating smoothly in-memory if filesystem writes are restricted
  }
}

export function createApiApp(): express.Express {
  const app = express();
  app.use(express.json());

  // Restore full /api/* path when Vercel rewrites /api/(.*) -> /api/index?__path=$1
  app.use((req, _res, next) => {
    const rawPath = req.query?.__path;
    if (typeof rawPath === 'string' && rawPath.length > 0) {
      const clean = rawPath.replace(/^\/+/, '');
      req.url = `/api/${clean}`;
    }
    next();
  });

  const state = loadInitialState();

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, sanctuary: 'HSA Bunyo Dog Rescue' });
  });

  app.get('/api/state', (_req, res) => {
    res.json({
      dogs: state.dogs,
      campaign: state.campaign,
      donations: state.donations.slice(0, 12),
      volunteerCount: state.volunteers.length,
    });
  });

  app.post('/api/adoptions', (req, res) => {
    const errors = validateAdoptionInquiry(req.body ?? {});
    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: 'Validation failed', fieldErrors: errors });
      return;
    }

    const dog = state.dogs.find((d) => d.id === req.body.dogId);
    if (!dog) {
      res.status(404).json({ error: 'Selected dog profile was not found.' });
      return;
    }

    const referenceId = `HSA-ADP-${Math.floor(1000 + Math.random() * 9000)}`;
    const inquiry: AdoptionInquiryRecord = {
      referenceId,
      dogId: dog.id,
      dogName: dog.name,
      applicantName: String(req.body.applicantName).trim(),
      email: String(req.body.email).trim(),
      phone: String(req.body.phone).trim(),
      location: String(req.body.location).trim(),
      housingType: String(req.body.housingType).trim(),
      experience: String(req.body.experience || 'First-time dog adopter').trim(),
      reason: String(req.body.reason).trim(),
      createdAt: new Date().toISOString(),
    };

    dog.inquiryCount += 1;
    state.adoptions.unshift(inquiry);
    saveState(state);

    res.status(201).json({
      inquiry,
      dog,
    });
  });

  app.post('/api/volunteers', (req, res) => {
    const errors = validateVolunteerApplication(req.body ?? {});
    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: 'Validation failed', fieldErrors: errors });
      return;
    }

    const role = VOLUNTEER_ROLES.find((r) => r.id === req.body.roleId);
    const referenceId = `HSA-VOL-${Math.floor(1000 + Math.random() * 9000)}`;
    const application: VolunteerApplicationRecord = {
      referenceId,
      fullName: String(req.body.fullName).trim(),
      email: String(req.body.email).trim(),
      phone: String(req.body.phone).trim(),
      roleId: String(req.body.roleId).trim(),
      roleTitle: role ? role.title : String(req.body.roleId).trim(),
      availability: String(req.body.availability).trim(),
      experience: String(req.body.experience).trim(),
      emergencyContact: String(req.body.emergencyContact).trim(),
      createdAt: new Date().toISOString(),
    };

    state.volunteers.unshift(application);
    saveState(state);

    res.status(201).json({
      application,
      volunteerCount: state.volunteers.length,
    });
  });

  app.post('/api/donations', (req, res) => {
    const payload = req.body ?? {};
    const errors = validateDonationSubmission(payload);
    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: 'Validation failed', fieldErrors: errors });
      return;
    }

    const currency = payload.currency === 'UGX' ? 'UGX' : 'USD';
    const originalAmount = Number(payload.amount);
    const amountUsd =
      currency === 'UGX' ? convertUgxToUsd(originalAmount) : Math.round(originalAmount * 100) / 100;

    // Mask mobile phone digits before storing or returning
    const digits = String(payload.mobilePhone || '').replace(/\D/g, '');
    const methodLabel = `Airtel Money ••• ${digits.slice(-3) || '000'}`;

    const receipt: DonationRecord = {
      id: `HSA-DON-${Math.floor(1000 + Math.random() * 9000)}`,
      donorName: String(payload.donorName).trim(),
      amountUsd,
      originalAmount,
      currency,
      frequency: payload.frequency === 'monthly' ? 'monthly' : 'one-time',
      fund: String(payload.fund).trim(),
      methodLabel,
      dedication: payload.dedication ? String(payload.dedication).trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    state.donations.unshift(receipt);
    state.campaign.raisedUsd = Math.round((state.campaign.raisedUsd + amountUsd) * 100) / 100;
    state.campaign.supportersCount += 1;
    saveState(state);

    res.status(201).json({
      receipt,
      campaign: state.campaign,
      donations: state.donations.slice(0, 12),
    });
  });

  app.post('/api/contact', (req, res) => {
    const errors = validateContactMessage(req.body ?? {});
    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: 'Validation failed', fieldErrors: errors });
      return;
    }

    const referenceId = `HSA-MSG-${Math.floor(1000 + Math.random() * 9000)}`;
    const contact: ContactMessageRecord = {
      referenceId,
      fullName: String(req.body.fullName).trim(),
      email: String(req.body.email).trim(),
      phone: String(req.body.phone || '').trim(),
      topic: String(req.body.topic).trim(),
      message: String(req.body.message).trim(),
      createdAt: new Date().toISOString(),
    };

    state.contacts.unshift(contact);
    saveState(state);

    res.status(201).json({
      contact,
      contactCount: state.contacts.length,
    });
  });

  return app;
}
