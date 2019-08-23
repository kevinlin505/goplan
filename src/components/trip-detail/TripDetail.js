import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import ActivePanel from '@constants/ActivePanel';
import { expenseActions } from '@providers/expense/expense';
import { tripActions } from '@providers/trip/trip';
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
import breakpointMin from '@styles/media';

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
      <Contents>
        <LeftPanel>
          <TripInfoCard>
            <TripName>{selectedTrip.name}</TripName>
            <TripDates>{`${tripStartDate} - ${tripEndDate}`}</TripDates>
            <TripNotes>{selectedTrip.notes}</TripNotes>
          </TripInfoCard>
          <TripMembers members={selectedTrip.members} />
        </LeftPanel>
        <MainPanel>
          <StatusNotification />
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
  padding: 20px;

  ${breakpointMin(
    'small',
    css`
      padding: 10px;
    `,
  )};
`;

const Contents = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.colossal}px;
  margin: 0 auto;

  ${breakpointMin(
    'small',
    css`
      flex-direction: column;
    `,
  )};

  ${breakpointMin(
    'smallPlus',
    css`
      flex-direction: row;
      flex-wrap: wrap;
    `,
  )};
`;

const LeftPanel = styled.div`
  width: 300px;

  ${breakpointMin(
    'small',
    css`
      width: 335px;
      margin: 0 auto;
    `,
  )};

  ${breakpointMin(
    'smallPlus',
    css`
      width: 52%;
      max-width: 300px;
      margin-right: 10px;
    `,
  )};
`;

const MainPanel = styled.div`
  width: 550px;
  margin: 0 15px;

  ${breakpointMin(
    'small',
    css`
      width: 90%;
      order: 1;
      margin: 0 auto;
    `,
  )};

  ${breakpointMin(
    'smallPlus',
    css`
      width: 95%;
      max-width: 620px;
    `,
  )};

  ${breakpointMin(
    'large',
    css`
      order: 0;
      width: 42%;
      max-width: 550px;
    `,
  )};
`;

const RightPanel = styled.div`
  width: 300px;
  margin-bottom: 15px;

  ${breakpointMin(
    'small',
    css`
      width: 335px;
      margin: 0 auto 15px;
    `,
  )};

  ${breakpointMin(
    'smallPlus',
    css`
      width: 40%;
      max-width: 300px;
      margin-left: 10px;
    `,
  )};

  ${breakpointMin(
    'large',
    css`
      width: 22%;
      max-width: 300px;
    `,
  )};
`;

const MainContentArea = styled(CardContainer)`
  min-height: 500px;
`;

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
