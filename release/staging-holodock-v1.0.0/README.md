# HoloDock

HoloDock is a free HoloSuite module for Foundry VTT that provides a system-agnostic ship loadout, power, and equipment console for sci-fi and vehicle-focused campaigns.

## Features

- Create and manage multiple ship profiles.
- Assign a custom ship image, with a bundled default ship image included.
- Track GM-defined ship statistics such as speed, fuel, defense, cargo, crew, or anything else your system needs.
- Create categorized equipment slots with names, descriptions, and optional ship-image pins.
- Drag regular Foundry Items onto equipment slots and convert them into tracked ship equipment.
- Display installed item names, icons, types, descriptions, power state, durability, and activation controls.
- Manage ship power capacity, per-system power allocation, online/offline state, and saved power presets.
- Review dashboard pages for overview, systems, power grid, damage, speed, capacity, and additional stats.
- Activate configured ship equipment from HoloDock and post activation results to chat.
- Let players request equipment installation through chat when GM approval is needed.
- Add a HoloDock ship equipment button to Item sheets for quick equipment setup.
- Optionally place equipment pins directly on the ship image and draw link lines back to the relevant equipment slots.
- Open HoloDock from the HoloSuite launcher.

## Permissions

Players can view visible ship profiles and equipment loadouts from HoloSuite.

Only GMs can:

- create, edit, or delete ship profiles;
- change ship images;
- add, edit, or delete ship statistics;
- add, edit, or delete equipment slots;
- configure ship equipment data on Items;
- approve player equipment install requests;
- place or clear ship-image equipment pins.

Per ship, GMs can also decide whether players may:

- see the ship profile;
- drag equipment into empty slots;
- activate ship systems.

## Compatibility

- Minimum Foundry VTT version: 12
- Verified Foundry VTT version: 14
- Maximum Foundry VTT version: 14
- Requires HoloSuite Core

## Installation

Install HoloDock from the Foundry VTT module installer with this manifest URL:

```text
https://github.com/Thuurvdv/holodock/releases/latest/download/module.json
```

## Release

Version 1.0.0 is the initial HoloDock release for Foundry VTT v12, v13, and v14.
