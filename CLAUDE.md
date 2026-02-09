# Design System Workflow

## Overview

This project uses a two-agent design system to ensure visual consistency. All design decisions are made once, documented in two standardized files, and enforced automatically from that point forward.

## Mandatory Design Files

Every project MUST have these two files before any UI work begins:

### 1. `globals.css`
The actual CSS file containing all design tokens (colors, fonts, radius). This is the single source of truth for what values exist. Located at the project root or `/app/globals.css` depending on framework.

### 2. `style.md`
The human-and-agent-readable design reference documenting every design decision: colors with usage descriptions, typography scale, spacing standards, component patterns. Located at the project root. This file has a standardized structure that must not be modified — the design-enforcer agent depends on parsing it consistently.

## Workflow

### Starting a New Project
1. Invoke the `design-initializer` agent (or run `/agents` and select it)
2. Provide project context: what it is, mood, any preferences
3. The agent outputs `globals.css` and `style.md`
4. Both files are committed to the repo
5. All subsequent UI work is governed by these files

### During Development
- The `design-enforcer` agent is automatically invoked when creating or modifying JSX/TSX/CSS/HTML files
- It reads `style.md` and `globals.css` before every review
- It flags violations with exact file, line, and fix
- NEVER override design-enforcer findings without explicit user approval

### Requesting a Full Audit
Ask: "Run a full design audit" or "Have the design-enforcer review the project"
The agent will scan all UI files and produce a comprehensive violation report.

## Rules for All Agents in This Project

### Colors
- ALL colors must be applied via semantic design tokens defined in globals.css
- NEVER use raw hex values in component code
- NEVER use direct Tailwind colors (bg-white, text-gray-500, bg-blue-600)
- If you change a background color, you MUST also set the text color

### Typography
- ONLY the fonts defined in style.md may be used
- Font classes must match the mapping in style.md (font-sans, font-mono, font-serif)
- Follow the type scale table in style.md for all text sizing

### Spacing
- Use Tailwind spacing scale only (p-4, gap-8) — NEVER arbitrary values (p-[16px])
- Use gap classes for spacing between elements — NEVER space-* classes
- Follow the standard spacing values in style.md for cards, buttons, sections, etc.

### Components
- Cards, buttons, inputs must follow the patterns defined in style.md
- No gradients unless style.md explicitly allows them
- No decorative blobs, abstract shapes, or filler SVGs
- No emojis as icons
- Icons from the specified library only, at specified sizes only

### Layout
- Mobile-first always: base styles are mobile, md: and lg: for larger screens
- Flexbox by default, Grid only for complex 2D layouts
- No floats

## Modifying the Design System

If the design system needs to change (new color, new component pattern, etc.):
1. Update BOTH `globals.css` AND `style.md` together — never one without the other
2. Ensure the style.md structure remains intact (same sections, same order)
3. The design-enforcer will use the updated files on its next review

## File Locations

```
project-root/
├── .claude/
│   └── agents/
│       ├── design-initializer.md    # Stage 1: creates the design system
│       ├── design-enforcer.md       # Stage 2: enforces the design system
│       └── code-surgeon.md          # Deep integration specialist
├── globals.css (or /app/globals.css)
├── style.md
└── CLAUDE.md                        # This file
```
