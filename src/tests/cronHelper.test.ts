import {CronHelper} from '../cronHelper';

describe('CronHelper', () => {
  test('every 15 minutes', () => {
    const parser = new CronHelper('*/15 * * * *');
    const occurrences = parser.getNextOccurrences(2);
    console.log("occurences")
    expect(occurrences.length).toBe(2);
    expect(occurrences[1].getTime() - occurrences[0].getTime()).toBe(15 * 60 * 1000);
  });

  test('at 10:30 every day', () => {
    const parser = new CronHelper('30 10 * * *');
    const occurrences = parser.getNextOccurrences(2);
    expect(occurrences.length).toBe(2);
    expect(occurrences[0].getHours()).toBe(10);
    expect(occurrences[0].getMinutes()).toBe(30);
    expect(occurrences[1].getTime() - occurrences[0].getTime()).toBe(24 * 60 * 60 * 1000);
  });

  // Add more test cases here
});