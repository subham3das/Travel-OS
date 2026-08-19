export class DateUtil {
  public static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  public static addMinutes(date: Date, minutes: number): Date {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }

  public static isFuture(date: Date): boolean {
    return new Date(date).getTime() > Date.now();
  }

  public static isPast(date: Date): boolean {
    return new Date(date).getTime() < Date.now();
  }

  public static formatISO(date: Date): string {
    return new Date(date).toISOString();
  }
}
