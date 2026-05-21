"use client";

import { useState, useCallback } from "react";
import { sendWorkWithUsEmail } from "@/lib/actions/workwithus";


interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal: string;
  country: string;
}

interface License {
  id: string;
  state: string;
  number: string;
  expiry: string;
  statuses: { active: boolean; inactive: boolean; compact: boolean; originalState: boolean };
}

interface Certificate {
  id: string;
  module: string;
  dateCompleted: string;
  expirationDate: string;
  file: File | null;
}

interface AdditionalCert {
  id: string;
  name: string;
  dateCompleted: string;
  expirationDate: string;
  file: File | null;
}

interface Step1State {
  title: string;
  dob: string;
  firstName: string;
  middleName: string;
  lastName: string;
  address: Address;
  usEligible: string;
  email: string;
  phone: string;
  dateAvailable: string;
  positionApplying: string;
  shiftsPreferred: string;
  typeOfPosition: string;
  typeOfContract: string;
  travelAssignment: string;
  yearsTravel: string;
  shiftsExtraValues: string[];
}

interface Step2State {
  category: string;
  licenses: License[];
  selectedStates: string[];
  blsDateCompleted: string;
  blsExpiration: string;
  blsFile: File | null;
  certificates: Certificate[];
  additionalCerts: AdditionalCert[];
}

interface FormErrors {
  [key: string]: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TITLES = ["Mr", "Mrs", "Miss", "Ms", "Dr", "Other"];

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" }, { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" }, { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" }, { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" }, { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" }, { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" }, { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" }, { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" }, { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" }, { code: "PR", name: "Puerto Rico" },
  { code: "GU", name: "Guam" }, { code: "VI", name: "U.S. Virgin Islands" },
];

const CATEGORIES = [
  "Allied Health", "Cardiovascular", "Emergency Medicine", "ICU / Critical Care",
  "Labor & Delivery", "Medical Surgical", "Neonatal", "Oncology", "Pediatrics",
  "Perioperative", "Psychiatric / Behavioral", "Radiology", "Rehabilitation",
  "Telemetry", "Travel Nursing",
];

const TRAINING_MODULES = [
  "ACLS – Advanced Cardiac Life Support",
  "ATLS – Advanced Trauma Life Support",
  "BLS – Basic Life Support",
  "PALS – Pediatric Advanced Life Support",
  "NRP – Neonatal Resuscitation Program",
  "TNCC – Trauma Nursing Core Course",
  "CCRN – Critical Care Registered Nurse",
  "CEN – Certified Emergency Nurse",
  "NIH Stroke Scale",
  "Fetal Heart Monitoring",
];

const SHIFTS = ["Day Shift", "Night Shift", "Evening Shift", "Rotating", "Flexible"];
const POSITION_TYPES = ["Full-Time", "Part-Time", "Per Diem", "Contract"];
const CONTRACT_TYPES = ["13-Week Contract", "26-Week Contract", "52-Week Contract", "Permanent"];

const newLicense = (): License => ({
  id: crypto.randomUUID(),
  state: "",
  number: "",
  expiry: "",
  statuses: { active: false, inactive: false, compact: false, originalState: false },
});

const newCertificate = (): Certificate => ({
  id: crypto.randomUUID(),
  module: "",
  dateCompleted: "",
  expirationDate: "",
  file: null,
});

const newAdditionalCert = (): AdditionalCert => ({
  id: crypto.randomUUID(),
  name: "",
  dateCompleted: "",
  expirationDate: "",
  file: null,
});

// ─── Shared UI Primitives ─────────────────────────────────────────────────────

const inputBase = "w-full bg-white rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#101935]/30 focus:border-[#101935] transition-all";

const errorInput = "border-red-400 focus:ring-red-300 focus:border-red-400";

const selectBase = "w-full bg-white rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#101935]/30 focus:border-[#101935] transition-all appearance-none cursor-pointer";

const sectionCard = " p-6 space-y-5";

