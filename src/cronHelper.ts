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
      const result: number[] = [];
  
      if (field === '*') {
        for (let i = min; i <= max; i++) {
          result.push(i);
        }
        return result;
      }
  
      const parts = field.split(',');
      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number);
          for (let i = start; i <= end; i++) {
            result.push(i);
          }
        } else if (part.includes('/')) {
          const [start, step] = part.split('/');
          const startNum = start === '*' ? min : Number(start);
          for (let i = startNum; i <= max; i += Number(step)) {
            result.push(i);
          }
        } else {
          result.push(Number(part));
        }
      }
  
      return result.filter(num => num >= min && num <= max).sort((a, b) => a - b);
    }
  
    getNextOccurrences(n: number, fromDate?: Date): Date[] {
      const occurrences: Date[] = [];
      let startDate = fromDate ? fromDate : new Date();
  
      while (occurrences.length < n) {
        startDate = this.getNextOccurrence(startDate);
        occurrences.push(new Date(startDate));
      }
  
      return occurrences;
    }
  
    private getNextOccurrence(fromDate: Date): Date {
      const date = new Date(fromDate);
      date.setSeconds(0);
      date.setMilliseconds(0);
  
      while (true) {
        if (
          this.fields[0].includes(date.getMinutes()) &&
          this.fields[1].includes(date.getHours()) &&
          this.fields[2].includes(date.getDate()) &&
          this.fields[3].includes(date.getMonth() + 1) &&
          this.fields[4].includes(date.getDay())
        ) {
          if (date > fromDate) {
            return date;
          }
        }
  
        date.setMinutes(date.getMinutes() + 1);
      }
    }
  }
  
export { CronHelper };