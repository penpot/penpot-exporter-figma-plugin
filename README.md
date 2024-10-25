[uri_license]: https://www.mozilla.org/en-US/MPL/2.0
[uri_license_image]: https://img.shields.io/badge/MPL-2.0-blue.svg

<h1 align="center">
  <br>
  <img style="width:100px" src="ui-src/logo.svg" alt="PENPOT">
  <br>
  PENPOT EXPORTER
</h1>

<p align="center"><a href="https://www.mozilla.org/en-US/MPL/2.0" rel="nofollow"><img src="https://camo.githubusercontent.com/3fcf3d6b678ea15fde3cf7d6af0e242160366282d62a7c182d83a50bfee3f45e/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4d504c2d322e302d626c75652e737667" alt="License: MPL-2.0" data-canonical-src="https://img.shields.io/badge/MPL-2.0-blue.svg" style="max-width:100%;"></a>
<a href="https://github.com/orgs/penpot/projects/1" title="Managed with GitHub Projects" rel="nofollow"><img src="https://camo.githubusercontent.com/4a1d1112f0272e3393b1e8da312ff4435418e9e2eb4c0964881e3680f90a653c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6d616e61676564253230776974682d54414947412e696f2d3730396631342e737667" alt="Managed with GitHub Projects" data-canonical-src="https://img.shields.io/badge/managed%20with-TAIGA.io-709f14.svg" style="max-width:100%;"></a>
<a href="https://gitpod.io/#https://github.com/penpot/penpot" rel="nofollow"><img src="https://camo.githubusercontent.com/daadb4894128d1e19b72d80236f5959f1f2b47f9fe081373f3246131f0189f6c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f476974706f642d72656164792d2d746f2d2d636f64652d626c75653f6c6f676f3d676974706f64" alt="Gitpod ready-to-code" data-canonical-src="https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod" style="max-width:100%;"></a></p>

<p align="center">
    <a href="https://penpot.app/"><b>Penpot Website</b></a> •
    <a href="https://community.penpot.app/t/figma-to-penpot-export-plugin/5554"><b>Export Figma to Penpot (Penpot community)</b></a> •
    <a href="https://community.penpot.app/"><b>Penpot Community</b></a> •
      <a href="https://www.figma.com/community/plugin/1219369440655168734/penpot-exporter"><b>Plugin in Figma community</b></a>
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/1045247/198583387-5c243c18-8ca9-4b66-9c91-6a30c8787bcc.jpg" alt="Help us">
</p>

https://github.com/penpot/penpot-exporter-figma-plugin/assets/165997885/44208d17-1ca0-4fe8-a541-4e68a24ee554

## Table of contents

