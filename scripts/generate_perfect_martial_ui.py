import resvg_py
from PIL import Image
import os

OUTPUT_DIR = r"C:\Users\WIN 10\.gemini\antigravity\scratch\apex-os\public\assets"

def make_ornate_banner_svg():
    w, h = 1200, 300
    top_y = 75
    bot_y = 230
    h_body = bot_y - top_y

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <defs>
    <linearGradient id="bGoldLustre" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#fffdf0"/>
      <stop offset="15%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#f59e0b"/>
      <stop offset="60%" stop-color="#b45309"/>
      <stop offset="85%" stop-color="#fde047"/>
      <stop offset="92%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>

    <linearGradient id="bGoldH" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="15%" stop-color="#d97706"/>
      <stop offset="35%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="65%" stop-color="#fef08a"/>
      <stop offset="85%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>

    <linearGradient id="bCinnabarLacquer" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1c0f12" stop-opacity="0.96"/>
      <stop offset="30%" stop-color="#2d1217" stop-opacity="0.94"/>
      <stop offset="50%" stop-color="#3b141b" stop-opacity="0.93"/>
      <stop offset="70%" stop-color="#280f13" stop-opacity="0.94"/>
      <stop offset="100%" stop-color="#140709" stop-opacity="0.96"/>
    </linearGradient>

    <radialGradient id="bCenterQiGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.30"/>
      <stop offset="40%" stop-color="#dc2626" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <filter id="bShadowHeavy" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#000000" flood-opacity="0.88"/>
    </filter>
  </defs>

  <!-- Banner Base Polygon (Swallow-Tail Scroll Body) -->
  <g filter="url(#bShadowHeavy)">
    <path d="M 100,{top_y} 
             L {w - 100},{top_y} 
             Q {w - 60},{top_y} {w - 75},{top_y + 35} 
             L {w - 95},{(top_y + bot_y) / 2} 
             L {w - 75},{bot_y - 35} 
             Q {w - 60},{bot_y} {w - 100},{bot_y} 
             L 100,{bot_y} 
             Q 60,{bot_y} 75,{bot_y - 35} 
             L 95,{(top_y + bot_y) / 2} 
             L 75,{top_y + 35} 
             Q 60,{top_y} 100,{top_y} Z" 
          fill="url(#bCinnabarLacquer)" 
          stroke="url(#bGoldLustre)" 
          stroke-width="3.5"/>
  </g>

  <!-- Center Ambient Radiance -->
  <ellipse cx="{w / 2}" cy="{(top_y + bot_y) / 2}" rx="{w * 0.40}" ry="{h_body * 0.45}" fill="url(#bCenterQiGlow)"/>

  <!-- Inner Double Filigree Line -->
  <path d="M 116,{top_y + 14} 
           L {w - 116},{top_y + 14} 
           Q {w - 85},{top_y + 14} {w - 95},{top_y + 36} 
           L {w - 112},{(top_y + bot_y) / 2} 
           L {w - 95},{bot_y - 36} 
           Q {w - 85},{bot_y - 14} {w - 116},{bot_y - 14} 
           L 116,{bot_y - 14} 
           Q 85,{bot_y - 14} 95,{bot_y - 36} 
           L 112,{(top_y + bot_y) / 2} 
           L 95,{top_y + 36} 
           Q 85,{top_y + 14} 116,{top_y + 14} Z" 
        fill="none" 
        stroke="url(#bGoldH)" 
        stroke-width="1.8" 
        stroke-dasharray="8,4" 
        opacity="0.85"/>

  <!-- Left Scroll End Bar & Brass Rings -->
  <g transform="translate(74, {(top_y + bot_y) / 2})" filter="url(#bShadowHeavy)">
    <rect x="-9" y="{-h_body * 0.48}" width="18" height="{h_body * 0.96}" rx="7" fill="#2a150c" stroke="url(#bGoldLustre)" stroke-width="2"/>
    <circle cx="0" cy="{-h_body * 0.48}" r="12" fill="url(#bGoldLustre)" stroke="#78350f" stroke-width="1.5"/>
    <circle cx="0" cy="{h_body * 0.48}" r="12" fill="url(#bGoldLustre)" stroke="#78350f" stroke-width="1.5"/>
    <circle cx="0" cy="{-h_body * 0.48}" r="4.5" fill="#dc2626"/>
    <circle cx="0" cy="{h_body * 0.48}" r="4.5" fill="#dc2626"/>
  </g>

  <!-- Right Scroll End Bar & Brass Rings -->
  <g transform="translate({w - 74}, {(top_y + bot_y) / 2})" filter="url(#bShadowHeavy)">
    <rect x="-9" y="{-h_body * 0.48}" width="18" height="{h_body * 0.96}" rx="7" fill="#2a150c" stroke="url(#bGoldLustre)" stroke-width="2"/>
    <circle cx="0" cy="{-h_body * 0.48}" r="12" fill="url(#bGoldLustre)" stroke="#78350f" stroke-width="1.5"/>
    <circle cx="0" cy="{h_body * 0.48}" r="12" fill="url(#bGoldLustre)" stroke="#78350f" stroke-width="1.5"/>
    <circle cx="0" cy="{-h_body * 0.48}" r="4.5" fill="#dc2626"/>
    <circle cx="0" cy="{h_body * 0.48}" r="4.5" fill="#dc2626"/>
  </g>

  <!-- Top Center Grand Medallion (Yin-Yang Qi Core) -->
  <g transform="translate({w / 2}, {top_y})" filter="url(#bShadowHeavy)">
    <!-- Golden Dragon Wings Crest Base -->
    <path d="M -160,-2 
             C -95,-22 -45,-26 0,-28 
             C 45,-26 95,-22 160,-2 
             C 105,-10 50,-12 0,-14 
             C -50,-12 -105,-10 -160,-2 Z" 
          fill="url(#bGoldLustre)" stroke="#78350f" stroke-width="1.2"/>

    <!-- Upward Cloud Flame Spire -->
    <path d="M 0,-28 
             C -18,-42 -26,-58 0,-68 
             C 26,-58 18,-42 0,-28 Z" 
          fill="url(#bGoldLustre)" stroke="#92400e" stroke-width="1.5"/>
    <circle cx="0" cy="-52" r="6" fill="#dc2626" stroke="#fef08a" stroke-width="1.5"/>

    <!-- Cloud Flourishes Left & Right -->
    <path d="M -25,-24 C -55,-40 -90,-34 -110,-24 C -85,-30 -50,-26 -20,-16 Z" fill="url(#bGoldLustre)"/>
    <path d="M 25,-24 C 55,-40 90,-34 110,-24 C 85,-30 50,-26 20,-16 Z" fill="url(#bGoldLustre)"/>

    <!-- Central Taiji Disc -->
    <circle cx="0" cy="-4" r="22" fill="#111827" stroke="url(#bGoldLustre)" stroke-width="3"/>
    <circle cx="0" cy="-4" r="16" fill="#030712"/>
    <!-- Sapphire Sword Qi Yin-Yang -->
    <path d="M 0,-20 A 16,16 0 0 1 0,12 A 8,8 0 0 1 0,-4 A 8,8 0 0 0 0,-20 Z" fill="#38bdf8"/>
    <circle cx="0" cy="-12" r="3" fill="#ffffff"/>
    <circle cx="0" cy="4" r="3" fill="#0284c7"/>
  </g>

  <!-- Bottom Center Jade Seal & Tassel Mount -->
  <g transform="translate({w / 2}, {bot_y})" filter="url(#bShadowHeavy)">
    <path d="M -110,4 
             C -60,18 -30,24 0,26 
             C 30,24 60,18 110,4 
             C 70,8 35,10 0,11 
             C -35,10 -70,8 -110,4 Z" 
          fill="url(#bGoldLustre)" stroke="#78350f" stroke-width="1.2"/>
    <!-- Emerald Jade Pendant -->
    <circle cx="0" cy="22" r="12" fill="#065f46" stroke="url(#bGoldLustre)" stroke-width="2.5"/>
    <circle cx="0" cy="22" r="6" fill="#10b981"/>
    <!-- Golden Lotus Cap & Crimson Silk Tassel -->
    <path d="M -8,32 L 8,32 L 0,44 Z" fill="url(#bGoldLustre)"/>
    <path d="M -4,42 L -6,60 L 0,64 L 6,60 L 4,42 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1"/>
  </g>

  <!-- Four Ornate Cloud Corner Brackets -->
  <g transform="translate(105, {top_y + 3})">
    <path d="M 0,0 
             C 35,4 60,22 68,52 
             C 70,34 52,14 26,4 
             C 44,-6 50,-20 44,-32 
             C 32,-28 26,-10 0,0 Z" 
          fill="url(#bGoldLustre)" stroke="#78350f" stroke-width="1"/>
    <circle cx="36" cy="24" r="5" fill="#ef4444" stroke="#fef08a" stroke-width="1"/>
  </g>
  <g transform="translate({w - 105}, {top_y + 3}) scale(-1, 1)">
    <path d="M 0,0 
             C 35,4 60,22 68,52 
             C 70,34 52,14 26,4 
             C 44,-6 50,-20 44,-32 
             C 32,-28 26,-10 0,0 Z" 
          fill="url(#bGoldLustre)" stroke="#78350f" stroke-width="1"/>
    <circle cx="36" cy="24" r="5" fill="#ef4444" stroke="#fef08a" stroke-width="1"/>
  </g>
  <g transform="translate(105, {bot_y - 3}) scale(1, -1)">
    <path d="M 0,0 
             C 35,4 60,22 68,52 
             C 70,34 52,14 26,4 
             C 44,-6 50,-20 44,-32 
             C 32,-28 26,-10 0,0 Z" 
          fill="url(#bGoldLustre)" stroke="#78350f" stroke-width="1"/>
    <circle cx="36" cy="24" r="5" fill="#ef4444" stroke="#fef08a" stroke-width="1"/>
  </g>
  <g transform="translate({w - 105}, {bot_y - 3}) scale(-1, -1)">
    <path d="M 0,0 
             C 35,4 60,22 68,52 
             C 70,34 52,14 26,4 
             C 44,-6 50,-20 44,-32 
             C 32,-28 26,-10 0,0 Z" 
          fill="url(#bGoldLustre)" stroke="#78350f" stroke-width="1"/>
    <circle cx="36" cy="24" r="5" fill="#ef4444" stroke="#fef08a" stroke-width="1"/>
  </g>
