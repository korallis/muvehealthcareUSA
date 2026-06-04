export interface PathAssetConfig {
  topPatternSrc: string;
  heroImageSrc: string;
}

export interface PathTextConfig {
  fallbackTitleBrand: string;
  fallbackTitleText: string;
  paragraphs: string[];
  ctaButtonText: string;
  ctaButtonHref: string;
}

export const PATH_ASSETS: PathAssetConfig = {
  topPatternSrc: "/care-path-pattern.svg",
  heroImageSrc: "/young-man.png",
};

export const PATH_TEXT_CONTENT: PathTextConfig = {
  fallbackTitleBrand: "Muve",
  fallbackTitleText: "Our Way",
  paragraphs: [
    "At MUVE Healthcare, we connect healthcare professionals with meaningful opportunities and support clients with reliable, high-quality staffing solutions.",
    "Whether you're looking for flexibility, career progression or dependable coverage, we make the process simple, transparent and effective."
  ],
  ctaButtonText: "Get in Touch",
  ctaButtonHref: "#Contact",
};
