import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOrCreateUUID() {
  let uuid = localStorage.getItem("browserUUID");
  if (!uuid) {
    uuid = generateUUID();
    localStorage.setItem("browserUUID", uuid);
  }
  return uuid;
}

export function generateUUID() {
  // Generate a random UUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function qrLink(imagelink: string) {
  return `https://quickchart.io/qr?text=${imagelink}`;
}
export const logoPath = (logo: string) => {
  return `/logos/${logo}`;
};
