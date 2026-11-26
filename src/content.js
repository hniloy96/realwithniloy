// ─────────────────────────────────────────────────────────────
//  ALL SITE TEXT LIVES HERE.
//  Everything marked PLACEHOLDER is temporary copy written to show the
//  layout. Replace it with your own words, reviews and links.
// ─────────────────────────────────────────────────────────────

// The five sections, in dial order. `id` is used for the page anchors.
export const SECTIONS = [
  { id: 'home', label: 'HOME' },
  { id: 'reviews', label: 'REVIEWS' },
  { id: 'about', label: 'ABOUT ME' },
  { id: 'contact', label: 'GET IN TOUCH' },
  { id: 'socials', label: 'SOCIALS' },
]

// PLACEHOLDER copy
export const HOME = {
  hello: "Hi, I'm Niloy.",
  headline: ['Every home', 'holds a story.', "Let's find where", 'yours begins.'],
  message:
    "Buying or selling a home isn't paperwork. It's the kitchen where you'll learn to cook, the hallway your kids will race down, the door you'll walk through on your hardest and happiest days. I'm here to walk that road with you, honestly, one step at a time.",
  cta: 'Start a conversation',
  // PLACEHOLDER image: swap for a real photo (any color photo turns black & white automatically)
  portrait: '/placeholders/portrait.svg',
}

// PLACEHOLDER reviews: replace with real client words (with their permission)
export const REVIEWS = [
  {
    quote:
      'We were first-time buyers and terrified. Niloy never rushed us, never made us feel silly for asking. When we got the keys, he was almost as excited as we were.',
    name: 'Client name',
    detail: 'First home, 2025',
  },
  {
    quote:
      'Selling my mom’s house was emotional. Niloy treated it with so much care. He handled every detail so I could just be present for my family.',
    name: 'Client name',
    detail: 'Sold a family home',
  },
  {
    quote:
      'Straight talk, no pressure. He told us when a place wasn’t right, even when it meant more weekends of searching. That’s why we trust him.',
    name: 'Client name',
    detail: 'Relocated across town',
  },
]

// PLACEHOLDER story
export const ABOUT = {
  title: 'Real, the way it should be.',
  paragraphs: [
    'I got into real estate because I remember what it felt like when my own family found a place to call home. The relief. The hope. The feeling that life could finally settle in.',
    "Today I help people find that feeling for themselves. I'll give you the truth, even when it's not what you want to hear, and I'll treat your move like it's my own family's.",
    'When I’m not touring homes, you’ll find me exploring neighborhood coffee spots, ... (add your own details here).',
  ],
  photo: '/placeholders/about.svg',
  facts: [
    { value: '00+', label: 'families helped' },
    { value: '0 yrs', label: 'in the neighborhood' },
    { value: '24h', label: 'reply time, always' },
  ],
}

export const CONTACT = {
  title: "Let's talk. No pressure, just a conversation.",
  intro:
    "Whether you're dreaming, planning, or ready to move tomorrow, tell me a little about where you are. I'll get back to you personally.",
  // To make the form send real emails, create a free form at https://formspree.io
  // and paste its endpoint here, e.g. 'https://formspree.io/f/abcd1234'
  formspreeEndpoint: '',
  // PLACEHOLDER contact details
  email: 'hello@realwithniloy.com',
  phone: '(000) 000-0000',
}

// PLACEHOLDER links: replace '#' with your real profile URLs
export const SOCIALS = [
  { name: 'Instagram', handle: '@realwithniloy', url: '#' },
  { name: 'TikTok', handle: '@realwithniloy', url: '#' },
  { name: 'YouTube', handle: 'Real with Niloy', url: '#' },
  { name: 'LinkedIn', handle: 'Niloy', url: '#' },
  { name: 'Facebook', handle: 'Real with Niloy', url: '#' },
]
