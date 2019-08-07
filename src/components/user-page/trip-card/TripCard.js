import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import convertNumberToCurrency from '@utils/convertNumberToCurrency';
import defaultBackgroundImage from '@assets/images/profileBackground.jpg';

const TripCard = ({ tripDetail }) => {
  const startDate = new Date(tripDetail.travelDates.startAt).toDateString();
  const endDate = new Date(tripDetail.travelDates.endAt).toDateString();

  const destination = tripDetail.destinations[0];
  const totalCost = Object.keys(tripDetail.costs).reduce((sum, category) => {
    return sum + tripDetail.costs[category];
  }, 0);

  const backgroundImageUrl =
    destination && destination.photo
      ? `${destination.photo}&w=600`
      : defaultBackgroundImage;

  function constructMemberList() {
    return Object.keys(tripDetail.members).map(memberId => {
      const member = tripDetail.members[memberId];

      return (
        <MemberName key={`member-${member.email}`}>{member.name}</MemberName>
      );
    });
  }

  return (
    <Container backgroundImageUrl={backgroundImageUrl}>
      <TripCardGradient>
        <TripCardDetail to={`/trip/${tripDetail.id}`}>
          <DetailWrapper>
            <DesinationDetail>
              <LocationName>{tripDetail.name}</LocationName>
              <TravelDate>{`${startDate} - ${endDate}`}</TravelDate>
            </DesinationDetail>
            <DesinationDetail>
              <MemberList>{constructMemberList()}</MemberList>
              <div>{convertNumberToCurrency(totalCost)}</div>
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

const Container = styled.div`
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
  font-size: 30px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TravelDate = styled.div`
  font-size: 16px;
`;

const MemberList = styled.div`
  width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MemberName = styled.div`
  display: inline-block;
  margin-right: 10px;
`;

export default TripCard;
