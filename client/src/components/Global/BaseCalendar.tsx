import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "../../Theme";
import { BaseButton, SecondaryButton } from "../../Styles";
import { useState } from "react";

type BaseCalendarProps = {
  isOpen: boolean;
  isRangeCalendar: boolean;
  handleSubmit: () => void;
  handleClose: () => void;
};

function BaseCalendar({
  isOpen,
  isRangeCalendar,
  handleSubmit,
  handleClose,
}: BaseCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string[]>([]);

  const handleChange = (value: any) => {
    setSelectedDate(value);
  };

  return isOpen ? (
    <CalendarContainer>
      <Calendar
        selectRange={isRangeCalendar}
        onClickDay={(value, e) => {
          e.stopPropagation();
        }}
        onChange={(value) => handleChange(value)}
        returnValue={isRangeCalendar ? "range" : "start"}
      />
      <Footer>
        <BaseButton disabled={!selectedDate.length} onClick={handleSubmit}>
          Save Changes
        </BaseButton>
        <SecondaryButton onClick={handleClose}> Cancel </SecondaryButton>{" "}
      </Footer>
    </CalendarContainer>
  ) : null;
}

const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  /* ... */

  /* ~~~ navigation styles ~~~ */
  .react-calendar {
    padding: ${SPACING.spacing3x} ${SPACING.spacing4x};
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    border-color: ${COLORS.darkGrey};

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

    .react-calendar__navigation__label {
      pointer-events: none;
      &:hover {
        background: ${COLORS.pureWhite};
      }
    }

    .react-calendar__navigation__arrow {
      font-size: ${FONTSIZE.md};
    }
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${SPACING.spacing6x};
  background: white;
  border: 1px solid ${COLORS.darkGrey};
  border-top: none;
  border-radius: 4px;
  gap: ${SPACING.spacing6x};
`;

export default BaseCalendar;
