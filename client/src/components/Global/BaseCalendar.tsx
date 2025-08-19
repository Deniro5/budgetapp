import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import { COLORS, FONTSIZE, SPACING } from "theme";
import {
  BaseButton,
  InputContainer,
  InputLabel,
  Row,
  SecondaryButton,
  BaseInput,
} from "styles";
import { useState } from "react";
import {
  dateToFormattedString,
  formatDateToYYYYMMDD,
  parseDate,
} from "utils/DateUtils";

type BaseCalendarProps = {
  isOpen: boolean;
  isRangeCalendar?: boolean;
  handleSubmit: (startDate: string, endDate: string) => void;
  handleClose: () => void;
};

function BaseCalendar({
  isOpen,
  isRangeCalendar,
  handleSubmit,
  handleClose,
}: BaseCalendarProps) {
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);

  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  const handleChange = (value: any) => {
    const newStartDate = value[0];
    const newEndDate = value[1];
    setStartDate(newStartDate);
    setEndDate(newEndDate);

    if (isRangeCalendar) {
      setStartInput(dateToFormattedString(newStartDate));
      setEndInput(dateToFormattedString(newEndDate));
    }
  };

  const handleStartInputBlur = () => {
    const date = parseDate(startInput);
    if (date && isRangeCalendar && (!endDate || date <= endDate)) {
      setStartDate(date);
    } else {
      //revert
      setStartInput(dateToFormattedString(startDate));
    }
  };

  const handleEndInputBlur = () => {
    const date = parseDate(endInput);

    if (date && isRangeCalendar && (!startDate || date >= startDate)) {
      setEndDate(date);
    } else {
      //revert
      setEndInput(dateToFormattedString(endDate));
    }
  };

  const isSubmitDisabled = () => !startDate && !endDate;

  const saveDates = () => {
    handleSubmit(
      formatDateToYYYYMMDD(startDate),
      formatDateToYYYYMMDD(endDate)
    );
  };

  return isOpen ? (
    <CalendarContainer>
      <Calendar
        selectRange={isRangeCalendar}
        onClickDay={(value, e) => e.stopPropagation()}
        onChange={(value) => handleChange(value)}
        value={[startDate, endDate]}
        returnValue={"range"}
      />
      <Footer>
        {isRangeCalendar && (
          <Row>
            <InputContainer>
              <InputLabel>Start Date</InputLabel>
              <DateInput
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                onBlur={handleStartInputBlur}
                placeholder="mm/dd/yyyy"
              />
            </InputContainer>
            <InputContainer>
              <InputLabel>End Date</InputLabel>
              <DateInput
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
                onBlur={handleEndInputBlur}
                placeholder="mm/dd/yyyy"
              />
            </InputContainer>
          </Row>
        )}
        <ButtonContainer>
          <BaseButton disabled={isSubmitDisabled()} onClick={saveDates}>
            Save Changes
          </BaseButton>
          <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
        </ButtonContainer>
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

    .react-calendar__tile--hasActive {
      background: unset;
    }
  }
`;

const Footer = styled.div`
  padding: ${SPACING.spacing4x} ${SPACING.spacing6x};
  background: white;
  border: 1px solid ${COLORS.darkGrey};
  border-top: none;
  border-radius: 4px;
  gap: ${SPACING.spacing6x};
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${SPACING.spacing4x};
  padding-top: ${SPACING.spacing6x};
`;

const DateInput = styled(BaseInput)`
  height: 30px;
  width: 139px;
`;

export default BaseCalendar;
