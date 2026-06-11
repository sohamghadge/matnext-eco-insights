import dayjs, { type ConfigType } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

const dayJs = (...args: Parameters<typeof dayjs>) => dayjs(...args);

const SAVE_FORMAT = 'DD/MM/YYYY';
const DISPLAY_FORMAT = 'YYYY/MM/DD';

const formatDateToDDMMYYYY = (date: ConfigType): string | null => {
  if (date === null || date === undefined || date === '') return null;

  return dayJs(date).format(SAVE_FORMAT);
};

export {
  dayJs,
  SAVE_FORMAT,
  DISPLAY_FORMAT,
  formatDateToDDMMYYYY,
};
