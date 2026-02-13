Modern Interactive Envelope

A sleek, contemporary envelope design with smooth animations, premium styling, and an interactive message reveal experience.

Files:
- index.html — structure and markup
- styles.css — modern styling with gradients and animations
- script.js — interactivity and animations
- README.md — this file

How to view:
1. Open `envelope-site/index.html` in a browser, or serve the folder:

```bash
cd envelope-site
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

Features:
- **Modern Dark Theme**: Slate and blue palette with gradient backgrounds
- **Smooth 3D Animation**: 230° flap rotation with lift effect
- **Confetti Burst**: Blue confetti celebration with fade effect
- **Typewriter Message Reveal**: Animated text reveal with elegant typography
- **Chime Sound**: Musical notification on envelope open (requires user interaction first)
- **Responsive Design**: Beautiful on mobile and desktop
- **Keyboard Support**: Open/close with Enter or Space key
- **Premium Polish**: Subtle shadows, gradients, and hover effects

Customization:
- Edit `index.html` to change default message
- Modify `styles.css` to adjust colors (search for `#3b82f6` for blue theme)
- Adjust animation timing in `script.js` (TRANSITION_MS, speed values)
- Change confetti colors in the `colors` array

Browser Support:
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Audio: Requires user interaction first (click page)