# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
- `npm start` or `npm run dev` - Start the Express server on port 3000
- `npm install` - Install dependencies

**Server runs on:** http://localhost:3000

## Architecture Overview

This is a retro Mac OS-inspired desktop web application built with vanilla HTML/CSS/JS and served by an Express.js server.

### Core Structure
- **server.js** - Simple Express server serving static files from `public/` directory
- **public/** - All client-side assets
  - **index.html** - Main desktop interface with taskbar, background controls, and window containers
  - **script.js** - Window management, background switching, and UI interactions
  - **styles.css** - Retro Mac OS styling with gradients, inset/outset borders
  - **images/** - Background image assets

### Key Components

**Window System:**
- Each "app button" opens a corresponding window (e.g., `youtube` → `youtube-window`)
- Windows are draggable, resizable, and have z-index management
- Window state managed globally with `draggedWindow`, `highestZIndex` variables
- Windows constrained to viewport bounds

**Background System:**
- 5 preset backgrounds defined in `backgrounds` array in script.js
- Arrow navigation (◀ ▶) cycles through backgrounds with `currentBackgroundIndex`
- Mountain Lake is the default background (index 0)

**Styling Philosophy:**
- Classic Mac OS visual elements: outset/inset borders, gradients, system fonts
- Responsive design with mobile adaptations
- Retro color scheme: #c0c0c0, #d0d0d0, #f0f0f0

### Adding New Features

**New App Button:**
1. Add button to taskbar in index.html with `data-app="name"`
2. Create corresponding window div with id `name-window`
3. Window opens automatically via existing event listener system

**New Background:**
1. Add image to `public/images/`
2. Add entry to `backgrounds` array in script.js

**Window Functionality:**
- All windows use shared dragging system in `setupWindowDragging()`
- Close buttons use `closeWindow(windowId)` function
- Z-index managed by `bringToFront(window)` function