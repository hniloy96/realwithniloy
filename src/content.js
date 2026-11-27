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
  { id: 'contact', label: 'CONTACT' },
  { id: 'socials', label: 'SOCIALS' },
]

// PLACEHOLDER copy
export const HOME = {
  hello: "Hi, I'm Niloy.",
  headline: ['Every home', 'holds a story.', "Let's find where", 'yours begins.'],
  message:
    "Buying or selling a home isn't paperwork. It's the kitchen where you'll learn to cook, the hallway your kids will race down, the door you'll walk through on your hardest and happiest days. I'm here to walk that road with you, honestly, one step at a time.",
  cta: 'Start a conversation',
  // Your photo (a web-sized copy of photos-originals/home_page_me_2.png). It is shown in black & white.
  portrait: '/images/home_page_me_2_web.jpg',
  portraitNote: "that's me, hi!",
}

// PLACEHOLDER reviews: replace with real client words (with their permission)
export const REVIEWS = [
  {
    quote:
      'We were first-time buyers and terrified. Niloy never rushed us, never made us feel silly for asking. When we got the keys, Niloy was almost as excited as we were.',
    name: 'Client name',
    detail: 'First home, 2025',
  },
  {
    quote:
      'Selling my mom’s house was emotional. Niloy treated it with so much care and handled every detail so I could just be present for my family.',
    name: 'Client name',
    detail: 'Sold a family home',
  },
  {
    quote:
      'Straight talk, no pressure. Niloy told us when a place wasn’t right, even when it meant more weekends of searching. That’s why we trust Niloy.',
    name: 'Client name',
    detail: 'Relocated across town',
  },
]

// Your story
export const ABOUT = {
  title: 'Real, the way it should be.',
  paragraphs: [
    'I remember how much it meant when my family finally found a place that felt like home—that sense of relief, hope, and being able to exhale. That’s why I do this.',
    'Buying a home is a massive decision, and it can get overwhelming fast. I’m not here to be just another agent in a suit chasing a commission. I’m here to bring real knowledge, help you navigate the stress of the process, and give you honest advice even when it’s tough to hear. I treat every move like it’s my family’s, and even long after closing day, I want you to feel like you gained a friend you can trust.',
    'When I’m not helping clients or in the neighborhood, you’ll find me coding fun projects as a software engineer, making music, and spending time with family.',
  ],
  // A web-sized copy of photos-originals/about me picture.jpg (shown in black & white)
  photo: '/images/about_me_web.jpg',
  facts: [
    { value: '15+ years', label: 'in the neighborhood' },
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
  // Your contact details
  email: 'niloy@easternprimerealty.com',
  phone: '917-943-4863',
  company: 'Eastern Prime Realty',
  address: ['120 Washington Ave', 'Endicott, NY 13760'],
}

// Your social profiles
export const SOCIALS = [
  { name: 'Instagram', handle: '@realwithniloy', url: 'https://www.instagram.com/realwithniloy' },
  { name: 'Facebook', handle: 'realwithniloy', url: 'https://www.facebook.com/realwithniloy' },
  { name: 'LinkedIn', handle: 'in/hniloy96', url: 'https://www.linkedin.com/in/hniloy96/' },
]
