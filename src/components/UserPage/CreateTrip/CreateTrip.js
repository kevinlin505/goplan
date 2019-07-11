import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import validateEmail from '@utils/validateEmail';
import Button from '@styles/Button';
import Overlay from '@styles/Overlay';

export const CreateTrip = ({ toggleCreateTripModal }) => {
  const [form, setValues] = useState({
    end_date: '',
    estimate_budget_per_person: 2000,
    name: '',
    notes: '',
    start_date: '',
    attendees: [],
  });

  const [invite, setInvite] = useState('');

  const updateField = event => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const updateInviteField = event => {
    if (event.type === 'change') {
      setInvite(event.target.value);
    } else if (event.keyCode === 13 || event.key === 'Enter') {
      if (validateEmail(event.target.value)) {
        setValues({
          ...form,
          attendees: [...form.attendees, event.target.value],
        });

        setInvite('');
      }
    }
  };

  const [inviteList, setInviteList] = useState(null);

  useEffect(() => {
    const chips = form.attendees.map(attendee => {
      return <InviteChip key={attendee} color="primary" label={attendee} />;
    });

    setInviteList(chips);
  }, [form.attendees.length]);

  return (
    <Overlay>
      <Container>
        <FormHeader>
          <CloseButton onClick={toggleCreateTripModal}>
            <svg
              height="18"
              viewBox="0 0 18 18"
              width="18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                fill="none"
                fillRule="evenodd"
                strokeWidth="2"
                transform="translate(1 1)"
              >
                <path d="M15.6.4L.4 15.6M15.6 15.6L.4.4" />
              </g>
            </svg>
          </CloseButton>
          <Header>Create trip</Header>
        </FormHeader>
        <CreateTripForm>
          <FieldWrapper>
            <FullWidthField
              label="Name"
              name="name"
              onChange={updateField}
              type="text"
              value={form.name}
            />
            <FullWidthField
              label="Notes"
              margin="normal"
              multiline
              name="notes"
              onChange={updateField}
              rowsMax={5}
              type="text"
              value={form.notes}
            />
          </FieldWrapper>
          <FieldWrapper>
            <HalfWidthField
              InputLabelProps={{
                shrink: true,
              }}
              label="Start Date"
              name="start_date"
              onChange={updateField}
              type="date"
              value={form.start_date}
            />
            <HalfWidthField
              InputLabelProps={{
                shrink: true,
              }}
              label="End Date"
              name="end_date"
              onChange={updateField}
              type="date"
              value={form.end_date}
            />
          </FieldWrapper>
          <FieldWrapper>
            <FullWidthField
              label="Notes"
              margin="normal"
              name="notes"
              onChange={updateInviteField}
              onKeyPress={updateInviteField}
              type="text"
              value={invite}
            />
            <InviteListWrapper>{inviteList}</InviteListWrapper>
          </FieldWrapper>
        </CreateTripForm>
      </Container>
    </Overlay>
  );
};

CreateTrip.propTypes = {
  toggleCreateTripModal: PropTypes.func.isRequired,
};

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  background: #ffffff;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100px;
  background: url('https://files.slack.com/files-pri/TG0UF1N3B-FLBRUDH1B/12009257525732651878.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1px;
  stroke: #ffffff;
`;

const Header = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 30px;
  color: #ffffff;
  text-transform: uppercase;
`;

const CreateTripForm = styled.form`
  padding: 25px;
`;

const FieldWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  flex-flow: row wrap;
  padding: 10px 20px;
`;

const FullWidthField = styled(TextField)`
  width: 100%;
`;

const HalfWidthField = styled(TextField)`
  width: 45%;
`;

const InviteListWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const InviteChip = styled(Chip)`
  margin: 0 10px;
`;

export default CreateTrip;
