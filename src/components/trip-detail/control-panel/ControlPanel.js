import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActivePanel from '@constants/ActivePanel';
import { tripActions } from '@providers/trip/trip';
import { breakpointMin } from '@utils/styleUtils';
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
  history,
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

  function handleLeaveTrip() {
    actions.trip.leaveTrip(selectedTrip.id).then(() => {
      history.push('/home');
    });
  }

  useEffect(() => {
    setValidEmail(validateEmail(inviteEmail));
  }, [inviteEmail]);

  return (
    <React.Fragment>
      <TripInviteContainer>
        <LeaveButton onClick={handleLeaveTrip}>Leave</LeaveButton>
        <InviteInput
          onChange={handleInviteEmail}
          placeholder="Enter an email to invite"
          value={inviteEmail}
        />
        <InviteButton disabled={!validEmail} onClick={handleInvite}>
          Invite
        </InviteButton>
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
  history: PropTypes.object.isRequired,
  selectedTrip: PropTypes.object.isRequired,
};

const TripInviteContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  background: ${({ theme }) => theme.colors.contrast};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.smallPlus,
      css`
        flex-wrap: nowrap;
        height: 60px;
        padding: 10px 16px;
      `,
    )};
`;

const InviteInput = styled.input`
  flex: 1 1 auto;
  order: 0;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: 4px;

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.smallPlus,
      css`
        order: 1;
        margin: 0 10px;
      `,
    )};
`;

const LeaveButton = styled(Button)`
  order: 1;
  width: calc(100% / 2 - 5px);

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.smallPlus,
      css`
        order: 0;
        width: auto;
      `,
    )};
`;

const InviteButton = styled(Button)`
  order: 2;
  width: calc(100% / 2 - 5px);

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.smallPlus,
      css`
        width: auto;
      `,
    )};
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
  padding: 10px;
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.white : theme.colors.textLight};
  background: ${({ isActive, theme }) =>
    isActive ? theme.colors.accent : theme.colors.contrastLight};
  border-radius: 0;
  font-size: 14px;

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

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.smallPlus,
      css`
        padding: 10px 20px;
        font-size: 16px;
      `,
    )};
`;

export default connect(
  null,
  mapDispatchToProps,
)(withRouter(ControlPanel));
