---
title: Recurring Timer
description: Recurring Timer Service Widget Configuration
---

The recurring timer widget displays the next occurrence of a recurring event and a live countdown. It calculates future occurrences based on a reference time and increment period.

The widget includes:

- Next occurrence date and time (displayed in local timezone)
- Live countdown timer showing time remaining
- Optional event name and description
- Support for various time intervals (seconds to weeks)

This is a client-side only widget that requires no external API or service.

Allowed fields: `reference_time`, `increment`, `name` (optional), `description` (optional).

```yaml
widget:
    type: recurring-timer
    reference_time: "2024-12-13T17:00:00Z" # ISO 8601 UTC timestamp
    increment: "5h" # Time interval between occurrences
    name: "Server Restart" # Optional display name
    description: "Maintenance window" # Optional description
```

## Configuration

- **reference_time**: The starting point for the recurring event in ISO 8601 UTC format (e.g., "2024-12-13T17:00:00Z")
- **increment**: The time interval between occurrences. Supported formats:
  - `Ns` - seconds (e.g., "30s")
  - `Nm` - minutes (e.g., "15m")
  - `Nh` - hours (e.g., "6h")
  - `Nd` - days (e.g., "2d")
  - `Nw` - weeks (e.g., "1w")
- **name**: Optional event name displayed in the widget
- **description**: Optional description displayed below the countdown
- **date_format**: Optional format for displaying the next occurrence date. Options:
  - `"short"` - Dec 13, 2:00 PM (default)
  - `"medium"` - Dec 13, 2024, 2:00 PM EST
  - `"long"` - Wednesday, December 13, 2024, 2:00 PM EST
  - `"datetime"` - 2024-12-13 14:00:00
  - `"iso"` - 2024-12-13T19:00:00.000Z
  - `"relative"` - in 2 days / in 5 hours / soon
  - Custom object with [Intl.DateTimeFormat options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options)
- **countdown_format**: Optional format for the countdown display. Options:
  - `"auto"` - Adaptive format (2d 14:30:15 / 14:30:15 / 30:15) (default)
  - `"full"` - Always show days (2d 14:30:15)
  - `"hours"` - Always show hours (62:30:15)
  - `"minutes"` - Always show minutes only (3750:15)
  - `"compact"` - Most compact (2d / 14h / 30m / 15s)

## Examples

### Server Maintenance Every 6 Hours
```yaml
- Server Maintenance:
    widget:
      type: recurring-timer
      reference_time: "2024-12-13T02:00:00Z"
      increment: "6h"
      name: "Maintenance Window"
      description: "Automated server restart"
```

### Daily Backup
```yaml
- Daily Backup:
    widget:
      type: recurring-timer
      reference_time: "2024-12-01T03:00:00Z"
      increment: "1d"
      name: "Backup Job"
```

### Weekly Reports
```yaml
- Weekly Report:
    widget:
      type: recurring-timer
      reference_time: "2024-12-02T09:00:00Z"
      increment: "1w"
      name: "Status Report"
      description: "Generated every Monday"
```

## Formatting Options

### Date Format Options

The `date_format` field controls how the next occurrence time is displayed:

| Format | Example Output | Description |
|--------|----------------|-------------|
| `"short"` | `Dec 13, 2:00 PM` | Compact date and time (default) |
| `"medium"` | `Dec 13, 2024, 2:00 PM EST` | Date with year and timezone |
| `"long"` | `Wednesday, December 13, 2024, 2:00 PM EST` | Full date with weekday |
| `"datetime"` | `2024-12-13 14:00:00` | Technical format YYYY-MM-DD HH:mm:ss |
| `"iso"` | `2024-12-13T19:00:00.000Z` | ISO 8601 format |
| `"relative"` | `in 2 days` / `in 5 hours` / `soon` | Relative time description |

#### Custom Date Format Objects

You can also provide a custom object using [Intl.DateTimeFormat options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options):

```yaml
date_format:
  weekday: "short"     # Mon, Tue, Wed...
  year: "numeric"      # 2024
  month: "short"       # Jan, Feb, Mar... 
  day: "numeric"       # 1, 2, 3...
  hour: "2-digit"      # 01, 02, 03...
  minute: "2-digit"    # 00, 15, 30...
  second: "2-digit"    # 00, 15, 30...
  hour12: false        # 24-hour format (true for 12-hour with AM/PM)
  timeZoneName: "short" # EST, PST, etc.
```

### Countdown Format Options

The `countdown_format` field controls how the countdown timer is displayed:

| Format | Example Output | Description |
|--------|----------------|-------------|
| `"auto"` | `2d 14:30:15` / `14:30:15` / `30:15` | Adaptive format (default) |
| `"full"` | `2d 14:30:15` | Always shows days |
| `"hours"` | `62:30:15` | Always shows hours (days converted) |
| `"minutes"` | `3750:15` | Shows minutes:seconds only |
| `"compact"` | `2d` / `14h` / `30m` / `15s` | Most compact single unit |

## Complete Examples

### Basic Configuration
```yaml
- Simple Timer:
    widget:
      type: recurring-timer
      reference_time: "2024-12-13T17:00:00Z"
      increment: "6h"
      name: "Server Restart"
```

### All Preset Format Combinations

