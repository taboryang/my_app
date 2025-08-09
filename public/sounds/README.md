# Sound Effects

This folder contains sound effects for the Retro AI Desktop interface.

## Required Sound Files

Replace the placeholder files with actual WAV audio files:

### 1. `window-open.wav`
- **Purpose**: Plays when opening windows (YouTube, iPod, Notes, Home)
- **Recommended**: Short "pop" or "swoosh" sound (0.2-0.5 seconds)
- **Volume**: Set to 30% in code
- **Examples**: System startup sound, bubble pop, soft chime

### 2. `window-close.wav` 
- **Purpose**: Plays when closing windows
- **Recommended**: Short "click" or "thud" sound (0.1-0.3 seconds)
- **Volume**: Set to 30% in code
- **Examples**: Door close, soft click, gentle thud

### 3. `button-hover.wav`
- **Purpose**: Plays when hovering over golden buttons or home cards
- **Recommended**: Very subtle "tick" or "beep" (0.1-0.2 seconds)
- **Volume**: Set to 20% in code (quieter than window sounds)
- **Examples**: Soft tick, gentle beep, mouse click

## File Requirements

- **Format**: WAV files recommended (MP3 also works)
- **Duration**: Keep sounds short (under 0.5 seconds)
- **Quality**: 44.1kHz, 16-bit is sufficient
- **Size**: Optimize for web (under 50KB each)

## Finding Sound Effects

**Free Sources:**
- Freesound.org
- Pixabay Audio
- YouTube Audio Library
- BBC Sound Effects Library

**Search Terms:**
- "UI sound effects"
- "Button click sound"
- "Window open sound" 
- "Interface sounds"
- "System sounds"

## Current Behavior

**With Sound Files**: Full audio feedback system
**Without Sound Files**: Graceful fallback - no sounds, but no errors

The system will automatically detect if sound files are present and play them accordingly.