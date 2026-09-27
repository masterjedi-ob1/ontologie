/**
 * Illustrative sample ontology for Northeast Ohio. Wages, openings, costs and
 * program details are placeholders for the demo, NOT sourced figures. The UI
 * marks every screen "Sample data" while this set is in use.
 */
import type { Ontology, RoleSkill, TalentSkill, Evidence } from "./types";

const skills: Ontology["skills"] = [
  // technical
  ["hw-troubleshoot", "Hardware troubleshooting", "technical"],
  ["os-admin", "Windows / macOS administration", "technical"],
  ["networking", "Networking fundamentals", "technical"],
  ["ticketing", "Help desk ticketing (ServiceNow/Jira)", "technical"],
  ["active-dir", "Active Directory & identity", "technical"],
  ["scripting", "Scripting (PowerShell / Python)", "technical"],
  ["sql", "SQL querying", "technical"],
  ["spreadsheets", "Spreadsheets & data cleanup", "technical"],
  ["data-viz", "Data visualization", "technical"],
  ["security-basics", "Security fundamentals", "technical"],
  ["siem", "SIEM & log analysis", "technical"],
  ["cloud-basics", "Cloud fundamentals (AWS/Azure)", "technical"],
  ["crm", "CRM tools (Salesforce/HubSpot)", "technical"],
  ["plc", "PLC & industrial controls", "technical"],
  ["cnc", "CNC operation", "technical"],
  ["blueprint", "Blueprint reading", "technical"],
  // durable
  ["customer-service", "Customer service", "durable"],
  ["communication", "Clear written & verbal communication", "durable"],
  ["problem-solving", "Structured problem solving", "durable"],
  ["teamwork", "Teamwork & collaboration", "durable"],
  ["time-mgmt", "Time management", "durable"],
  ["attention-detail", "Attention to detail", "durable"],
  ["cash-handling", "Cash handling & POS", "durable"],
  ["safety", "Workplace safety mindset", "durable"],
  // credentials
  ["google-it", "Google IT Support Certificate", "credential"],
  ["comptia-a", "CompTIA A+", "credential"],
  ["comptia-net", "CompTIA Network+", "credential"],
  ["comptia-sec", "CompTIA Security+", "credential"],
  ["google-da", "Google Data Analytics Certificate", "credential"],
  ["osha-10", "OSHA 10", "credential"],
].map(([id, name, category]) => ({ id, name, category })) as Ontology["skills"];

const roles: Ontology["roles"] = [
  { id: "it-support", title: "IT Support Specialist", soc_code: "15-1232", median_wage: 52000, openings: 410, entry_education: "Certificate or some college", summary: "First line of tech support: devices, accounts, and tickets." },
  { id: "help-desk", title: "Help Desk Technician", soc_code: "15-1232", median_wage: 44000, openings: 380, entry_education: "High school + certificate", summary: "Resolves user issues by phone, chat, and walk-up." },
  { id: "network-tech", title: "Network Support Technician", soc_code: "15-1231", median_wage: 61000, openings: 150, entry_education: "Certificate or associate", summary: "Keeps switches, Wi-Fi, and connectivity running." },
  { id: "soc-analyst", title: "Cybersecurity Analyst (Tier 1)", soc_code: "15-1212", median_wage: 74000, openings: 120, entry_education: "Certificate or associate", summary: "Monitors alerts and triages security events." },
  { id: "data-analyst", title: "Junior Data Analyst", soc_code: "15-2051", median_wage: 58000, openings: 200, entry_education: "Certificate or bachelor's", summary: "Turns raw operational data into decisions." },
  { id: "cs-rep", title: "Customer Success Associate", soc_code: "43-4051", median_wage: 42000, openings: 520, entry_education: "High school", summary: "Onboards and supports customers of a software product." },
  { id: "cnc-operator", title: "CNC Machine Operator", soc_code: "51-9161", median_wage: 45000, openings: 330, entry_education: "High school + training", summary: "Sets up and runs CNC equipment on the shop floor." },
  { id: "automation-tech", title: "Industrial Automation Technician", soc_code: "17-3024", median_wage: 63000, openings: 140, entry_education: "Certificate or associate", summary: "Maintains PLC-controlled manufacturing systems." },
];

const req = (role_id: string, spec: [string, "core" | "preferred", number][]): RoleSkill[] =>
  spec.map(([skill_id, importance, level]) => ({ role_id, skill_id, importance, level }));

