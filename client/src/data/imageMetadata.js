const imageMetadata = {
  "/images/home/desktop-home-hero.webp": { width: 1672, height: 941 },
  "/images/home/phone-home-hero.webp": { width: 941, height: 1672 },
  "/images/logo/web-district-logo.webp": { width: 1254, height: 1254 },
  "/images/projects/akm-cover.webp": { width: 544, height: 516 },
  "/images/projects/atheer-cover.webp": { width: 781, height: 656 },
  "/images/projects/byjojo-cover.webp": { width: 1024, height: 1024 },
  "/images/projects/davinto-cover.webp": { width: 1254, height: 1254 },
  "/images/projects/freshcart-cover.webp": { width: 859, height: 850 },
  "/images/projects/ms-cover.webp": { width: 1254, height: 1254 },
  "/images/projects/s8-cover.webp": { width: 528, height: 413 },
  "/images/projects/salahframe-cover.webp": { width: 1254, height: 1254 },
  "/images/projects/travco-cover.webp": { width: 1254, height: 1254 },
  "/images/projects/zohour-cover.webp": { width: 1021, height: 800 },
  "/images/brands-logos/akm-logo.webp": { width: 544, height: 516 },
  "/images/brands-logos/atheer-logo.webp": { width: 781, height: 656 },
  "/images/brands-logos/byjojo-logo.webp": { width: 1024, height: 1024 },
  "/images/brands-logos/davinto-logo.webp": { width: 1254, height: 1254 },
  "/images/brands-logos/freshcart-logo.webp": { width: 859, height: 850 },
  "/images/brands-logos/ms-logo.webp": { width: 1254, height: 1254 },
  "/images/brands-logos/s8-logo.webp": { width: 528, height: 413 },
  "/images/brands-logos/salahframe-logo.webp": { width: 1254, height: 1254 },
  "/images/brands-logos/travco-logo.webp": { width: 1254, height: 1254 },
  "/images/brands-logos/zohour-logo.webp": { width: 1021, height: 800 },
};

for (const slug of [
  "akm",
  "atheer",
  "byjojo",
  "davinto",
  "fresh-cart",
  "ms-store",
  "s8-factory",
  "salah-frame",
  "travco",
  "zohour",
]) {
  for (let index = 1; index <= 3; index += 1) {
    imageMetadata[
      `/images/projects/showcases/${slug}-showcase-${String(index).padStart(2, "0")}.webp`
    ] = { width: 1080, height: 1350 };
  }
}

export const getImageMetadata = (source) =>
  imageMetadata[typeof source === "string" ? source : source?.src] || {};

export default imageMetadata;
