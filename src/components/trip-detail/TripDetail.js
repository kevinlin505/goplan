import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import ActivePanel from '@constants/ActivePanel';
import { expenseActions } from '@providers/expense/expense';
import { tripActions } from '@providers/trip/trip';
import { breakpointMin } from '@utils/styleUtils';
import StatusNotification from '@components/status-notification/StatusNotification';
import ControlPanel from '@components/trip-detail/control-panel/ControlPanel';
import TripMembers from '@components/trip-detail/trip-members/TripMembers';
import TripActivities from '@components/trip-detail/trip-activities/TripActivities';
import TripDestinations from '@components/trip-detail/trip-destinations/TripDestinations';
import TripExpenseList from '@components/trip-detail/trip-expense/TripExpenseList';
import TripExpenseSummary from '@components/trip-detail/trip-expense/TripExpenseSummary';
import NewExpenseModal from '@components/trip-detail/new-expense-modal/NewExpenseModal';
import TripMap from '@components/trip-map/TripMap';
import Loading from '@components/loading/Loading';
import CardContainer from '@styles/card/CardContainer';

const mapStateToProps = state => {
  return {
    selectedTrip: state.trip.selectedTrip,
    weatherCache: state.trip.weatherCache,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      expense: bindActionCreators(expenseActions, dispatch),
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

const TripDetail = ({ actions, selectedTrip, weatherCache }) => {
  const [isExpenseModal, setExpenseModal] = useState(false);
  const [activePanel, setActivePanel] = useState(ActivePanel.ACTIVITIES);
  const tripStartDate = new Date(
    selectedTrip.travelDates.startAt,
  ).toLocaleDateString();
  const tripEndDate = new Date(
    selectedTrip.travelDates.endAt,
  ).toLocaleDateString();

  function toggleCreateExpenseModal() {
    setExpenseModal(prevExpenseModal => !prevExpenseModal);
  }

  function handleActivePanelChange(event) {
    setActivePanel(event.target.name);
  }

  return (
    <Container>
      <StatusNotification currentPage="tripDetail" />
      <Contents>
        <LeftPanel>
          <TripInfoCard>
            <TripName>{selectedTrip.name}</TripName>
            <TripDates>{`${tripStartDate} - ${tripEndDate}`}</TripDates>
            <TripNotes>{selectedTrip.notes}</TripNotes>
          </TripInfoCard>
          <TripMembers members={selectedTrip.members} />
          <BreakpointWrapper>
            <TripExpenseSummary
              members={selectedTrip.members}
              totalExpense={selectedTrip.costs}
            />
            <TripMap destinations={selectedTrip.destinations} />
          </BreakpointWrapper>
        </LeftPanel>
        <MainPanel>
          <MainContentArea>
            {selectedTrip ? (
              <React.Fragment>
                <ControlPanel
                  activePanel={activePanel}
                  handleActivePanelChange={handleActivePanelChange}
                  selectedTrip={selectedTrip}
                />
                {activePanel === ActivePanel.ACTIVITIES && (
                  <TripActivities
                    actions={actions}
                    destinations={selectedTrip.destinations}
                  />
                )}
                {activePanel === ActivePanel.DESTINATIONS && (
                  <TripDestinations
                    actions={actions}
                    destinations={selectedTrip.destinations}
                    weatherCache={weatherCache}
                  />
                )}
                {activePanel === ActivePanel.EXPENSES && (
                  <TripExpenseList
                    selectedTrip={selectedTrip}
                    toggleCreateExpenseModal={toggleCreateExpenseModal}
                  />
                )}
              </React.Fragment>
            ) : (
              <Loading />
            )}
          </MainContentArea>
        </MainPanel>
        <RightPanel>
          <TripExpenseSummary
            members={selectedTrip.members}
            totalExpense={selectedTrip.costs}
          />
          <TripMap destinations={selectedTrip.destinations} />
        </RightPanel>
      </Contents>
      {isExpenseModal && (
        <NewExpenseModal toggleCreateExpenseModal={toggleCreateExpenseModal} />
      )}
    </Container>
  );
};

TripDetail.propTypes = {
  actions: PropTypes.object.isRequired,
  selectedTrip: PropTypes.object.isRequired,
  weatherCache: PropTypes.object.isRequired,
};

const Container = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const Contents = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.giant}px;
  margin: 0 auto;

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.smallPlus,
      css`
        flex-flow: row wrap;
      `,
    )};

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.large,
      css`
        flex-flow: row nowrap;
      `,
    )};
`;

const LeftPanel = styled.div`
  width: 100%;

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.medium,
      css`
        max-width: 300px;
        margin-right: 10px;
      `,
    )};
`;

const MainPanel = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  margin: 0 auto;

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.medium,
      css`
        width: calc(100% - 310px);
      `,
    )};
`;

const RightPanel = styled.div`
  width: 100%;
  margin-bottom: 15px;

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.medium,
      css`
        display: none;
      `,
    )};

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.large,
      css`
        display: block;
        max-width: 270px;
        margin-left: 10px;
      `,
    )};

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.giant,
      css`
        display: block;
        max-width: 300px;
      `,
    )};
`;

const BreakpointWrapper = styled.div`
  display: none;

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.medium,
      css`
        display: block;
      `,
    )};

  ${({ theme }) =>
    breakpointMin(
      theme.sizes.large,
      css`
        display: none;
      `,
    )};
`;

const MainContentArea = styled(CardContainer)``;

const TripInfoCard = styled(CardContainer)`
  padding: 16px;
`;

const TripName = styled.div`
  font-size: 30px;
  font-weight: 500;
  padding-bottom: 5px;
`;

const TripDates = styled.div`
  font-size: 18px;
`;

const TripNotes = styled.div`
  font-size: 16px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TripDetail);
