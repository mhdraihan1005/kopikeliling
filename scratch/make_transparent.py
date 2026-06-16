import os
from PIL import Image

def make_white_transparent(img_path, output_path):
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    
    pixels = img.load()
    visited = set()
    queue = []
    
    # Start BFS from all border pixels
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))
            
    # Remove duplicates
    queue = list(set(queue))
    
    # Threshold for "near white". White is (255, 255, 255)
    def is_near_white(color):
        r, g, b, a = color
        if a == 0:
            return False
        # If the pixel is very bright/near white (e.g. > 200 in all channels)
        return r > 200 and g > 200 and b > 200
        
    while queue:
        cx, cy = queue.pop(0)
        if (cx, cy) in visited:
            continue
        visited.add((cx, cy))
        
        if 0 <= cx < width and 0 <= cy < height:
            color = pixels[cx, cy]
            if is_near_white(color):
                # Make it transparent
                pixels[cx, cy] = (0, 0, 0, 0)
                
                # Add neighbors
                for nx, ny in [(cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)]:
                    if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                        queue.append((nx, ny))
                        
    img.save(output_path, "PNG")
    print("Background transparency processing complete.")

if __name__ == "__main__":
    img_path = r"c:\Users\Thinkpad\kopikeliling\public\logo.png"
    output_path = r"c:\Users\Thinkpad\kopikeliling\public\logo.png"
    make_white_transparent(img_path, output_path)
