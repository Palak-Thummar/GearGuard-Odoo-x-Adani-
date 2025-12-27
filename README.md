# GearGuard: The Ultimate Maintenance Tracker

This workspace contains an Odoo module named `gear_guard_maintenance` that provides a complete maintenance management workflow connecting Equipment, Teams, and Requests with Kanban drag & drop and Calendar scheduling.

## Features
- Equipment registry with ownership, location, warranty, category, and default team/technician
- Maintenance Teams with members (technicians)
- Maintenance Requests (Corrective / Preventive) with stages: New, In Progress, Repaired, Scrap
- Auto-fill: selecting Equipment sets Category, Team, and default Technician
- Smart button on Equipment: view related requests with open count badge
- Kanban: drag cards across stages, show technician avatar, highlight overdue
- Calendar: all preventive requests visible by schedule
- Pivot/Graph: analyze requests per Team and Category
- Scrap logic: moving a request to Scrap flags the Equipment as scrapped and logs a note

## Install
1. Ensure Odoo (v16 or v17) is installed with `hr` and `mail` modules available.
2. Copy the module folder to your addons path:
	- Folder: `gear_guard_maintenance`
3. Update App List in Odoo and search for "GearGuard Maintenance".
4. Install the module.

## Usage
- Create Equipment and assign a Maintenance Team and default Technician.
- Create Maintenance Requests from Requests menu or from the Equipment smart button.
- Drag requests on the Kanban board between stages.
- Schedule Preventive requests; view them on the Calendar.
- Click Scrap on a request to mark equipment as scrapped.

## Development
- Models, views, data, and security are under `gear_guard_maintenance/`.
- Default stages are loaded from data and can be customized via Settings/Technical (developer mode).

## License
LGPL-3