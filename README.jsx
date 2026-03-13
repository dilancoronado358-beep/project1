import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS  —  80% black · 5% white · 10% teal
═══════════════════════════════════════════════════ */
const T = {
  bg0: "#060A0F",      // deepest black
  bg1: "#0A0F17",      // sidebar / cards
  bg2: "#0D1420",      // main content bg
  bg3: "#111B2B",      // inputs / hover rows
  bg4: "#162236",      // elevated cards
  border: "#1C2D42",
  borderHi: "#24405E",

  teal:      "#14B8A6",
  tealDark:  "#0D9488",
  tealLight: "#2DD4BF",
  tealSoft:  "rgba(20,184,166,0.12)",
  tealGlow:  "rgba(20,184,166,0.06)",

  white:     "#F0F6FF",
  whiteOff:  "#B8C8DC",
  whiteDim:  "#6B8299",
  whiteFade: "#334D63",

  green:  "#10B981",
  greenS: "rgba(16,185,129,0.12)",
  amber:  "#F59E0B",
  amberS: "rgba(245,158,11,0.12)",
  red:    "#EF4444",
  redS:   "rgba(239,68,68,0.12)",

  grad: "linear-gradient(135deg, #14B8A6, #0891B2)",
};

/* ═══════════════════════════════════════════════════
   LOCALSTORAGE HOOK
═══════════════════════════════════════════════════ */
function useLocalStorage(key, fallback) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  });
  const set = useCallback((next) => {
    setVal(prev => {
      const v = typeof next === "function" ? next(prev) : next;
      try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
      return v;
    });
  }, [key]);
  return [val, set];
}

/* ═══════════════════════════════════════════════════
   SEED DATA
═══════════════════════════════════════════════════ */
let _uid = 2000;
const uid = () => String(++_uid);

const SEED = {
  user: { name: "Alex Morgan", email: "alex@mycompany.com", role: "Admin", avatar: "AM" },
  emailAccount: { connected: false, provider: "", address: "", smtp: "", port: "587", user: "", pass: "" },
  contacts: [
    { id:"c1", name:"Sofia Martin",    email:"sofia@techflow.com",   phone:"+1 612-001-0001", company:"TechFlow Inc",    position:"CEO",           status:"client",    tags:["vip","saas"],    value:84000, avatar:"SM", color:T.teal,  created:"2024-01-10", lastSeen:"2024-03-14", score:92, source:"Referral", notes:"Interested in European expansion." },
    { id:"c2", name:"Carlos Reyes",    email:"carlos@innolab.io",    phone:"+1 655-002-0002", company:"InnoLab",         position:"CTO",           status:"lead",      tags:["tech","startup"],value:28000, avatar:"CR", color:T.green, created:"2024-02-15", lastSeen:"2024-03-12", score:74, source:"LinkedIn",  notes:"Evaluating enterprise plan." },
    { id:"c3", name:"Laura Chen",      email:"laura@globalretail.us", phone:"+1 677-003-0003", company:"Global Retail",  position:"VP Sales",      status:"prospect",  tags:["retail"],        value:52000, avatar:"LC", color:T.amber, created:"2024-02-28", lastSeen:"2024-03-10", score:61, source:"Web",       notes:"Demo meeting pending." },
    { id:"c4", name:"Marcus Johnson",  email:"marcus@consult.pro",   phone:"+1 699-004-0004", company:"Consult Pro",    position:"Partner",       status:"client",    tags:["vip"],           value:120000,avatar:"MJ", color:"#A78BFA",created:"2023-11-05", lastSeen:"2024-03-13", score:98, source:"Event",     notes:"3-year framework contract." },
    { id:"c5", name:"Elena Torres",    email:"elena@designhub.co",   phone:"+1 644-005-0005", company:"DesignHub",      position:"Founder",       status:"inactive",  tags:["design"],        value:9500,  avatar:"ET", color:"#F472B6",created:"2023-08-20", lastSeen:"2024-01-05", score:32, source:"Email",     notes:"No response since January." },
    { id:"c6", name:"James Wright",    email:"james@cloudsync.net",  phone:"+1 611-006-0006", company:"CloudSync",      position:"VP Sales",      status:"lead",      tags:["cloud","saas"],  value:47000, avatar:"JW", color:"#60A5FA",created:"2024-03-01", lastSeen:"2024-03-15", score:68, source:"Cold Call", notes:"Very interested, follow-up Friday." },
  ],
  companies: [
    { id:"co1", name:"TechFlow Inc",  industry:"SaaS",        size:"51-200",  website:"techflow.com",    revenue:"$5M-10M",   city:"San Francisco", logo:"TF", color:T.teal,   contacts:["c1"], deals:["d1","d2"] },
    { id:"co2", name:"InnoLab",       industry:"Startup",     size:"11-50",   website:"innolab.io",      revenue:"$1M-5M",    city:"Austin",        logo:"IL", color:T.green,  contacts:["c2"], deals:["d3"] },
    { id:"co3", name:"Global Retail", industry:"Retail",      size:"201-500", website:"globalretail.us", revenue:"$20M-50M",  city:"Chicago",       logo:"GR", color:T.amber,  contacts:["c3"], deals:["d4"] },
    { id:"co4", name:"Consult Pro",   industry:"Consulting",  size:"11-50",   website:"consult.pro",     revenue:"$2M-5M",    city:"New York",      logo:"CP", color:"#A78BFA",contacts:["c4"], deals:["d5","d6"] },
    { id:"co5", name:"DesignHub",     industry:"Design",      size:"1-10",    website:"designhub.co",    revenue:"<$500K",    city:"Portland",      logo:"DH", color:"#F472B6",contacts:["c5"], deals:[] },
    { id:"co6", name:"CloudSync",     industry:"Cloud",       size:"51-200",  website:"cloudsync.net",   revenue:"$5M-10M",   city:"Seattle",       logo:"CS", color:"#60A5FA",contacts:["c6"], deals:["d7"] },
  ],
  pipelines: [
    { id:"pl1", name:"B2B Sales", color:T.teal, isDefault:true, stages:[
      { id:"st1", name:"New Lead",       color:"#334D63", order:0, probability:10 },
      { id:"st2", name:"Qualified",      color:"#60A5FA", order:1, probability:25 },
      { id:"st3", name:"Proposal Sent",  color:"#A78BFA", order:2, probability:50 },
      { id:"st4", name:"Negotiation",    color:T.amber,   order:3, probability:75 },
      { id:"st5", name:"Won",            color:T.green,   order:4, probability:100, isWon:true },
      { id:"st6", name:"Lost",           color:T.red,     order:5, probability:0,   isLost:true },
    ]},
    { id:"pl2", name:"Renewals", color:T.green, isDefault:false, stages:[
      { id:"sr1", name:"Up for Renewal", color:"#334D63", order:0, probability:60 },
      { id:"sr2", name:"In Contact",     color:"#60A5FA", order:1, probability:70 },
      { id:"sr3", name:"Negotiating",    color:T.amber,   order:2, probability:85 },
      { id:"sr4", name:"Renewed",        color:T.green,   order:3, probability:100, isWon:true },
      { id:"sr5", name:"Cancelled",      color:T.red,     order:4, probability:0,   isLost:true },
    ]},
  ],
  deals: [
    { id:"d1", title:"TechFlow — Enterprise Plan",     contactId:"c1", companyId:"co1", pipelineId:"pl1", stageId:"st4", value:84000, prob:75, closeDate:"2024-04-30", owner:"Alex Morgan",  created:"2024-01-15", tags:["priority"], notes:"Negotiating SLA clauses." },
    { id:"d2", title:"TechFlow — Analytics Module",    contactId:"c1", companyId:"co1", pipelineId:"pl1", stageId:"st3", value:18000, prob:50, closeDate:"2024-05-15", owner:"Maria Lopez",  created:"2024-02-10", tags:[], notes:"Awaiting feedback on proposal." },
    { id:"d3", title:"InnoLab — Growth Plan",          contactId:"c2", companyId:"co2", pipelineId:"pl1", stageId:"st2", value:28000, prob:25, closeDate:"2024-06-01", owner:"Alex Morgan",  created:"2024-02-20", tags:["new"], notes:"Initial positive contact." },
    { id:"d4", title:"Global Retail — Omnichannel",    contactId:"c3", companyId:"co3", pipelineId:"pl1", stageId:"st1", value:52000, prob:10, closeDate:"2024-07-01", owner:"Maria Lopez",  created:"2024-03-05", tags:[], notes:"Starting qualification." },
    { id:"d5", title:"Consult Pro — Q2 Strategy",      contactId:"c4", companyId:"co4", pipelineId:"pl1", stageId:"st5", value:38000, prob:100, closeDate:"2024-03-31",owner:"Alex Morgan",  created:"2023-12-01", tags:["won"], notes:"Closed. Kick-off April 3." },
    { id:"d6", title:"Consult Pro — Annual Support",   contactId:"c4", companyId:"co4", pipelineId:"pl2", stageId:"sr4", value:12000, prob:100, closeDate:"2024-01-31",owner:"Maria Lopez",  created:"2023-11-15", tags:[], notes:"Auto-renewed." },
    { id:"d7", title:"CloudSync — API Integration",    contactId:"c6", companyId:"co6", pipelineId:"pl1", stageId:"st2", value:47000, prob:25, closeDate:"2024-06-15", owner:"Alex Morgan",  created:"2024-03-05", tags:["new"], notes:"Demo scheduled." },
  ],
  activities: [
    { id:"a1", type:"call",    title:"Follow-up TechFlow",    contactId:"c1", dealId:"d1", date:"2024-03-14 10:00", duration:45, done:true,  owner:"Alex Morgan", notes:"Confirmed interest. Send contract draft." },
    { id:"a2", type:"meeting", title:"CloudSync product demo", contactId:"c6", dealId:"d7", date:"2024-03-18 16:00", duration:60, done:false, owner:"Alex Morgan", notes:"Prepare custom deck." },
    { id:"a3", type:"email",   title:"Proposal sent InnoLab",  contactId:"c2", dealId:"d3", date:"2024-03-12 09:30", duration:0,  done:true,  owner:"Maria Lopez", notes:"Include success stories." },
    { id:"a4", type:"task",    title:"Prepare Consult Pro contract", contactId:"c4", dealId:"d5", date:"2024-03-20 12:00", duration:0, done:false, owner:"Alex Morgan", notes:"Include revised clauses." },
    { id:"a5", type:"call",    title:"Follow-up Global Retail",contactId:"c3", dealId:"d4", date:"2024-03-22 11:00", duration:30, done:false, owner:"Maria Lopez", notes:"Second qualification call." },
  ],
  tasks: [
    { id:"t1", title:"Review TechFlow proposal",  priority:"high",   status:"todo",       assignee:"Alex Morgan", due:"2024-03-20", contactId:"c1", dealId:"d1", desc:"Adjust pricing per client feedback." },
    { id:"t2", title:"CloudSync demo",             priority:"high",   status:"inprogress", assignee:"Alex Morgan", due:"2024-03-18", contactId:"c6", dealId:"d7", desc:"Prepare API module demo." },
    { id:"t3", title:"InnoLab follow-up",          priority:"medium", status:"todo",       assignee:"Maria Lopez", due:"2024-03-19", contactId:"c2", dealId:"d3", desc:"Send similar success cases." },
    { id:"t4", title:"Monthly pipeline report",    priority:"low",    status:"todo",       assignee:"Maria Lopez", due:"2024-03-31", contactId:null, dealId:null, desc:"Compile March metrics." },
    { id:"t5", title:"Consult Pro contract — Sign",priority:"high",   status:"done",       assignee:"Alex Morgan", due:"2024-03-10", contactId:"c4", dealId:"d5", desc:"Send for digital signature." },
  ],
  emails: [
    { id:"e1", folder:"inbox", from:"sofia@techflow.com",  to:"alex@mycompany.com",  subject:"Re: Enterprise Proposal 2024",     body:"Hi Alex,\n\nWe reviewed the proposal internally and agree with the main terms. However, we need to adjust the response SLA to 2 hours for P1 issues. Could you confirm if this is possible?\n\nLooking forward to closing this.\n\nBest,\nSofia", date:"2024-03-14 11:23", read:true,  contactId:"c1", templateId:null },
    { id:"e2", folder:"inbox", from:"james@cloudsync.net", to:"alex@mycompany.com",  subject:"API Integration Query",            body:"Hi Alex,\n\nAfter our Monday call, I wanted to ask if the integration module includes real-time webhooks for user events. Also, is the rate limit configurable per client?\n\nThanks,\nJames", date:"2024-03-13 09:45", read:false, contactId:"c6", templateId:null },
    { id:"e3", folder:"inbox", from:"carlos@innolab.io",   to:"alex@mycompany.com",  subject:"Can we schedule a demo?",          body:"Good morning,\n\nWe've been evaluating your platform and would love to see a demo focused on marketing automation features.\n\nWould next Tuesday work at 3pm EST?\n\nBest,\nCarlos", date:"2024-03-12 16:30", read:false, contactId:"c2", templateId:null },
    { id:"e4", folder:"inbox", from:"marcus@consult.pro",  to:"alex@mycompany.com",  subject:"April 3rd Kick-off — Confirm",     body:"Perfect. Confirming kick-off for April 3rd at 10am at our New York office.\n\nPlease send the agenda in advance so we can prepare.\n\nRegards,\nMarcus", date:"2024-03-11 14:10", read:true,  contactId:"c4", templateId:null },
    { id:"e5", folder:"sent",  from:"alex@mycompany.com",  to:"sofia@techflow.com",  subject:"Enterprise Proposal — TechFlow",   body:"Hi Sofia,\n\nPlease find attached our Enterprise proposal tailored to TechFlow's needs.\n\nHighlights:\n• Dedicated support team\n• 99.9% SLA\n• Unlimited users\n\nLet me know if you have any questions.\n\nBest,\nAlex", date:"2024-03-10 09:00", read:true,  contactId:"c1", templateId:"tpl1" },
  ],
  emailTemplates: [
    { id:"tpl1", name:"Initial Outreach",      subject:"Introduction — {{company_name}}", category:"outreach",  body:"Hi {{first_name}},\n\nI hope this message finds you well. My name is {{sender_name}} from {{our_company}}.\n\nI came across {{company_name}} and was impressed by your work in {{industry}}. I believe we could add significant value to your team.\n\nWould you be open to a quick 15-minute call this week?\n\nBest regards,\n{{sender_name}}\n{{sender_title}}", variables:["first_name","company_name","industry","sender_name","sender_title","our_company"] },
    { id:"tpl2", name:"Follow-up After Demo",  subject:"Following up — {{company_name}} Demo", category:"followup", body:"Hi {{first_name}},\n\nThank you for taking the time to attend yesterday's demo. I hope it gave you a clear picture of how {{our_company}} can help {{company_name}}.\n\nAs discussed, the key benefits for your team are:\n• {{benefit_1}}\n• {{benefit_2}}\n• {{benefit_3}}\n\nI've attached the presentation for your reference. Please let me know if you have any questions.\n\nLooking forward to next steps!\n\nBest,\n{{sender_name}}", variables:["first_name","company_name","benefit_1","benefit_2","benefit_3","sender_name","our_company"] },
    { id:"tpl3", name:"Proposal Sent",         subject:"Your Custom Proposal — {{company_name}}", category:"proposal", body:"Hi {{first_name}},\n\nAttached you'll find your custom proposal for {{company_name}}.\n\nProposal Summary:\n• Plan: {{plan_name}}\n• Investment: ${{amount}}/year\n• Includes: {{features}}\n\nThis proposal is valid for 30 days. I'm available for any questions — feel free to reply or call me at {{sender_phone}}.\n\nBest regards,\n{{sender_name}}\n{{sender_title}}", variables:["first_name","company_name","plan_name","amount","features","sender_name","sender_title","sender_phone"] },
    { id:"tpl4", name:"Check-in / Re-engage",  subject:"Checking in — {{first_name}}", category:"reengagement", body:"Hi {{first_name}},\n\nI wanted to check in and see how things are going at {{company_name}}.\n\nSince we last spoke, we've launched some exciting new features that I think would be particularly useful for your team, especially {{relevant_feature}}.\n\nWould you have 20 minutes this week for a quick call?\n\nLooking forward to reconnecting!\n\nBest,\n{{sender_name}}", variables:["first_name","company_name","relevant_feature","sender_name"] },
    { id:"tpl5", name:"Contract / Closing",    subject:"Next Steps — {{company_name}}", category:"closing", body:"Hi {{first_name}},\n\nExcellent news! I'm excited to move forward with {{company_name}}.\n\nI've prepared the contract based on our agreed terms:\n• Start date: {{start_date}}\n• Plan: {{plan_name}}\n• Annual value: ${{amount}}\n\nPlease review the attached contract and sign at your earliest convenience. Our onboarding team will reach out within 24 hours of signing.\n\nThank you for choosing {{our_company}}!\n\nBest,\n{{sender_name}}", variables:["first_name","company_name","start_date","plan_name","amount","sender_name","our_company"] },
    { id:"tpl6", name:"Win-back Campaign",     subject:"We miss you, {{first_name}} 👋", category:"reengagement", body:"Hi {{first_name}},\n\nIt's been a while since we've heard from {{company_name}}, and we wanted to reach out.\n\nWe've made significant improvements since we last spoke:\n• {{update_1}}\n• {{update_2}}\n\nAs a valued past contact, we'd like to offer you a {{discount}}% discount on any plan for the first 3 months.\n\nWould you be open to a brief conversation?\n\nBest,\n{{sender_name}}", variables:["first_name","company_name","update_1","update_2","discount","sender_name"] },
  ],
  notes: [
    { id:"n1", contactId:"c1", dealId:"d1", text:"Call went great. CEO is committed. Send contract ASAP.", author:"Alex Morgan", date:"2024-03-14 10:45", pinned:true },
    { id:"n2", contactId:"c2", dealId:"d3", text:"Evaluating 2 competitors. Key differentiator: onboarding speed.", author:"Maria Lopez", date:"2024-03-12 09:30", pinned:false },
    { id:"n3", contactId:"c4", dealId:"d5", text:"Deal closed. Very satisfied contact. Potential upsell in Q3.", author:"Alex Morgan", date:"2024-03-10 17:00", pinned:true },
  ],
};

