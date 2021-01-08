import moment from 'moment';

export const createFontFormat = (fontSize, lineHeight) => {
  return { fontSize, lineHeight };
};

export const urlEncodeTitle = (title) => {
  const strsplit = title.split(' ');
  return strsplit.join('+');
};

/**
 * Generate an array of days starting from now
 * @param {number} numberDays the number of days to generate
 */
export const generateDatesFromToday = (numberDays = 7) => {
  console.log(numberDays);
  let dates = [];

  for (let i = 0; i < numberDays; i++) {
    dates.push({
      id: i + 1,
      value: moment().add(i, 'days').valueOf(),
      formatted: moment().add(i, 'days').format('ddd, MMM D')
    });
  }

  return dates;
};
