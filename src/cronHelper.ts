import { DateTime } from 'luxon';

class CronHelper {
    private fields: number[][];
  
    constructor(private cronExpression: string) {
      this.fields = this.parseExpression(cronExpression);
    }
  
    private parseExpression(expression: string): number[][] {
      const fields = expression.split(' ');
      if (fields.length !== 5) {
        throw new Error('Invalid cron expression. Expected 5 fields.');
      }
  
      return fields.map((field, index) => this.parseField(field, index));
    }
  
    private parseField(field: string, fieldIndex: number): number[] {
      const ranges = [
        { min: 0, max: 59 },   // Minute
        { min: 0, max: 23 },   // Hour
        { min: 1, max: 31 },   // Day of Month
        { min: 1, max: 12 },   // Month
        { min: 0, max: 6 },    // Day of Week
      ];
  
      const { min, max } = ranges[fieldIndex];
      const result: Set<number> = new Set();
  
      if (field === '*') {
        for (let i = min; i <= max; i++) {
          result.add(i);
        }
        return Array.from(result).sort((a, b) => a - b);
      }
  
      const parts = field.split(',');
      for (const part of parts) {
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-');
          let [start, end] = [Number(startStr), Number(endStr)];
          let step = 1;
  
          if (endStr.includes('/')) {
            [end, step] = endStr.split('/').map(Number);
          }
  
          for (let i = start; i <= end; i += step) {
            result.add(i);
          }
        } else if (part.includes('/')) {
          const [startStr, stepStr] = part.split('/');
          const start = startStr === '*' ? min : Number(startStr);
          const step = Number(stepStr);
  
          for (let i = start; i <= max; i += step) {
            result.add(i);
          }
        } else {
          result.add(Number(part));
        }
      }
  
      return Array.from(result).filter(num => num >= min && num <= max).sort((a, b) => a - b);
    }
  
    getNextOccurrences(n: number, fromDate?: Date, timezone: string = 'local'): Date[] {
      const occurrences: Date[] = [];
      let startDate = fromDate 
        ? DateTime.fromJSDate(fromDate).setZone(timezone)
        : DateTime.local().setZone(timezone);
  
      while (occurrences.length < n) {
        startDate = this.getNextOccurrence(startDate, timezone);
        occurrences.push(startDate.toJSDate());
      }
  
      return occurrences;
    }
  
    private getNextOccurrence(fromDate: DateTime, timezone: string): DateTime {
      let date = fromDate.set({ second: 0, millisecond: 0 });
  
      while (true) {
        if (
          this.fields[0].includes(date.get('minute')) &&
          this.fields[1].includes(date.get('hour')) &&
          this.fields[2].includes(date.get('day')) &&
          this.fields[3].includes(date.get('month')) &&
          this.fields[4].includes(date.weekday % 7)
        ) {
          if (date > fromDate) {
            return date;
          }
        }
  
        date = date.plus({ minutes: 1 }).setZone(timezone);
      }
    }
}
export { CronHelper };