const roleSkills: RoleSkill[] = [
  ...req("it-support", [["hw-troubleshoot", "core", 2], ["os-admin", "core", 2], ["networking", "core", 2], ["ticketing", "core", 2], ["active-dir", "preferred", 2], ["customer-service", "core", 2], ["communication", "core", 2], ["comptia-a", "preferred", 1], ["google-it", "preferred", 1]]),
  ...req("help-desk", [["hw-troubleshoot", "core", 1], ["os-admin", "core", 1], ["ticketing", "core", 2], ["customer-service", "core", 3], ["communication", "core", 2], ["time-mgmt", "preferred", 2], ["google-it", "preferred", 1]]),
  ...req("network-tech", [["networking", "core", 3], ["hw-troubleshoot", "core", 2], ["os-admin", "preferred", 2], ["scripting", "preferred", 1], ["comptia-net", "core", 1], ["problem-solving", "core", 2], ["cloud-basics", "preferred", 1]]),
  ...req("soc-analyst", [["security-basics", "core", 3], ["networking", "core", 2], ["siem", "core", 2], ["scripting", "preferred", 2], ["comptia-sec", "core", 1], ["attention-detail", "core", 3], ["communication", "preferred", 2]]),
  ...req("data-analyst", [["sql", "core", 2], ["spreadsheets", "core", 3], ["data-viz", "core", 2], ["scripting", "preferred", 1], ["google-da", "preferred", 1], ["communication", "core", 2], ["attention-detail", "core", 2]]),
  ...req("cs-rep", [["customer-service", "core", 3], ["communication", "core", 3], ["crm", "core", 2], ["spreadsheets", "preferred", 1], ["time-mgmt", "core", 2], ["teamwork", "preferred", 2]]),
  ...req("cnc-operator", [["cnc", "core", 2], ["blueprint", "core", 2], ["safety", "core", 2], ["attention-detail", "core", 2], ["osha-10", "preferred", 1], ["teamwork", "preferred", 1]]),
  ...req("automation-tech", [["plc", "core", 2], ["blueprint", "core", 2], ["safety", "core", 2], ["problem-solving", "core", 2], ["hw-troubleshoot", "preferred", 2], ["osha-10", "preferred", 1]]),
];

const programs: Ontology["programs"] = [
  { id: "tric-net", name: "Networking Essentials (Network+ prep)", provider: "Tri-C Workforce", duration_weeks: 8, cost: 0, modality: "Hybrid", location: "Cleveland" },
  { id: "tric-a", name: "CompTIA A+ Bootcamp", provider: "Tri-C Workforce", duration_weeks: 10, cost: 0, modality: "In person", location: "Cleveland" },
  { id: "perscholas-it", name: "IT Support Training", provider: "Per Scholas Cleveland", duration_weeks: 15, cost: 0, modality: "In person", location: "Cleveland" },
  { id: "perscholas-sec", name: "Cybersecurity Analyst Track", provider: "Per Scholas Cleveland", duration_weeks: 15, cost: 0, modality: "Remote", location: "Online" },
  { id: "csu-data", name: "Data Analytics Certificate", provider: "Cleveland State University", duration_weeks: 16, cost: 2400, modality: "Hybrid", location: "Cleveland" },
  { id: "google-da-p", name: "Google Data Analytics (self-paced)", provider: "Coursera", duration_weeks: 12, cost: 294, modality: "Online", location: "Online" },
  { id: "mfg-cnc", name: "CNC Fast Track", provider: "Manufacturing Advocacy & Growth Network", duration_weeks: 6, cost: 0, modality: "In person", location: "Cleveland" },
  { id: "tric-plc", name: "Mechatronics & PLC Certificate", provider: "Tri-C Manufacturing Center", duration_weeks: 20, cost: 1800, modality: "In person", location: "Cleveland" },
  { id: "hd-soft", name: "Help Desk & Customer Skills", provider: "Year Up Greater Cleveland", duration_weeks: 24, cost: 0, modality: "Hybrid", location: "Cleveland" },
];

const teaches: [string, string[]][] = [
  ["tric-net", ["networking", "comptia-net", "cloud-basics"]],
  ["tric-a", ["hw-troubleshoot", "os-admin", "comptia-a"]],
  ["perscholas-it", ["hw-troubleshoot", "os-admin", "networking", "ticketing", "active-dir", "comptia-a"]],
  ["perscholas-sec", ["security-basics", "siem", "comptia-sec", "scripting"]],
  ["csu-data", ["sql", "data-viz", "spreadsheets", "scripting"]],
  ["google-da-p", ["sql", "spreadsheets", "data-viz", "google-da"]],
  ["mfg-cnc", ["cnc", "blueprint", "safety", "osha-10"]],
  ["tric-plc", ["plc", "blueprint", "safety", "hw-troubleshoot"]],
  ["hd-soft", ["ticketing", "customer-service", "communication", "crm", "active-dir"]],
];
const programSkills = teaches.flatMap(([program_id, ids]) => ids.map((skill_id) => ({ program_id, skill_id })));

