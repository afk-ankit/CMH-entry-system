import { IEntryForm } from "@/app/entry/EntryForm";
import { IForm } from "@/app/exit/ExitForm";
import { type ClassValue, clsx } from "clsx";
import { jwtVerify, SignJWT } from "jose";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const HOSTEL_LATITUDE = 26.701569370515426;
export const HOSTEL_LONGITUDE = 92.83623619883863;
export const GEOFENCE_RADIUS = 50;
export const ACCURACCY_THRESHOLD = 100;

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export const reasons = [
  {
    value: "home",
    label: "Going home",
  },
  {
    value: "project",
    label: "Project work",
  },
  {
    value: "canteen",
    label: "Canteen for eating",
  },
  {
    value: "sports",
    label: "Play sports",
  },
  {
    value: "library",
    label: "Library for studying",
  },
  {
    value: "department",
    label: "Department for studying",
  },
  {
    value: "group-study",
    label: "Group study",
  },
  {
    value: "others",
    label: "Others",
  },
];

export const LOCAL_STORAGE_EXIT_KEY = "exit-form-data";
export const LOCAL_STORAGE_ENTRY_KEY = "entry-form-data";

//function to save the data in localStorage
export const saveToLocalStorage = (data: IForm | IEntryForm, key: string) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save form data to localStorage:", error);
  }
};
// Function to load form data from localStorage
export const loadFromLocalStorage = (key: string): IForm | null => {
  try {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error("Failed to load form data from localStorage:", error);
  }
  return null;
};

const secretKey = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_JOSE as string,
);

export async function signToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("3m") // Token expires in 2 hours
    .sign(secretKey);

  return token;
}

// Function to verify a JWT token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