</svg>"""

def make_ornate_panel_svg(transparent_center=False):
    w, h = 1200, 880
    top_y = 90
    bot_y = 790
    inner_fill = "none" if transparent_center else "#080c14"
    inner_opacity = "0.0" if transparent_center else "0.85"

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <defs>
    <linearGradient id="pGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffdf0"/>
      <stop offset="15%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#f59e0b"/>
      <stop offset="60%" stop-color="#b45309"/>
      <stop offset="85%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>

    <linearGradient id="pGoldH" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="12%" stop-color="#d97706"/>
      <stop offset="25%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="75%" stop-color="#fde047"/>
      <stop offset="88%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>

    <linearGradient id="pLacquer" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#190e10" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#12090b" stop-opacity="0.92"/>
      <stop offset="100%" stop-color="#190e10" stop-opacity="0.95"/>
    </linearGradient>

    <filter id="pDropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#000000" flood-opacity="0.88"/>
    </filter>
  </defs>

  <!-- Outer Lacquer Rim with rounded corners -->
  <rect x="50" y="{top_y}" width="{w - 100}" height="{bot_y - top_y}" rx="18" 
        fill="url(#pLacquer)" 
        stroke="url(#pGoldGrad)" 
        stroke-width="3.5" 
        filter="url(#pDropShadow)"/>

  <!-- Inner Display Window -->
  <rect x="80" y="{top_y + 30}" width="{w - 160}" height="{bot_y - top_y - 60}" rx="12" 
        fill="{inner_fill}" 
        fill-opacity="{inner_opacity}" 
        stroke="url(#pGoldH)" 
        stroke-width="2"/>

  <!-- Golden Dotted / Fret Accent Inner Ring -->
  <rect x="94" y="{top_y + 44}" width="{w - 188}" height="{bot_y - top_y - 88}" rx="8" 
        fill="none" 
        stroke="#f59e0b" 
        stroke-width="1.2" 
        stroke-dasharray="8,4" 
        opacity="0.65"/>

  <!-- Top Center Imperial Martial Crown Crest -->
  <g transform="translate({w / 2}, {top_y})" filter="url(#pDropShadow)">
    <path d="M -180,0 
             C -110,-18 -55,-24 0,-26 
             C 55,-24 110,-18 180,0 
             C 120,-8 60,-10 0,-12 
             C -60,-10 -120,-8 -180,0 Z" 
          fill="url(#pGoldGrad)" stroke="#78350f" stroke-width="1.2"/>
    
    <!-- Cloud Flame Spire reaching safely up to y=15 -->
    <path d="M 0,-26 C -20,-45 -28,-65 0,-76 C 28,-65 20,-45 0,-26 Z" 
          fill="url(#pGoldGrad)" stroke="#78350f" stroke-width="1.5"/>
    <circle cx="0" cy="-55" r="7" fill="#dc2626" stroke="#fef08a" stroke-width="1.5"/>

    <!-- Winged Scrollwork -->
    <path d="M -30,-22 C -65,-38 -105,-32 -130,-20 C -100,-26 -60,-22 -22,-14 Z" fill="url(#pGoldGrad)"/>
    <path d="M 30,-22 C 65,-38 105,-32 130,-20 C 100,-26 60,-22 22,-14 Z" fill="url(#pGoldGrad)"/>

    <!-- Martial Center Medallion -->
    <circle cx="0" cy="0" r="22" fill="#111827" stroke="url(#pGoldGrad)" stroke-width="3"/>
    <circle cx="0" cy="0" r="16" fill="#030712"/>
    <!-- Sapphire Sword Insignia -->
    <path d="M 0,-12 L 4,2 L 0,14 L -4,2 Z" fill="#38bdf8"/>
    <path d="M -7,2 L 7,2" stroke="url(#pGoldGrad)" stroke-width="2"/>
    <circle cx="0" cy="0" r="2" fill="#ffffff"/>
  </g>

  <!-- Bottom Center Dragon Clasp -->
  <g transform="translate({w / 2}, {bot_y})" filter="url(#pDropShadow)">
    <path d="M -140,0 
             C -80,14 -40,20 0,22 
             C 40,20 80,14 140,0 
             C 90,6 45,8 0,9 
             C -45,8 -90,6 -140,0 Z" 
          fill="url(#pGoldGrad)" stroke="#78350f" stroke-width="1.2"/>
    <!-- Emerald Gem Inlay -->
    <circle cx="0" cy="14" r="14" fill="#065f46" stroke="url(#pGoldGrad)" stroke-width="2.5"/>
    <circle cx="0" cy="14" r="7" fill="#10b981"/>
    <path d="M -6,26 L 6,26 L 0,38 Z" fill="url(#pGoldGrad)"/>
    <path d="M -3,36 L -5,54 L 0,58 L 5,54 L 3,36 Z" fill="#dc2626"/>
  </g>

  <!-- Four Elaborate Dragon-Cloud Corners -->
  <!-- Top Left -->
  <g transform="translate(55, {top_y + 5})" filter="url(#pDropShadow)">
    <path d="M 0,0 
             L 100,0 
             C 75,12 55,20 45,38 
             C 50,22 38,15 22,18 
             C 14,40 22,50 36,55 
             C 18,55 12,75 0,100 Z" 
          fill="url(#pGoldGrad)" stroke="#78350f" stroke-width="1.2"/>
    <path d="M 14,14 C 32,18 42,32 38,48 C 32,38 24,34 16,38 Z" fill="#fef08a" opacity="0.9"/>
    <circle cx="32" cy="32" r="5.5" fill="#dc2626" stroke="#fef08a" stroke-width="1.2"/>
    <circle cx="9" cy="9" r="4" fill="#fef08a" stroke="#78350f" stroke-width="1"/>
  </g>

  <!-- Top Right -->
  <g transform="translate({w - 55}, {top_y + 5}) scale(-1, 1)" filter="url(#pDropShadow)">
    <path d="M 0,0 
             L 100,0 
             C 75,12 55,20 45,38 
             C 50,22 38,15 22,18 
             C 14,40 22,50 36,55 
             C 18,55 12,75 0,100 Z" 
          fill="url(#pGoldGrad)" stroke="#78350f" stroke-width="1.2"/>
    <path d="M 14,14 C 32,18 42,32 38,48 C 32,38 24,34 16,38 Z" fill="#fef08a" opacity="0.9"/>
    <circle cx="32" cy="32" r="5.5" fill="#dc2626" stroke="#fef08a" stroke-width="1.2"/>
    <circle cx="9" cy="9" r="4" fill="#fef08a" stroke="#78350f" stroke-width="1"/>
  </g>

  <!-- Bottom Left -->
  <g transform="translate(55, {bot_y - 5}) scale(1, -1)" filter="url(#pDropShadow)">
    <path d="M 0,0 
             L 100,0 
             C 75,12 55,20 45,38 
             C 50,22 38,15 22,18 
             C 14,40 22,50 36,55 
             C 18,55 12,75 0,100 Z" 
          fill="url(#pGoldGrad)" stroke="#78350f" stroke-width="1.2"/>
    <path d="M 14,14 C 32,18 42,32 38,48 C 32,38 24,34 16,38 Z" fill="#fef08a" opacity="0.9"/>
    <circle cx="32" cy="32" r="5.5" fill="#dc2626" stroke="#fef08a" stroke-width="1.2"/>
    <circle cx="9" cy="9" r="4" fill="#fef08a" stroke="#78350f" stroke-width="1"/>
  </g>

  <!-- Bottom Right -->
  <g transform="translate({w - 55}, {bot_y - 5}) scale(-1, -1)" filter="url(#pDropShadow)">
    <path d="M 0,0 
             L 100,0 
             C 75,12 55,20 45,38 
             C 50,22 38,15 22,18 
             C 14,40 22,50 36,55 
             C 18,55 12,75 0,100 Z" 
          fill="url(#pGoldGrad)" stroke="#78350f" stroke-width="1.2"/>
    <path d="M 14,14 C 32,18 42,32 38,48 C 32,38 24,34 16,38 Z" fill="#fef08a" opacity="0.9"/>
    <circle cx="32" cy="32" r="5.5" fill="#dc2626" stroke="#fef08a" stroke-width="1.2"/>
    <circle cx="9" cy="9" r="4" fill="#fef08a" stroke="#78350f" stroke-width="1"/>
  </g>

  <!-- Left & Right Mid-Rail Diamond Crests -->
  <g transform="translate(64, {(top_y + bot_y) / 2})" filter="url(#pDropShadow)">
    <polygon points="0,-18 14,0 0,18 -14,0" fill="url(#pGoldGrad)" stroke="#78350f" stroke-width="1.2"/>
    <circle cx="0" cy="0" r="5" fill="#ef4444"/>
  </g>
  <g transform="translate({w - 64}, {(top_y + bot_y) / 2})" filter="url(#pDropShadow)">
    <polygon points="0,-18 14,0 0,18 -14,0" fill="url(#pGoldGrad)" stroke="#78350f" stroke-width="1.2"/>
    <circle cx="0" cy="0" r="5" fill="#ef4444"/>
  </g>
</svg>"""