const sectionHeading = "text-[#101935] font-bold text-base tracking-wide uppercase border-b border-[#101935]/20 pb-2";

const subHeading = "text-[#101935]/80 font-semibold text-sm";

const labelText = "block text-xs font-semibold text-[#101935]/70 uppercase tracking-wider mb-1";

const tealBtn = "inline-flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm";

const navyBtn = "inline-flex items-center gap-2 bg-[#101935] hover:bg-[#1a2d55] active:bg-[#0d1428] text-white text-sm font-semibold px-8 py-2.5 rounded-full transition-colors shadow-md";

const radioOption = (selected: boolean) =>
  `px-4 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all select-none ${
    selected
      ? "bg-[#101935] text-white border-[#101935] shadow-sm"
      : "bg-white text-gray-600 border-gray-200 hover:border-[#101935]/40 hover:text-[#101935]"
  }`;

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, required, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className={labelText}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

interface Step1Props {
  data: Step1State;
  onChange: (patch: Partial<Step1State>) => void;
  onAddressChange: (patch: Partial<Address>) => void;
  errors: FormErrors;
  shiftsExtra: string[];
  onAddShift: () => void;
  onRemoveShift: (idx: number) => void;
  onShiftChange: (idx: number, val: string) => void;
}

function Step1({
  data,
  onChange,
  onAddressChange,
  errors,
  shiftsExtra,
  onAddShift,
  onRemoveShift,
  onShiftChange,
}: Step1Props) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className={sectionCard}>
        <h3 className={sectionHeading}>Personal Information</h3>

        {/* Title */}
        <Field label="Title" required error={errors.title}>
          <div className="flex flex-wrap rounded-full gap-2">
            {TITLES.map((t) => (
              <span 
                key={t} 
                className={radioOption(data.title === t)} 
                onClick={() => onChange({ title: t })}>
                {t}
              </span>
            ))}
          </div>
        </Field>

        {/* DOB */}
        <Field label="Date of Birth" required error={errors.dob}>
          <input
            type="text"
            placeholder="DD / MM / YYYY"
            value={data.dob}
            onChange={(e) => onChange({ dob: e.target.value })}
            className={`!rounded-4xl ${inputBase} ${errors.dob ? errorInput : ""}`}
          />
        </Field>

        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="First Name" required error={errors.firstName}>
            <input
              type="text"
              placeholder="First Name"
              value={data.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              className={`${inputBase} ${errors.firstName ? errorInput : ""} !rounded-4xl`}
            />
          </Field>
          <Field label="Middle Name">
            <input
              type="text"
              placeholder="Middle Name"
              value={data.middleName}
              onChange={(e) => onChange({ middleName: e.target.value })}
              className={`!rounded-4xl ${inputBase}`}
            />
          </Field>
          <Field label="Last Name" required error={errors.lastName}>
            <input
              type="text"
              placeholder="Last Name"
              value={data.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              className={`${inputBase} ${errors.lastName ? errorInput : ""} !rounded-4xl`}
            />
          </Field>
        </div>

        {/* Address */}
        <Field label="Address Line 1" required error={errors.addressLine1}>
          <input
            type="text"
            placeholder="Address Line 1"
            value={data.address.line1}
            onChange={(e) => onAddressChange({ line1: e.target.value })}
            className={`${inputBase} ${errors.addressLine1 ? errorInput : ""} !rounded-4xl`}
          />
        </Field>
        <Field label="Address Line 2">
          <input
            type="text"
            placeholder="Address Line 2"
            value={data.address.line2}
            onChange={(e) => onAddressChange({ line2: e.target.value })}
            className={`!rounded-4xl ${inputBase}`}
          />
        </Field>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="City" required error={errors.city}>
            <input
              type="text"
              placeholder="City"
              value={data.address.city}
              onChange={(e) => onAddressChange({ city: e.target.value })}
              className={`${inputBase} ${errors.city ? errorInput : ""} !rounded-4xl`}
            />
          </Field>
          <Field label="State / Province / Region" required error={errors.stateRegion}>
            <input
              type="text"
              placeholder="State / Province"
              value={data.address.state}
              onChange={(e) => onAddressChange({ state: e.target.value })}
              className={`${inputBase} ${errors.stateRegion ? errorInput : ""} !rounded-4xl`}
            />
          </Field>
          <Field label="Postal / Zip Code" required error={errors.postal}>
            <input
              type="text"
              placeholder="Postal Code"
              value={data.address.postal}
              onChange={(e) => onAddressChange({ postal: e.target.value })}
              className={`${inputBase} ${errors.postal ? errorInput : ""} !rounded-4xl`}
            />
          </Field>
          <Field label="Country" required error={errors.country}>
            <input
              type="text"
              placeholder="Country"
              value={data.address.country}
              onChange={(e) => onAddressChange({ country: e.target.value })}
              className={`${inputBase} ${errors.country ? errorInput : ""} !rounded-4xl`}
            />
          </Field>
        </div>

        {/* US Eligibility */}
        <Field label="Are you eligible to work in the US?" required error={errors.usEligible}>
          <div className="flex gap-3 mt-1">
            {["Yes", "No"].map((v) => (
              <span key={v} className={radioOption(data.usEligible === v)} onClick={() => onChange({ usEligible: v })}>
                {v}
              </span>
            ))}
          </div>
        </Field>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email" required error={errors.email}>
            <input
              type="email"
              placeholder="email@example.com"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className={`${inputBase} ${errors.email ? errorInput : ""} !rounded-4xl`}
            />
          </Field>
          <Field label="Phone" required error={errors.phone}>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className={`${inputBase} ${errors.phone ? errorInput : ""} !rounded-4xl`}
            />
          </Field>
        </div>

        {/* Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date Available">
            <input
              type="text"
              placeholder="DD / MM / YYYY"
              value={data.dateAvailable}
              onChange={(e) => onChange({ dateAvailable: e.target.value })}
              className={`!rounded-4xl ${inputBase}`}
            />
          </Field>
          <Field label="Position Applying For">
            <input
              type="text"
              placeholder="Position title"
              value={data.positionApplying}
              onChange={(e) => onChange({ positionApplying: e.target.value })}
              className={`!rounded-4xl ${inputBase}`}
            />
          </Field>
        </div>
      </div>

      {/* Preferences */}
      <div className={sectionCard}>
        <h3 className={sectionHeading}>Preferences</h3>
        <p className={subHeading}>Preferences (Please choose preferred below)</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Field label="Shifts Preferred" required error={errors.shiftsPreferred}>
              <select
                value={data.shiftsPreferred}
                onChange={(e) => onChange({ shiftsPreferred: e.target.value })}
                className={`${selectBase} ${errors.shiftsPreferred ? errorInput : ""} !rounded-4xl`}
              >
                <option value="">Please Select*</option>
                {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <button type="button" onClick={onAddShift} className={tealBtn}>
              <span className="text-lg leading-none">+</span> Add Item
            </button>
            {shiftsExtra.map((val, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  value={val}
                  onChange={(e) => onShiftChange(idx, e.target.value)}
                  className={`${selectBase} flex-1 !rounded-4xl`}
                >
                  <option value="">Please Select*</option>
                  {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => onRemoveShift(idx)}
                  className="!rounded-4xl flex-shrink-0 text-red-400 hover:text-red-600 text-xs font-semibold transition-colors px-1"
                  aria-label="Remove shift"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <Field label="Type of Position" required error={errors.typeOfPosition}>
            <select
              value={data.typeOfPosition}
              onChange={(e) => onChange({ typeOfPosition: e.target.value })}
              className={`${selectBase} ${errors.typeOfPosition ? errorInput : ""} !rounded-4xl`}
            >
              <option value="">Please Select*</option>
              {POSITION_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Type of Contract" required error={errors.typeOfContract}>
            <select
              value={data.typeOfContract}
              onChange={(e) => onChange({ typeOfContract: e.target.value })}
              className={`${selectBase} ${errors.typeOfContract ? errorInput : ""} !rounded-4xl`}
            >
              <option value="">Please Select*</option>
              {CONTRACT_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Travel Experience */}
      <div className={sectionCard}>
        <h3 className={sectionHeading}>Travel Experience</h3>

        <Field label="Have you completed a Travel assignment before?" error={errors.travelAssignment}>
          <div className="flex gap-3 mt-1">
            {["Yes", "No"].map((v) => (
              <span key={v} className={radioOption(data.travelAssignment === v)} onClick={() => onChange({ travelAssignment: v })}>
                {v}
              </span>
            ))}
          </div>
        </Field>

        <Field label="How many years travel experience do you have?">
          <input
            type="text"
            placeholder="If yes, state"
            value={data.yearsTravel}
            onChange={(e) => onChange({ yearsTravel: e.target.value })}
            className={`!rounded-4xl ${inputBase}`}
          />
        </Field>
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

interface Step2Props {
  data: Step2State;
  onChange: (patch: Partial<Step2State>) => void;
  errors: FormErrors;
}

function Step2({ data, onChange, errors }: Step2Props) {
  const toggleState = (code: string) => {
    const already = data.selectedStates.includes(code);
    onChange({
      selectedStates: already
        ? data.selectedStates.filter((s) => s !== code)
        : [...data.selectedStates, code],
    });
  };

  const updateLicense = (id: string, patch: Partial<License>) => {
    onChange({
      licenses: data.licenses.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    });
  };

  const updateLicenseStatus = (id: string, key: keyof License["statuses"], val: boolean) => {
    onChange({
      licenses: data.licenses.map((l) =>
        l.id === id ? { ...l, statuses: { ...l.statuses, [key]: val } } : l
      ),
    });
  };

  const removeLicense = (id: string) => {
    onChange({ licenses: data.licenses.filter((l) => l.id !== id) });
  };

  const updateCert = (id: string, patch: Partial<Certificate>) => {
    onChange({ certificates: data.certificates.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  };

  const removeCert = (id: string) => {
    onChange({ certificates: data.certificates.filter((c) => c.id !== id) });
  };

  const updateAdditional = (id: string, patch: Partial<AdditionalCert>) => {
    onChange({ additionalCerts: data.additionalCerts.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  };

  const removeAdditional = (id: string) => {
    onChange({ additionalCerts: data.additionalCerts.filter((c) => c.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Category */}
      <div className={sectionCard}>
        <h3 className={sectionHeading}>Category | Disciplines | Specialities</h3>
        <Field label="Category" required error={errors.category}>
          <select
            value={data.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className={`!rounded-4xl ${selectBase} ${errors.category ? errorInput : ""}`}
          >
            <option value="">Please select</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      {/* Professional Licenses */}
      <div className={sectionCard}>
        <h3 className={sectionHeading}>Professional Licenses</h3>
        {data.licenses.map((lic, idx) => (
          <div key={lic.id} className="rounded-xl p-4 space-y-4 relative">
            <div className="flex items-center justify-between">
              <p className={subHeading}>• License {idx + 1}</p>
              {data.licenses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLicense(lic.id)}
                  className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="State">
                <select
                  value={lic.state}
                  onChange={(e) => updateLicense(lic.id, { state: e.target.value })}
                  className={selectBase}
                >
                  <option value="">Select State</option>
                  {US_STATES.map((s) => <option key={s.code} value={s.code}>{s.code} – {s.name}</option>)}
                </select>
              </Field>
              <Field label="License Number">
                <input
                  type="text"
                  placeholder="License Number"
                  value={lic.number}
                  onChange={(e) => updateLicense(lic.id, { number: e.target.value })}
                  className={inputBase}
                />
              </Field>
              <Field label="Expiry">
                <input
                  type="text"
                  placeholder="DD / MM / YYYY"
                  value={lic.expiry}
                  onChange={(e) => updateLicense(lic.id, { expiry: e.target.value })}
                  className={inputBase}
                />
              </Field>
            </div>
            <div className="flex flex-wrap gap-4">
              {(["active", "inactive", "compact", "originalState"] as const).map((key) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={lic.statuses[key]}
                    onChange={(e) => updateLicenseStatus(lic.id, key, e.target.checked)}
                    className="!rounded-4xl w-4 h-4 accent-teal-500 "
                  />
                  {key === "originalState" ? "Original State" : key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange({ licenses: [...data.licenses, newLicense()] })}
          className={tealBtn}
        >
          <span className="text-lg leading-none">+</span> Add License
        </button>
      </div>

      {/* State Selection Grid */}
      <div className={sectionCard}>
        <h3 className={sectionHeading}>States of Interest</h3>
        <p className="text-sm text-[#101935]/70 font-medium">
          What states are you interested in working in? (Please select all states required)
        </p>
        {errors.selectedStates && (
          <p className="text-red-500 text-xs">{errors.selectedStates}</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
          {US_STATES.map((s) => {
            const selected = data.selectedStates.includes(s.code);
            return (
              <button
                key={s.code}
                type="button"
                onClick={() => toggleState(s.code)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                  selected
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                    selected ? "bg-teal-400 border-teal-300" : "border-gray-300 bg-white"
                  }`}
                />
                <span>
                  <span className="font-bold">{s.code}</span> – {s.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mandatory Certification */}
      <div className={sectionCard}>
        <h3 className={sectionHeading}>Mandatory Certification</h3>
        <div className="rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="flex items-center">
              <span className="text-sm font-bold text-[#101935] bg-teal-100 px-3 py-2.5 rounded-xl w-full text-center">
                BLS / CPR
              </span>
            </div>
            <Field label="Date Completed">
              <input
                type="text"
                placeholder="DD / MM / YYYY"
                value={data.blsDateCompleted}
                onChange={(e) => onChange({ blsDateCompleted: e.target.value })}
                className={inputBase}
              />
            </Field>
            <Field label="Expiration Date">
              <input
                type="text"
                placeholder="DD / MM / YYYY"
                value={data.blsExpiration}
                onChange={(e) => onChange({ blsExpiration: e.target.value })}
                className={inputBase}
              />
            </Field>
            <Field label="File Upload">
              <div className="relative">
                <input
                  type="file"
                  id="bls-file"
                  className="hidden"
                  onChange={(e) => onChange({ blsFile: e.target.files?.[0] ?? null })}
                />
                <label
                  htmlFor="bls-file"
                  className={`${inputBase} flex items-center justify-between cursor-pointer`}
                >
                  <span className="text-gray-400 truncate text-xs">
                    {data.blsFile ? data.blsFile.name : "No file chosen"}
                  </span>
                  <span className="ml-2 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-lg flex-shrink-0">
                    + Upload
                  </span>
                </label>
              </div>
            </Field>
          </div>
        </div>
      </div>

      {/* Additional Training Certification */}
      <div className={sectionCard}>
        <h3 className={sectionHeading}>Additional Training Certification</h3>
        <p className={subHeading}>Please add all certificates held</p>
        {data.certificates.map((cert, idx) => (
          <div key={cert.id} className="bg-white/50 rounded-xl p-4 border border-white/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 tracking-widest">
                CERTIFICATE {idx + 1}
              </span>
              {data.certificates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCert(cert.id)}
                  className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <Field label="Training Module" required>
                <select
                  value={cert.module}
                  onChange={(e) => updateCert(cert.id, { module: e.target.value })}
                  className={selectBase}
                >
                  <option value="">Please Select</option>
                  {TRAINING_MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Date Completed">
                <input
                  type="text"
                  placeholder="DD / MM / YYYY"
                  value={cert.dateCompleted}
                  onChange={(e) => updateCert(cert.id, { dateCompleted: e.target.value })}
                  className={inputBase}
                />
              </Field>
              <Field label="Expiration Date">
                <input
                  type="text"
                  placeholder="DD / MM / YYYY"
                  value={cert.expirationDate}
                  onChange={(e) => updateCert(cert.id, { expirationDate: e.target.value })}
                  className={inputBase}
                />
              </Field>
              <Field label="File Upload">
                <div className="relative">
                  <input
                    type="file"
                    id={`cert-file-${cert.id}`}
                    className="hidden"
                    onChange={(e) => updateCert(cert.id, { file: e.target.files?.[0] ?? null })}
                  />
                  <label
                    htmlFor={`cert-file-${cert.id}`}
                    className={`${inputBase} flex items-center justify-between cursor-pointer`}
                  >
                    <span className="text-gray-400 truncate text-xs">
                      {cert.file ? cert.file.name : "No file chosen"}
                    </span>
                    <span className="ml-2 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-lg flex-shrink-0">
                      + Upload
                    </span>
                  </label>
                </div>
              </Field>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange({ certificates: [...data.certificates, newCertificate()] })}
          className={tealBtn}
        >
          <span className="text-lg leading-none">+</span> Add Item
        </button>
      </div>

      {/* Additional Training Completed */}
      <div className={sectionCard}>
        <h3 className={sectionHeading}>Additional Training Completed</h3>
        <p className={subHeading}>
          Please add any additional certificate of training held not on the drop-down
        </p>
        {data.additionalCerts.map((cert, idx) => (
          <div key={cert.id} className="bg-white/50 rounded-xl p-4 border border-white/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 tracking-widest">
                CERTIFICATE {idx + 1}
              </span>
              {data.additionalCerts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAdditional(cert.id)}
                  className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <Field label="Certificate Name">
                <input
                  type="text"
                  placeholder="Certificate name"
                  value={cert.name}
                  onChange={(e) => updateAdditional(cert.id, { name: e.target.value })}
                  className={inputBase}
                />
              </Field>
              <Field label="Date Completed">
                <input
                  type="text"
                  placeholder="DD / MM / YYYY"
                  value={cert.dateCompleted}
                  onChange={(e) => updateAdditional(cert.id, { dateCompleted: e.target.value })}
                  className={inputBase}
                />
              </Field>
              <Field label="Expiration Date">
                <input
                  type="text"
                  placeholder="DD / MM / YYYY"
                  value={cert.expirationDate}
                  onChange={(e) => updateAdditional(cert.id, { expirationDate: e.target.value })}
                  className={inputBase}
                />
              </Field>
              <Field label="File Upload">
                <div className="relative">
                  <input
                    type="file"
                    id={`add-cert-file-${cert.id}`}
                    className="hidden"
                    onChange={(e) => updateAdditional(cert.id, { file: e.target.files?.[0] ?? null })}
                  />
                  <label
                    htmlFor={`add-cert-file-${cert.id}`}
                    className={`${inputBase} flex items-center justify-between cursor-pointer`}
                  >
                    <span className="text-gray-400 truncate text-xs">
                      {cert.file ? cert.file.name : "No file chosen"}
                    </span>
                    <span className="ml-2 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-lg flex-shrink-0">
                      + Upload
                    </span>
                  </label>
                </div>
              </Field>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange({ additionalCerts: [...data.additionalCerts, newAdditionalCert()] })}
          className={tealBtn}
        >
          <span className="text-lg leading-none">+</span> Add Item
        </button>
      </div>
    </div>
  );
}

// ─── Root Form ────────────────────────────────────────────────────────────────

const initialStep1: Step1State = {
  title: "",
  dob: "",
  firstName: "",
  middleName: "",
  lastName: "",
  address: { line1: "", line2: "", city: "", state: "", postal: "", country: "" },
  usEligible: "",
  email: "",
  phone: "",
  dateAvailable: "",
  positionApplying: "",
  shiftsPreferred: "",
  typeOfPosition: "",
  typeOfContract: "",
  travelAssignment: "",
  yearsTravel: "",
  shiftsExtraValues: [],
};

const initialStep2: Step2State = {
  category: "",
  licenses: [newLicense()],
  selectedStates: [],
  blsDateCompleted: "",
  blsExpiration: "",
  blsFile: null,
  certificates: [newCertificate()],
  additionalCerts: [newAdditionalCert()],
};

export default function WorkWithUsForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [step1, setStep1] = useState<Step1State>(initialStep1);
  const [step2, setStep2] = useState<Step2State>(initialStep2);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleStep1Change = useCallback((patch: Partial<Step1State>) => {
    setStep1((prev) => ({ ...prev, ...patch }));
    const keys = Object.keys(patch) as (keyof Step1State)[];
    setErrors((prev) => {
      const next = { ...prev };
      keys.forEach((k) => delete next[k as string]);
      return next;
    });
  }, []);

  const handleAddShift = useCallback(() => {
    setStep1((prev) => ({ ...prev, shiftsExtraValues: [...prev.shiftsExtraValues, ""] }));
  }, []);

  const handleRemoveShift = useCallback((idx: number) => {
    setStep1((prev) => ({
      ...prev,
      shiftsExtraValues: prev.shiftsExtraValues.filter((_, i) => i !== idx),
    }));
  }, []);

  const handleShiftChange = useCallback((idx: number, val: string) => {
    setStep1((prev) => ({
      ...prev,
      shiftsExtraValues: prev.shiftsExtraValues.map((v, i) => (i === idx ? val : v)),
    }));
  }, []);

  const handleAddressChange = useCallback((patch: Partial<Address>) => {
    setStep1((prev) => ({ ...prev, address: { ...prev.address, ...patch } }));
    const keyMap: Record<keyof Address, string> = {
      line1: "addressLine1", line2: "addressLine2", city: "city",
      state: "stateRegion", postal: "postal", country: "country",
    };
    setErrors((prev) => {
      const next = { ...prev };
      (Object.keys(patch) as (keyof Address)[]).forEach((k) => delete next[keyMap[k]]);
      return next;
    });
  }, []);

  const handleStep2Change = useCallback((patch: Partial<Step2State>) => {
    setStep2((prev) => ({ ...prev, ...patch }));
    const keys = Object.keys(patch) as (keyof Step2State)[];
    setErrors((prev) => {
      const next = { ...prev };
      keys.forEach((k) => delete next[k as string]);
      return next;
    });
  }, []);

  const validateStep1 = (): FormErrors => {
    const e: FormErrors = {};
    if (!step1.title) e.title = "Please select a title";
    if (!step1.dob) e.dob = "Date of birth is required";
    if (!step1.firstName) e.firstName = "First name is required";
    if (!step1.lastName) e.lastName = "Last name is required";
    if (!step1.address.line1) e.addressLine1 = "Address line 1 is required";
    if (!step1.address.city) e.city = "City is required";
    if (!step1.address.state) e.stateRegion = "State / Region is required";
    if (!step1.address.postal) e.postal = "Postal code is required";
    if (!step1.address.country) e.country = "Country is required";
    if (!step1.usEligible) e.usEligible = "Please indicate US work eligibility";
    if (!step1.email) e.email = "Email is required";
    if (!step1.phone) e.phone = "Phone is required";
    if (!step1.shiftsPreferred) e.shiftsPreferred = "Please select a shift";
    if (!step1.typeOfPosition) e.typeOfPosition = "Please select a position type";
    if (!step1.typeOfContract) e.typeOfContract = "Please select a contract type";
    return e;
  };

  const validateStep2 = (): FormErrors => {
    const e: FormErrors = {};
    if (!step2.category) e.category = "Please select a category";
    return e;
  };

  const handleContinue = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // const handleSubmit = () => {
  //   const errs = validateStep2();
  //   if (Object.keys(errs).length > 0) {
  //     setErrors(errs);
  //     return;
  //   }
  //   setErrors({});
  //   setSubmitted(true);
  // };

  const handleSubmit = async () => {
  const errs = validateStep2();
  if (Object.keys(errs).length > 0) { setErrors(errs); return; }
  setErrors({});

  const result = await sendWorkWithUsEmail({
    // Step 1
    title: step1.title, dob: step1.dob,
    firstName: step1.firstName, middleName: step1.middleName, lastName: step1.lastName,
    addressLine1: step1.address.line1, addressLine2: step1.address.line2,
    city: step1.address.city, stateRegion: step1.address.state,
    postal: step1.address.postal, country: step1.address.country,
    usEligible: step1.usEligible, email: step1.email, phone: step1.phone,
    dateAvailable: step1.dateAvailable, positionApplying: step1.positionApplying,
    shiftsPreferred: step1.shiftsPreferred, shiftsExtra: step1.shiftsExtraValues,
    typeOfPosition: step1.typeOfPosition, typeOfContract: step1.typeOfContract,
    travelAssignment: step1.travelAssignment, yearsTravel: step1.yearsTravel,
    // Step 2
    category: step2.category, licenses: step2.licenses,
    selectedStates: step2.selectedStates,
    blsDateCompleted: step2.blsDateCompleted, blsExpiration: step2.blsExpiration,
    certificates: step2.certificates, additionalCerts: step2.additionalCerts,
  });

  if (result.success) setSubmitted(true);
  else setErrors({ submit: "Submission failed. Please try again." });
};

  const STEPS = [
    { n: 1, label: "Personal Information" },
    { n: 2, label: "Licenses & Certifications" },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#7F92A3] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#101935] mb-2">Application Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Thank you, {step1.firstName}. We'll review your application and be in touch shortly.
          </p>
          <button
            type="button"
            onClick={() => { setSubmitted(false); setStep(1); setStep1(initialStep1); setStep2(initialStep2); }}
            className={navyBtn}
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {/* Background */}
      <div className="fixed inset-0 bg-[#7E98A6] z-0" />
      <div
        className="fixed inset-0 z-0 opacity-40"
      />

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight drop-shadow">
            Work With Us
          </h1>
          <p className="text-white/70 text-sm mt-1">Complete all required fields marked with an asterisk (*)</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <button
                type="button"
                onClick={() => { if (s.n < step) setStep(s.n as 1 | 2); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  step === s.n
                    ? "bg-[#101935] text-white shadow-md"
                    : s.n < step
                    ? "bg-white/30 text-white hover:bg-white/40 cursor-pointer"
                    : "bg-white/15 text-white/50 cursor-default"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    step === s.n ? "bg-teal-400 text-[white]" : s.n < step ? "bg-teal-500 text-white" : "bg-white/20 text-white/50"
                  }`}
                >
                  {s.n < step ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s.n}
                </span>
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-6 mx-1 rounded ${step > s.n ? "bg-teal-400" : "bg-white/20"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        {step === 1 && (
          <Step1
            data={step1}
            onChange={handleStep1Change}
            onAddressChange={handleAddressChange}
            errors={errors}
            shiftsExtra={step1.shiftsExtraValues}
            onAddShift={handleAddShift}
            onRemoveShift={handleRemoveShift}
            onShiftChange={handleShiftChange}
          />
        )}

        {step === 2 && (
          <Step2
            data={step2}
            onChange={handleStep2Change}
            errors={errors}
          />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <div>
            {step === 2 && (
              <button
                type="button"
                onClick={() => { setStep(1); setErrors({}); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
          </div>
          <div>
            {step === 1 ? (
              <button type="button" onClick={handleContinue} className={navyBtn}>
                Continue
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} className={navyBtn}>
                Submit Application
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}