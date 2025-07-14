import os
import tkinter as tk
from tkinter import filedialog, messagebox
import imageio.v2 as imageio  # imageio supports reading .dds files
from PIL import Image

def convert_dds_to_png():
    dds_folder = filedialog.askdirectory(title="Select folder with DDS files")
    if not dds_folder:
        return

    for root, _, files in os.walk(dds_folder):
        for file in files:
            if file.lower().endswith(".dds"):
                dds_path = os.path.join(root, file)
                base_name = os.path.splitext(file)[0]
                png_path = os.path.join(root, f"{base_name}.png")

                try:
                    image = imageio.imread(dds_path)
                    img = Image.fromarray(image)
                    img.save(png_path)
                except Exception as e:
                    messagebox.showerror("Conversion Error", f"Error converting {file}: {e}")
    
    messagebox.showinfo("Conversion Complete", "All .dds files have been converted to .png.")

def adjust_fnt():
    fnt_folder = filedialog.askdirectory(title="Select folder with FNT files")
    if not fnt_folder:
        return

    for root, _, files in os.walk(fnt_folder):
        for file in files:
            if file.lower().endswith(".fnt"):
                fnt_path = os.path.join(root, file)
                try:
                    with open(fnt_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    content = content.replace('.dds"', '.png"')
                    with open(fnt_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                except Exception as e:
                    messagebox.showerror("FNT Adjustment Error", f"Error adjusting {file}: {e}")
    
    messagebox.showinfo("Adjustment Complete", "All .fnt files have been updated.")

# Graphical Interface
window = tk.Tk()
window.title("DDS Converter + FNT Adjuster")
window.geometry("400x200")
window.configure(bg="#2e2e2e")

btn_dds = tk.Button(window, text="Convert DDS to PNG", command=convert_dds_to_png, bg="#444", fg="white", font=("Arial", 12))
btn_dds.pack(pady=20)

btn_fnt = tk.Button(window, text="Adjust FNT Files", command=adjust_fnt, bg="#444", fg="white", font=("Arial", 12))
btn_fnt.pack(pady=10)

window.mainloop()