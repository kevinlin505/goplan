import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActivePanel from '@constants/ActivePanel';
import { tripActions } from '@providers/trip/trip';
import validateEmail from '@utils/validateEmail';
import getTravelDates from '@utils/calculateTravelDates';
import Button from '@styles/Button';

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

export const ControlPanel = ({
  actions,
  activePanel,
  handleActivePanelChange,
  selectedTrip,
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  function handleInviteEmail(event) {
    setInviteEmail(event.target.value);
  }

  function handleInvite() {
    if (inviteEmail) {
      actions.trip.inviteTrip(
        inviteEmail,
        selectedTrip.id,
        selectedTrip.name,
        getTravelDates(selectedTrip),
      );
      setInviteEmail('');
    }
  }

  useEffect(() => {
    setValidEmail(validateEmail(inviteEmail));
  }, [inviteEmail]);

  return (
    <React.Fragment>
      <TripInviteContainer>
        <InviteInput
          onChange={handleInviteEmail}
          placeholder="Enter an email to invite"
          value={inviteEmail}
        />
        <Button disabled={!validEmail} onClick={handleInvite}>
          Invite
        </Button>
      </TripInviteContainer>
      <ContentControlPanel>
        <ControlButton
          isActive={activePanel === ActivePanel.ACTIVITIES}
          name={ActivePanel.ACTIVITIES}
          onClick={handleActivePanelChange}
          variant="text"
        >
          Activities
        </ControlButton>
        <ControlButton
          isActive={activePanel === ActivePanel.DESTINATIONS}
          name={ActivePanel.DESTINATIONS}
          onClick={handleActivePanelChange}
          variant="text"
        >
          Destinations
        </ControlButton>
        <ControlButton
          isActive={activePanel === ActivePanel.EXPENSES}
          name={ActivePanel.EXPENSES}
          onClick={handleActivePanelChange}
          variant="text"
        >
          Expenses
        </ControlButton>
      </ContentControlPanel>
    </React.Fragment>
  );
};

ControlPanel.propTypes = {
  actions: PropTypes.object.isRequired,
  activePanel: PropTypes.string.isRequired,
  handleActivePanelChange: PropTypes.func.isRequired,
  selectedTrip: PropTypes.object.isRequired,
};

const TripInviteContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.contrast};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
`;

const InviteInput = styled.input`
  flex: 1 1 auto;
  margin-right: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: 4px;
`;

const ContentControlPanel = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  background: ${({ theme }) => theme.colors.contrastLight};
  color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
`;

const ControlButton = styled(Button)`
  width: calc(100% / 3);
  height: 100%;
  padding: 10px 20px;
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.white : theme.colors.textLight};
  background: ${({ isActive, theme }) =>
    isActive ? theme.colors.accent : theme.colors.contrastLight};
  border-radius: 0;

  &:active,
  &:focus,
  &:hover {
    background: ${({ isActive, theme }) =>
      isActive ? theme.colors.accent : theme.colors.contrastLight};
    color: ${({ theme }) => theme.colors.text};
  }

  &:active,
  &:focus {
    &::after {
      border: 2px solid ${({ theme }) => theme.colors.white};
      border-radius: 0;
    }
  }
`;

export default connect(
  null,
  mapDispatchToProps,
)(ControlPanel);