const skillRelations: Ontology["skillRelations"] = [
  { from_skill_id: "networking", to_skill_id: "security-basics", type: "prerequisite" },
  { from_skill_id: "security-basics", to_skill_id: "siem", type: "prerequisite" },
  { from_skill_id: "os-admin", to_skill_id: "active-dir", type: "prerequisite" },
  { from_skill_id: "spreadsheets", to_skill_id: "sql", type: "adjacent" },
  { from_skill_id: "sql", to_skill_id: "data-viz", type: "adjacent" },
  { from_skill_id: "google-it", to_skill_id: "comptia-a", type: "adjacent" },
  { from_skill_id: "comptia-net", to_skill_id: "comptia-sec", type: "prerequisite" },
  { from_skill_id: "customer-service", to_skill_id: "crm", type: "adjacent" },
  { from_skill_id: "blueprint", to_skill_id: "plc", type: "adjacent" },
  { from_skill_id: "hw-troubleshoot", to_skill_id: "plc", type: "adjacent" },
];

// Jordan: the demo persona. Retail background + Google IT cert.
const JORDAN = "jordan";
const ts = (talent_id: string, spec: [string, number, Evidence][]): TalentSkill[] =>
  spec.map(([skill_id, level, evidence]) => ({ talent_id, skill_id, level, evidence }));

const talent: Ontology["talent"] = [{ id: JORDAN, name: "Jordan Reyes", headline: "Retail shift lead · Google IT Support Certificate" }];
const talentSkills: TalentSkill[] = ts(JORDAN, [
  ["customer-service", 3, "resume"],
  ["communication", 2, "resume"],
  ["cash-handling", 3, "resume"],
  ["teamwork", 3, "resume"],
  ["time-mgmt", 2, "self"],
  ["google-it", 1, "verified"],
  ["hw-troubleshoot", 2, "verified"],
  ["os-admin", 2, "verified"],
  ["ticketing", 1, "self"],
  ["spreadsheets", 2, "self"],
]);

// Deterministic synthetic cohort (40 people) for the Navigator dashboard.
// Each person is drawn toward one role archetype (holding 45-100% of its
// skills near the required level) plus a few unrelated skills, so the cohort
// shows a realistic READY / CLOSE / STRETCH spread instead of noise.
let seed = 42;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const FIRST = ["Ava", "Malik", "Sofia", "Deshawn", "Mia", "Luis", "Imani", "Tyler", "Zara", "Andre", "Grace", "Omar", "Nia", "Ethan", "Leah", "Marcus", "Priya", "Caleb", "Jada", "Noah"];
const LAST = ["Johnson", "Nguyen", "Patel", "Brooks", "Garcia", "Kowalski", "Williams", "Ahmed", "Rivera", "Thompson"];
for (let i = 0; i < 40; i++) {
  const id = `t${i + 1}`;
  talent.push({ id, name: `${FIRST[i % FIRST.length]} ${LAST[(i * 7) % LAST.length]}`, headline: null });
  const archetype = roles[i % roles.length].id;
  const coverage = 0.45 + rand() * 0.55;
  const levels = new Map<string, number>();
  for (const r of roleSkills.filter((x) => x.role_id === archetype)) {
    if (rand() < coverage) levels.set(r.skill_id, Math.max(1, Math.min(4, r.level + (rand() < 0.3 ? -1 : 0))));
  }
  const extras = 1 + Math.floor(rand() * 3);
  for (let k = 0; k < extras; k++) {
    const s = skills[Math.floor(rand() * skills.length)].id;
    if (!levels.has(s)) levels.set(s, 1 + Math.floor(rand() * 2));
  }
  for (const [skill_id, level] of levels) {
    talentSkills.push({ talent_id: id, skill_id, level, evidence: rand() > 0.6 ? "verified" : "self" });
  }
}

export const DEMO_TALENT_ID = JORDAN;

export const sampleOntology: Ontology = {
  skills,
  roles,
  programs,
  roleSkills,
  programSkills,
  skillRelations,
  talent,
  talentSkills,
};
