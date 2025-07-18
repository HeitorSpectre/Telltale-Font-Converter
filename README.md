# Telltale Font Converter

## What does it do? 🤔

Simply put, it takes the font files from Telltale Games (those classic `.fnt + .png` pairs) and converts them into a single TrueType Font file (`.ttf`).  
Once you have the `.ttf`, you can install it on your system and use it in any program — like Photoshop, FontForge, or any other font editor!

---

## ⚙️ How Does It Work?

The process is super simple and broken down into a few steps:

1. **Give your project a name**  
   Just a name to help you identify the font you're creating  
   _Example: "The Walking Dead Main Font"_

2. **Upload the `.fnt` file**  
   The tool will read the data from the file and figure out which texture files (`.png`) are needed.

3. **Upload the `.png` files**  
   The tool will prompt you to upload the correct image files one by one.  
   It even checks if the filenames match what’s expected!

4. **Select the Characters**  
   Tick the boxes for the character sets you want to include.

5. **Generate the `.ttf`**  
   With a single click, the tool will process the images and data to generate and download your ready-to-use `.ttf` file.

---

## 🔁 v.1.1 - New! Convert TTF Back Into Telltale Fonts

A brand new feature has been added: now you can also convert TTF fonts back into the original `.fnt + .png` format used by Telltale Games!

This allows you to take any custom font and use it in your favorite Telltale titles.

> ⚠️ Note: To make it work properly, you’ll need **TTG Tools** and my custom tool **"PNG - DDS Converter + FNT Adjuster.exe"**.

### How to use it:

1. **Convert your `.ttf`**  
   Use **Telltale Font Converter** to generate `.png` and `.fnt` files from any TTF font.

2. **Convert the `.png` to `.dds`**  
   Open **"PNG - DDS Converter + FNT Adjuster.exe"**.  
   Click **"Convert PNG to DDS (DXT5)"** and select the folder containing your `.png` file.

3. **Adjust the `.fnt` file**  
   Still in the same tool, click **"Adjust FNT to DDS"** and select the folder with your `.fnt` file.

4. **Rebuild the font for Telltale games**  
   Use **TTG Tools**, available here: [https://github.com/zenderovpaulo95/TTG-Tools](https://github.com/zenderovpaulo95/TTG-Tools)  
   Open the **Font Editor** and rebuild your font using the adjusted files.

## 🔁 v.1.2 - Add DDS (DXT5) Export via Batch Script

This commit introduces support for generating DDS (DXT5) textures as part of the TTF to FNT conversion workflow.

Since web applications cannot directly execute local command-line tools like `texconv.exe`, this feature is implemented through the generation of a helper Windows batch script (`.bat`), alongside the standard `.fnt` and `.png` files.

### Key Changes:
- A new "Texture Format" dropdown menu has been added to the configuration screen, allowing users to select between "PNG" and "DDS (DXT5)".
- When "DDS (DXT5)" is selected, an informational message is displayed, instructing users on how to use the generated batch file with `texconv.exe`.
- The `generateFontAssets` service now conditionally creates a `convert_to_dds.bat` file. This script contains the necessary commands to convert all generated PNG textures to the DDS DXT5 format.
- The generated `.fnt` file is updated to reference the final `.dds` filenames instead of `.png` when the DDS option is selected.

This provides an optimized workflow for users who require DDS textures, while respecting browser security limitations.

---

## 🔧 About the PNG - DDS Converter + FNT Adjuster

This tool was built to streamline the process of preparing fonts for Telltale games, and it uses the official [DirectXTex](https://github.com/microsoft/DirectXTex) library from Microsoft to handle image conversions.

> The `texconv.exe` files required for conversion are already included inside the **"PNG - DDS Converter + FNT Adjuster"** folder, so you don’t need to download anything else separately.

Now your custom font is ready to be used inside any Telltale game! 🔥
