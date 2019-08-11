import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ActivePanel from '@constants/ActivePanel';
import { expenseActions } from '@providers/expense/expense';
import { tripActions } from '@providers/trip/trip';
import { getParamTripId, getTripStatus } from '@selectors/tripSelector';
import TripMembers from '@components/trips/trip-detail/trip-members/TripMembers';
import TripMap from '@components/trips/trip-detail/trip-map/TripMap';
import TripExpenseSummary from '@components/trips/trip-detail/trip-expense/TripExpenseSummary';
import NewExpenseModal from '@components/trips/trip-detail/new-expense-modal/NewExpenseModal';
import ControlPanel from '@components/trips/trip-detail/control-panel/ControlPanel';
import TripDestinations from '@components/trips/trip-detail/trip-destinations/TripDestinations';
import TripExpenseList from '@components/trips/trip-detail/trip-expense/TripExpenseList';
import Loading from '@components/loading/Loading';
import Button from '@styles/Button';
import CardContainer from '@styles/card/CardContainer';

const mapStateToProps = (state, props) => {
  return {
    selectedTrip: state.trip.selectedTrip,
    tripId: getParamTripId(state, props),
    userInTrip: getTripStatus(state, props),
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

const TripDetail = ({
  actions,
  history,
  selectedTrip,
  tripId,
  userInTrip,
  match,
}) => {
  const [isExpenseModal, setExpenseModal] = useState(false);
  const [activePanel, setActivePanel] = useState(ActivePanel.EXPENSES);
  const tripStartDate = new Date(
    selectedTrip.travelDates.startAt,
  ).toLocaleDateString();
  const tripEndDate = new Date(
    selectedTrip.travelDates.endAt,
  ).toLocaleDateString();

  function toggleCreateExpenseModal() {
    setExpenseModal(prevExpenseModal => !prevExpenseModal);
  }

  function handleLeaveTrip() {
    actions.trip.leaveTrip(tripId).then(() => {
      history.push('/home');
    });
  }

  function handleActivePanelChange(event) {
    setActivePanel(event.target.name);
  }

  useEffect(() => {
    // actions.trip.getMembers(selectedTrip.members);
    actions.trip.getTripExpenses(selectedTrip.expenses);

    actions.trip.subscribeToTripChange(tripId);

    if (!userInTrip) {
      actions.trip.joinTrip(tripId);
    }

    return () => {
      actions.trip.unsubscribeToTripChange();
    };
  }, []);

  return (
    <Container>
      <Contents>
        <LeftPanel>
          <TripInfoCard>
            <TripName>{selectedTrip.name}</TripName>
            <TripDates>{`${tripStartDate} - ${tripEndDate}`}</TripDates>
            <TripNotes>{selectedTrip.notes}</TripNotes>
            <Wrapper>
              <Button
                color="primary"
                onClick={handleLeaveTrip}
                variant="contained"
              >
                Leave
              </Button>
            </Wrapper>
          </TripInfoCard>
          <TripMembers members={selectedTrip.members} />
        </LeftPanel>
        <MainPanel>
          <CardContainer>
            {selectedTrip ? (
              <React.Fragment>
                <ControlPanel
                  activePanel={activePanel}
                  handleActivePanelChange={handleActivePanelChange}
                  selectedTrip={selectedTrip}
                />
                {selectedTrip.destinations &&
                  activePanel === ActivePanel.DESTINATIONS && (
                    <TripDestinations
                      actions={actions}
                      destinations={selectedTrip.destinations}
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
          </CardContainer>
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
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  selectedTrip: PropTypes.object.isRequired,
  tripId: PropTypes.string.isRequired,
  userInTrip: PropTypes.bool.isRequired,
};

const Container = styled.div`
  padding: 20px;
`;

const Contents = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.colossal}px;
  margin: 0 auto;
`;

const LeftPanel = styled.div`
  width: 300px;
`;

const MainPanel = styled.div`
  width: 550px;
  margin: 0 15px;
`;

const RightPanel = styled.div`
  width: 300px;
`;

const TripInfoCard = styled(CardContainer)`
  padding: 16px;
`;

const TripName = styled.div`
  font-size: 30px;
`;

const TripDates = styled.div`
  font-size: 18px;
`;

const TripNotes = styled.div`
  font-size: 16px;
`;

const Wrapper = styled.div`
  display: flex;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripDetail));