def main():
    # 1. Martial Banner
    b_svg = make_ornate_banner_svg()
    b_svg_p = os.path.join(OUTPUT_DIR, "martial_banner_border.svg")
    with open(b_svg_p, "w", encoding="utf-8") as f:
        f.write(b_svg)
    b_png = resvg_py.svg_to_bytes(b_svg)
    b_png_p = os.path.join(OUTPUT_DIR, "martial_banner_border.png")
    with open(b_png_p, "wb") as f:
        f.write(b_png)
    print("Banner written:", b_png_p)

    # 2. Martial Panel Frame
    f_svg = make_ornate_panel_svg(transparent_center=False)
    f_svg_p = os.path.join(OUTPUT_DIR, "martial_ui_frame.svg")
    with open(f_svg_p, "w", encoding="utf-8") as f:
        f.write(f_svg)
    f_png = resvg_py.svg_to_bytes(f_svg)
    f_png_p = os.path.join(OUTPUT_DIR, "martial_ui_frame.png")
    with open(f_png_p, "wb") as f:
        f.write(f_png)
    print("Panel frame written:", f_png_p)

    # 3. Martial Frame Overlay (transparent center)
    o_svg = make_ornate_panel_svg(transparent_center=True)
    o_svg_p = os.path.join(OUTPUT_DIR, "martial_frame_border_overlay.svg")
    with open(o_svg_p, "w", encoding="utf-8") as f:
        f.write(o_svg)
    o_png = resvg_py.svg_to_bytes(o_svg)
    o_png_p = os.path.join(OUTPUT_DIR, "martial_frame_border_overlay.png")
    with open(o_png_p, "wb") as f:
        f.write(o_png)
    print("Overlay frame written:", o_png_p)

if __name__ == "__main__":
    main()
