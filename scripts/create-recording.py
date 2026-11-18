import os
from PIL import Image

FRAMES_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/f2c31b2b-25d0-4970-9cb8-3b2e33dd39f1/frames'
OUTPUT_GIF = 'C:/Users/Admin/.gemini/antigravity/brain/f2c31b2b-25d0-4970-9cb8-3b2e33dd39f1/deadlock-phase1-recording.gif'

files = sorted([os.path.join(FRAMES_DIR, f) for f in os.listdir(FRAMES_DIR) if f.endswith('.png')])
print(f"Found {len(files)} frames.")

if not files:
    print("No frames found!")
    exit(1)

# Resize to 960x540 for fast loading and optimal quality
target_size = (960, 540)
images = []

for idx, f in enumerate(files):
    img = Image.open(f).convert("RGB")
    img_resized = img.resize(target_size, Image.Resampling.LANCZOS)
    # Quantize with adaptive palette for crisp dark aesthetics and vibrant lime
    quantized = img_resized.quantize(colors=128, method=Image.Quantize.MEDIANCUT)
    images.append(quantized)

# Save as animated GIF with 90ms duration per frame (~11 fps)
images[0].save(
    OUTPUT_GIF,
    save_all=True,
    append_images=images[1:],
    duration=90,
    loop=0,
    optimize=True
)

print(f"Animated recording successfully created at: {OUTPUT_GIF}")
print(f"File size: {os.path.getsize(OUTPUT_GIF) / (1024 * 1024):.2f} MB")
