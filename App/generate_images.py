from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

root = Path(r"c:\Users\Rayfaga\Desktop\ЦУ\term_3\HACK\frontend\images")
root.mkdir(parents=True, exist_ok=True)

for i in range(1, 7):
    img = Image.new('RGB', (300, 180), (245, 247, 255))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((18, 18, 282, 162), radius=18, fill=(230, 236, 255))
    draw.rectangle((34, 34, 266, 146), outline=(128, 164, 255), width=2)
    draw.text((150, 90), str(i), fill=(52, 82, 180), anchor='mm', font=ImageFont.load_default())
    img.save(root / f'{i}_type.png')

print('created:', sorted(p.name for p in root.iterdir()))
