import { z } from "zod";

const NAME_RE = /^\p{L}+\.?(?:(?: +|['’-])\p{L}+\.?)*$/u; // letters only, single separators, no trailing "---"
const BLOCKED_WORDS = new Set([
  "test", "testing", "demo", "dummy", "fake", "sample", "asdf", "asdfgh",
  "qwerty", "abc", "abcd", "xyz", "name", "fullname",
]);
const EMAIL_RE =
  /^[a-z0-9](?:[a-z0-9._%+-]{1,62}[a-z0-9])@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;
const BAD_EMAIL_LOCAL = /^(test|testing|demo|abc|asdf|xyz|na|none|noemail)\d*$/i;
const TYPO_DOMAINS = new Set([
  "gmial.com", "gmai.com", "gmail.co", "gmail.con", "gmil.com", "gamil.com",
  "gnail.com", "yahho.com", "yaho.com", "hotmial.com", "hotmal.com", "outlok.com",
]);
const BLOCKED_EMAIL_DOMAINS = new Set([
  "example.com", "example.org", "test.com", "domain.com",
  "mailinator.com", "yopmail.com", "tempmail.com", "guerrillamail.com",
]);
const CITY_RE = /^\p{L}+(?:[ .'’-]\p{L}+)*$/u;

// "+91 98765-43210", "09876543210", "919876543210" -> "9876543210"
export const normalizePhone = (raw) => {
  let d = String(raw || "").replace(/[\s\-().]/g, "");
  if (d.startsWith("+91")) d = d.slice(3);
  else if (d.startsWith("0091")) d = d.slice(4);
  else if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d;
};

const isFakeNumber = (n) => {
  // one digit used 7+ times: 7777777777, 9111111111
  if ([...new Set(n)].some((ch) => n.split(ch).length - 1 >= 7)) return true;
  // 6+ ascending/descending run: 9876543210, 9123456789
  for (let i = 0; i <= n.length - 6; i++) {
    const s = n.slice(i, i + 6);
    if ("0123456789".includes(s) || "9876543210".includes(s)) return true;
  }
  // repeating blocks: 9898989898, 9876598765
  return /^(\d{2})\1{4}$/.test(n) || /^(\d{5})\1$/.test(n);
};

// export const leadSchema = z.object({
//   fullName: z
//     .string()
//     .trim()
//     .min(2, "Enter your full name")
//     .max(60, "Name is too long")
//     .regex(NAME_RE, "Use letters only (no numbers or symbols)")
//     .refine((v) => (v.match(/\p{L}/gu) || []).length >= 2, "Enter your full name")
//     .refine(
//       (v) => !v.toLowerCase().split(/[\s.'’-]+/).some((w) => BLOCKED_WORDS.has(w)),
//       "Please enter your real name"
//     ),
//   contact: z
//     .string()
//     .trim()
//     .min(1, "Enter your mobile number")
//     .refine((v) => /^[6-9]\d{9}$/.test(normalizePhone(v)), "Enter a valid 10-digit Indian mobile number")
//     .refine((v) => !isFakeNumber(normalizePhone(v)), "Please enter your real mobile number"),
//   email: z
//     .string()
//     .trim()
//     .min(1, "Enter your email address")
//     .max(100, "Email is too long")
//     .refine((v) => EMAIL_RE.test(v) && !v.includes(".."), "Enter a valid email address")
//     .refine((v) => !BAD_EMAIL_LOCAL.test(v.split("@")[0]), "Please enter your real email address")
//     .refine((v) => !TYPO_DOMAINS.has(v.split("@")[1]?.toLowerCase()), "Check the email domain for a typo"),
//   place: z
//     .string()
//     .trim()
//     .max(50, "City name is too long")
//     .refine((v) => v === "" || CITY_RE.test(v), "City can only contain letters"),
//   property: z.string(),
//   termsAndConditions: z
//     .boolean()
//     .refine((v) => v === true, "Please agree to the Privacy Policy and terms"),
//   website: z.string().optional(), // honeypot, hidden from real users
// });


const makeNameField = (label) =>
  z
    .string()
    .trim()
    .min(2, `Enter your ${label}`)
    .max(60, "Name is too long")
    .regex(NAME_RE, "Use letters only (no numbers or symbols)")
    .refine((v) => (v.match(/\p{L}/gu) || []).length >= 2, `Enter your ${label}`)
    .refine((v) => !/(\p{L})\1{3,}/iu.test(v), "Please enter your real name") // "aaaa bbbb"
    .refine(
      (v) => !v.toLowerCase().split(/[\s.'’-]+/).some((w) => BLOCKED_WORDS.has(w)),
      "Please enter your real name"
    );

const fullNameField = makeNameField("full name");

const phoneField = z
  .string()
  .trim()
  .min(1, "Enter your mobile number")
  .refine((v) => /^[6-9]\d{9}$/.test(normalizePhone(v)), "Enter a valid 10-digit Indian mobile number")
  .refine((v) => !isFakeNumber(normalizePhone(v)), "Please enter your real mobile number");

const emailField = z
  .string()
  .trim()
  .min(1, "Enter your email address")
  .max(100, "Email is too long")
  .refine((v) => EMAIL_RE.test(v) && !v.includes(".."), "Enter a valid email address")
  .refine((v) => !BAD_EMAIL_LOCAL.test(v.split("@")[0]), "Please enter your real email address")
  .refine((v) => !TYPO_DOMAINS.has(v.split("@")[1]?.toLowerCase()), "Check the email domain for a typo")
  .refine((v) => !BLOCKED_EMAIL_DOMAINS.has(v.split("@")[1]?.toLowerCase()), "Please enter your personal email address");

const placeField = z
  .string()
  .trim()
  .min(2, "Enter your city")
  .max(50, "City name is too long")
  .refine((v) => CITY_RE.test(v), "City can only contain letters")
  .refine((v) => !BLOCKED_WORDS.has(v.toLowerCase()), "Please enter your real city");

const queryField = z
  .string()
  .trim()
  .min(5, "Please enter at least 5 characters")
  .max(500, "Message is too long")
  .refine((v) => !/(.)\1{5,}/.test(v), "Please enter a meaningful message");

const termsField = z
  .boolean()
  .refine((v) => v === true, "Please agree to the Privacy Policy and terms");

export const leadSchema = z.object({
  fullName: fullNameField,
  contact: phoneField,
  email: emailField,
  place: placeField,
    query: queryField,
  termsAndConditions: termsField,
  website: z.string().optional(), // honeypot, hidden from real users
});

const jobTitleField = z
  .string()
  .trim()
  .min(2, "Enter the job position")
  .max(60, "Job position is too long")
  .regex(/^[\p{L}0-9][\p{L}0-9 .,'’&/()+-]*$/u, "Job position contains invalid characters")
  .refine((v) => (v.match(/\p{L}/gu) || []).length >= 2, "Enter a valid job position")
  .refine((v) => !/(.)\1{3,}/u.test(v), "Please enter a real job position")
  .refine(
    (v) => !v.toLowerCase().split(/[\s.,'’&/()+-]+/).some((w) => BLOCKED_WORDS.has(w)),
    "Please enter a real job position"
  );

// One validator for every form. Maps each form's own field names to the shared rules.
const FIELD_SCHEMAS = {
  fullName: fullNameField,
  firstName: makeNameField("first name"),
  lastName: makeNameField("last name"),
  contact: phoneField,
  contactNo: phoneField,
  mobile: phoneField,
  email: emailField,
  place: placeField,
    jobTitle: jobTitleField,
  location: placeField,
  query: queryField,
  termsAndConditions: termsField,
  termsAccepted: termsField,
};

export const validateLeadField = (name, value) => {
  const schema = FIELD_SCHEMAS[name];
  if (!schema) return "";
  const result = schema.safeParse(value);
  return result.success ? "" : result.error.issues[0].message;
};