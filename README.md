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

## 🔁 New! Convert TTF Back Into Telltale Fonts

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

---

## 🔧 About the PNG - DDS Converter + FNT Adjuster

This tool was built to streamline the process of preparing fonts for Telltale games, and it uses the official [DirectXTex](https://github.com/microsoft/DirectXTex) library from Microsoft to handle image conversions.

> The `texconv.exe` files required for conversion are already included inside the **"PNG - DDS Converter + FNT Adjuster"** folder, so you don’t need to download anything else separately.

Now your custom font is ready to be used inside any Telltale game! 🔥
