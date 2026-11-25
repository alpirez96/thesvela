/**
 * Delivery countries offered at checkout (English names, as iyzico expects
 * free-text country names). Turkey first, the rest alphabetical. `dial` is
 * the calling code used to normalise local phone numbers.
 */
export interface Country {
  name: string;
  dial: string;
}

export const DEFAULT_COUNTRY = "Turkey";

export const COUNTRIES: readonly Country[] = [
  { name: "Turkey", dial: "90" },
  { name: "Albania", dial: "355" },
  { name: "Australia", dial: "61" },
  { name: "Austria", dial: "43" },
  { name: "Azerbaijan", dial: "994" },
  { name: "Bahrain", dial: "973" },
  { name: "Belgium", dial: "32" },
  { name: "Bulgaria", dial: "359" },
  { name: "Canada", dial: "1" },
  { name: "Croatia", dial: "385" },
  { name: "Cyprus", dial: "357" },
  { name: "Czech Republic", dial: "420" },
  { name: "Denmark", dial: "45" },
  { name: "Estonia", dial: "372" },
  { name: "Finland", dial: "358" },
  { name: "France", dial: "33" },
  { name: "Georgia", dial: "995" },
  { name: "Germany", dial: "49" },
  { name: "Greece", dial: "30" },
  { name: "Hong Kong", dial: "852" },
  { name: "Hungary", dial: "36" },
  { name: "Iceland", dial: "354" },
  { name: "Ireland", dial: "353" },
  { name: "Israel", dial: "972" },
  { name: "Italy", dial: "39" },
  { name: "Japan", dial: "81" },
  { name: "Kuwait", dial: "965" },
  { name: "Latvia", dial: "371" },
  { name: "Lithuania", dial: "370" },
  { name: "Luxembourg", dial: "352" },
  { name: "Malta", dial: "356" },
  { name: "Monaco", dial: "377" },
  { name: "Montenegro", dial: "382" },
  { name: "Netherlands", dial: "31" },
  { name: "New Zealand", dial: "64" },
  { name: "North Macedonia", dial: "389" },
  { name: "Norway", dial: "47" },
  { name: "Oman", dial: "968" },
  { name: "Poland", dial: "48" },
  { name: "Portugal", dial: "351" },
  { name: "Qatar", dial: "974" },
  { name: "Romania", dial: "40" },
  { name: "Saudi Arabia", dial: "966" },
  { name: "Serbia", dial: "381" },
  { name: "Singapore", dial: "65" },
  { name: "Slovakia", dial: "421" },
  { name: "Slovenia", dial: "386" },
  { name: "South Africa", dial: "27" },
  { name: "South Korea", dial: "82" },
  { name: "Spain", dial: "34" },
  { name: "Sweden", dial: "46" },
  { name: "Switzerland", dial: "41" },
  { name: "United Arab Emirates", dial: "971" },
  { name: "United Kingdom", dial: "44" },
  { name: "United States", dial: "1" },
];

export function getCountry(name: string): Country | undefined {
  return COUNTRIES.find((c) => c.name === name);
}
