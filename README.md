# Telltale Font Converter

## 📦 What does it do?

This tool converts Telltale Games' font files (the classic `.fnt` + `.png` pairs) into usable TTF fonts for Windows systems. It simplifies the process of turning game assets into functional fonts for editing or localization purposes.

## ⚙️ Requirements

To ensure everything works properly, follow these steps:

### FNT and DDS Extraction

To extract `.fnt` and `.dds` files from Telltale font textures, **you must use the TTG Tools** application.  
Go to the **Font Editor** tab inside TTG Tools to extract the required files before using them in Telltale Font Converter.

### Preprocessing Step (Before Using This Tool)

After extraction, place both the `.fnt` and `.dds` files inside the **DDS Converter + FNT Adjuster.exe** tool.

This step is essential because:

- It converts the `.dds` file to `.png`, which is required for the font to work correctly.
- It also updates a key line in the FNT file, changing:

```xml
page id=0 file="Arial_30_0.dds"
````

to:

```xml
page id=0 file="Arial_30_0.png"
```

Only after this adjustment can the Telltale Font Converter properly read and convert the font files.
