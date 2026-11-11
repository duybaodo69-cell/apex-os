import resvg_py
from PIL import Image, ImageFilter
import io
import os
import numpy as np

OUTPUT_DIR = r"C:\Users\WIN 10\.gemini\antigravity\scratch\apex-os\public\assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_banner_svg(w=1200, h=240):
    """Generates an ancient martial scroll/banner border texture with gold filigree and dragon cloud motifs."""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="15%" stop-color="#fde047"/>
      <stop offset="45%" stop-color="#d97706"/>
      <stop offset="70%" stop-color="#b45309"/>
      <stop offset="85%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>

    <linearGradient id="goldHorizontal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#92400e"/>
      <stop offset="10%" stop-color="#fde047"/>
      <stop offset="25%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#fef08a"/>
      <stop offset="75%" stop-color="#f59e0b"/>
      <stop offset="90%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>

    <linearGradient id="lacquerBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1c120c" stop-opacity="0.95"/>
      <stop offset="30%" stop-color="#2a1215" stop-opacity="0.92"/>
      <stop offset="70%" stop-color="#1f0e11" stop-opacity="0.92"/>
      <stop offset="100%" stop-color="#140a08" stop-opacity="0.95"/>
    </linearGradient>

    <radialGradient id="bannerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e11d48" stop-opacity="0.25"/>
      <stop offset="50%" stop-color="#b45309" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <filter id="goldDropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.8"/>
    </filter>

    <filter id="qiGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Banner Background Body with Swallow-tail / Scroll-cut Ends -->
  <path d="M 60,30 
           L {w - 60},30 
           Q {w - 20},30 {w - 30},60 
           L {w - 50},{h / 2} 
           L {w - 30},{h - 60} 
           Q {w - 20},{h - 30} {w - 60},{h - 30} 
           L 60,{h - 30} 
           Q 20,{h - 30} 30,{h - 60} 
           L 50,{h / 2} 
           L 30,60 
           Q 20,30 60,30 Z" 
        fill="url(#lacquerBg)" 
        stroke="url(#goldGrad)" 
        stroke-width="3" 
        filter="url(#goldDropShadow)"/>

  <!-- Radial Atmosphere Overlay -->
  <ellipse cx="{w / 2}" cy="{h / 2}" rx="{w * 0.42}" ry="{h * 0.4}" fill="url(#bannerGlow)"/>

  <!-- Inner Trim Double Line -->
  <path d="M 75,42 
           L {w - 75},42 
           Q {w - 45},42 {w - 52},64 
           L {w - 68},{h / 2} 
           L {w - 52},{h - 64} 
           Q {w - 45},{h - 42} {w - 75},{h - 42} 
           L 75,{h - 42} 
           Q 45,{h - 42} 52,{h - 64} 
           L 68,{h / 2} 
           L 52,64 
           Q 45,42 75,42 Z" 
        fill="none" 
        stroke="url(#goldHorizontal)" 
        stroke-width="1.5" 
        stroke-dasharray="6,3" 
        opacity="0.85"/>

  <!-- Top Central Ornament / Crest Mount -->
  <g transform="translate({w / 2}, 30)" filter="url(#goldDropShadow)">
    <!-- Central Crest Base -->
    <path d="M -110,-12 
             C -60,-24 -30,-28 0,-30 
             C 30,-28 60,-24 110,-12 
             C 70,-4 35,-6 0,-8 
             C -35,-6 -70,-4 -110,-12 Z" 
          fill="url(#goldGrad)" stroke="#78350f" stroke-width="1"/>
    
    <!-- Cloud Spire Top -->
    <path d="M 0,-32 
             C -15,-45 -22,-60 0,-68 
             C 22,-60 15,-45 0,-32 Z" 
          fill="url(#goldGrad)" stroke="#92400e" stroke-width="1.2"/>
    <circle cx="0" cy="-50" r="5" fill="#ef4444" stroke="#fef08a" stroke-width="1"/>

    <!-- Winged Cloud Filigree Left -->
    <path d="M -20,-24 C -45,-38 -75,-30 -90,-20 C -70,-26 -40,-22 -15,-16 Z" 
          fill="url(#goldGrad)" opacity="0.9"/>
    <!-- Winged Cloud Filigree Right -->
    <path d="M 20,-24 C 45,-38 75,-30 90,-20 C 70,-26 40,-22 15,-16 Z" 
          fill="url(#goldGrad)" opacity="0.9"/>

    <!-- Martial Medallion Center -->
    <circle cx="0" cy="-12" r="14" fill="#1e1b4b" stroke="url(#goldGrad)" stroke-width="3"/>
    <circle cx="0" cy="-12" r="9" fill="#0f172a"/>
    <!-- Yin Yang / Dao Symbol Mini -->
    <path d="M 0,-21 A 9,9 0 0 1 0,-3 A 4.5,4.5 0 0 1 0,-12 A 4.5,4.5 0 0 0 0,-21 Z" fill="#38bdf8"/>
    <circle cx="0" cy="-16.5" r="1.8" fill="#ffffff"/>
    <circle cx="0" cy="-7.5" r="1.8" fill="#0284c7"/>
  </g>

  <!-- Bottom Central Seal Clasp -->
  <g transform="translate({w / 2}, {h - 30})" filter="url(#goldDropShadow)">
    <path d="M -80,10 
             C -40,18 -20,22 0,24 
             C 20,22 40,18 80,10 
             C 50,4 25,6 0,7 
             C -25,6 -50,4 -80,10 Z" 
          fill="url(#goldGrad)" stroke="#78350f" stroke-width="1"/>
    <!-- Tassel Loop & Jade Pendant -->
    <circle cx="0" cy="18" r="8" fill="#047857" stroke="url(#goldGrad)" stroke-width="2"/>
    <path d="M -3,26 L 0,42 L 3,26 Z" fill="#dc2626"/>
  </g>

  <!-- Corner Dragon Scrollwork - Top Left -->
  <g transform="translate(60, 30)">
    <path d="M 0,0 
             C 25,2 45,15 50,35 
             C 52,22 38,8 20,0 
             C 35,-6 40,-16 35,-25 
             C 26,-22 22,-8 0,0 Z" 
          fill="url(#goldGrad)" stroke="#78350f" stroke-width="0.8"/>
    <circle cx="28" cy="18" r="4" fill="#dc2626" stroke="#fef08a" stroke-width="1"/>
  </g>

  <!-- Corner Dragon Scrollwork - Top Right -->
  <g transform="translate({w - 60}, 30) scale(-1, 1)">
    <path d="M 0,0 
             C 25,2 45,15 50,35 
             C 52,22 38,8 20,0 
             C 35,-6 40,-16 35,-25 
             C 26,-22 22,-8 0,0 Z" 
          fill="url(#goldGrad)" stroke="#78350f" stroke-width="0.8"/>
    <circle cx="28" cy="18" r="4" fill="#dc2626" stroke="#fef08a" stroke-width="1"/>
  </g>

  <!-- Corner Dragon Scrollwork - Bottom Left -->
  <g transform="translate(60, {h - 30}) scale(1, -1)">
    <path d="M 0,0 
             C 25,2 45,15 50,35 
             C 52,22 38,8 20,0 
             C 35,-6 40,-16 35,-25 
             C 26,-22 22,-8 0,0 Z" 
          fill="url(#goldGrad)" stroke="#78350f" stroke-width="0.8"/>
    <circle cx="28" cy="18" r="4" fill="#dc2626" stroke="#fef08a" stroke-width="1"/>
  </g>

  <!-- Corner Dragon Scrollwork - Bottom Right -->
  <g transform="translate({w - 60}, {h - 30}) scale(-1, -1)">
    <path d="M 0,0 
             C 25,2 45,15 50,35 
             C 52,22 38,8 20,0 
             C 35,-6 40,-16 35,-25 
             C 26,-22 22,-8 0,0 Z" 
          fill="url(#goldGrad)" stroke="#78350f" stroke-width="0.8"/>
    <circle cx="28" cy="18" r="4" fill="#dc2626" stroke="#fef08a" stroke-width="1"/>
  </g>

  <!-- Left & Right Ancient Scroll Caps (Wood / Brass Rod Terminals) -->
  <g transform="translate(30, {h / 2})">
    <ellipse cx="0" cy="0" rx="8" ry="{h * 0.38}" fill="#3f2314" stroke="url(#goldGrad)" stroke-width="2"/>
    <circle cx="0" cy="{-h * 0.36}" r="6" fill="url(#goldGrad)"/>
    <circle cx="0" cy="{h * 0.36}" r="6" fill="url(#goldGrad)"/>
  </g>
  <g transform="translate({w - 30}, {h / 2})">
    <ellipse cx="0" cy="0" rx="8" ry="{h * 0.38}" fill="#3f2314" stroke="url(#goldGrad)" stroke-width="2"/>
    <circle cx="0" cy="{-h * 0.36}" r="6" fill="url(#goldGrad)"/>
    <circle cx="0" cy="{h * 0.36}" r="6" fill="url(#goldGrad)"/>
  </g>
