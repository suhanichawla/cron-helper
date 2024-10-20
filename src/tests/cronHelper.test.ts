import { CronHelper } from '../cronHelper';
import { DateTime } from 'luxon';

describe('CronHelper', () => {
  describe('constructor', () => {
    it('should create a CronHelper instance with a valid cron expression', () => {
      expect(() => new CronHelper('* * * * *')).not.toThrow();
    });

    it('should throw an error for an invalid cron expression', () => {
      expect(() => new CronHelper('* * * *')).toThrow('Invalid cron expression. Expected 5 fields.');
    });
  });

  describe('getNextOccurrences', () => {
    it('should return the next occurrence for a simple cron expression', () => {
      const helper = new CronHelper('0 0 * * *'); // Midnight every day
      const startDate = new Date('2023-05-03T12:00:00');
      const occurrences = helper.getNextOccurrences(1, startDate);
      expect(occurrences[0]).toEqual(new Date('2023-05-04T00:00:00'));
    });

    it('should return multiple occurrences', () => {
      const helper = new CronHelper('0 12 * * *'); // Noon every day
      const startDate = new Date('2023-05-01T00:00:00');
      const occurrences = helper.getNextOccurrences(3, startDate);
      expect(occurrences).toEqual([
        new Date('2023-05-01T12:00:00'),
        new Date('2023-05-02T12:00:00'),
        new Date('2023-05-03T12:00:00'),
      ]);
    });

    it('should handle complex cron expressions', () => {
      const helper = new CronHelper('*/15 9-17 * * 1-5'); // Every 15 minutes from 9 AM to 5 PM, Monday to Friday
      const startDate = new Date('2023-05-01T08:00:00'); // Monday
      const occurrences = helper.getNextOccurrences(4, startDate);
      expect(occurrences).toEqual([
        new Date('2023-05-01T09:00:00'),
        new Date('2023-05-01T09:15:00'),
        new Date('2023-05-01T09:30:00'),
        new Date('2023-05-01T09:45:00'),
      ]);
    });

    it('should handle timezone correctly', () => {
      const helper = new CronHelper('0 12 * * *'); // Noon every day
      const startDate = new Date('2023-05-01T00:00:00Z'); // Midnight UTC
      const occurrences = helper.getNextOccurrences(1, startDate, 'America/New_York');
      
      // Noon in New York is 16:00 UTC
      expect(occurrences[0].toUTCString()).toBe('Mon, 01 May 2023 16:00:00 GMT');
    });
  });

  describe('parseField', () => {
    let helper: CronHelper;

    beforeEach(() => {
      helper = new CronHelper('* * * * *');
    });

    it('should parse asterisk correctly', () => {
      const result = (helper as any).parseField('*', 0);
      expect(result).toEqual(Array.from({ length: 60 }, (_, i) => i));
    });

    it('should parse range correctly', () => {
      const result = (helper as any).parseField('1-5', 0);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should parse step values correctly', () => {
      const result = (helper as any).parseField('*/15', 0);
      expect(result).toEqual([0, 15, 30, 45]);
    });

    it('should parse comma-separated values correctly', () => {
      const result = (helper as any).parseField('1,3,5', 0);
      expect(result).toEqual([1, 3, 5]);
    });

    it('should handle complex expressions', () => {
      const result = (helper as any).parseField('1-5,10-15/2', 0);
      expect(result).toEqual([1, 2, 3, 4, 5, 10, 12, 14]);
    });
  });
});