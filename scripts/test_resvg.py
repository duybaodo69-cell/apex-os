import resvg_py
from PIL import Image
import io

test_svg = """<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#111827"/>
  <circle cx="100" cy="100" r="80" fill="gold" stroke="#b45309" stroke-width="6"/>
</svg>"""

png_data = resvg_py.svg_to_bytes(test_svg)
img = Image.open(io.BytesIO(png_data))
print("Successfully rendered test SVG to PNG, size:", img.size)
