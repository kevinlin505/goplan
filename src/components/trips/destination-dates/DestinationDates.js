import React from 'react';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';

const DestinationDates = ({ destination, handleUpdate }) => {
  const minDate = new Date();
  const startDate =
    destination.startAt && new Date(destination.startAt).getTime();
  const endDate = destination.endAt && new Date(destination.endAt).getTime();

  function handleChangeStart(date) {
    handleUpdate('startAt', date.toString());
  }

  function handleChangeEnd(date) {
    handleUpdate('endAt', date.toString());
  }

  return (
    <React.Fragment>
      <DateInput
        dateFormat="MM-dd-yyyy"
        endDate={endDate}
        minDate={minDate}
        name="startAt"
        onChange={handleChangeStart}
        placeholderText="Start Date"
        selected={startDate}
        selectsStart
        startDate={startDate}
      />

      <DateInput
        dateFormat="MM-dd-yyyy"
        endDate={endDate}
        minDate={startDate}
        name="endAt"
        onChange={handleChangeEnd}
        placeholderText="End Date"
        selected={endDate}
        selectsEnd
        startDate={startDate}
      />
    </React.Fragment>
  );
};

DestinationDates.propTypes = {
  destination: PropTypes.object.isRequired,
  handleUpdate: PropTypes.any.isRequired,
};

const DateInput = styled(DatePicker)`
  width: 100%;
  flex: 1 1 auto;
  margin-right: 1px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
`;

export default DestinationDates;