</svg>"""

def generate_panel_frame_svg(w=1200, h=800):
    """Generates an ornate full-panel ancient martial UI frame border with translucent inner center."""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <defs>
    <linearGradient id="frameGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="12%" stop-color="#fde047"/>
      <stop offset="35%" stop-color="#d97706"/>
      <stop offset="65%" stop-color="#92400e"/>
      <stop offset="85%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>

    <linearGradient id="lacquerRim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1012" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#14090b" stop-opacity="0.90"/>
      <stop offset="100%" stop-color="#1e1012" stop-opacity="0.95"/>
    </linearGradient>

    <radialGradient id="cornerAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <filter id="glowShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.9"/>
    </filter>
  </defs>

  <!-- Outer Dark Lacquer Outer Rail -->
  <rect x="15" y="15" width="{w - 30}" height="{h - 30}" rx="12" 
        fill="url(#lacquerRim)" 
        stroke="url(#frameGold)" 
        stroke-width="3" 
        filter="url(#glowShadow)"/>

  <!-- Inner Transparent Window Cutout (Semi-translucent dark tint for game readability) -->
  <rect x="42" y="42" width="{w - 84}" height="{h - 84}" rx="8" 
        fill="#05070a" 
        fill-opacity="0.75" 
        stroke="url(#frameGold)" 
        stroke-width="1.8"/>

  <!-- Decorative Inner Fret Inset Line -->
  <rect x="52" y="52" width="{w - 104}" height="{h - 104}" rx="6" 
        fill="none" 
        stroke="#d97706" 
        stroke-width="1" 
        stroke-dasharray="8,4" 
        opacity="0.7"/>

  <!-- Top Center Martial Arch & Emblem -->
  <g transform="translate({w / 2}, 30)" filter="url(#glowShadow)">
    <!-- Base Ribbon Crest -->
    <path d="M -160,0 
             C -90,-15 -45,-20 0,-22 
             C 45,-20 90,-15 160,0 
             C 100,-6 50,-8 0,-10 
             C -50,-8 -100,-6 -160,0 Z" 
          fill="url(#frameGold)"/>
    
    <!-- Cloud Spire -->
    <path d="M -35,-8 C -40,-35 -15,-48 0,-56 C 15,-48 40,-35 35,-8 Z" 
          fill="url(#frameGold)" stroke="#78350f" stroke-width="1.5"/>
    <circle cx="0" cy="-36" r="7" fill="#dc2626" stroke="#fef08a" stroke-width="1.5"/>

    <!-- Central Grand Medallion -->
    <circle cx="0" cy="12" r="22" fill="#18120c" stroke="url(#frameGold)" stroke-width="3"/>
    <circle cx="0" cy="12" r="15" fill="#0f172a" stroke="#b45309" stroke-width="1"/>
    <!-- Sword Blade Emblem -->
    <path d="M 0,-1 L 3,12 L 0,25 L -3,12 Z" fill="#38bdf8"/>
    <path d="M -6,12 L 6,12" stroke="url(#frameGold)" stroke-width="2"/>
  </g>

  <!-- Bottom Center Dragon Clasp -->
  <g transform="translate({w / 2}, {h - 30})" filter="url(#glowShadow)">
    <path d="M -120,0 
             C -70,12 -35,16 0,18 
             C 35,16 70,12 120,0 
             C 75,5 35,7 0,8 
             C -35,7 -75,5 -120,0 Z" 
          fill="url(#frameGold)"/>
    <circle cx="0" cy="10" r="14" fill="#064e3b" stroke="url(#frameGold)" stroke-width="2"/>
    <circle cx="0" cy="10" r="7" fill="#10b981"/>
  </g>

  <!-- Four Elaborate Dragon-Horn Cloud Corners -->
  <!-- Top-Left Corner -->
  <g transform="translate(18, 18)" filter="url(#glowShadow)">
    <path d="M 0,0 
             L 90,0 
             C 70,10 50,15 40,30 
             C 45,18 35,12 20,15 
             C 12,35 18,45 30,50 
             C 15,50 10,70 0,90 
             Z" 
          fill="url(#frameGold)" stroke="#78350f" stroke-width="1"/>
    <!-- Cloud Spiral Inner -->
    <path d="M 12,12 C 28,15 36,28 32,42 C 28,34 20,30 14,34 Z" fill="#fde047" opacity="0.9"/>
    <circle cx="28" cy="28" r="5" fill="#dc2626" stroke="#fef08a" stroke-width="1"/>
    <!-- Corner Rivet -->
    <circle cx="8" cy="8" r="3.5" fill="#fef08a" stroke="#78350f" stroke-width="1"/>
  </g>

  <!-- Top-Right Corner -->
  <g transform="translate({w - 18}, 18) scale(-1, 1)" filter="url(#glowShadow)">
    <path d="M 0,0 
             L 90,0 
             C 70,10 50,15 40,30 
             C 45,18 35,12 20,15 
             C 12,35 18,45 30,50 
             C 15,50 10,70 0,90 
             Z" 
          fill="url(#frameGold)" stroke="#78350f" stroke-width="1"/>
    <path d="M 12,12 C 28,15 36,28 32,42 C 28,34 20,30 14,34 Z" fill="#fde047" opacity="0.9"/>
    <circle cx="28" cy="28" r="5" fill="#dc2626" stroke="#fef08a" stroke-width="1"/>
    <circle cx="8" cy="8" r="3.5" fill="#fef08a" stroke="#78350f" stroke-width="1"/>
  </g>

  <!-- Bottom-Left Corner -->
  <g transform="translate(18, {h - 18}) scale(1, -1)" filter="url(#glowShadow)">
    <path d="M 0,0 
             L 90,0 
             C 70,10 50,15 40,30 
             C 45,18 35,12 20,15 
             C 12,35 18,45 30,50 
             C 15,50 10,70 0,90 
             Z" 
          fill="url(#frameGold)" stroke="#78350f" stroke-width="1"/>
    <path d="M 12,12 C 28,15 36,28 32,42 C 28,34 20,30 14,34 Z" fill="#fde047" opacity="0.9"/>
    <circle cx="28" cy="28" r="5" fill="#dc2626" stroke="#fef08a" stroke-width="1"/>
    <circle cx="8" cy="8" r="3.5" fill="#fef08a" stroke="#78350f" stroke-width="1"/>
  </g>

  <!-- Bottom-Right Corner -->
  <g transform="translate({w - 18}, {h - 18}) scale(-1, -1)" filter="url(#glowShadow)">
    <path d="M 0,0 
             L 90,0 
             C 70,10 50,15 40,30 
             C 45,18 35,12 20,15 
             C 12,35 18,45 30,50 
             C 15,50 10,70 0,90 
             Z" 
          fill="url(#frameGold)" stroke="#78350f" stroke-width="1"/>
    <path d="M 12,12 C 28,15 36,28 32,42 C 28,34 20,30 14,34 Z" fill="#fde047" opacity="0.9"/>
    <circle cx="28" cy="28" r="5" fill="#dc2626" stroke="#fef08a" stroke-width="1"/>
    <circle cx="8" cy="8" r="3.5" fill="#fef08a" stroke="#78350f" stroke-width="1"/>
  </g>

  <!-- Mid-rail Medallions Left & Right -->
  <g transform="translate(28, {h / 2})" filter="url(#glowShadow)">
    <polygon points="0,-16 12,0 0,16 -12,0" fill="url(#frameGold)" stroke="#78350f" stroke-width="1"/>
    <circle cx="0" cy="0" r="4" fill="#ef4444"/>
  </g>
  <g transform="translate({w - 28}, {h / 2})" filter="url(#glowShadow)">
    <polygon points="0,-16 12,0 0,16 -12,0" fill="url(#frameGold)" stroke="#78350f" stroke-width="1"/>
    <circle cx="0" cy="0" r="4" fill="#ef4444"/>
  </g>
</svg>"""

