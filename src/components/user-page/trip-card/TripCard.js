import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import CardContainer from '@styles/card/CardContainer';

const TripCard = ({ tripDetail }) => {
  const [attendeeList, setAttendeeList] = useState(null);
  const startDate = new Date(tripDetail.start_date.toDate());
  const endDate = new Date(tripDetail.end_date.toDate());
  const destination = tripDetail.destinations[0];
  const totalCost = Object.keys(tripDetail.costs).reduce((sum, category) => {
    return sum + tripDetail.costs[category];
  }, 0);

  useEffect(() => {
    setAttendeeList(
      tripDetail.attendees.map(attendee => {
        return (
          <AttendeeName key={`attendee-${attendee.email}`}>
            {attendee.name}
          </AttendeeName>
        );
      }),
    );
  }, [tripDetail.attendees.length]);

  return (
    <Container backgroundImageUrl={destination && destination.photo_url}>
      <TripCardGradient>
        <TripCardDetail to={`/trip/${tripDetail.id}`}>
          <DetailWrapper>
            <DesinationDetail>
              <LocationName>{tripDetail.trip_name}</LocationName>
              <TravelDate>
                {`${startDate.toLocaleDateString()}`} -{' '}
                {`${endDate.toLocaleDateString()}`}
              </TravelDate>
            </DesinationDetail>
            <DesinationDetail>
              <AttendeeList>{attendeeList}</AttendeeList>
              <div>${totalCost}</div>
            </DesinationDetail>
          </DetailWrapper>
        </TripCardDetail>
      </TripCardGradient>
    </Container>
  );
};

TripCard.propTypes = {
  tripDetail: PropTypes.object.isRequired,
};

const Container = styled(CardContainer)`
  height: 280px;
  margin: 0 auto 20px;
  background-image: url(${({ backgroundImageUrl }) => backgroundImageUrl});
  background-size: cover;
  background-position: center;
  border: none;
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px ${({ theme }) => theme.colors.divider},
    0px 1px 1px 0px ${({ theme }) => theme.colors.divider},
    0px 2px 1px -1px ${({ theme }) => theme.colors.divider};
  overflow: hidden;
`;

const TripCardGradient = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const TripCardDetail = styled(Link)`
  display: block;
  height: 100%;
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
`;

const DesinationDetail = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 20px;
`;

const LocationName = styled.div`
  width: 100%;
  font-size: 36px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TravelDate = styled.div``;

const AttendeeList = styled.div`
  width: calc(100% - 80px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AttendeeName = styled.div`
  display: inline-block;
  margin: 0 5px;
`;

export default TripCard;
