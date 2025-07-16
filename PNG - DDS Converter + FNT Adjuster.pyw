import os
import sys
import subprocess
import tkinter as tk
from tkinter import filedialog, messagebox
import imageio.v2 as imageio
from PIL import Image

# Função para determinar o caminho correto dos recursos empacotados
def resource_path(relative_path):
    """Obtém o caminho absoluto para o recurso, funciona para desenvolvimento e para PyInstaller"""
    try:
        # PyInstaller cria uma pasta temporária e armazena o caminho em _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

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

def convert_png_to_dds():
    png_folder = filedialog.askdirectory(title="Select folder with PNG files")
    if not png_folder:
        return

    # Obtém o caminho correto para texconv.exe (considerando empacotamento)
    texconv_path = resource_path("texconv.exe")
    
    if not os.path.isfile(texconv_path):
        messagebox.showerror("Missing Tool", f"texconv.exe not found at: {texconv_path}")
        return

    for root, _, files in os.walk(png_folder):
        for file in files:
            if file.lower().endswith(".png"):
                png_path = os.path.join(root, file)
                try:
                    subprocess.run([
                        texconv_path,
                        "-f", "DXT5",
                        "-o", root,
                        "-y",
                        png_path
                    ], check=True)
                except subprocess.CalledProcessError as e:
                    messagebox.showerror("Conversion Error", f"Error converting {file} to DDS: {e}")
    
    messagebox.showinfo("Conversion Complete", "All .png files have been converted to .dds (DXT5).")

def adjust_fnt_to_png():
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
    
    messagebox.showinfo("Adjustment Complete", "All .fnt files have been updated to use .png.")

def adjust_fnt_to_dds():
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
                    content = content.replace('.png"', '.dds"')
                    with open(fnt_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                except Exception as e:
                    messagebox.showerror("FNT Adjustment Error", f"Error adjusting {file}: {e}")
    
    messagebox.showinfo("Adjustment Complete", "All .fnt files have been updated to use .dds.")

# GUI
window = tk.Tk()
window.title("DDS ⇄ PNG Converter + FNT Adjuster")
window.geometry("430x300")
window.configure(bg="#2e2e2e")

tk.Button(window, text="Convert DDS to PNG", command=convert_dds_to_png, bg="#444", fg="white", font=("Arial", 12)).pack(pady=10)
tk.Button(window, text="Adjust FNT to PNG", command=adjust_fnt_to_png, bg="#444", fg="white", font=("Arial", 12)).pack(pady=5)
tk.Button(window, text="Convert PNG to DDS (DXT5)", command=convert_png_to_dds, bg="#444", fg="white", font=("Arial", 12)).pack(pady=10)
tk.Button(window, text="Adjust FNT to DDS", command=adjust_fnt_to_dds, bg="#444", fg="white", font=("Arial", 12)).pack(pady=5)

window.mainloop()