def make_alex_vance_cultivator():
    """Creates a transparent vignetted sprite for Alex Vance in public/assets/."""
    src = r"C:\Users\WIN 10\.gemini\antigravity\scratch\apex-os\public\characters\alex_vance.jpg"
    img = Image.open(src).convert("RGBA")
    w, h = img.size

    y_coords, x_coords = np.indices((h, w))
    cx, cy = w * 0.50, h * 0.45
    rx, ry = w * 0.48, h * 0.50

    dist_sq = ((x_coords - cx) / rx) ** 2 + ((y_coords - cy) / ry) ** 2
    alpha = np.ones((h, w), dtype=np.float32)
    outer = dist_sq >= 1.0
    blend = (dist_sq >= 0.70) & (dist_sq < 1.0)
    t = (np.sqrt(dist_sq[blend]) - np.sqrt(0.70)) / (1.0 - np.sqrt(0.70))
    alpha[outer] = 0.0
    alpha[blend] = 0.5 * (1.0 + np.cos(np.pi * t))

    # Bottom fade
    b_fade = np.clip((h - y_coords) / (h * 0.12), 0.0, 1.0)
    alpha = alpha * b_fade

    a_img = Image.fromarray((alpha * 255.0).astype(np.uint8), mode="L")
    a_img = a_img.filter(ImageFilter.GaussianBlur(radius=4))
    img.putalpha(a_img)

    out_p = os.path.join(OUTPUT_DIR, "cultivator_alex_vance.png")
    img.save(out_p, format="PNG")
    print("Saved:", out_p)