/* ═══════════════════════════════════════════════════
   FORMATTERS
═══════════════════════════════════════════════════ */
const money = v => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(v||0);
const fdate = d => { if(!d) return "—"; return new Date(d).toLocaleDateString("en-US",{day:"2-digit",month:"short",year:"numeric"}); };
const fdtm = d => { if(!d) return "—"; const dt=new Date(d); return dt.toLocaleDateString("en-US",{month:"short",day:"2-digit"})+" "+dt.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}); };

const STATUS_CFG = {
  client:   {label:"Client",   color:T.green,  bg:T.greenS},
  lead:     {label:"Lead",     color:T.teal,   bg:T.tealSoft},
  prospect: {label:"Prospect", color:T.amber,  bg:T.amberS},
  inactive: {label:"Inactive", color:T.whiteDim,bg:"rgba(107,130,153,0.12)"},
};
const PRIO_CFG = {
  high:   {label:"High",   color:T.red,   bg:T.redS},
  medium: {label:"Medium", color:T.amber, bg:T.amberS},
  low:    {label:"Low",    color:T.green, bg:T.greenS},
};
const ACT_CFG = {
  call:    {label:"Call",    color:T.teal,   icon:"📞"},
  meeting: {label:"Meeting", color:"#A78BFA",icon:"📅"},
  email:   {label:"Email",   color:T.amber,  icon:"✉️"},
  task:    {label:"Task",    color:T.green,  icon:"✅"},
};
const TPL_CATS = {
  outreach:     {label:"Outreach",     color:T.teal},
  followup:     {label:"Follow-up",    color:"#60A5FA"},
  proposal:     {label:"Proposal",     color:T.amber},
  reengagement: {label:"Re-engagement",color:"#A78BFA"},
  closing:      {label:"Closing",      color:T.green},
};

/* ═══════════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════════ */
const PATHS = {
  home:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  users:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  building:"M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  funnel:"M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z",
  dollar:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  lightning:"M13 10V3L4 14h7v7l9-11h-7z",
  check:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  mail:"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  chart:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  cog:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  plus:"M12 4v16m8-8H4",
  x:"M6 18L18 6M6 6l12 12",
  search:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  edit:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  trash:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  chevD:"M19 9l-7 7-7-7",
  chevR:"M9 5l7 7-7 7",
  menu:"M4 6h16M4 12h16M4 18h16",
  bell:"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  star:"M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  phone:"M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  reply:"M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6",
  note:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  trend:"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  board:"M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
  list:"M4 6h16M4 10h16M4 14h16M4 18h16",
  grid:"M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z",
  link:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  calendar:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  template:"M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
  plug:"M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
  inbox:"M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
  send:"M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
  copy:"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
  eye:"M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  refresh:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  arrow:"M14 5l7 7m0 0l-7 7m7-7H3",
  var:"M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
};
const Ico = ({k,size=16,style={}}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {(PATHS[k]||"").split("M").filter(Boolean).map((d,i)=><path key={i} d={"M"+d}/>)}
  </svg>
);

/* ═══════════════════════════════════════════════════
   BASE UI COMPONENTS
═══════════════════════════════════════════════════ */
const Av = ({text="?",color=T.teal,size=36,fs})=>(
  <div style={{width:size,height:size,borderRadius:"50%",background:color+"18",border:`1.5px solid ${color}40`,color,fontWeight:700,fontSize:fs||size*.36,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
    {(text||"?").slice(0,2).toUpperCase()}
  </div>
);

const Chip = ({label,color,bg})=>(
  <span style={{display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,color,background:bg||color+"18",border:`1px solid ${color}28`,whiteSpace:"nowrap"}}>
    {label}
  </span>
);

const Btn = ({children,variant="primary",size="md",onClick,disabled,style={},full})=>{
  const V={
    primary:  {bg:T.teal,       color:"#000",  border:T.teal},
    ghost:    {bg:"transparent",color:T.whiteDim,border:"transparent"},
    secondary:{bg:T.bg4,        color:T.whiteOff,border:T.border},
    danger:   {bg:T.redS,       color:T.red,   border:T.red+"30"},
    success:  {bg:T.greenS,     color:T.green, border:T.green+"30"},
    teal:     {bg:T.tealSoft,   color:T.teal,  border:T.teal+"30"},
  };
  const S={sm:{padding:"5px 10px",fontSize:11},md:{padding:"8px 14px",fontSize:12.5},lg:{padding:"11px 22px",fontSize:14}};
  const v=V[variant]||V.primary; const s=S[size]||S.md;
  return(
    <button onClick={onClick} disabled={disabled}
      style={{background:v.bg,color:v.color,border:`1px solid ${v.border}`,...s,borderRadius:7,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.5:1,fontWeight:700,display:"inline-flex",alignItems:"center",gap:5,transition:"all .15s",width:full?"100%":undefined,justifyContent:full?"center":undefined,...style}}>
      {children}
    </button>
  );
};

const Inp = ({value,onChange,placeholder,type="text",style={},rows,readOnly})=>{
  const base={background:T.bg3,border:`1px solid ${T.border}`,borderRadius:7,color:T.white,fontSize:12.5,outline:"none",width:"100%",boxSizing:"border-box",transition:"border .15s",fontFamily:"inherit"};
  if(rows) return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} readOnly={readOnly} style={{...base,padding:"9px 11px",resize:"vertical",...style}}/>;
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly} style={{...base,padding:"9px 11px",...style}}/>;
};

const Sel = ({value,onChange,children,style={}})=>(
  <select value={value} onChange={onChange} style={{background:T.bg3,border:`1px solid ${T.border}`,borderRadius:7,color:T.white,fontSize:12.5,padding:"9px 11px",outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"inherit",...style}}>
    {children}
  </select>
);

const Lbl = ({children})=><label style={{fontSize:10.5,fontWeight:700,color:T.whiteDim,textTransform:"uppercase",letterSpacing:".07em",display:"block",marginBottom:5}}>{children}</label>;
const Field = ({label,children,col=1,style={}})=>(
  <div style={{gridColumn:`span ${col}`,...style}}>
    <Lbl>{label}</Lbl>
    {children}
  </div>
);

const Modal = ({open,onClose,title,children,width=640})=>{
  if(!open) return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",backdropFilter:"blur(8px)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,width:"100%",maxWidth:width,maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:`0 0 60px rgba(20,184,166,.08),0 32px 80px rgba(0,0,0,.7)`}}>
        <div style={{padding:"16px 22px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <span style={{fontWeight:700,fontSize:15,color:T.white}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.whiteDim,cursor:"pointer",padding:4,borderRadius:5,display:"flex"}}><Ico k="x" size={17}/></button>
        </div>
        <div style={{padding:22,overflowY:"auto",flex:1}}>{children}</div>
      </div>
    </div>
  );
};

const Card = ({children,style={},onClick,glow})=>(
  <div onClick={onClick} style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:11,...(glow?{boxShadow:`0 0 20px ${T.teal}08`}:{}),...style,cursor:onClick?"pointer":undefined}}>
    {children}
  </div>
);

const KPI = ({label,value,sub,color=T.teal,icon})=>(
  <Card style={{padding:"17px 19px",flex:1,minWidth:140}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div>
        <div style={{fontSize:10,fontWeight:700,color:T.whiteDim,textTransform:"uppercase",letterSpacing:".07em",marginBottom:7}}>{label}</div>
        <div style={{fontSize:24,fontWeight:800,color,lineHeight:1}}>{value}</div>
        {sub&&<div style={{fontSize:11,color:T.whiteDim,marginTop:5}}>{sub}</div>}
      </div>
      {icon&&<Ico k={icon} size={20} style={{color,opacity:.5}}/>}
    </div>
  </Card>
);

const THead = ({cols})=>(
  <thead>
    <tr>
      {cols.map((c,i)=><th key={i} style={{padding:"10px 13px",textAlign:"left",fontSize:10,fontWeight:700,color:T.whiteDim,textTransform:"uppercase",letterSpacing:".07em",borderBottom:`1px solid ${T.border}`,whiteSpace:"nowrap"}}>{c}</th>)}
    </tr>
  </thead>
);
const TR = ({children,onClick})=>(
  <tr onClick={onClick} style={{cursor:onClick?"pointer":undefined,transition:"background .1s"}}
    onMouseEnter={e=>{if(onClick)e.currentTarget.style.background=T.bg3;}}
    onMouseLeave={e=>{e.currentTarget.style.background="";}}>
    {children}
  </tr>
);
const TD = ({children,style={}})=>(
  <td style={{padding:"10px 13px",borderBottom:`1px solid ${T.border}`,fontSize:12.5,color:T.whiteOff,...style}}>{children}</td>
);

const Progress = ({value,color=T.teal,h=5})=>(
  <div style={{background:T.bg3,borderRadius:99,height:h,overflow:"hidden",width:"100%"}}>
    <div style={{background:color,height:"100%",width:`${Math.min(100,Math.max(0,value))}%`,borderRadius:99}}/>
  </div>
);

const ScoreRing = ({score,size=40})=>{
  const color=score>=80?T.green:score>=50?T.amber:T.red;
  const r=(size/2)-4; const c=2*Math.PI*r; const d=(score/100)*c;
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.bg3} strokeWidth={3}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={3} strokeDasharray={`${d} ${c-d}`} strokeLinecap="round"/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color}}>{score}</div>
    </div>
  );
};

const ColorPick = ({value,onChange})=>{
  const pal=[T.teal,"#60A5FA","#A78BFA","#F472B6",T.green,T.amber,"#FB923C","#F87171","#34D399","#38BDF8"];
  return(
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      {pal.map(c=><div key={c} onClick={()=>onChange(c)} style={{width:24,height:24,borderRadius:"50%",background:c,cursor:"pointer",border:value===c?"2.5px solid #fff":"2.5px solid transparent",boxShadow:value===c?`0 0 0 2px ${c}`:undefined}}/>)}
    </div>
  );
};

const SearchBar = ({value,onChange,placeholder="Search..."})=>(
  <div style={{position:"relative",flex:1}}>
    <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.whiteDim,pointerEvents:"none"}}><Ico k="search" size={14}/></div>
    <Inp value={value} onChange={onChange} placeholder={placeholder} style={{paddingLeft:32}}/>
  </div>
);

const Empty = ({text="No data"})=>(
  <div style={{padding:"36px 20px",textAlign:"center",color:T.whiteDim,fontSize:12.5}}>{text}</div>
);

const SectionHeader = ({title,sub,actions})=>(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,gap:12,flexWrap:"wrap"}}>
    <div>
      <h2 style={{margin:0,fontSize:19,fontWeight:800,color:T.white,letterSpacing:"-.02em"}}>{title}</h2>
      {sub&&<p style={{margin:"3px 0 0",fontSize:12,color:T.whiteDim}}>{sub}</p>}
    </div>
    {actions&&<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>{actions}</div>}
  </div>
);

