export interface SpecialityItem {
  id: number;
  title: string;
  description: string;
  image: string;
  alt: string;
}

export const GOODBYE_ITEMS: string[] = [
  "Overpromising recruiters",
  "Onboarding delays",
  "Costly cancellations",
];

export const HELLO_ITEMS: string[] = [
  "Right first time",
  "Clear communication",
  "Reliable support",
];

export const SPECIALITIES_DATA: SpecialityItem[] = [
  {
    id: 1,
    title: "Allied Health",
    description: "We provide allied health professionals across surgery, respiratory care, laboratories, pharmacy, radiology, cardiovascular services and therapy roles.",
    image: "/specialties/allied.svg",
    alt: "Allied Health professionals smiling",
  },
  {
    id: 2,
    title: "Nurses",
    description: "We provide nurses across acute care, palliative care, rehabilitation, outpatient services and ambulatory care.",
    image: "/specialties/nurses.svg",
    alt: "Nurse smiling at camera",
  },
  {
    id: 3,
    title: "Physicians, APRNs and Locum Tenens",
    description: "We provide physicians, APRNs and locum tenens professionals across all specialties.",
    image: "/specialties/physicians.svg",
    alt: "Physicians and medical staff",
  },
];

export const SPECIALITIES_ASSETS = {
  bgSquiggles: "/patterns/bg-squiggles.svg",
  getStartedHref: "ApplicationForm"
};
