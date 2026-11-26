# realwithniloy.com

Personal real estate portfolio site for Niloy. React + Vite, animations with Motion (Framer Motion).

## Run it on your computer

```powershell
npm install
npm run dev
```

Then open http://localhost:5173 in your browser. Press `Ctrl + C` in the terminal to stop it.

## Where things live

| What | File |
| --- | --- |
| All text, reviews, links, contact details | `src/content.js` |
| Photos (replace the placeholders) | `public/placeholders/` |
| The looping dial menu | `src/components/Dial.jsx` |
| Colors, fonts, layout | `src/styles.css` |

Anything marked **PLACEHOLDER** is temporary.

## Contact form

The form is not connected yet. Create a free form at https://formspree.io and paste its endpoint
into `formspreeEndpoint` in `src/content.js`.

## Build for hosting

```powershell
npm run build
```

The finished site lands in `dist/`, ready for Vercel or Netlify.