const SegCtrl = ({options,value,onChange})=>(
  <div style={{display:"flex",background:T.bg3,borderRadius:7,padding:3,gap:2}}>
    {options.map(o=>(
      <button key={o.value} onClick={()=>onChange(o.value)}
        style={{background:value===o.value?T.bg1:"transparent",color:value===o.value?T.teal:T.whiteDim,border:value===o.value?`1px solid ${T.border}`:"1px solid transparent",borderRadius:5,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:"inherit"}}>
        {o.icon&&<Ico k={o.icon} size={12}/>}{o.label}
      </button>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════ */
const Dashboard = ({db})=>{
  const isWon=d=>{const pl=db.pipelines.find(p=>p.id===d.pipelineId);return pl?.stages.find(s=>s.id===d.stageId)?.isWon;};
  const isLost=d=>{const pl=db.pipelines.find(p=>p.id===d.pipelineId);return pl?.stages.find(s=>s.id===d.stageId)?.isLost;};
  const active=db.deals.filter(d=>!isWon(d)&&!isLost(d));
  const won=db.deals.filter(isWon);
  const conv=db.deals.length>0?Math.round(won.length/db.deals.length*100):0;
  const unread=db.emails.filter(e=>!e.read).length;
  const pendActs=db.activities.filter(a=>!a.done).length;
  const overdue=db.tasks.filter(t=>t.status!=="done"&&t.due&&new Date(t.due)<new Date()).length;

  const stagesB=db.pipelines[0]?.stages.map(s=>({
    ...s,
    deals:db.deals.filter(d=>d.pipelineId===db.pipelines[0].id&&d.stageId===s.id),
    total:db.deals.filter(d=>d.pipelineId===db.pipelines[0].id&&d.stageId===s.id).reduce((a,d)=>a+d.value,0),
  })).filter(s=>s.deals.length>0)||[];
  const maxV=Math.max(...stagesB.map(s=>s.total),1);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        <KPI label="Active Pipeline"     value={money(active.reduce((s,d)=>s+d.value,0))} sub={`${active.length} opportunities`}     color={T.teal}  icon="funnel"/>
        <KPI label="Total Won"            value={money(won.reduce((s,d)=>s+d.value,0))}   sub={`${won.length} deals closed`}          color={T.green} icon="trend"/>
        <KPI label="Conversion Rate"      value={`${conv}%`}                               sub="all-time"                              color={T.amber} icon="chart"/>
        <KPI label="Contacts"             value={db.contacts.length}                       sub={`${db.contacts.filter(c=>c.status==="lead").length} active leads`} color={T.teal} icon="users"/>
        <KPI label="Pending Activities"   value={pendActs}                                 sub={`${overdue} tasks overdue`}            color={overdue>0?T.red:T.teal} icon="lightning"/>
        <KPI label="Unread Emails"        value={unread}                                   sub="in inbox"                              color={unread>0?T.amber:T.teal} icon="mail"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16}}>
        <Card style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:13,color:T.white,marginBottom:16,display:"flex",alignItems:"center",gap:7}}>
            <Ico k="funnel" size={14} style={{color:T.teal}}/> B2B Sales Pipeline
          </div>
          {stagesB.map(s=>(
            <div key={s.id} style={{marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,alignItems:"center"}}>
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:s.color}}/>
                  <span style={{fontSize:12,color:T.whiteOff}}>{s.name}</span>
                </div>
                <div>
                  <span style={{fontWeight:700,color:T.white,fontSize:12}}>{money(s.total)}</span>
                  <span style={{color:T.whiteDim,fontSize:10,marginLeft:5}}>{s.deals.length} deal{s.deals.length!==1?"s":""}</span>
                </div>
              </div>
              <Progress value={s.total/maxV*100} color={s.color} h={6}/>
            </div>
          ))}
        </Card>

        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          {[
            {label:"Overdue tasks",      val:overdue,     color:T.red,   icon:"check",    warn:overdue>0},
            {label:"Unread emails",      val:unread,      color:T.amber, icon:"mail",     warn:unread>0},
            {label:"Pending activities", val:pendActs,    color:T.teal,  icon:"lightning",warn:false},
            {label:"Avg. lead score",    val:Math.round(db.contacts.reduce((s,c)=>s+c.score,0)/Math.max(db.contacts.length,1)), color:T.green, icon:"star", warn:false},
          ].map(item=>(
            <Card key={item.label} style={{padding:"13px 16px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:9,background:item.color+"15",display:"flex",alignItems:"center",justifyContent:"center",color:item.color,flexShrink:0}}>
                <Ico k={item.icon} size={16}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:T.whiteDim}}>{item.label}</div>
                <div style={{fontSize:20,fontWeight:800,color:item.warn?item.color:T.white}}>{item.val}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:13,color:T.white,marginBottom:14}}>Recent Activity</div>
          {[...db.activities].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5).map(act=>{
            const contact=db.contacts.find(c=>c.id===act.contactId);
            const cfg=ACT_CFG[act.type];
            return(
              <div key={act.id} style={{display:"flex",gap:11,marginBottom:12,alignItems:"flex-start"}}>
                <span style={{fontSize:16,flexShrink:0,marginTop:1}}>{cfg.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:act.done?T.whiteDim:T.white,textDecoration:act.done?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{act.title}</div>
                  <div style={{fontSize:10,color:T.whiteDim}}>{contact?.name||""} · {fdtm(act.date)}</div>
                </div>
                {act.done&&<Chip label="✓" color={T.green}/>}
              </div>
            );
          })}
        </Card>

        <Card style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:13,color:T.white,marginBottom:14}}>Top Deals</div>
          {[...db.deals].filter(d=>!isLost(d)).sort((a,b)=>b.value-a.value).slice(0,4).map(deal=>{
            const pl=db.pipelines.find(p=>p.id===deal.pipelineId);
            const st=pl?.stages.find(s=>s.id===deal.stageId);
            const contact=db.contacts.find(c=>c.id===deal.contactId);
            return(
              <div key={deal.id} style={{display:"flex",gap:11,marginBottom:12,alignItems:"center"}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:T.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{deal.title}</div>
                  <div style={{fontSize:10,color:T.whiteDim}}>{contact?.name} · closes {fdate(deal.closeDate)}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.green}}>{money(deal.value)}</div>
                  {st&&<Chip label={st.name} color={st.color}/>}
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   CONTACTS
═══════════════════════════════════════════════════ */
const Contacts = ({db,setDb})=>{
  const [search,setSearch]=useState("");
  const [statusF,setStatusF]=useState("all");
  const [viewMode,setViewMode]=useState("table");
  const [showForm,setShowForm]=useState(false);
  const [editing,setEditing]=useState(null);
  const [detail,setDetail]=useState(null);

  const filtered=db.contacts.filter(c=>
    (statusF==="all"||c.status===statusF)&&
    [c.name,c.email,c.company,c.position].some(v=>v?.toLowerCase().includes(search.toLowerCase()))
  );

  const save=(form)=>{
    const colors=[T.teal,T.green,T.amber,"#A78BFA","#F472B6","#60A5FA"];
    if(editing){
      setDb(d=>({...d,contacts:d.contacts.map(c=>c.id===editing.id?{...editing,...form}:c)}));
    }else{
      setDb(d=>({...d,contacts:[{...form,id:"c"+uid(),color:colors[Math.floor(Math.random()*colors.length)],created:new Date().toISOString().slice(0,10),lastSeen:new Date().toISOString().slice(0,10),...d.contacts.length===0?{}:{}},  ...d.contacts]}));
    }
    setShowForm(false);setEditing(null);
  };
  const del=(id)=>{if(confirm("Delete contact?"))setDb(d=>({...d,contacts:d.contacts.filter(c=>c.id!==id)}));};

  const ContactFormInner = ({init={},onSave,onCancel})=>{
    const [f,setF]=useState({name:"",email:"",phone:"",company:"",position:"",status:"lead",source:"Web",value:0,score:50,tags:"",notes:"",...init,tags:(init.tags||[]).join(", ")});
    const s=k=>e=>setF(p=>({...p,[k]:e.target.value}));
    return(
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
        <Field label="Full Name *"><Inp value={f.name} onChange={s("name")} placeholder="Jane Smith"/></Field>
        <Field label="Email"><Inp value={f.email} onChange={s("email")} placeholder="jane@company.com"/></Field>
        <Field label="Phone"><Inp value={f.phone} onChange={s("phone")} placeholder="+1 555-000-0000"/></Field>
        <Field label="Company"><Inp value={f.company} onChange={s("company")} placeholder="Acme Corp"/></Field>
        <Field label="Position"><Inp value={f.position} onChange={s("position")} placeholder="CEO, VP Sales..."/></Field>
        <Field label="Status"><Sel value={f.status} onChange={s("status")}><option value="lead">Lead</option><option value="prospect">Prospect</option><option value="client">Client</option><option value="inactive">Inactive</option></Sel></Field>
        <Field label="Potential Value ($)"><Inp type="number" value={f.value} onChange={s("value")}/></Field>
        <Field label="Lead Score (0-100)"><Inp type="number" value={f.score} onChange={s("score")}/></Field>
        <Field label="Source"><Sel value={f.source} onChange={s("source")}><option>Web</option><option>LinkedIn</option><option>Referral</option><option>Event</option><option>Cold Call</option><option>Email</option><option>Other</option></Sel></Field>
        <Field label="Tags (comma-separated)"><Inp value={f.tags} onChange={s("tags")} placeholder="vip, tech, startup"/></Field>
        <Field label="Notes" col={2}><Inp value={f.notes} onChange={s("notes")} rows={3} placeholder="Observations..."/></Field>
        <div style={{gridColumn:"span 2",display:"flex",gap:9,justifyContent:"flex-end",paddingTop:8}}>
          <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
          <Btn onClick={()=>onSave({...f,value:+f.value,score:+f.score,tags:f.tags.split(",").map(t=>t.trim()).filter(Boolean),avatar:f.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()})}>Save Contact</Btn>
        </div>
      </div>
    );
  };

  return(
    <div>
      <SectionHeader title="Contacts" sub={`${db.contacts.length} total contacts`}
        actions={<Btn onClick={()=>{setEditing(null);setShowForm(true);}}><Ico k="plus" size={13}/>New Contact</Btn>}/>

      <div style={{display:"flex",gap:7,marginBottom:14,flexWrap:"wrap"}}>
        {[["all","All"],["client","Clients"],["lead","Leads"],["prospect","Prospects"],["inactive","Inactive"]].map(([k,label])=>(
          <button key={k} onClick={()=>setStatusF(k)}
            style={{padding:"4px 13px",borderRadius:20,border:`1px solid ${statusF===k?(STATUS_CFG[k]?.color||T.teal):T.border}`,background:statusF===k?(STATUS_CFG[k]?.color||T.teal)+"15":"transparent",color:statusF===k?(STATUS_CFG[k]?.color||T.teal):T.whiteDim,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            {label} <span style={{opacity:.6}}>{k==="all"?db.contacts.length:db.contacts.filter(c=>c.status===k).length}</span>
          </button>
        ))}
      </div>

      <div style={{display:"flex",gap:9,marginBottom:14,alignItems:"center"}}>
        <SearchBar value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email, company..."/>
        <SegCtrl value={viewMode} onChange={setViewMode} options={[{value:"table",label:"List",icon:"list"},{value:"cards",label:"Cards",icon:"grid"}]}/>
      </div>

      {viewMode==="table"&&(
        <Card>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <THead cols={["Contact","Company","Status","Score","Value","Source","Last Seen",""]}/>
            <tbody>
              {filtered.map(c=>{
                const sc=STATUS_CFG[c.status]||STATUS_CFG.lead;
                return(
                  <TR key={c.id} onClick={()=>setDetail(c)}>
                    <TD><div style={{display:"flex",gap:9,alignItems:"center"}}><Av text={c.avatar} color={c.color} size={32} fs={12}/><div><div style={{fontWeight:600,color:T.white,fontSize:12}}>{c.name}</div><div style={{fontSize:10,color:T.whiteDim}}>{c.email}</div></div></div></TD>
                    <TD><div style={{fontSize:12}}>{c.company}</div><div style={{fontSize:10,color:T.whiteDim}}>{c.position}</div></TD>
                    <TD><Chip label={sc.label} color={sc.color} bg={sc.bg}/></TD>
                    <TD><ScoreRing score={c.score} size={34}/></TD>
                    <TD style={{fontWeight:700,color:T.green}}>{money(c.value)}</TD>
                    <TD>{c.source}</TD>
                    <TD style={{fontSize:11}}>{fdate(c.lastSeen)}</TD>
                    <TD><div style={{display:"flex",gap:3}} onClick={e=>e.stopPropagation()}>
                      <Btn variant="ghost" size="sm" onClick={()=>{setEditing(c);setShowForm(true);}}><Ico k="edit" size={12}/></Btn>
                      <Btn variant="ghost" size="sm" onClick={()=>del(c.id)}><Ico k="trash" size={12}/></Btn>
                    </div></TD>
                  </TR>
                );
              })}
              {filtered.length===0&&<tr><td colSpan={8}><Empty text="No contacts found"/></td></tr>}
            </tbody>
          </table>
        </Card>
      )}

      {viewMode==="cards"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
          {filtered.map(c=>{
            const sc=STATUS_CFG[c.status]||STATUS_CFG.lead;
            return(
              <Card key={c.id} onClick={()=>setDetail(c)} style={{padding:17,cursor:"pointer",transition:"all .15s",border:`1px solid ${T.border}`}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color+"60";e.currentTarget.style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="";}}>
                <div style={{display:"flex",gap:11,marginBottom:13,alignItems:"flex-start"}}>
                  <Av text={c.avatar} color={c.color} size={42} fs={15}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,color:T.white,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                    <div style={{fontSize:11,color:T.whiteDim}}>{c.position}</div>
                  </div>
                  <ScoreRing score={c.score} size={34}/>
                </div>
                <div style={{fontSize:11,color:T.whiteOff,marginBottom:3}}>🏢 {c.company}</div>
                <div style={{fontSize:11,color:T.whiteDim,marginBottom:11}}>✉️ {c.email}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${T.border}`}}>
                  <Chip label={sc.label} color={sc.color} bg={sc.bg}/>
                  <span style={{fontSize:13,fontWeight:700,color:T.green}}>{money(c.value)}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={showForm} onClose={()=>{setShowForm(false);setEditing(null);}} title={editing?"Edit Contact":"New Contact"} width={680}>
        <ContactFormInner init={editing||{}} onSave={save} onCancel={()=>{setShowForm(false);setEditing(null);}}/>
      </Modal>

      <Modal open={!!detail} onClose={()=>setDetail(null)} title="Contact Detail" width={700}>
        {detail&&(
          <div>
            <div style={{display:"flex",gap:16,marginBottom:20,alignItems:"flex-start"}}>
              <Av text={detail.avatar} color={detail.color} size={60} fs={22}/>
              <div style={{flex:1}}>
                <div style={{fontSize:20,fontWeight:800,color:T.white,marginBottom:4}}>{detail.name}</div>
                <div style={{fontSize:13,color:T.whiteOff,marginBottom:8}}>{detail.position} at <strong>{detail.company}</strong></div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{(detail.tags||[]).map(t=><Chip key={t} label={t} color={T.teal}/>)}</div>
              </div>
              <ScoreRing score={detail.score} size={52}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <Card style={{padding:15}}>
                <div style={{fontSize:10,fontWeight:700,color:T.whiteDim,textTransform:"uppercase",letterSpacing:".07em",marginBottom:11}}>Contact Info</div>
                {[["phone",detail.phone,"Phone"],["mail",detail.email,"Email"],["calendar",fdate(detail.created),"Created"],["link",detail.source,"Source"]].map(([icon,val,lbl])=>(
                  <div key={lbl} style={{display:"flex",gap:9,marginBottom:9,alignItems:"center"}}>
                    <Ico k={icon} size={13} style={{color:T.teal}}/>
                    <div><div style={{fontSize:9,color:T.whiteDim}}>{lbl}</div><div style={{fontSize:12,color:T.white}}>{val||"—"}</div></div>
                  </div>
                ))}
              </Card>
              <Card style={{padding:15}}>
                <div style={{fontSize:10,fontWeight:700,color:T.whiteDim,textTransform:"uppercase",letterSpacing:".07em",marginBottom:11}}>Financial</div>
                <div style={{fontSize:26,fontWeight:800,color:detail.color,marginBottom:4}}>{money(detail.value)}</div>
                <div style={{fontSize:11,color:T.whiteDim,marginBottom:14}}>Potential value</div>
                <Progress value={detail.score} color={detail.score>=80?T.green:detail.score>=50?T.amber:T.red} h={7}/>
                <div style={{fontSize:10,color:T.whiteDim,marginTop:4}}>Lead Score: {detail.score}/100</div>
              </Card>
            </div>
            {detail.notes&&<Card style={{padding:14,marginBottom:14}}><div style={{fontSize:12,color:T.whiteOff,lineHeight:1.7}}>{detail.notes}</div></Card>}
            <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
              <Btn variant="secondary" onClick={()=>setDetail(null)}>Close</Btn>
              <Btn onClick={()=>{setEditing(detail);setDetail(null);setShowForm(true);}}><Ico k="edit" size={13}/>Edit</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   PIPELINE + KANBAN
═══════════════════════════════════════════════════ */
const Pipeline = ({db,setDb})=>{
  const [tab,setTab]=useState("kanban");
  const [activePL,setActivePL]=useState(db.pipelines[0]?.id);
  const [showNewPL,setShowNewPL]=useState(false);
  const [newPL,setNewPL]=useState({name:"",color:T.teal});
  const [showDealForm,setShowDealForm]=useState(false);
  const [editDeal,setEditDeal]=useState(null);
  const [preStage,setPreStage]=useState(null);
  const [dragDeal,setDragDeal]=useState(null);
  const [dragOver,setDragOver]=useState(null);
  const [editStage,setEditStage]=useState(null);
  const [showAddStage,setShowAddStage]=useState(false);
  const [newStage,setNewStage]=useState({name:"",color:T.teal,probability:50});

  const pipeline=db.pipelines.find(p=>p.id===activePL);
  const plDeals=db.deals.filter(d=>d.pipelineId===activePL);

  const updPipeline=updated=>setDb(d=>({...d,pipelines:d.pipelines.map(p=>p.id===updated.id?updated:p)}));
  const delPipeline=id=>{
    if(!confirm("Delete pipeline?"))return;
    setDb(d=>({...d,pipelines:d.pipelines.filter(p=>p.id!==id)}));
    setActivePL(db.pipelines.find(p=>p.id!==id)?.id);
  };
  const createPL=()=>{
    if(!newPL.name.trim())return;
    const np={id:"pl"+uid(),name:newPL.name,color:newPL.color,isDefault:false,stages:[
      {id:"s"+uid(),name:"New Lead",     color:"#334D63",order:0,probability:10},
      {id:"s"+uid(),name:"In Progress",  color:"#60A5FA",order:1,probability:40},
      {id:"s"+uid(),name:"Proposal",     color:"#A78BFA",order:2,probability:60},
      {id:"s"+uid(),name:"Won",          color:T.green,  order:3,probability:100,isWon:true},
      {id:"s"+uid(),name:"Lost",         color:T.red,    order:4,probability:0,  isLost:true},
    ]};
    setDb(d=>({...d,pipelines:[...d.pipelines,np]}));
    setActivePL(np.id);setShowNewPL(false);setNewPL({name:"",color:T.teal});
  };
  const addStage=()=>{
    if(!newStage.name.trim())return;
    const s={id:"s"+uid(),name:newStage.name,color:newStage.color,probability:+newStage.probability,order:pipeline.stages.length};
    updPipeline({...pipeline,stages:[...pipeline.stages,s]});
    setShowAddStage(false);setNewStage({name:"",color:T.teal,probability:50});
  };
  const delStage=id=>updPipeline({...pipeline,stages:pipeline.stages.filter(s=>s.id!==id)});
  const moveStage=(id,dir)=>{
    const arr=[...pipeline.stages];
    const i=arr.findIndex(s=>s.id===id);
    const t=i+dir; if(t<0||t>=arr.length)return;
    [arr[i],arr[t]]=[arr[t],arr[i]];
    updPipeline({...pipeline,stages:arr.map((s,idx)=>({...s,order:idx}))});
  };

  const DealFormInner=({init={},onSave,onCancel})=>{
    const [f,setF]=useState({title:"",contactId:"",companyId:"",pipelineId:activePL,stageId:pipeline?.stages[0]?.id||"",value:0,prob:50,closeDate:"",owner:db.user?.name||"",tags:"",notes:"",...init,tags:(init.tags||[]).join(", ")});
    const s=k=>e=>setF(p=>({...p,[k]:e.target.value}));
    const curPL=db.pipelines.find(p=>p.id===f.pipelineId);
    return(
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
        <Field label="Deal Title *" col={2}><Inp value={f.title} onChange={s("title")} placeholder="e.g. Acme — Enterprise Plan"/></Field>
        <Field label="Pipeline"><Sel value={f.pipelineId} onChange={e=>{setF(p=>({...p,pipelineId:e.target.value,stageId:db.pipelines.find(pl=>pl.id===e.target.value)?.stages[0]?.id||""}));}}>
          {db.pipelines.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</Sel></Field>
        <Field label="Stage"><Sel value={f.stageId} onChange={s("stageId")}>{curPL?.stages.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Sel></Field>
        <Field label="Contact"><Sel value={f.contactId} onChange={s("contactId")}><option value="">— No contact —</option>{db.contacts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Sel></Field>
        <Field label="Company"><Sel value={f.companyId} onChange={s("companyId")}><option value="">— No company —</option>{db.companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Sel></Field>
        <Field label="Value ($)"><Inp type="number" value={f.value} onChange={s("value")}/></Field>
        <Field label="Probability (%)"><Inp type="number" value={f.prob} onChange={s("prob")}/></Field>
        <Field label="Close Date"><Inp type="date" value={f.closeDate} onChange={s("closeDate")}/></Field>
        <Field label="Owner"><Inp value={f.owner} onChange={s("owner")} placeholder="Salesperson name"/></Field>
        <Field label="Tags (comma)" col={2}><Inp value={f.tags} onChange={s("tags")} placeholder="priority, new, upsell"/></Field>
        <Field label="Notes" col={2}><Inp value={f.notes} onChange={s("notes")} rows={3} placeholder="Deal context..."/></Field>
        <div style={{gridColumn:"span 2",display:"flex",gap:9,justifyContent:"flex-end",paddingTop:8}}>
          <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
          <Btn onClick={()=>{if(!f.title.trim())return;onSave({...f,value:+f.value,prob:+f.prob,tags:f.tags.split(",").map(t=>t.trim()).filter(Boolean)});}}>Save Deal</Btn>
        </div>
      </div>
    );
  };

  const saveDeal=form=>{
    if(editDeal){setDb(d=>({...d,deals:d.deals.map(deal=>deal.id===editDeal.id?{...editDeal,...form}:deal)}));}
    else{setDb(d=>({...d,deals:[{...form,id:"d"+uid(),created:new Date().toISOString().slice(0,10)},  ...d.deals]}));}
    setShowDealForm(false);setEditDeal(null);setPreStage(null);
  };
  const delDeal=id=>{if(confirm("Delete deal?"))setDb(d=>({...d,deals:d.deals.filter(deal=>deal.id!==id)}));};

  return(
    <div>
      <SectionHeader title="Pipeline" sub="Manage your sales opportunities"
        actions={
          <div style={{display:"flex",gap:7}}>
            <SegCtrl value={tab} onChange={setTab} options={[{value:"kanban",label:"Kanban",icon:"board"},{value:"builder",label:"Configure",icon:"cog"}]}/>
            <Btn onClick={()=>{setEditDeal(null);setPreStage(null);setShowDealForm(true);}}><Ico k="plus" size={13}/>New Deal</Btn>
          </div>
        }/>

      <div style={{display:"flex",gap:7,marginBottom:18,alignItems:"center",flexWrap:"wrap"}}>
        {db.pipelines.map(pl=>(
          <button key={pl.id} onClick={()=>setActivePL(pl.id)}
            style={{padding:"6px 14px",borderRadius:7,border:`1px solid ${activePL===pl.id?pl.color:T.border}`,background:activePL===pl.id?pl.color+"15":"transparent",color:activePL===pl.id?pl.color:T.whiteDim,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:7,fontFamily:"inherit"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:pl.color}}/>
            {pl.name}
            <span style={{background:activePL===pl.id?pl.color+"25":T.bg3,color:activePL===pl.id?pl.color:T.whiteDim,borderRadius:10,padding:"0 7px",fontSize:10,fontWeight:700}}>
              {db.deals.filter(d=>d.pipelineId===pl.id).length}
            </span>
          </button>
        ))}
        <Btn variant="secondary" size="sm" onClick={()=>setShowNewPL(true)}><Ico k="plus" size={12}/>Pipeline</Btn>
      </div>

      {/* KANBAN */}
      {tab==="kanban"&&pipeline&&(
        <div style={{display:"flex",gap:11,overflowX:"auto",paddingBottom:14,minHeight:"62vh",alignItems:"flex-start"}}>
          {pipeline.stages.map(stage=>{
            const stageDeals=plDeals.filter(d=>d.stageId===stage.id);
            const isOver=dragOver===stage.id;
            const stageTotal=stageDeals.reduce((s,d)=>s+d.value,0);
            return(
              <div key={stage.id} style={{minWidth:255,maxWidth:255,display:"flex",flexDirection:"column",gap:8,flexShrink:0}}
                onDragOver={e=>{e.preventDefault();setDragOver(stage.id);}}
                onDrop={e=>{e.preventDefault();if(dragDeal)setDb(d=>({...d,deals:d.deals.map(deal=>deal.id===dragDeal.id?{...deal,stageId:stage.id}:deal)}));setDragDeal(null);setDragOver(null);}}
                onDragLeave={()=>setDragOver(null)}>
                {/* Column header */}
                <div style={{background:isOver?stage.color+"12":T.bg1,border:`1px solid ${isOver?stage.color:T.border}`,borderRadius:9,padding:"11px 13px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                    <div style={{width:9,height:9,borderRadius:"50%",background:stage.color}}/>
                    <span style={{fontSize:12,fontWeight:700,color:T.white,flex:1}}>{stage.name}</span>
                    <span style={{background:stage.color+"20",color:stage.color,borderRadius:10,padding:"0 7px",fontSize:10,fontWeight:700}}>{stageDeals.length}</span>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:T.teal}}>{money(stageTotal)}</div>
                  <div style={{fontSize:9,color:T.whiteDim}}>{stage.probability}% probability</div>
                </div>

                {/* Cards */}
                {stageDeals.map(deal=>{
                  const contact=db.contacts.find(c=>c.id===deal.contactId);
                  const pc=deal.prob>=70?T.green:deal.prob>=40?T.amber:T.red;
                  return(
                    <div key={deal.id} draggable onDragStart={()=>setDragDeal(deal)}
                      style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:9,padding:12,cursor:"grab",userSelect:"none",transition:"all .15s"}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=stage.color+"70";e.currentTarget.style.transform="translateY(-1px)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="";}}>
                      <div style={{fontSize:12,fontWeight:700,color:T.white,marginBottom:7,lineHeight:1.3}}>{deal.title}</div>
                      {contact&&<div style={{display:"flex",gap:6,alignItems:"center",marginBottom:7}}><Av text={contact.avatar} color={contact.color} size={20} fs={8}/><span style={{fontSize:10,color:T.whiteOff}}>{contact.name}</span></div>}
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                        <span style={{fontSize:14,fontWeight:800,color:T.green}}>{money(deal.value)}</span>
                        <span style={{fontSize:10,fontWeight:700,color:pc,background:pc+"15",padding:"2px 6px",borderRadius:9}}>{deal.prob}%</span>
                      </div>
                      <Progress value={deal.prob} color={pc} h={4}/>
                      {deal.closeDate&&<div style={{fontSize:10,color:T.whiteDim,marginTop:7}}>📅 {fdate(deal.closeDate)}</div>}
                      <div style={{display:"flex",gap:3,marginTop:9,justifyContent:"flex-end"}} onClick={e=>e.stopPropagation()}>
                        <Btn variant="ghost" size="sm" onClick={()=>{setEditDeal(deal);setShowDealForm(true);}}><Ico k="edit" size={11}/></Btn>
                        <Btn variant="ghost" size="sm" onClick={()=>delDeal(deal.id)}><Ico k="trash" size={11}/></Btn>
                      </div>
                    </div>
                  );
                })}

                <button onClick={()=>{setEditDeal(null);setPreStage(stage.id);setShowDealForm(true);}}
                  style={{background:"transparent",border:`1px dashed ${T.border}`,borderRadius:9,padding:"8px",color:T.whiteFade,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:5,justifyContent:"center",fontFamily:"inherit"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=stage.color}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                  <Ico k="plus" size={12}/>Add deal
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* PIPELINE BUILDER */}
      {tab==="builder"&&(
        <div>
          {db.pipelines.map(pl=>(
            <Card key={pl.id} style={{padding:20,marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:16}}>
                <div style={{width:11,height:11,borderRadius:"50%",background:pl.color}}/>
                <span style={{fontWeight:700,fontSize:14,color:T.white,flex:1}}>{pl.name}</span>
                {pl.isDefault&&<Chip label="Default" color={T.teal}/>}
                <span style={{fontSize:11,color:T.whiteDim}}>{db.deals.filter(d=>d.pipelineId===pl.id).length} deals</span>
                {!pl.isDefault&&<Btn variant="danger" size="sm" onClick={()=>delPipeline(pl.id)}><Ico k="trash" size={11}/>Delete</Btn>}
              </div>

              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                {pl.stages.map((stage,idx)=>(
                  <div key={stage.id} style={{position:"relative"}}>
                    {editStage===stage.id?(
                      <div style={{background:T.bg3,border:`1px solid ${T.border}`,borderRadius:9,padding:11,minWidth:180}}>
                        <Inp value={stage.name} onChange={e=>updPipeline({...pl,stages:pl.stages.map(s=>s.id===stage.id?{...s,name:e.target.value}:s)})} placeholder="Stage name" style={{marginBottom:8}}/>
                        <div style={{marginBottom:8}}><ColorPick value={stage.color} onChange={c=>updPipeline({...pl,stages:pl.stages.map(s=>s.id===stage.id?{...s,color:c}:s)})}/></div>
                        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
                          <span style={{fontSize:10,color:T.whiteDim}}>Probability %</span>
                          <Inp type="number" value={stage.probability} onChange={e=>updPipeline({...pl,stages:pl.stages.map(s=>s.id===stage.id?{...s,probability:+e.target.value}:s)})} style={{flex:1}}/>
                        </div>
                        <div style={{display:"flex",gap:5}}>
                          <Btn variant="success" size="sm" onClick={()=>setEditStage(null)}>OK</Btn>
                          {!stage.isWon&&!stage.isLost&&<Btn variant="danger" size="sm" onClick={()=>{delStage(stage.id);setEditStage(null);}}>Del</Btn>}
                        </div>
                      </div>
                    ):(
                      <div style={{display:"flex",gap:4,alignItems:"center"}}>
                        <div style={{display:"flex",gap:5,alignItems:"center",background:stage.color+"15",border:`1px solid ${stage.color}35`,borderRadius:7,padding:"5px 11px",cursor:"pointer"}}
                          onClick={()=>setEditStage(editStage===stage.id?null:stage.id)}>
                          <div style={{width:7,height:7,borderRadius:"50%",background:stage.color}}/>
                          <span style={{fontSize:11,fontWeight:600,color:stage.color,whiteSpace:"nowrap"}}>{stage.name}</span>
                          <span style={{fontSize:9,color:T.whiteDim}}>{stage.probability}%</span>
                          <Ico k="edit" size={10} style={{color:T.whiteDim}}/>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:1}}>
                          {idx>0&&<button onClick={()=>moveStage(stage.id,-1)} style={{background:"none",border:"none",color:T.whiteFade,cursor:"pointer",fontSize:9,lineHeight:1,padding:1}}>▲</button>}
                          {idx<pl.stages.length-1&&<button onClick={()=>moveStage(stage.id,1)} style={{background:"none",border:"none",color:T.whiteFade,cursor:"pointer",fontSize:9,lineHeight:1,padding:1}}>▼</button>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {pl.id===activePL&&(showAddStage?(
                  <div style={{background:T.bg3,border:`1px solid ${T.border}`,borderRadius:9,padding:11,minWidth:195}}>
                    <Inp value={newStage.name} onChange={e=>setNewStage(p=>({...p,name:e.target.value}))} placeholder="Stage name" style={{marginBottom:8}}/>
                    <div style={{marginBottom:8}}><ColorPick value={newStage.color} onChange={c=>setNewStage(p=>({...p,color:c}))}/></div>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9}}>
                      <span style={{fontSize:10,color:T.whiteDim}}>Prob %</span>
                      <Inp type="number" value={newStage.probability} onChange={e=>setNewStage(p=>({...p,probability:e.target.value}))} style={{flex:1}}/>
                    </div>
                    <div style={{display:"flex",gap:5}}>
                      <Btn onClick={addStage} disabled={!newStage.name.trim()}>Add</Btn>
                      <Btn variant="secondary" size="sm" onClick={()=>setShowAddStage(false)}>Cancel</Btn>
                    </div>
                  </div>
                ):(
                  <button onClick={()=>setShowAddStage(true)}
                    style={{display:"flex",alignItems:"center",gap:5,background:"transparent",border:`1px dashed ${T.border}`,borderRadius:7,padding:"5px 11px",color:T.whiteDim,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>
                    <Ico k="plus" size={12}/>Add Stage
                  </button>
                ))}
              </div>
              <div style={{fontSize:10,color:T.whiteDim}}>💡 Click a stage to edit · Drag deals on the Kanban to move between stages</div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showNewPL} onClose={()=>setShowNewPL(false)} title="New Pipeline" width={420}>
        <Field label="Pipeline Name"><Inp value={newPL.name} onChange={e=>setNewPL(p=>({...p,name:e.target.value}))} placeholder="e.g. Enterprise Partnerships"/></Field>
        <div style={{marginTop:13}}><Lbl>Color</Lbl><ColorPick value={newPL.color} onChange={c=>setNewPL(p=>({...p,color:c}))}/></div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:18}}>
          <Btn variant="secondary" onClick={()=>setShowNewPL(false)}>Cancel</Btn>
          <Btn onClick={createPL} disabled={!newPL.name.trim()}>Create Pipeline</Btn>
        </div>
      </Modal>

      <Modal open={showDealForm} onClose={()=>{setShowDealForm(false);setEditDeal(null);}} title={editDeal?"Edit Deal":"New Deal"} width={680}>
        <DealFormInner init={editDeal||(preStage?{pipelineId:activePL,stageId:preStage}:{pipelineId:activePL,stageId:pipeline?.stages[0]?.id})} onSave={saveDeal} onCancel={()=>{setShowDealForm(false);setEditDeal(null);}}/>
      </Modal>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   DEALS LIST
═══════════════════════════════════════════════════ */
const Deals=({db,setDb})=>{
  const [search,setSearch]=useState("");
  const [fPL,setFPL]=useState("all");
  const [fStage,setFStage]=useState("all");
  const filtered=db.deals.filter(d=>(fPL==="all"||d.pipelineId===fPL)&&(fStage==="all"||d.stageId===fStage)&&d.title.toLowerCase().includes(search.toLowerCase()));
  const curStages=fPL!=="all"?db.pipelines.find(p=>p.id===fPL)?.stages||[]:[];
  const isWon=d=>{const pl=db.pipelines.find(p=>p.id===d.pipelineId);return pl?.stages.find(s=>s.id===d.stageId)?.isWon;};
  const total=filtered.reduce((s,d)=>s+d.value,0);
  const won=filtered.filter(isWon);
  const del=id=>{if(confirm("Delete?"))setDb(d=>({...d,deals:d.deals.filter(deal=>deal.id!==id)}));};

  return(
    <div>
      <SectionHeader title="Deals" sub={`${filtered.length} opportunities · ${money(total)} pipeline`}/>
      <div style={{display:"flex",gap:11,marginBottom:16,flexWrap:"wrap"}}>
        <KPI label="Total Pipeline" value={money(total)} color={T.teal}/>
        <KPI label="Won" value={money(won.reduce((s,d)=>s+d.value,0))} color={T.green} sub={`${won.length} deals`}/>
        <KPI label="Active Deals" value={filtered.filter(d=>!isWon(d)).length} color={T.amber}/>
      </div>
      <div style={{display:"flex",gap:9,marginBottom:14,flexWrap:"wrap"}}>
        <SearchBar value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search deals..."/>
        <Sel value={fPL} onChange={e=>{setFPL(e.target.value);setFStage("all");}} style={{width:180}}>
          <option value="all">All Pipelines</option>
          {db.pipelines.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </Sel>
        {curStages.length>0&&<Sel value={fStage} onChange={e=>setFStage(e.target.value)} style={{width:180}}>
          <option value="all">All Stages</option>
          {curStages.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
        </Sel>}
      </div>
      <Card>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <THead cols={["Deal","Contact","Pipeline · Stage","Value","Prob.","Close","Owner",""]}/>
          <tbody>
            {filtered.map(deal=>{
              const contact=db.contacts.find(c=>c.id===deal.contactId);
              const pl=db.pipelines.find(p=>p.id===deal.pipelineId);
              const st=pl?.stages.find(s=>s.id===deal.stageId);
              const pc=deal.prob>=70?T.green:deal.prob>=40?T.amber:T.red;
              return(
                <TR key={deal.id}>
                  <TD><div style={{fontWeight:600,color:T.white,fontSize:12}}>{deal.title}</div><div style={{fontSize:10,color:T.whiteDim}}>{fdate(deal.created)}</div></TD>
                  <TD>{contact?<div style={{display:"flex",gap:7,alignItems:"center"}}><Av text={contact.avatar} color={contact.color} size={24} fs={9}/><span style={{fontSize:11}}>{contact.name}</span></div>:<span style={{color:T.whiteFade}}>—</span>}</TD>
                  <TD><div style={{fontSize:10,color:T.whiteDim,marginBottom:3}}>{pl?.name}</div>{st&&<Chip label={st.name} color={st.color}/>}</TD>
                  <TD style={{fontWeight:700,color:T.green,fontSize:13}}>{money(deal.value)}</TD>
                  <TD><div style={{display:"flex",gap:5,alignItems:"center"}}><div style={{width:36}}><Progress value={deal.prob} color={pc} h={4}/></div><span style={{fontSize:10,color:pc,fontWeight:700}}>{deal.prob}%</span></div></TD>
                  <TD style={{fontSize:11}}>{fdate(deal.closeDate)}</TD>
                  <TD style={{fontSize:11}}>{deal.owner}</TD>
                  <TD><Btn variant="ghost" size="sm" onClick={()=>del(deal.id)}><Ico k="trash" size={12}/></Btn></TD>
                </TR>
              );
            })}
            {filtered.length===0&&<tr><td colSpan={8}><Empty text="No deals found"/></td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   ACTIVITIES
═══════════════════════════════════════════════════ */
const Activities=({db,setDb})=>{
  const [showForm,setShowForm]=useState(false);
  const [f,setF]=useState({type:"call",title:"",contactId:"",dealId:"",date:"",duration:30,owner:db.user?.name||"",notes:"",done:false});
  const s=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const save=()=>{
    if(!f.title.trim())return;
    setDb(d=>({...d,activities:[{...f,id:"a"+uid(),contactId:f.contactId||null,dealId:f.dealId||null,duration:+f.duration},...d.activities]}));
    setShowForm(false);setF({type:"call",title:"",contactId:"",dealId:"",date:"",duration:30,owner:db.user?.name||"",notes:"",done:false});
  };
  const toggle=id=>setDb(d=>({...d,activities:d.activities.map(a=>a.id===id?{...a,done:!a.done}:a)}));
  const del=id=>setDb(d=>({...d,activities:d.activities.filter(a=>a.id!==id)}));
  const pending=db.activities.filter(a=>!a.done).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const done=db.activities.filter(a=>a.done).sort((a,b)=>new Date(b.date)-new Date(a.date));

  const Row=({act})=>{
    const contact=db.contacts.find(c=>c.id===act.contactId);
    const cfg=ACT_CFG[act.type];
    return(
      <div style={{display:"flex",gap:11,padding:"12px 15px",borderBottom:`1px solid ${T.border}`,alignItems:"center",opacity:act.done?.55:1}}>
        <button onClick={()=>toggle(act.id)} style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${act.done?T.green:cfg.color}`,background:act.done?T.green:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {act.done&&<Ico k="check" size={10} style={{color:"#000"}}/>}
        </button>
        <span style={{fontSize:16,flexShrink:0}}>{cfg.icon}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:600,color:act.done?T.whiteDim:T.white,textDecoration:act.done?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{act.title}</div>
          <div style={{fontSize:10,color:T.whiteDim}}>{contact&&<span>{contact.name} · </span>}{fdtm(act.date)}{act.duration>0&&` · ${act.duration}min`}</div>
          {act.notes&&<div style={{fontSize:10,color:T.whiteOff,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{act.notes}</div>}
        </div>
        <Chip label={cfg.label} color={cfg.color}/>
        <Btn variant="ghost" size="sm" onClick={()=>del(act.id)}><Ico k="trash" size={11}/></Btn>
      </div>
    );
  };

  return(
    <div>
      <SectionHeader title="Activities" sub={`${pending.length} pending · ${done.length} done`}
        actions={<Btn onClick={()=>setShowForm(true)}><Ico k="plus" size={13}/>New Activity</Btn>}/>
      <div style={{display:"flex",gap:9,marginBottom:18}}>
        {Object.entries(ACT_CFG).map(([k,v])=>(
          <div key={k} style={{display:"flex",gap:6,alignItems:"center",background:T.bg1,border:`1px solid ${T.border}`,borderRadius:7,padding:"5px 11px"}}>
            <span>{v.icon}</span><span style={{fontSize:11,color:T.whiteDim}}>{v.label}:</span><span style={{fontSize:12,fontWeight:700,color:v.color}}>{db.activities.filter(a=>a.type===k).length}</span>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div>
          <div style={{fontWeight:700,fontSize:11,color:T.whiteDim,marginBottom:9,textTransform:"uppercase",letterSpacing:".07em"}}>Pending ({pending.length})</div>
          <Card>{pending.length===0?<Empty text="No pending activities 🎉"/>:pending.map(a=><Row key={a.id} act={a}/>)}</Card>
        </div>
        <div>
          <div style={{fontWeight:700,fontSize:11,color:T.whiteDim,marginBottom:9,textTransform:"uppercase",letterSpacing:".07em"}}>Completed ({done.length})</div>
          <Card>{done.length===0?<Empty text="No completed activities"/>:done.map(a=><Row key={a.id} act={a}/>)}</Card>
        </div>
      </div>
      <Modal open={showForm} onClose={()=>setShowForm(false)} title="New Activity" width={540}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          <Field label="Type"><Sel value={f.type} onChange={s("type")}><option value="call">📞 Call</option><option value="meeting">📅 Meeting</option><option value="email">✉️ Email</option><option value="task">✅ Task</option></Sel></Field>
          <Field label="Title *"><Inp value={f.title} onChange={s("title")} placeholder="Activity description..."/></Field>
          <Field label="Contact"><Sel value={f.contactId} onChange={s("contactId")}><option value="">— None —</option>{db.contacts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Sel></Field>
          <Field label="Deal"><Sel value={f.dealId} onChange={s("dealId")}><option value="">— None —</option>{db.deals.map(d=><option key={d.id} value={d.id}>{d.title.slice(0,28)}</option>)}</Sel></Field>
          <Field label="Date & Time"><Inp type="datetime-local" value={f.date} onChange={s("date")}/></Field>
          <Field label="Duration (min)"><Inp type="number" value={f.duration} onChange={s("duration")}/></Field>
          <Field label="Owner" col={2}><Inp value={f.owner} onChange={s("owner")} placeholder="Name..."/></Field>
          <Field label="Notes" col={2}><Inp value={f.notes} onChange={s("notes")} rows={3} placeholder="Activity notes..."/></Field>
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:14}}>
          <Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancel</Btn>
          <Btn onClick={save} disabled={!f.title.trim()}>Save</Btn>
        </div>
      </Modal>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TASKS
═══════════════════════════════════════════════════ */
const Tasks=({db,setDb})=>{
  const [showForm,setShowForm]=useState(false);
  const [f,setF]=useState({title:"",priority:"medium",status:"todo",assignee:"",due:"",contactId:"",dealId:"",desc:""});
  const s=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const save=()=>{
    if(!f.title.trim())return;
    setDb(d=>({...d,tasks:[{...f,id:"t"+uid(),contactId:f.contactId||null,dealId:f.dealId||null},...d.tasks]}));
    setShowForm(false);setF({title:"",priority:"medium",status:"todo",assignee:"",due:"",contactId:"",dealId:"",desc:""});
  };
  const upd=(id,status)=>setDb(d=>({...d,tasks:d.tasks.map(t=>t.id===id?{...t,status}:t)}));
  const del=id=>setDb(d=>({...d,tasks:d.tasks.filter(t=>t.id!==id)}));
  const COLS=[{id:"todo",label:"To Do",color:T.whiteDim},{id:"inprogress",label:"In Progress",color:T.teal},{id:"done",label:"Done",color:T.green}];

  return(
    <div>
      <SectionHeader title="Tasks" sub={`${db.tasks.filter(t=>t.status!=="done").length} pending`}
        actions={<Btn onClick={()=>setShowForm(true)}><Ico k="plus" size={13}/>New Task</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:13}}>
        {COLS.map(col=>{
          const tasks=db.tasks.filter(t=>t.status===col.id);
          return(
            <div key={col.id}>
              <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:9,padding:"6px 11px",background:T.bg1,border:`1px solid ${T.border}`,borderRadius:7}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:col.color}}/>
                <span style={{fontSize:11,fontWeight:700,color:T.white}}>{col.label}</span>
                <span style={{marginLeft:"auto",background:col.color+"20",color:col.color,borderRadius:10,padding:"0 7px",fontSize:10,fontWeight:700}}>{tasks.length}</span>
              </div>
              {tasks.map(task=>{
                const pc=PRIO_CFG[task.priority];
                const contact=db.contacts.find(c=>c.id===task.contactId);
                const overdue=task.status!=="done"&&task.due&&new Date(task.due)<new Date();
                return(
                  <Card key={task.id} style={{padding:13,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                      <Chip label={pc.label} color={pc.color} bg={pc.bg}/>
                      <Btn variant="ghost" size="sm" onClick={()=>del(task.id)}><Ico k="trash" size={11}/></Btn>
                    </div>
                    <div style={{fontSize:12,fontWeight:600,color:T.white,marginBottom:4}}>{task.title}</div>
                    {task.desc&&<div style={{fontSize:10,color:T.whiteDim,marginBottom:7,lineHeight:1.5}}>{task.desc}</div>}
                    {contact&&<div style={{fontSize:10,color:T.whiteOff,marginBottom:5}}>👤 {contact.name}</div>}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:9}}>
                      <span style={{fontSize:10,color:overdue?T.red:T.whiteDim,fontWeight:overdue?700:400}}>{overdue?"⚠️ ":"📅 "}{fdate(task.due)}</span>
                      <Sel value={task.status} onChange={e=>upd(task.id,e.target.value)} style={{width:"auto",padding:"3px 7px",fontSize:10}}>
                        <option value="todo">To Do</option><option value="inprogress">In Progress</option><option value="done">Done</option>
                      </Sel>
                    </div>
                  </Card>
                );
              })}
              {tasks.length===0&&<div style={{padding:14,border:`1px dashed ${T.border}`,borderRadius:9,textAlign:"center",color:T.whiteFade,fontSize:11}}>Empty</div>}
            </div>
          );
        })}
      </div>
      <Modal open={showForm} onClose={()=>setShowForm(false)} title="New Task" width={540}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          <Field label="Title *" col={2}><Inp value={f.title} onChange={s("title")} placeholder="Task description"/></Field>
          <Field label="Priority"><Sel value={f.priority} onChange={s("priority")}><option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option></Sel></Field>
          <Field label="Due Date"><Inp type="date" value={f.due} onChange={s("due")}/></Field>
          <Field label="Assignee"><Inp value={f.assignee} onChange={s("assignee")} placeholder="Name..."/></Field>
          <Field label="Status"><Sel value={f.status} onChange={s("status")}><option value="todo">To Do</option><option value="inprogress">In Progress</option><option value="done">Done</option></Sel></Field>
          <Field label="Contact"><Sel value={f.contactId} onChange={s("contactId")}><option value="">— None —</option>{db.contacts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Sel></Field>
          <Field label="Deal"><Sel value={f.dealId} onChange={s("dealId")}><option value="">— None —</option>{db.deals.map(d=><option key={d.id} value={d.id}>{d.title.slice(0,28)}</option>)}</Sel></Field>
          <Field label="Description" col={2}><Inp value={f.desc} onChange={s("desc")} rows={3} placeholder="Details..."/></Field>
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:14}}>
          <Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancel</Btn>
          <Btn onClick={save} disabled={!f.title.trim()}>Save</Btn>
        </div>
      </Modal>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   EMAIL TEMPLATES MODULE
═══════════════════════════════════════════════════ */
const EmailTemplates=({db,setDb})=>{
  const [showForm,setShowForm]=useState(false);
  const [editing,setEditing]=useState(null);
  const [preview,setPreview]=useState(null);
  const [catFilter,setCatFilter]=useState("all");
  const [f,setF]=useState({name:"",subject:"",category:"outreach",body:""});
  const s=k=>e=>setF(p=>({...p,[k]:e.target.value}));

  const filtered=db.emailTemplates.filter(t=>catFilter==="all"||t.category===catFilter);

  const extractVars=(body,subj)=>{
    const matches=[...(body||"").matchAll(/\{\{(\w+)\}\}/g),...(subj||"").matchAll(/\{\{(\w+)\}\}/g)];
    return [...new Set(matches.map(m=>m[1]))];
  };

  const save=()=>{
    if(!f.name.trim())return;
    const vars=extractVars(f.body,f.subject);
    if(editing){
      setDb(d=>({...d,emailTemplates:d.emailTemplates.map(t=>t.id===editing.id?{...editing,...f,variables:vars}:t)}));
    }else{
      setDb(d=>({...d,emailTemplates:[...d.emailTemplates,{...f,id:"tpl"+uid(),variables:vars}]}));
    }
    setShowForm(false);setEditing(null);setF({name:"",subject:"",category:"outreach",body:""});
  };
  const del=id=>{if(confirm("Delete template?"))setDb(d=>({...d,emailTemplates:d.emailTemplates.filter(t=>t.id!==id)}));};
  const dup=tpl=>{const copy={...tpl,id:"tpl"+uid(),name:tpl.name+" (copy)"};setDb(d=>({...d,emailTemplates:[...d.emailTemplates,copy]}));};

  return(
    <div>
      <SectionHeader title="Email Templates" sub={`${db.emailTemplates.length} templates · Use {{variable}} syntax for dynamic content`}
        actions={<Btn onClick={()=>{setEditing(null);setF({name:"",subject:"",category:"outreach",body:""});setShowForm(true);}}><Ico k="plus" size={13}/>New Template</Btn>}/>

      {/* Category filter */}
      <div style={{display:"flex",gap:7,marginBottom:16,flexWrap:"wrap"}}>
        {[["all","All Templates",T.teal],...Object.entries(TPL_CATS).map(([k,v])=>[k,v.label,v.color])].map(([k,label,color])=>(
          <button key={k} onClick={()=>setCatFilter(k)}
            style={{padding:"4px 13px",borderRadius:20,border:`1px solid ${catFilter===k?color:T.border}`,background:catFilter===k?color+"15":"transparent",color:catFilter===k?color:T.whiteDim,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            {label} {k==="all"&&<span style={{opacity:.6}}>{db.emailTemplates.length}</span>}
          </button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:13}}>
        {filtered.map(tpl=>{
          const catCfg=TPL_CATS[tpl.category]||TPL_CATS.outreach;
          return(
            <Card key={tpl.id} style={{padding:18,display:"flex",flexDirection:"column",gap:11}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:T.white,marginBottom:4}}>{tpl.name}</div>
                  <Chip label={catCfg.label} color={catCfg.color}/>
                </div>
                <div style={{display:"flex",gap:3}}>
                  <Btn variant="ghost" size="sm" onClick={()=>setPreview(tpl)}><Ico k="eye" size={12}/></Btn>
                  <Btn variant="ghost" size="sm" onClick={()=>{setEditing(tpl);setF({name:tpl.name,subject:tpl.subject,category:tpl.category,body:tpl.body});setShowForm(true);}}><Ico k="edit" size={12}/></Btn>
                  <Btn variant="ghost" size="sm" onClick={()=>dup(tpl)}><Ico k="copy" size={12}/></Btn>
                  <Btn variant="ghost" size="sm" onClick={()=>del(tpl.id)}><Ico k="trash" size={12}/></Btn>
                </div>
              </div>

              <div style={{fontSize:11,fontWeight:600,color:T.whiteOff,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                📧 {tpl.subject}
              </div>

              <div style={{fontSize:11,color:T.whiteDim,lineHeight:1.6,flex:1,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical"}}>
                {tpl.body.slice(0,120)}...
              </div>

              {tpl.variables?.length>0&&(
                <div>
                  <div style={{fontSize:9,fontWeight:700,color:T.whiteDim,textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>Variables</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {tpl.variables.map(v=>(
                      <span key={v} style={{background:T.teal+"12",color:T.teal,border:`1px solid ${T.teal}25`,borderRadius:4,padding:"1px 6px",fontSize:10,fontFamily:"monospace"}}>
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Template form */}
      <Modal open={showForm} onClose={()=>{setShowForm(false);setEditing(null);}} title={editing?"Edit Template":"New Email Template"} width={720}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          <Field label="Template Name *"><Inp value={f.name} onChange={s("name")} placeholder="e.g. Initial Outreach"/></Field>
          <Field label="Category"><Sel value={f.category} onChange={s("category")}>{Object.entries(TPL_CATS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</Sel></Field>
          <Field label="Email Subject *" col={2}><Inp value={f.subject} onChange={s("subject")} placeholder="Subject line — use {{variable}} for dynamic content"/></Field>
          <Field label="Email Body *" col={2}>
            <Inp value={f.body} onChange={s("body")} rows={12} placeholder={"Write your email here...\n\nUse {{first_name}}, {{company_name}}, etc. for personalization.\n\nExample:\nHi {{first_name}},\n\nI'd love to connect with {{company_name}}..."}/>
          </Field>
        </div>
        <div style={{background:T.bg3,border:`1px solid ${T.border}`,borderRadius:8,padding:12,marginTop:12}}>
          <div style={{fontSize:10,fontWeight:700,color:T.teal,marginBottom:5}}>💡 Variable Tips</div>
          <div style={{fontSize:11,color:T.whiteDim,lineHeight:1.7}}>
            Use <code style={{background:T.bg0,padding:"1px 5px",borderRadius:4,color:T.teal,fontSize:10}}>{"{{variable_name}}"}</code> for dynamic fields. Common variables: <code style={{background:T.bg0,padding:"1px 5px",borderRadius:4,color:T.teal,fontSize:10}}>{"{{first_name}}"}</code> <code style={{background:T.bg0,padding:"1px 5px",borderRadius:4,color:T.teal,fontSize:10}}>{"{{company_name}}"}</code> <code style={{background:T.bg0,padding:"1px 5px",borderRadius:4,color:T.teal,fontSize:10}}>{"{{sender_name}}"}</code>
          </div>
          {(f.body||f.subject)&&(
            <div style={{marginTop:8}}>
              <span style={{fontSize:10,fontWeight:700,color:T.whiteDim}}>Detected variables: </span>
              {extractVars(f.body,f.subject).map(v=>(
                <span key={v} style={{background:T.teal+"12",color:T.teal,border:`1px solid ${T.teal}25`,borderRadius:4,padding:"1px 6px",fontSize:10,fontFamily:"monospace",marginLeft:4}}>{`{{${v}}}`}</span>
              ))}
              {extractVars(f.body,f.subject).length===0&&<span style={{fontSize:10,color:T.whiteDim}}>none detected yet</span>}
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:14}}>
          <Btn variant="secondary" onClick={()=>{setShowForm(false);setEditing(null);}}>Cancel</Btn>
          <Btn onClick={save} disabled={!f.name.trim()||!f.body.trim()}>Save Template</Btn>
        </div>
      </Modal>

      {/* Preview modal */}
      <Modal open={!!preview} onClose={()=>setPreview(null)} title={`Preview: ${preview?.name}`} width={660}>
        {preview&&(
          <div>
            <div style={{background:T.bg3,borderRadius:9,padding:"10px 14px",marginBottom:12}}>
              <span style={{fontSize:10,color:T.whiteDim}}>Subject: </span>
              <span style={{fontSize:13,fontWeight:600,color:T.white}}>{preview.subject}</span>
            </div>
            <div style={{background:T.bg3,borderRadius:9,padding:16,fontSize:13,color:T.whiteOff,lineHeight:1.8,whiteSpace:"pre-wrap",fontFamily:"inherit"}}>
              {preview.body}
            </div>
            {preview.variables?.length>0&&(
              <div style={{marginTop:14}}>
                <div style={{fontSize:11,fontWeight:700,color:T.whiteDim,marginBottom:8}}>Variables to replace ({preview.variables.length}):</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {preview.variables.map(v=>(
                    <span key={v} style={{background:T.tealSoft,color:T.teal,border:`1px solid ${T.teal}30`,borderRadius:5,padding:"3px 9px",fontSize:11,fontFamily:"monospace"}}>{`{{${v}}}`}</span>
                  ))}
                </div>
              </div>
            )}
            <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:16}}>
              <Btn variant="secondary" onClick={()=>setPreview(null)}>Close</Btn>
              <Btn onClick={()=>{setEditing(preview);setF({name:preview.name,subject:preview.subject,category:preview.category,body:preview.body});setPreview(null);setShowForm(true);}}><Ico k="edit" size={13}/>Edit</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   EMAIL MODULE (Inbox + Compose with Templates)
═══════════════════════════════════════════════════ */
const EmailModule=({db,setDb})=>{
  const [selected,setSelected]=useState(null);
  const [folder,setFolder]=useState("inbox");
  const [showCompose,setShowCompose]=useState(false);
  const [compose,setCompose]=useState({to:"",subject:"",body:"",templateId:""});
  const [varValues,setVarValues]=useState({});
  const [selectedTpl,setSelectedTpl]=useState(null);
  const cc=k=>e=>setCompose(p=>({...p,[k]:e.target.value}));

  const folderEmails=db.emails.filter(e=>e.folder===folder);
  const unread=db.emails.filter(e=>!e.read&&e.folder==="inbox").length;
  const markRead=id=>setDb(d=>({...d,emails:d.emails.map(e=>e.id===id?{...e,read:true}:e)}));
  const del=id=>setDb(d=>({...d,emails:d.emails.filter(e=>e.id!==id)}));

  const applyTemplate=(tpl)=>{
    setSelectedTpl(tpl);
    const vars={};
    (tpl.variables||[]).forEach(v=>{vars[v]="";});
    setVarValues(vars);
    setCompose(p=>({...p,subject:tpl.subject,body:tpl.body,templateId:tpl.id}));
  };

  const renderBody=()=>{
    let body=compose.body;
    let subj=compose.subject;
    Object.entries(varValues).forEach(([k,v])=>{
      const re=new RegExp(`\\{\\{${k}\\}\\}`,"g");
      body=body.replace(re,v||`{{${k}}}`);
      subj=subj.replace(re,v||`{{${k}}}`);
    });
    return{body,subj};
  };

  const sendEmail=()=>{
    const{body,subj}=renderBody();
    const sent={id:"e"+uid(),folder:"sent",from:db.user.email||"me@company.com",to:compose.to,subject:subj,body,date:new Date().toISOString().replace("T"," ").slice(0,16),read:true,contactId:null,templateId:compose.templateId||null};
    setDb(d=>({...d,emails:[...d.emails,sent]}));
    alert(`✅ Email sent to ${compose.to} (simulation)\n\nSubject: ${subj}`);
    setShowCompose(false);setCompose({to:"",subject:"",body:"",templateId:""});setSelectedTpl(null);setVarValues({});
  };

  return(
    <div>
      <SectionHeader title="Email"
        actions={
          <div style={{display:"flex",gap:8}}>
            {!db.emailAccount?.connected&&<Btn variant="secondary" size="sm" onClick={()=>alert("Go to Settings → Email Account to connect your email")}><Ico k="plug" size={12}/>Connect Email</Btn>}
            <Btn onClick={()=>setShowCompose(true)}><Ico k="plus" size={13}/>Compose</Btn>
          </div>
        }/>

      {!db.emailAccount?.connected&&(
        <div style={{background:T.tealSoft,border:`1px solid ${T.teal}30`,borderRadius:9,padding:"11px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:11}}>
          <Ico k="plug" size={15} style={{color:T.teal}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:700,color:T.teal}}>Email account not connected</div>
            <div style={{fontSize:11,color:T.whiteOff}}>Go to Settings → Email Account to connect your SMTP/IMAP account and send real emails.</div>
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:14,height:"66vh"}}>
        {/* Sidebar */}
        <div style={{width:200,flexShrink:0,display:"flex",flexDirection:"column",gap:3}}>
          {[["inbox","Inbox",unread,"inbox"],["sent","Sent",0,"send"]].map(([id,label,badge,icon])=>(
            <button key={id} onClick={()=>setFolder(id)}
              style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:7,border:"none",cursor:"pointer",background:folder===id?T.tealSoft:"transparent",color:folder===id?T.teal:T.whiteDim,fontSize:12,fontWeight:600,fontFamily:"inherit",transition:"all .15s"}}>
              <Ico k={icon} size={14}/>{label}
              {badge>0&&<span style={{marginLeft:"auto",background:T.teal,color:"#000",borderRadius:10,padding:"0 7px",fontSize:9,fontWeight:800}}>{badge}</span>}
            </button>
          ))}
          <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border}`}}>
            <div style={{fontSize:9,fontWeight:700,color:T.whiteDim,textTransform:"uppercase",letterSpacing:".07em",marginBottom:7,paddingLeft:4}}>Quick Compose</div>
            {db.emailTemplates.slice(0,4).map(tpl=>{
              const cat=TPL_CATS[tpl.category];
              return(
                <button key={tpl.id} onClick={()=>{setCompose({to:"",subject:tpl.subject,body:tpl.body,templateId:tpl.id});applyTemplate(tpl);setShowCompose(true);}}
                  style={{display:"flex",alignItems:"center",gap:6,width:"100%",padding:"6px 9px",borderRadius:6,border:"none",cursor:"pointer",background:"transparent",color:T.whiteDim,fontSize:11,fontFamily:"inherit",marginBottom:2,textAlign:"left"}}
                  onMouseEnter={e=>e.currentTarget.style.background=T.bg3}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:cat?.color||T.teal,flexShrink:0}}/>
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tpl.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Email list */}
        <Card style={{width:320,flexShrink:0,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"10px 13px",borderBottom:`1px solid ${T.border}`,fontSize:11,fontWeight:700,color:T.whiteDim,textTransform:"uppercase",letterSpacing:".07em"}}>{folder==="inbox"?`Inbox (${folderEmails.length})`:`Sent (${folderEmails.length})`}</div>
          <div style={{overflowY:"auto",flex:1}}>
            {folderEmails.map(email=>{
              const contact=db.contacts.find(c=>c.id===email.contactId);
              return(
                <div key={email.id} onClick={()=>{setSelected(email);markRead(email.id);}}
                  style={{padding:"11px 13px",borderBottom:`1px solid ${T.border}`,cursor:"pointer",background:selected?.id===email.id?T.bg3:"transparent",borderLeft:`3px solid ${!email.read&&email.folder==="inbox"?T.teal:"transparent"}`}}
                  onMouseEnter={e=>{if(selected?.id!==email.id)e.currentTarget.style.background=T.bg3+"80";}}
                  onMouseLeave={e=>{if(selected?.id!==email.id)e.currentTarget.style.background="";}}>
                  <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:3}}>
                    {contact?<Av text={contact.avatar} color={contact.color} size={28} fs={10}/>:<div style={{width:28,height:28,borderRadius:"50%",background:T.bg4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:T.whiteDim}}>✉️</div>}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",gap:4}}>
                        <span style={{fontSize:11,fontWeight:email.read?500:700,color:email.read?T.whiteOff:T.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{email.folder==="inbox"?email.from:email.to}</span>
                        <span style={{fontSize:9,color:T.whiteDim,flexShrink:0}}>{fdate(email.date)}</span>
                      </div>
                      <div style={{fontSize:11,fontWeight:email.read?400:600,color:email.read?T.whiteDim:T.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>{email.subject}</div>
                      <div style={{fontSize:10,color:T.whiteDim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{email.body.slice(0,60)}</div>
                    </div>
                    {!email.read&&email.folder==="inbox"&&<div style={{width:6,height:6,borderRadius:"50%",background:T.teal,flexShrink:0,marginTop:4}}/>}
                  </div>
                </div>
              );
            })}
            {folderEmails.length===0&&<Empty text="No emails"/>}
          </div>
        </Card>

        {/* Reader */}
        <Card style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          {selected?(
            <>
              <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
                <h3 style={{margin:"0 0 7px",color:T.white,fontSize:16,fontWeight:700}}>{selected.subject}</h3>
                <div style={{fontSize:11,color:T.whiteDim}}>
                  From: <span style={{color:T.whiteOff}}>{selected.from}</span> → {selected.to} · {fdtm(selected.date)}
                </div>
              </div>
              <div style={{padding:"18px 20px",flex:1,overflowY:"auto"}}>
                <p style={{fontSize:13,color:T.whiteOff,lineHeight:1.9,margin:0,whiteSpace:"pre-wrap"}}>{selected.body}</p>
              </div>
              <div style={{padding:"12px 20px",borderTop:`1px solid ${T.border}`,display:"flex",gap:7,flexShrink:0}}>
                <Btn onClick={()=>{setCompose({to:selected.from,subject:`Re: ${selected.subject}`,body:`\n\n--- Original message ---\n${selected.body.slice(0,200)}`,templateId:""});setShowCompose(true);}}><Ico k="reply" size={13}/>Reply</Btn>
                <Btn variant="secondary"><Ico k="arrow" size={13}/>Forward</Btn>
                <Btn variant="danger" onClick={()=>{del(selected.id);setSelected(null);}}><Ico k="trash" size={13}/>Delete</Btn>
              </div>
            </>
          ):(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:T.whiteDim,gap:11}}>
              <Ico k="mail" size={44} style={{opacity:.2}}/>
              <span style={{fontSize:13}}>Select an email to read</span>
            </div>
          )}
        </Card>
      </div>

      {/* Compose modal */}
      <Modal open={showCompose} onClose={()=>{setShowCompose(false);setSelectedTpl(null);setVarValues({});}} title="Compose Email" width={740}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <Field label="To"><Inp value={compose.to} onChange={cc("to")} placeholder="recipient@company.com"/></Field>
          <Field label="Use Template">
            <Sel value={compose.templateId} onChange={e=>{const tpl=db.emailTemplates.find(t=>t.id===e.target.value);if(tpl)applyTemplate(tpl);}}>
              <option value="">— Select a template —</option>
              {Object.entries(TPL_CATS).map(([cat,cfg])=>(
                <optgroup key={cat} label={cfg.label}>
                  {db.emailTemplates.filter(t=>t.category===cat).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
                </optgroup>
              ))}
            </Sel>
          </Field>
        </div>

        {/* Variable inputs */}
        {selectedTpl&&selectedTpl.variables?.length>0&&(
          <div style={{background:T.tealGlow,border:`1px solid ${T.teal}20`,borderRadius:9,padding:14,marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:T.teal,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
              <Ico k="var" size={12}/>Fill Template Variables
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:9}}>
              {selectedTpl.variables.map(v=>(
                <div key={v}>
                  <Lbl>{v.replace(/_/g," ")}</Lbl>
                  <Inp value={varValues[v]||""} onChange={e=>setVarValues(p=>({...p,[v]:e.target.value}))} placeholder={`{{${v}}}`} style={{fontFamily:"inherit"}}/>
                </div>
              ))}
            </div>
          </div>
        )}

        <Field label="Subject"><Inp value={renderBody().subj||compose.subject} readOnly style={{marginBottom:12}}/></Field>
        <Field label="Body">
          <Inp value={compose.body} onChange={cc("body")} rows={10} placeholder="Write your message..."/>
        </Field>

        {/* Live preview if template + vars */}
        {selectedTpl&&Object.values(varValues).some(v=>v)&&(
          <div style={{background:T.bg3,borderRadius:9,padding:14,marginTop:12}}>
            <div style={{fontSize:10,fontWeight:700,color:T.whiteDim,marginBottom:8,textTransform:"uppercase",letterSpacing:".07em"}}>Preview</div>
            <div style={{fontSize:12,color:T.whiteOff,lineHeight:1.8,whiteSpace:"pre-wrap",maxHeight:120,overflow:"auto"}}>{renderBody().body}</div>
          </div>
        )}

        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:14}}>
          <Btn variant="secondary" onClick={()=>{setShowCompose(false);setSelectedTpl(null);setVarValues({});}}>Cancel</Btn>
          <Btn onClick={sendEmail} disabled={!compose.to||!compose.subject}><Ico k="send" size={13}/>Send Email</Btn>
        </div>
      </Modal>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   COMPANIES
═══════════════════════════════════════════════════ */
const Companies=({db,setDb})=>{
  const [showForm,setShowForm]=useState(false);
  const [f,setF]=useState({name:"",industry:"",size:"",website:"",revenue:"",city:""});
  const s=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const save=()=>{
    if(!f.name.trim())return;
    const colors=[T.teal,T.green,T.amber,"#A78BFA","#F472B6","#60A5FA"];
    setDb(d=>({...d,companies:[{...f,id:"co"+uid(),contacts:[],deals:[],logo:f.name.slice(0,2).toUpperCase(),color:colors[Math.floor(Math.random()*colors.length)]},...d.companies]}));
    setShowForm(false);setF({name:"",industry:"",size:"",website:"",revenue:"",city:""});
  };
  const del=id=>{if(confirm("Delete company?"))setDb(d=>({...d,companies:d.companies.filter(c=>c.id!==id)}));};

  return(
    <div>
      <SectionHeader title="Companies" sub={`${db.companies.length} companies`}
        actions={<Btn onClick={()=>setShowForm(true)}><Ico k="plus" size={13}/>New Company</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:13}}>
        {db.companies.map(co=>{
          const deals=db.deals.filter(d=>d.companyId===co.id);
          const totalV=deals.reduce((s,d)=>s+d.value,0);
          return(
            <Card key={co.id} style={{padding:18,transition:"all .15s",border:`1px solid ${T.border}`}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=co.color+"60";e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="";}}>
              <div style={{display:"flex",gap:12,marginBottom:14}}>
                <Av text={co.logo} color={co.color} size={46} fs={16}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:T.white}}>{co.name}</div>
                  <div style={{fontSize:11,color:T.whiteDim}}>{co.industry} · {co.size}</div>
                  {co.website&&<div style={{fontSize:10,color:T.teal,marginTop:2}}>🌐 {co.website}</div>}
                  {co.city&&<div style={{fontSize:10,color:T.whiteDim}}>📍 {co.city}</div>}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,padding:"11px 0",borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,marginBottom:11}}>
                {[[deals.length,"Deals",T.teal],[db.contacts.filter(c=>(co.contacts||[]).includes(c.id)).length,"Contacts","#A78BFA"],[money(totalV),"Value",T.green]].map(([v,l,c])=>(
                  <div key={l} style={{textAlign:"center"}}>
                    <div style={{fontSize:14,fontWeight:800,color:c}}>{v}</div>
                    <div style={{fontSize:9,color:T.whiteDim}}>{l}</div>
                  </div>
                ))}
              </div>
              {co.revenue&&<div style={{fontSize:11,color:T.whiteDim,marginBottom:8}}>💰 Revenue: {co.revenue}</div>}
              <div style={{display:"flex",justifyContent:"flex-end"}}><Btn variant="ghost" size="sm" onClick={()=>del(co.id)}><Ico k="trash" size={12}/></Btn></div>
            </Card>
          );
        })}
      </div>
      <Modal open={showForm} onClose={()=>setShowForm(false)} title="New Company" width={520}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          <Field label="Name *" col={2}><Inp value={f.name} onChange={s("name")} placeholder="Acme Corp"/></Field>
          <Field label="Industry"><Inp value={f.industry} onChange={s("industry")} placeholder="SaaS, Retail..."/></Field>
          <Field label="Size"><Sel value={f.size} onChange={s("size")}><option value="">—</option><option>1-10</option><option>11-50</option><option>51-200</option><option>201-500</option><option>500+</option></Sel></Field>
          <Field label="Revenue"><Sel value={f.revenue} onChange={s("revenue")}><option value="">—</option><option>{"<$500K"}</option><option>$500K-1M</option><option>$1M-5M</option><option>$5M-10M</option><option>$10M-50M</option><option>$50M+</option></Sel></Field>
          <Field label="City"><Inp value={f.city} onChange={s("city")} placeholder="New York, Austin..."/></Field>
          <Field label="Website" col={2}><Inp value={f.website} onChange={s("website")} placeholder="company.com"/></Field>
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end",marginTop:14}}>
          <Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancel</Btn>
          <Btn onClick={save} disabled={!f.name.trim()}>Save</Btn>
        </div>
      </Modal>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   REPORTS
═══════════════════════════════════════════════════ */
const Reports=({db})=>{
  const isWon=d=>{const pl=db.pipelines.find(p=>p.id===d.pipelineId);return pl?.stages.find(s=>s.id===d.stageId)?.isWon;};
  const isLost=d=>{const pl=db.pipelines.find(p=>p.id===d.pipelineId);return pl?.stages.find(s=>s.id===d.stageId)?.isLost;};
  const won=db.deals.filter(isWon); const lost=db.deals.filter(isLost);
  const totalR=won.reduce((s,d)=>s+d.value,0);
  const totalP=db.deals.filter(d=>!isWon(d)&&!isLost(d)).reduce((s,d)=>s+d.value,0);
  const conv=db.deals.length>0?Math.round(won.length/db.deals.length*100):0;
  const avgD=db.deals.length>0?Math.round(db.deals.reduce((s,d)=>s+d.value,0)/db.deals.length):0;

  const byOwner=[...new Set(db.deals.map(d=>d.owner).filter(Boolean))].map(owner=>({
    name:owner,deals:db.deals.filter(d=>d.owner===owner).length,
    value:db.deals.filter(d=>d.owner===owner).reduce((s,d)=>s+d.value,0),
    won:db.deals.filter(d=>d.owner===owner&&isWon(d)).length,
  }));
  const maxOV=Math.max(...byOwner.map(o=>o.value),1);

  const bySource=[...new Set(db.contacts.map(c=>c.source).filter(Boolean))].map(src=>({
    name:src,count:db.contacts.filter(c=>c.source===src).length,
    value:db.contacts.filter(c=>c.source===src).reduce((s,c)=>s+c.value,0),
  }));

  const pl1=db.pipelines[0];
  const stageData=(pl1?.stages||[]).map(s=>({...s,count:db.deals.filter(d=>d.pipelineId===pl1.id&&d.stageId===s.id).length,value:db.deals.filter(d=>d.pipelineId===pl1.id&&d.stageId===s.id).reduce((a,d)=>a+d.value,0)}));
  const maxSV=Math.max(...stageData.map(s=>s.value),1);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <SectionHeader title="Reports & Analytics" sub="Global performance overview"/>
      <div style={{display:"flex",gap:11,flexWrap:"wrap"}}>
        <KPI label="Revenue Won"       value={money(totalR)} color={T.green}  icon="trend"/>
        <KPI label="Active Pipeline"   value={money(totalP)} color={T.teal}   icon="funnel"/>
        <KPI label="Conversion Rate"   value={`${conv}%`}    color={T.amber}  icon="star"/>
        <KPI label="Avg Deal Size"     value={money(avgD)}   color="#A78BFA"  icon="dollar"/>
        <KPI label="Total Contacts"    value={db.contacts.length} color={T.teal} icon="users"/>
        <KPI label="Email Templates"   value={db.emailTemplates.length} color="#60A5FA" icon="template"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:13,color:T.white,marginBottom:16,display:"flex",gap:6,alignItems:"center"}}><Ico k="funnel" size={13} style={{color:T.teal}}/>Deals by Stage</div>
          {stageData.map(s=>(
            <div key={s.id} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <div style={{display:"flex",gap:6,alignItems:"center"}}><div style={{width:7,height:7,borderRadius:"50%",background:s.color}}/><span style={{fontSize:12,color:T.whiteOff}}>{s.name}</span></div>
                <div><span style={{fontWeight:700,color:T.white,fontSize:12}}>{money(s.value)}</span><span style={{color:T.whiteDim,fontSize:10,marginLeft:5}}>{s.count}</span></div>
              </div>
              <Progress value={s.value/maxSV*100} color={s.color} h={6}/>
            </div>
          ))}
        </Card>
        <Card style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:13,color:T.white,marginBottom:16,display:"flex",gap:6,alignItems:"center"}}><Ico k="users" size={13} style={{color:T.teal}}/>Sales Rep Performance</div>
          {byOwner.map((o,i)=>(
            <div key={o.name} style={{padding:"11px 13px",background:T.bg3,borderRadius:9,marginBottom:9}}>
              <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:7}}>
                <Av text={o.name.split(" ").map(w=>w[0]).join("")} color={[T.teal,T.green,T.amber][i%3]} size={32} fs={11}/>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:T.white}}>{o.name}</div><div style={{fontSize:10,color:T.whiteDim}}>{o.deals} deals · {o.won} won · {o.deals>0?Math.round(o.won/o.deals*100):0}% conv.</div></div>
                <div style={{fontSize:14,fontWeight:800,color:T.green}}>{money(o.value)}</div>
              </div>
              <Progress value={o.value/maxOV*100} color={[T.teal,T.green,T.amber][i%3]} h={5}/>
            </div>
          ))}
        </Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:13,color:T.white,marginBottom:16}}>Contacts by Status</div>
          <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
            {Object.entries(STATUS_CFG).map(([k,v])=>{
              const cnt=db.contacts.filter(c=>c.status===k).length;
              const pct=db.contacts.length>0?Math.round(cnt/db.contacts.length*100):0;
              return(
                <div key={k} style={{flex:1,minWidth:90,padding:"13px 14px",background:T.bg3,borderRadius:9,textAlign:"center"}}>
                  <div style={{fontSize:24,fontWeight:800,color:v.color}}>{cnt}</div>
                  <div style={{fontSize:11,color:T.whiteOff,marginBottom:7}}>{v.label}</div>
                  <Progress value={pct} color={v.color} h={5}/>
                  <div style={{fontSize:9,color:T.whiteDim,marginTop:3}}>{pct}%</div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card style={{padding:20}}>
          <div style={{fontWeight:700,fontSize:13,color:T.white,marginBottom:16}}>Leads by Source</div>
          {bySource.map((s,i)=>(
            <div key={s.name} style={{marginBottom:11}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,color:T.whiteOff}}>{s.name}</span>
                <div><span style={{fontWeight:700,color:T.white,fontSize:12}}>{s.count}</span><span style={{fontSize:10,color:T.whiteDim,marginLeft:5}}>{money(s.value)}</span></div>
              </div>
              <Progress value={db.contacts.length>0?s.count/db.contacts.length*100:0} color={[T.teal,T.green,T.amber,"#A78BFA","#F472B6","#60A5FA"][i%6]} h={5}/>
            </div>
          ))}
        </Card>
      </div>
      <Card style={{padding:20}}>
        <div style={{fontWeight:700,fontSize:13,color:T.white,marginBottom:14}}>Lead Score Distribution</div>
        <div style={{display:"flex",gap:3,alignItems:"flex-end",height:70}}>
          {Array.from({length:10},(_,i)=>{
            const cnt=db.contacts.filter(c=>c.score>=i*10&&c.score<(i+1)*10).length;
            const maxC=Math.max(...Array.from({length:10},(_,j)=>db.contacts.filter(c=>c.score>=j*10&&c.score<(j+1)*10).length),1);
            const color=i>=8?T.green:i>=5?T.amber:T.red;
            return(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{width:"100%",background:color,borderRadius:"3px 3px 0 0",height:`${cnt/maxC*100}%`,minHeight:cnt>0?3:0}}/>
                <div style={{fontSize:9,color:T.whiteDim}}>{i*10}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   NOTES
═══════════════════════════════════════════════════ */
const Notes=({db,setDb})=>{
  const [f,setF]=useState({text:"",contactId:"",dealId:"",pinned:false});
  const s=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const save=()=>{
    if(!f.text.trim())return;
    setDb(d=>({...d,notes:[{...f,id:"n"+uid(),contactId:f.contactId||null,dealId:f.dealId||null,author:db.user.name,date:new Date().toISOString().slice(0,16).replace("T"," ")},...d.notes]}));
    setF({text:"",contactId:"",dealId:"",pinned:false});
  };
  const del=id=>setDb(d=>({...d,notes:d.notes.filter(n=>n.id!==id)}));
  const pin=id=>setDb(d=>({...d,notes:d.notes.map(n=>n.id===id?{...n,pinned:!n.pinned}:n)}));
  const sorted=[...db.notes].sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||new Date(b.date)-new Date(a.date));

  return(
    <div>
      <SectionHeader title="Notes" sub={`${db.notes.length} notes · ${db.notes.filter(n=>n.pinned).length} pinned`}/>
      <Card style={{padding:18,marginBottom:18}}>
        <div style={{fontSize:12,fontWeight:600,color:T.whiteOff,marginBottom:11}}>New note</div>
        <Inp value={f.text} onChange={s("text")} rows={3} placeholder="Write a note..." style={{marginBottom:11}}/>
        <div style={{display:"flex",gap:9,flexWrap:"wrap",alignItems:"center"}}>
          <Sel value={f.contactId} onChange={s("contactId")} style={{width:190}}><option value="">No contact</option>{db.contacts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Sel>
          <Sel value={f.dealId} onChange={s("dealId")} style={{width:220}}><option value="">No deal</option>{db.deals.map(d=><option key={d.id} value={d.id}>{d.title.slice(0,28)}</option>)}</Sel>
          <label style={{display:"flex",gap:5,alignItems:"center",color:T.whiteOff,fontSize:12,cursor:"pointer"}}>
            <input type="checkbox" checked={f.pinned} onChange={e=>setF(p=>({...p,pinned:e.target.checked}))}/>Pin
          </label>
          <Btn onClick={save} disabled={!f.text.trim()} style={{marginLeft:"auto"}}><Ico k="plus" size={13}/>Save Note</Btn>
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:11}}>
        {sorted.map(note=>{
          const contact=db.contacts.find(c=>c.id===note.contactId);
          const deal=db.deals.find(d=>d.id===note.dealId);
          return(
            <Card key={note.id} style={{padding:15,borderLeft:`3px solid ${note.pinned?T.teal:T.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
                <div style={{display:"flex",gap:5}}>{note.pinned&&<span style={{fontSize:13}}>📌</span>}<span style={{fontSize:10,color:T.whiteDim}}>{note.author} · {note.date}</span></div>
                <div style={{display:"flex",gap:3}}>
                  <Btn variant="ghost" size="sm" onClick={()=>pin(note.id)}><Ico k="star" size={11}/></Btn>
                  <Btn variant="ghost" size="sm" onClick={()=>del(note.id)}><Ico k="trash" size={11}/></Btn>
                </div>
              </div>
              <p style={{fontSize:12,color:T.whiteOff,margin:"0 0 9px",lineHeight:1.7}}>{note.text}</p>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {contact&&<Chip label={`👤 ${contact.name}`} color={T.teal}/>}
                {deal&&<Chip label={`💰 ${deal.title.slice(0,20)}`} color={T.green}/>}
              </div>
            </Card>
          );
        })}
        {db.notes.length===0&&<div style={{gridColumn:"1/-1"}}><Empty text="No notes yet. Create your first note above."/></div>}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   SETTINGS (with Email Account integration)
═══════════════════════════════════════════════════ */
const Settings=({db,setDb})=>{
  const [tab,setTab]=useState("profile");
  const [profile,setProfile]=useState({...db.user});
  const [emailAcc,setEmailAcc]=useState({connected:false,provider:"gmail",address:"",smtp:"smtp.gmail.com",port:"587",user:"",pass:"",...(db.emailAccount||{})});
  const sp=k=>e=>setProfile(p=>({...p,[k]:e.target.value}));
  const se=k=>e=>setEmailAcc(p=>({...p,[k]:e.target.value}));

  const PROVIDERS={gmail:{label:"Gmail",smtp:"smtp.gmail.com",port:"587",note:"Use an App Password (not your regular password). Enable 2FA → App Passwords in Google Account."},
    outlook:{label:"Outlook / Hotmail",smtp:"smtp.office365.com",port:"587",note:"Use your Microsoft account credentials. May need to enable SMTP AUTH in admin center."},
    yahoo:{label:"Yahoo Mail",smtp:"smtp.mail.yahoo.com",port:"465",note:"Generate an App Password in Yahoo Security settings."},
    custom:{label:"Custom SMTP",smtp:"",port:"587",note:"Enter your SMTP server details manually."}};

  const connectEmail=()=>{
    if(!emailAcc.address||!emailAcc.user)return alert("Fill in at least your email address and username.");
    setEmailAcc(p=>({...p,connected:true}));
    setDb(d=>({...d,emailAccount:{...emailAcc,connected:true}}));
    alert(`✅ Email account configured!\n\nProvider: ${PROVIDERS[emailAcc.provider]?.label||"Custom"}\nAccount: ${emailAcc.address}\n\nNote: In this demo environment, emails are simulated. In production, real SMTP sending would occur.`);
  };
  const disconnectEmail=()=>{
    setEmailAcc(p=>({...p,connected:false}));
    setDb(d=>({...d,emailAccount:{...emailAcc,connected:false}}));
  };

  const TABS=[["profile","My Profile","users"],["email","Email Account","mail"],["pipelines","Pipelines","funnel"],["team","Team","users"],["data","Data","refresh"],["general","General","cog"]];

  return(
    <div>
      <SectionHeader title="Settings"/>
      <div style={{display:"flex",gap:16}}>
        <div style={{width:190,flexShrink:0}}>
          {TABS.map(([id,label,icon])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{display:"flex",gap:9,alignItems:"center",width:"100%",padding:"8px 11px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,marginBottom:2,background:tab===id?T.tealSoft:"transparent",color:tab===id?T.teal:T.whiteDim}}>
              <Ico k={icon} size={14}/>{label}
            </button>
          ))}
        </div>

        <div style={{flex:1}}>
          {tab==="profile"&&(
            <Card style={{padding:22}}>
              <div style={{fontWeight:700,fontSize:14,color:T.white,marginBottom:18}}>My Profile</div>
              <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:20}}>
                <Av text={db.user.avatar} color={T.teal} size={60} fs={22}/>
                <div>
                  <div style={{fontWeight:700,fontSize:17,color:T.white}}>{db.user.name}</div>
                  <div style={{fontSize:12,color:T.whiteDim}}>{db.user.email} · {db.user.role}</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
                <Field label="Full Name"><Inp value={profile.name} onChange={sp("name")}/></Field>
                <Field label="Email"><Inp value={profile.email} onChange={sp("email")}/></Field>
                <Field label="Role"><Sel value={profile.role} onChange={sp("role")}><option>Admin</option><option>Sales Rep</option><option>Manager</option><option>Read Only</option></Sel></Field>
              </div>
              <div style={{marginTop:14,display:"flex",justifyContent:"flex-end"}}>
                <Btn onClick={()=>{setDb(d=>({...d,user:{...profile,avatar:profile.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}}));alert("✅ Profile saved!");}}>Save Changes</Btn>
              </div>
            </Card>
          )}

          {tab==="email"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <Card style={{padding:22}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:T.white,marginBottom:4}}>Email Account Integration</div>
                    <div style={{fontSize:12,color:T.whiteDim}}>Connect your email to send from the CRM using your own address</div>
                  </div>
                  {emailAcc.connected?(
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <Chip label="● Connected" color={T.green}/>
                      <Btn variant="danger" size="sm" onClick={disconnectEmail}>Disconnect</Btn>
                    </div>
                  ):<Chip label="Not connected" color={T.whiteDim}/>}
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
                  <Field label="Email Provider" col={2}>
                    <Sel value={emailAcc.provider} onChange={e=>{const p=PROVIDERS[e.target.value];setEmailAcc(prev=>({...prev,provider:e.target.value,smtp:p?.smtp||"",port:p?.port||"587"}));}}>
                      {Object.entries(PROVIDERS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                    </Sel>
                  </Field>

                  {PROVIDERS[emailAcc.provider]&&(
                    <div style={{gridColumn:"span 2",background:T.tealGlow,border:`1px solid ${T.teal}20`,borderRadius:8,padding:"10px 13px",fontSize:11,color:T.whiteOff,lineHeight:1.6}}>
                      <span style={{color:T.teal,fontWeight:700}}>💡 {PROVIDERS[emailAcc.provider].label}: </span>
                      {PROVIDERS[emailAcc.provider].note}
                    </div>
                  )}

                  <Field label="Your Email Address"><Inp value={emailAcc.address} onChange={se("address")} placeholder="you@gmail.com"/></Field>
                  <Field label="SMTP Username"><Inp value={emailAcc.user} onChange={se("user")} placeholder="Usually your email address"/></Field>
                  <Field label="SMTP Server"><Inp value={emailAcc.smtp} onChange={se("smtp")} placeholder="smtp.gmail.com"/></Field>
                  <Field label="SMTP Port"><Inp value={emailAcc.port} onChange={se("port")} placeholder="587"/></Field>
                  <Field label="Password / App Password" col={2}><Inp type="password" value={emailAcc.pass} onChange={se("pass")} placeholder="Your app password or email password"/></Field>
                </div>

                <div style={{background:T.bg3,borderRadius:8,padding:"10px 13px",marginTop:14,marginBottom:14,fontSize:11,color:T.whiteDim,lineHeight:1.6}}>
                  <strong style={{color:T.white}}>Security note:</strong> Your credentials are stored locally in your browser (localStorage). They are never sent to any server in this demo. In a production environment, use OAuth or backend-encrypted storage.
                </div>

                <div style={{display:"flex",justifyContent:"flex-end"}}>
                  <Btn onClick={connectEmail} disabled={emailAcc.connected}><Ico k="plug" size={13}/>{emailAcc.connected?"Already Connected":"Connect Email Account"}</Btn>
                </div>
              </Card>

              <Card style={{padding:20}}>
                <div style={{fontWeight:700,fontSize:14,color:T.white,marginBottom:4}}>Email Templates</div>
                <div style={{fontSize:12,color:T.whiteDim,marginBottom:14}}>You have {db.emailTemplates.length} templates configured. Templates can be used when composing emails.</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {Object.entries(TPL_CATS).map(([k,v])=>(
                    <div key={k} style={{display:"flex",gap:6,alignItems:"center",background:T.bg3,borderRadius:7,padding:"5px 11px"}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:v.color}}/>
                      <span style={{fontSize:11,color:T.whiteOff}}>{v.label}:</span>
                      <span style={{fontSize:11,fontWeight:700,color:v.color}}>{db.emailTemplates.filter(t=>t.category===k).length}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab==="pipelines"&&(
            <Card style={{padding:22}}>
              <div style={{fontWeight:700,fontSize:14,color:T.white,marginBottom:16}}>Configured Pipelines</div>
              {db.pipelines.map(pl=>(
                <div key={pl.id} style={{padding:"13px 15px",background:T.bg3,borderRadius:9,marginBottom:11}}>
                  <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:9}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:pl.color}}/>
                    <span style={{fontWeight:700,color:T.white}}>{pl.name}</span>
                    {pl.isDefault&&<Chip label="Default" color={T.teal}/>}
                    <span style={{color:T.whiteDim,fontSize:11,marginLeft:"auto"}}>{db.deals.filter(d=>d.pipelineId===pl.id).length} deals</span>
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {pl.stages.map(s=><Chip key={s.id} label={`${s.name} (${s.probability}%)`} color={s.color}/>)}
                  </div>
                </div>
              ))}
              <div style={{fontSize:11,color:T.whiteDim}}>💡 Manage pipelines from Pipeline → Configure tab</div>
            </Card>
          )}

          {tab==="team"&&(
            <Card style={{padding:22}}>
              <div style={{fontWeight:700,fontSize:14,color:T.white,marginBottom:16}}>Sales Team</div>
              {["Alex Morgan","Maria Lopez"].map((u,i)=>(
                <div key={u} style={{display:"flex",gap:11,alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${T.border}`}}>
                  <Av text={u.split(" ").map(w=>w[0]).join("")} color={[T.teal,T.green][i]} size={38} fs={13}/>
                  <div style={{flex:1}}><div style={{fontWeight:600,color:T.white,fontSize:13}}>{u}</div><div style={{fontSize:11,color:T.whiteDim}}>{u.toLowerCase().replace(" ",".")}@company.com · {i===0?"Admin":"Sales Rep"}</div></div>
                  <Chip label={i===0?"Admin":"Rep"} color={i===0?T.teal:T.green}/>
                </div>
              ))}
              <Btn variant="secondary" style={{marginTop:14}}><Ico k="plus" size={12}/>Invite User</Btn>
            </Card>
          )}

          {tab==="data"&&(
            <Card style={{padding:22}}>
              <div style={{fontWeight:700,fontSize:14,color:T.white,marginBottom:16}}>Data Management</div>
              <div style={{display:"flex",flexDirection:"column",gap:11}}>
                {[
                  ["Contacts",db.contacts.length,T.teal],
                  ["Companies",db.companies.length,T.green],
                  ["Deals",db.deals.length,T.amber],
                  ["Activities",db.activities.length,"#A78BFA"],
                  ["Tasks",db.tasks.length,"#60A5FA"],
                  ["Emails",db.emails.length,T.pink||"#F472B6"],
                  ["Templates",db.emailTemplates.length,T.teal],
                  ["Notes",db.notes.length,"#FB923C"],
                ].map(([label,count,color])=>(
                  <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"9px 13px",background:T.bg3,borderRadius:7}}>
                    <span style={{fontSize:12,color:T.whiteOff}}>{label}</span>
                    <span style={{fontSize:13,fontWeight:700,color}}>{count} records</span>
                  </div>
                ))}
                <div style={{borderTop:`1px solid ${T.border}`,paddingTop:14,display:"flex",gap:9}}>
                  <Btn variant="teal" onClick={()=>{const data=JSON.stringify(db,null,2);const b=new Blob([data],{type:"application/json"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="crm-backup.json";a.click();}}>
                    <Ico k="arrow" size={13}/>Export Backup
                  </Btn>
                  <Btn variant="danger" onClick={()=>{if(confirm("⚠️ Clear all data? This cannot be undone."))localStorage.clear();}}>
                    <Ico k="trash" size={13}/>Clear All Data
                  </Btn>
                </div>
                <div style={{fontSize:11,color:T.whiteDim}}>All data is stored in your browser's localStorage and persists between sessions.</div>
              </div>
            </Card>
          )}

          {tab==="general"&&(
            <Card style={{padding:22}}>
              <div style={{fontWeight:700,fontSize:14,color:T.white,marginBottom:18}}>General Settings</div>
              <Field label="Company Name" style={{marginBottom:13}}><Inp defaultValue="My Company CRM" onChange={()=>{}}/></Field>
              <Field label="Currency" style={{marginBottom:13}}><Sel value="USD" onChange={()={}}><option value="USD">USD — US Dollar ($)</option></Sel></Field>
              <Field label="Time Zone" style={{marginBottom:13}}><Sel defaultValue="America/New_York" onChange={()={}}><option>America/New_York</option><option>America/Chicago</option><option>America/Los_Angeles</option><option>America/Denver</option><option>Europe/London</option><option>Europe/Madrid</option></Sel></Field>
              <Field label="Date Format" style={{marginBottom:13}}><Sel defaultValue="MM/DD/YYYY" onChange={()={}}><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option></Sel></Field>
              <Btn onClick={()=>alert("✅ Settings saved!")}>Save Changes</Btn>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════ */
const NAV=[
  {id:"dashboard",  label:"Dashboard",   icon:"home"},
  {id:"pipeline",   label:"Pipeline",    icon:"funnel"},
  {id:"contacts",   label:"Contacts",    icon:"users"},
  {id:"companies",  label:"Companies",   icon:"building"},
  {id:"deals",      label:"Deals",       icon:"dollar"},
  {id:"activities", label:"Activities",  icon:"lightning"},
  {id:"tasks",      label:"Tasks",       icon:"check"},
  {id:"email",      label:"Email",       icon:"mail"},
  {id:"templates",  label:"Templates",   icon:"template"},
  {id:"notes",      label:"Notes",       icon:"note"},
  {id:"reports",    label:"Reports",     icon:"chart"},
  {id:"settings",   label:"Settings",    icon:"cog"},
];

export default function App(){
  const [db,setDb]=useLocalStorage("nexus_crm_v3",SEED);
  const [mod,setMod]=useState("dashboard");
  const [collapsed,setCollapsed]=useState(false);

  // Merge new keys from SEED if missing (for upgrades)
  useEffect(()=>{
    if(!db.emailAccount) setDb(d=>({...d,emailAccount:SEED.emailAccount}));
    if(!db.emailTemplates||db.emailTemplates.length===0) setDb(d=>({...d,emailTemplates:SEED.emailTemplates}));
  },[]);

  const unread=db.emails.filter(e=>!e.read&&e.folder==="inbox").length;
  const pendActs=db.activities.filter(a=>!a.done).length;
  const pendTasks=db.tasks.filter(t=>t.status!=="done").length;
  const BADGES={email:unread,tasks:pendTasks,activities:pendActs};

  const MODULES={
    dashboard:  <Dashboard db={db}/>,
    contacts:   <Contacts db={db} setDb={setDb}/>,
    companies:  <Companies db={db} setDb={setDb}/>,
    pipeline:   <Pipeline db={db} setDb={setDb}/>,
    deals:      <Deals db={db} setDb={setDb}/>,
    activities: <Activities db={db} setDb={setDb}/>,
    tasks:      <Tasks db={db} setDb={setDb}/>,
    email:      <EmailModule db={db} setDb={setDb}/>,
    templates:  <EmailTemplates db={db} setDb={setDb}/>,
    notes:      <Notes db={db} setDb={setDb}/>,
    reports:    <Reports db={db}/>,
    settings:   <Settings db={db} setDb={setDb}/>,
  };

  return(
    <div style={{display:"flex",height:"100vh",background:T.bg0,fontFamily:"'Outfit','DM Sans',system-ui,sans-serif",color:T.white,overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${T.bg4};border-radius:2px;}
        input,select,textarea,button{font-family:inherit;}
        input::placeholder,textarea::placeholder{color:${T.whiteFade};}
        input[type=date]::-webkit-calendar-picker-indicator,
        input[type=datetime-local]::-webkit-calendar-picker-indicator{filter:invert(0.3) sepia(1) saturate(2) hue-rotate(150deg);cursor:pointer;}
        input:focus,select:focus,textarea:focus{border-color:${T.teal}!important;outline:none;}
        select option{background:${T.bg1};color:${T.white};}
        optgroup{background:${T.bg0};color:${T.teal};font-weight:700;}
      `}</style>

      {/* ─── SIDEBAR ─── */}
      <aside style={{width:collapsed?58:205,background:T.bg1,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",transition:"width .2s ease",flexShrink:0,overflow:"hidden"}}>
        {/* Logo */}
        <div style={{height:54,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",padding:"0 14px",gap:10,flexShrink:0}}>
          <div style={{width:28,height:28,borderRadius:7,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#000",flexShrink:0}}>N</div>
          {!collapsed&&<span style={{fontWeight:900,fontSize:14,color:T.white,whiteSpace:"nowrap",letterSpacing:"-.02em"}}>NexusCRM<span style={{color:T.teal}}>.</span></span>}
        </div>

        {/* Nav */}
        <nav style={{flex:1,overflowY:"auto",padding:"10px 7px"}}>
          {NAV.map(item=>{
            const isActive=mod===item.id;
            const badge=BADGES[item.id];
            return(
              <button key={item.id} onClick={()=>setMod(item.id)}
                style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:collapsed?"9px 0":"8px 10px",justifyContent:collapsed?"center":undefined,borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,marginBottom:1,background:isActive?T.tealSoft:"transparent",color:isActive?T.teal:T.whiteDim,transition:"all .12s",position:"relative",fontFamily:"inherit"}}
                onMouseEnter={e=>{if(!isActive){e.currentTarget.style.background=T.bg3;e.currentTarget.style.color=T.white;}}}
                onMouseLeave={e=>{if(!isActive){e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.whiteDim;}}}>
                {isActive&&!collapsed&&<div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:18,background:T.teal,borderRadius:"0 2px 2px 0"}}/>}
                <Ico k={item.icon} size={15}/>
                {!collapsed&&<span style={{flex:1,whiteSpace:"nowrap",textAlign:"left"}}>{item.label}</span>}
                {!collapsed&&badge>0&&<span style={{background:T.teal,color:"#000",borderRadius:10,padding:"0 6px",fontSize:9,fontWeight:800}}>{badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* User row */}
        <div style={{padding:"9px 7px",borderTop:`1px solid ${T.border}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 5px",borderRadius:7}}>
            <Av text={db.user.avatar} color={T.teal} size={26} fs={10}/>
            {!collapsed&&(
              <div style={{overflow:"hidden",flex:1}}>
                <div style={{fontSize:11,fontWeight:700,color:T.white,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{db.user.name}</div>
                <div style={{fontSize:9,color:T.whiteDim}}>{db.user.role}</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Topbar */}
        <header style={{height:54,background:T.bg1,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",padding:"0 20px",gap:13,flexShrink:0}}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{background:"none",border:"none",color:T.whiteDim,cursor:"pointer",padding:5,borderRadius:6,display:"flex"}}>
            <Ico k="menu" size={17}/>
          </button>
          <span style={{fontWeight:700,fontSize:14,color:T.white}}>{NAV.find(n=>n.id===mod)?.label}</span>

          <div style={{marginLeft:"auto",display:"flex",gap:9,alignItems:"center"}}>
            {db.emailAccount?.connected&&(
              <div style={{display:"flex",gap:5,alignItems:"center",background:T.greenS,border:`1px solid ${T.green}30`,borderRadius:6,padding:"3px 9px",fontSize:10,fontWeight:700,color:T.green}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:T.green}}/>{db.emailAccount.address}
              </div>
            )}
            {unread>0&&<button onClick={()=>setMod("email")} style={{background:T.tealSoft,border:`1px solid ${T.teal}25`,borderRadius:7,padding:"4px 10px",color:T.teal,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",gap:4,alignItems:"center",fontFamily:"inherit"}}><Ico k="mail" size={12}/>{unread}</button>}
            {pendActs>0&&<button onClick={()=>setMod("activities")} style={{background:T.amberS,border:`1px solid ${T.amber}25`,borderRadius:7,padding:"4px 10px",color:T.amber,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",gap:4,alignItems:"center",fontFamily:"inherit"}}><Ico k="lightning" size={12}/>{pendActs}</button>}
            <div style={{width:1,height:20,background:T.border}}/>
            <Av text={db.user.avatar} color={T.teal} size={28} fs={10}/>
          </div>
        </header>

        {/* Content */}
        <main style={{flex:1,overflowY:"auto",padding:20,background:T.bg2}}>
          {MODULES[mod]||<Dashboard db={db}/>}
        </main>
      </div>
    </div>
  );
}