- [Table of contents](#table-of-contents)
- [Why a Penpot exporter](#why-a-penpot-exporter)
- [Getting started](#getting-started)
  - [Pre-requisites](#pre-requisites)
  - [Building](#building)
  - [Add to Figma](#add-to-figma)
  - [To use the plugin](#to-use-the-plugin)
- [Call to the community](#call-to-the-community)
- [What can this plugin currently import?](#what-can-this-plugin-currently-import)
- [Limitations](#limitations)
- [Contributing](#contributing)
- [License](#license)

## Why a Penpot exporter

The aim of this plugin is to help people migrate their files from Figma
to [Penpot](https://penpot.app/). Migrating work from one design tool to another was never an easy
task due to the abundance of closed and non-standard formats, and this is not a different case. Our
approach to better solve this situation is to build a Figma plugin that can convert a Figma file
into a .zip file that can be imported to Penpot.

There is a sense of urgency for this capability because there is a feeling that Adobe might force
Figma to limit exports and interoperability via plugins very soon.

## Getting started

This plugin makes use of npm, webpack and react, and is written on TypeScript. It also includes a
Penpot file builder library.

### Pre-requisites

To use this plugin, you will need to have `node` and `npm` installed on your computer. If you don't
already have these, you can download and install them from the official website
([https://nodejs.org/en/](https://nodejs.org/en/)).

Once you have `node` and `npm` installed, you will need to download the source code for this plugin.
You can do this by clicking the "Clone or download" button on the GitHub page for this project and
then selecting "Download ZIP". Extract the ZIP file to a location on your computer.

### Building

#### For Windows users:

1.  Open the terminal by searching for "Command Prompt" in the start menu.
2.  Use the `cd` command to navigate to the folder where the repository has been extracted. For
    example, if the repository is located in the `Downloads` folder, you can use the following
    command: `cd Downloads/penpot-exporter-figma-plugin`.
3.  Once you are in the correct folder, you can run the `npm install` command to install the
    dependencies, and then the `npm run build` command to build the plugin.

#### For Mac users:

1.  Open the terminal by searching for "Terminal" in the Launchpad or by using the `Command + Space`
    keyboard shortcut and searching for "Terminal".
2.  Use the `cd` command to navigate to the folder where the repository has been extracted. For
    example, if the repository is located in the `Downloads` folder, you can use the following
    command: `cd Downloads/penpot-exporter-figma-plugin`.
3.  Once you are in the correct folder, you can run the `npm install` command to install the
    dependencies, and then the `npm run build` command to build the plugin.

#### For Linux users:

1.  Open the terminal by using the `Ctrl + Alt + T` keyboard shortcut.
2.  Use the `cd` command to navigate to the folder where the repository has been extracted. For
    example, if the repository is located in the `Downloads` folder, you can use the following
    command: `cd Downloads/penpot-exporter-figma-plugin`.
3.  Once you are in the correct folder, you can run the `npm install` command to install the
    dependencies, and then the `npm run build` command to build the plugin.

#### Building for production:
Follow the same steps as above, but instead of running `npm run build`, run `npm run build:prod`.

### Add to Figma

`Figma menu` > `Plugins` > `Development` > `Import plugin from manifest…` To add the plugin to
Figma, open Figma and go to the `Plugins` menu. Select `Development` and then choose
`Import plugin from manifest…`.

<img src="resources/Import plugin from manifest.png" alt='Screenshot of the Plugins > Development menus open showing the, "Import plugin from manifest" option.'>

Select the `manifest.json` file that is located in the folder where you extracted the source code
for the plugin.

### To use the plugin

1. `Open a Figma file` > `Figma top toolbar` > `Resources` > `Plugins` > search for
   `Penpot Exporter` > `Select the plugin` > `Export your file`.
   <img width="421" alt="Screenshot 2024-06-26 at 08 51 49" src="https://github.com/penpot/penpot-exporter-figma-plugin/assets/165997885/c50ad95d-2ebc-41dc-a62d-3f901612bdd3">

2. A `.zip file` will be generated that you can `import into Penpot`.
3. `Open Penpot` > `Select the projects or drafts menu` (three dots on the right side) >
   `Select Import Penpot files` > `Select the exported .zip file` > `Open the file` and continue
   your work in Penpot 🥳
   ![Untitled](https://github.com/penpot/penpot-exporter-figma-plugin/assets/165997885/3dc1bd1e-1f59-4069-b3a5-90e024ffc806)

Visit the <a href="https://github.com/penpot/penpot-exporter-figma-plugin/wiki"><b>Penpot Exporter
Wik</b></a> to learn more about how to use the plug-in.

## Call to the community

Answering to the interest expressed by community members to build the plugin by themselves, we're
opening the door for anyone interested to jump in and contribute.

We'd love your help! 🤗

For more details on this initiative, we've shared our approach in a
[community post](https://community.penpot.app/t/figma-file-importer/1684) and provided updates in
another [community post](https://community.penpot.app/t/figma-to-penpot-export-plugin/5554). Feel
free to join the conversation!

## What can this plugin currently import?

Things that are currently included in the import are:

- **Basic shapes** (Rectangles, Ellipses, Stars and Polygons)
- **Vectors, Lines and Arrows**
- **Frames and Sections** (Boards in Penpot)
- **Groups and Boolean groups**
- **Masks**
- **Texts** (you can upload your own fonts too)
- **All basic shapes properties** (fills, visibility, strokes, corner radius, shadows, rotations,
  effects, etc...)
- **Components, Components sets and Component instances**
- **Auto Layouts**
- **Color and Typography libraries**

## Limitations

Since the objective of the plug-in is to enable seamless file exports from Figma to Penpot. A key
part of this goal is to support exporting large files, making **performance a primary challenge**.
The exportation process requires comprehensive navigation through all nodes in a Figma file, and
currently we’re facing some limitation with the Figma API to solve this.

Another obvious limitations are the features that are in Figma but not in Penpot or work differently
in both tools so they can not be easily converted, consequently, some features may not look exactly
the same. Additionally, **prototyping settings are currently not supported** in the export/import
process of files.

## Contributing

If you want to make many people very happy and help us continue to build this Figma plugin, for
instance, it would be interesting to add:

- Performance optimization
- Prototyping interactions and flows

Motivated to contribute? Take a look at
our [Contributing Guide](https://help.penpot.app/contributing-guide/) that explains our guidelines
(they're for the Penpot Core, but are mostly of application here too).

## License

```
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright (c) KALEIDOS INC
```

Penpot and the Penpot exporter plugin are Kaleidos’
[open source projects](https://kaleidos.net/products)
