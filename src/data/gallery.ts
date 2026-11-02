export type WeddingGalleryPhoto = {
  id: string;
  imageId: string;
  alt: string;
  orientation: "portrait" | "landscape";
  caption: string;
};

const sampleCaption = "Wedding inspiration · Sample photograph";

export const weddingGallery: WeddingGalleryPhoto[] = [
  {
    id: "gallery-one",
    imageId: "/images/aashma-diwas.jpeg",
    alt: "Aashma Timilsina and Diwas Sapkota in their wedding attire.",
    orientation: "portrait",
    caption: "Aashma & Diwas · Their wedding portrait",
  },
  {
    id: "gallery-two",
    imageId: "photo-1529636798458-92182e662485",
    alt: "Sample stock wedding photograph; replace with a portrait of the couple.",
    orientation: "portrait",
    caption: sampleCaption,
  },
  {
    id: "gallery-three",
    imageId: "photo-1530023367847-a683933f4172",
    alt: "Sample stock wedding photograph of a celebration; not a memory from the couple.",
    orientation: "landscape",
    caption: sampleCaption,
  },
  {
    id: "gallery-four",
    imageId: "photo-1519167758481-83f550bb49b3",
    alt: "Sample stock photograph of a wedding venue; replace with the couple’s venue photograph.",
    orientation: "landscape",
    caption: sampleCaption,
  },
  {
    id: "gallery-five",
    imageId: "photo-1519741497674-611481863552",
    alt: "Sample stock photograph of wedding flowers and details; not a photograph of the couple.",
    orientation: "portrait",
    caption: sampleCaption,
  },
  {
    id: "gallery-six",
    imageId: "photo-1511285560929-80b456fea0bc",
    alt: "Sample stock photograph of a wedding celebration; replace with a real photograph of the couple.",
    orientation: "landscape",
    caption: sampleCaption,
  },
];

export function weddingPhotoUrl(imageId: string, width: number) {
  if (imageId.startsWith("/")) return imageId;
  return `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=${width}&q=85`;
}
