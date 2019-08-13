import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';

const DestinationDates = ({ handleUpdate }) => {
  const minDate = new Date();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  function handleChangeStart(date) {
    setStartDate(date);
  }

  function handleChangeEnd(date) {
    setEndDate(date);
  }

  return (
    <React.Fragment>
      <DatePicker
        endDate={endDate}
        minDate={minDate}
        name="startAt"
        onChange={handleChangeStart}
        onChange={handleUpdate}
        selected={startDate}
        selectsStart
        startDate={startDate}
      />

      <DatePicker
        endDate={endDate}
        minDate={startDate}
        name="endAt"
        onChange={handleChangeEnd}
        onChange={handleUpdate}
        selected={endDate}
        selectsEnd
        startDate={startDate}
      />
    </React.Fragment>
  );
};

DestinationDates.propTypes = {
  handleUpdate: PropTypes.object.isRequired,
};

export default DestinationDates;
