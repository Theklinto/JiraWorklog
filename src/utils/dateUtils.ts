export function getComparableDate(date: string): Date {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}

export function sameDay(day1: Date, day2: Date): boolean {
    const day1Copy = new Date(day1);
    day1Copy.setHours(0, 0, 0, 0);
    const day2Copy = new Date(day2);
    day2Copy.setHours(0, 0, 0, 0);
    return day1Copy.getTime() === day2Copy.getTime();
}

export function getDate(date: Date) {
    return date.toLocaleTimeString("da-dk", { day: "2-digit", month: "2-digit" });
}
export function getDayName(date: Date) {
    const weekday = date.toLocaleDateString("da-dk", { weekday: "long" });
    return weekday[0].toLocaleUpperCase() + weekday.slice(1);
}
