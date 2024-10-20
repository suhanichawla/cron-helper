# CronHelper

CronHelper is a lightweight TypeScript library for parsing cron expressions and calculating their next occurrences. It provides a simple and efficient way to work with cron schedules in your JS applications, now with timezone support!

## Features

- Parse standard cron expressions
- Calculate the next N occurrences of a cron schedule
- Support for all standard cron fields (minute, hour, day of month, month, day of week)
- Handles various cron syntax including ranges, lists, and steps
- **NEW: Timezone support for accurate scheduling across different time zones**

## Installation

You can install CronHelper using npm:

```bash
npm install cron-helper
```

Or using yarn:

```bash
yarn add cron-helper
```

## Usage

Here's a quick example of how to use CronHelper:

```typescript
import { CronHelper } from 'cron-helper';

// Create a new CronHelper instance
const cronHelper = new CronHelper('*/15 * * * *');

// Get the next 5 occurrences
const nextOccurrences = cronHelper.getNextOccurrences(5);

console.log(nextOccurrences);
```

This will output an array of the next 5 Date objects that match the cron expression "*/15 * * * *" (every 15 minutes).

### Advanced Usage

You can specify a start date and optionally a timezone for calculating occurrences:

```typescript
const startDate = new Date('2023-06-01T00:00:00Z');
const nextOccurrences = cronHelper.getNextOccurrences(5, startDate);
```
or
```typescript
const startDate = new Date('2023-06-01T00:00:00Z');
const timezone = 'America/New_York';
const nextOccurrences = cronHelper.getNextOccurrences(5, startDate, timezone);
```

## Cron Expression Format

CronHelper supports the standard cron expression format with five fields:

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── day of week (0 - 6) (Sunday to Saturday)
│ │ │ └───── month (1 - 12)
│ │ └─────── day of month (1 - 31)
│ └───────── hour (0 - 23)
└─────────── minute (0 - 59)
```

Supported syntax for each field:

- `*`: any value
- `,`: value list separator
- `-`: range of values
- `/`: step values

## Examples

1. Every 15 minutes:
   ```typescript
   const cron = new CronHelper('*/15 * * * *');
   const occurrences = cron.getNextOccurrences(5, new Date());
   ```

2. At 10:30 AM every day in New York:
   ```typescript
   const cron = new CronHelper('30 10 * * *');
   const occurrences = cron.getNextOccurrences(3, new Date(), 'America/New_York');
   ```

3. Every Monday at 9:00 AM in Sydney:
   ```typescript
   const cron = new CronHelper('0 9 * * 1');
   const occurrences = cron.getNextOccurrences(2, new Date(), 'Australia/Sydney');
   ```

4. Every weekday at 6:00 PM in Paris:
   ```typescript
   const cron = new CronHelper('0 18 * * 1-5');
   const occurrences = cron.getNextOccurrences(5, new Date(), 'Europe/Paris');
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

This is a hobby project which I will keep developing weekly. Some future feature ideas are:
- Get Cron from string description
- Custom cron expressions (e.g., supporting seconds or years)

## License

This project is licensed under the MIT License.