import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "../../Theme";

type BaseCalendarProps = {
  isOpen: boolean;
  isRangeCalendar: boolean;
};

function BaseCalendar({ isOpen, isRangeCalendar }: BaseCalendarProps) {
  return isOpen ? (
    <CalendarContainer>
      <Calendar selectRange={isRangeCalendar} />
    </CalendarContainer>
  ) : null;
}

const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  /* ... */

  /* ~~~ navigation styles ~~~ */
  .react-calendar {
    border-radius: 4px;
    padding: ${SPACING.spacing3x} ${SPACING.spacing4x};

    .react-calendar__tile--now {
      color: ${COLORS.calendarBlue};
      background: none;
      font-weight: 700;
    }

    .react-calendar__tile--active {
      background: ${COLORS.primary};
    }

    .react-calendar__navigation__label__labelText {
      font-weight: 600;
      font-size: ${FONTSIZE.md};
    }

    .react-calendar__navigation__arrow {
      font-size: ${FONTSIZE.md};
    }
  }
`;

export default BaseCalendar;