def main():
    print("Generating vector & rendered martial UI assets...")
    
    # 1. Martial Banner
    banner_svg = generate_banner_svg(1200, 240)
    banner_svg_path = os.path.join(OUTPUT_DIR, "martial_banner_border.svg")
    with open(banner_svg_path, "w", encoding="utf-8") as f:
        f.write(banner_svg)
    print("Saved:", banner_svg_path)

    banner_png_bytes = resvg_py.svg_to_bytes(banner_svg)
    banner_png_path = os.path.join(OUTPUT_DIR, "martial_banner_border.png")
    with open(banner_png_path, "wb") as f:
        f.write(banner_png_bytes)
    print("Saved:", banner_png_path)

    # 2. Martial UI Frame
    frame_svg = generate_panel_frame_svg(1200, 800)
    frame_svg_path = os.path.join(OUTPUT_DIR, "martial_ui_frame.svg")
    with open(frame_svg_path, "w", encoding="utf-8") as f:
        f.write(frame_svg)
    print("Saved:", frame_svg_path)

    frame_png_bytes = resvg_py.svg_to_bytes(frame_svg)
    frame_png_path = os.path.join(OUTPUT_DIR, "martial_ui_frame.png")
    with open(frame_png_path, "wb") as f:
        f.write(frame_png_bytes)
    print("Saved:", frame_png_path)

    # 3. Alex Vance cultivator sprite
    make_alex_vance_cultivator()

    print("All martial visual assets generated successfully!")

if __name__ == "__main__":
    main()
