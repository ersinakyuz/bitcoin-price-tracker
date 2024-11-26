from PIL import Image
import requests
import numpy as np
from rembg import remove

# Load the image
image_path = "C:/Users/eakyu/OneDrive/Pictures/avatars/buymeacoffee.png"
with open(image_path, "rb") as img_file:
    input_image = Image.open(img_file)

# Remove the background
output_image = remove(input_image)

# Save the resulting image with a white background
white_bg_image = Image.new("RGBA", output_image.size, (255, 255, 255, 255))
white_bg_image.paste(output_image, mask=output_image)

output_path = "C:/Users/eakyu/OneDrive/Pictures/avatars/buymeacoffee_bg.png"
white_bg_image.save(output_path)
output_path