#### Short Date with Auto Countdown
```yaml
- Quick Event:
    widget:
      type: recurring-timer
      reference_time: "2024-12-13T10:00:00Z"
      increment: "30m"
      name: "Quick Check"
      date_format: "short"        # Dec 13, 10:30 AM
      countdown_format: "auto"    # 25:30 or 5m
```

#### Medium Date with Full Countdown
```yaml
- Detailed Event:
    widget:
      type: recurring-timer
      reference_time: "2024-12-13T17:00:00Z"
      increment: "6h"
      name: "System Backup"
      date_format: "medium"       # Dec 13, 2024, 5:00 PM EST
      countdown_format: "full"    # 0d 05:30:15
```

#### Long Date with Hours Countdown
```yaml
- Verbose Event:
    widget:
      type: recurring-timer
      reference_time: "2024-12-01T03:00:00Z"
      increment: "1d"
      name: "Daily Backup"
      date_format: "long"         # Friday, December 1, 2024, 3:00 AM EST
      countdown_format: "hours"   # 23:30:15
```

#### DateTime Format with Compact Countdown
```yaml
- Technical Display:
    widget:
      type: recurring-timer
      reference_time: "2024-12-13T17:00:00Z"
      increment: "1h"
      name: "System Check"
      date_format: "datetime"     # 2024-12-13 17:00:00
      countdown_format: "compact" # 45m
```

#### ISO Format with Minutes Countdown
```yaml
- API Integration:
    widget:
      type: recurring-timer
      reference_time: "2024-12-13T17:00:00Z"
      increment: "2h"
      name: "API Sync"
      date_format: "iso"          # 2024-12-13T17:00:00.000Z
      countdown_format: "minutes" # 105:30
```

#### Relative Time with Auto Countdown
```yaml
- User Friendly:
    widget:
      type: recurring-timer
      reference_time: "2024-12-13T17:00:00Z"
      increment: "1d"
      name: "Daily Report"
      date_format: "relative"     # in 5 hours / tomorrow
      countdown_format: "auto"    # 5:30:15
```

### Custom Format Examples

#### 12-Hour Format with AM/PM
```yaml
- US Style:
    widget:
      type: recurring-timer
      reference_time: "2024-12-13T17:00:00Z"
      increment: "6h"
      name: "Meeting Reminder"
      date_format:
        month: "short"
        day: "numeric"
        hour: "numeric"
        minute: "2-digit"
        hour12: true              # Dec 13, 5:00 PM
      countdown_format: "auto"
```

#### European Style Date
```yaml
- EU Style:
    widget:
      type: recurring-timer
      reference_time: "2024-12-13T17:00:00Z"
      increment: "1d"
      name: "Daily Task"
      date_format:
        day: "2-digit"
        month: "2-digit"
        year: "numeric"
        hour: "2-digit"
        minute: "2-digit"
        hour12: false             # 13/12/2024 17:00
      countdown_format: "hours"
```

#### Detailed Weekday Format
```yaml
- Weekly Schedule:
    widget:
      type: recurring-timer
      reference_time: "2024-12-02T09:00:00Z"
      increment: "1w"
      name: "Weekly Report"
      date_format:
        weekday: "long"
        month: "long"
        day: "numeric"
        hour: "2-digit"
        minute: "2-digit"
        timeZoneName: "short"     # Monday, December 2, 09:00 EST
      countdown_format: "full"
```

#### Minimal Custom Format
```yaml
- Minimal Display:
    widget:
      type: recurring-timer
      reference_time: "2024-12-13T17:00:00Z"
      increment: "4h"
      name: "Quick Timer"
      date_format:
        hour: "2-digit"
        minute: "2-digit"         # 17:00 (time only)
      countdown_format: "compact"
```

### Real-World Use Cases

#### Server Maintenance Window
```yaml
- Server Maintenance:
    widget:
      type: recurring-timer
      reference_time: "2024-12-13T02:00:00Z"
      increment: "1w"
      name: "Weekly Maintenance"
      description: "Server restart and updates"
      date_format: "long"
      countdown_format: "full"
```

#### Database Backup Schedule
```yaml
- Database Backup:
    widget:
      type: recurring-timer
      reference_time: "2024-12-01T03:00:00Z"
      increment: "1d"
      name: "DB Backup"
      description: "Automated database backup"
      date_format: "datetime"
      countdown_format: "hours"
```

#### SSL Certificate Renewal
```yaml
- SSL Renewal:
    widget:
      type: recurring-timer
      reference_time: "2024-12-01T00:00:00Z"
      increment: "90d"
      name: "SSL Certificate"
      description: "Renewal due"
      date_format: "medium"
      countdown_format: "auto"
```

#### Team Meeting Reminder
```yaml
- Team Standup:
    widget:
      type: recurring-timer
      reference_time: "2024-12-02T14:00:00Z"
      increment: "1d"
      name: "Daily Standup"
      description: "Team meeting"
      date_format: "relative"
      countdown_format: "compact"
```

## Notes

- The reference time should be in UTC format for consistency across timezones
- The next occurrence time is displayed in the user's local timezone
- The widget automatically calculates the next occurrence even if the reference time is in the past
- The countdown updates in real-time every second
- Multiple recurring timer widgets can be configured with different intervals