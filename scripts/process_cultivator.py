import numpy as np
from PIL import Image, ImageFilter

def make_cultivator_assets():
    src_path = r'C:\Users\WIN 10\.gemini\antigravity\scratch\apex-os\public\landscapes\mount_hua.jpg'
    img = Image.open(src_path)

    # Crop the martial cultivator in full combat stance
    # Coordinates: x 665 to 1275, y 60 to 655
    crop = img.crop((665, 60, 1275, 655)).convert('RGBA')
    w, h = crop.size

    # Upscale 1.5x with Lanczos for high-DPI clarity
    target_w, target_h = int(w * 1.5), int(h * 1.5)
    highres = crop.resize((target_w, target_h), Image.LANCZOS)
    hw, hh = highres.size

    # 1. Create a seamless alpha vignette mask for stage viewport overlay
    # The edges should smoothly fade to 0 alpha, while the center (character, sword, stance, petals) is 100% solid
    y_coords, x_coords = np.indices((hh, hw))
    
    # Center around character core: cx ~ 0.48 * hw, cy ~ 0.52 * hh
    cx, cy = hw * 0.48, hh * 0.52
    
    # Elliptical normalized distance from center
    rx = hw * 0.46
    ry = hh * 0.47
    
    dist_sq = ((x_coords - cx) / rx) ** 2 + ((y_coords - cy) / ry) ** 2
    
    # Inner region (< 0.70) is full opacity (255)
    # Outer region (> 1.0) is transparent (0)
    # Between 0.70 and 1.0 is a smooth cosine fade
    alpha_mask = np.ones((hh, hw), dtype=np.float32)
    outer = dist_sq >= 1.0
    blend = (dist_sq >= 0.72) & (dist_sq < 1.0)
    
    # Smooth step
    t = (np.sqrt(dist_sq[blend]) - np.sqrt(0.72)) / (1.0 - np.sqrt(0.72))
    smooth = 0.5 * (1.0 + np.cos(np.pi * t))
    alpha_mask[outer] = 0.0
    alpha_mask[blend] = smooth
    
    # Also feather the bottom stone edge slightly so it anchors onto any background stage
    bottom_fade = np.clip((hh - y_coords) / (hh * 0.08), 0.0, 1.0)
    alpha_mask = alpha_mask * bottom_fade

    alpha_channel = (alpha_mask * 255.0).astype(np.uint8)
    alpha_img = Image.fromarray(alpha_channel, mode='L')
    
    # Blur alpha mask slightly for ultra-soft feathering
    alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(radius=3))

    cultivator_stage = highres.copy()
    cultivator_stage.putalpha(alpha_img)

    out_path_vignette = r'C:\Users\WIN 10\.gemini\antigravity\scratch\apex-os\public\assets\cultivator_idle_stance.png'
    cultivator_stage.save(out_path_vignette, format='PNG')
    print('Saved:', out_path_vignette, cultivator_stage.size)

    # 2. Also create a dark background version with glowing cyan/sapphire rim aura
    dark_bg = Image.new('RGBA', (hw, hh), (8, 12, 22, 255))
    dark_combined = Image.alpha_composite(dark_bg, cultivator_stage)
    out_path_dark = r'C:\Users\WIN 10\.gemini\antigravity\scratch\apex-os\public\assets\cultivator_idle_dark.png'
    dark_combined.save(out_path_dark, format='PNG')
    print('Saved:', out_path_dark, dark_combined.size)

    # Clean up test files
    import os
    for temp in [
        r'C:\Users\WIN 10\.gemini\antigravity\scratch\apex-os\public\landscapes\test_cultivator.jpg',
        r'C:\Users\WIN 10\.gemini\antigravity\scratch\apex-os\public\landscapes\test_cultivator_wide.jpg',
        r'C:\Users\WIN 10\.gemini\antigravity\scratch\apex-os\public\landscapes\test_cultivator_framed.jpg'
    ]:
        if os.path.exists(temp):
            os.remove(temp)

make_cultivator_assets()
