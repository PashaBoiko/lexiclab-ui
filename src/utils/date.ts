export const getWeekNumberFromStartOfYear = (date: Date) => {
  // Начало года
  const startOfYear = new Date(date.getFullYear(), 0, 1);

  // Количество дней, прошедших с начала года
  const daysPassed = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
  );

  // День недели первого дня года (0 - воскресенье, 1 - понедельник и т.д.)
  const firstDayOfYear = startOfYear.getDay();

  // Если начало года не понедельник, корректируем
  const daysToFirstMonday =
    firstDayOfYear <= 1 ? 1 - firstDayOfYear : 8 - firstDayOfYear;

  // Номер недели
  return Math.ceil((daysPassed + daysToFirstMonday) / 7);
};

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};
