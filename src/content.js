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

// Client reviews (shared with permission)
export const REVIEWS = [
  {
    quote:
      'After letting down experiences with other agents while looking for a second home, we didn’t know what to expect. Working with Niloy showed us that buying a second property shouldn’t feel stressful or rushed. He listened to every single thought and question we had and gave us space to talk things through properly. We finally felt supported and confident every step of the way.',
    name: 'Amena Rahman Poly & Anisur Rahman Dipu',
    detail: 'Second-Home Buyers',
  },
  {
    quote:
      'As a first-time buyer, I didn’t even know where to start. Niloy walked me through every single step without ever making me feel rushed or in the dark. I’d call him multiple times a day to go over every detail, and he always picked up and broke things down clearly. Having someone that patient and reliable made a huge difference.',
    name: 'Ruman Ahmad',
    detail: 'First-Time Homebuyer',
  },
  {
    quote:
      'Finding investment properties can get hectic fast when the market shifts day by day. Niloy kept things clear and steady at every step, giving me straight numbers and honest takes instead of sales fluff. What could have been a stressful process felt organized and manageable from start to finish.',
    name: 'Kamrul Wadud',
    detail: 'Real Estate Investor',
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
  // shown under the photo
  credentials: {
    name: 'Hamim Niloy, REALTOR®',
    title: 'Real Estate Salesperson',
    license: 'License No: #10401403188',
    company: 'Eastern Prime Realty',
    address: '120 Washington Ave, Endicott, NY 13760', // keeps NY and the zip together
  },
  facts: [
    { value: '15+ years', label: 'in the neighborhood' },
    { value: '24h', label: 'reply time, always' },
  ],
}

export const CONTACT = {
  title: "Let's talk. No pressure, just a conversation.",
  intro:
    "Whether you're dreaming, planning, or ready to move tomorrow, tell me a little about where you are. I'll get back to you personally.",
  // The contact form sends through Formspree (free) to niloy@easternprimerealty.com.
  // Paste your Formspree form endpoint here, e.g. 'https://formspree.io/f/abcd1234'.
  // Leave it empty and the form shows a friendly "email or call me" note instead.
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

// Required by New York State: link to the NYS Housing and Anti-Discrimination Notice
export const FAIR_HOUSING = {
  label: 'Fair Housing Notice',
  url: 'https://dos.ny.gov/system/files/documents/2025/03/nys-housing-and-anti-discrimination-notice_02.2025.pdf',
}

// Footer at the very bottom of the page
export const FOOTER = {
  companyLogo: '/images/company_logo.jpg',
  brokerageUrl: 'https://easternprimerealty.com/',
  // Paste the Standard Operating Procedure link here when you have it
  sopUrl: '',
  info: [
    'Name: Hamim Niloy, REALTOR®', // REALTOR® always with the ® and attached to the name (NAR rule)
    'Licensed Real Estate Salesperson',
    'NY Lic #10401403188',
    'Eastern Prime Realty',
    '120 Washington Ave, Endicott, NY 13760',
    // items with a phone number become tap-to-call links
    { label: 'Office', phone: '929-372-2611' },
    { label: 'Cell', phone: '917-943-4863' },
  ],
}
