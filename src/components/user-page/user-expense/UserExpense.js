import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CardContainer from '@styles/card/CardContainer';

const mapStateToProps = state => {
  return {
    expense: state.expense,
    trips: state.trip.trips,
  };
};

export const UserExpense = ({
  expense: { expenseCategories, expenseTotal, expenseTrips },
  trips,
}) => {
  const categoryList = Object.keys(expenseCategories).map((category, index) => {
    const cost = expenseCategories[category];

    return (
      <ExpenseWrapper key={`${category}-${index}`}>
        <Name>{category}</Name>:<Price>${cost}</Price>
      </ExpenseWrapper>
    );
  });

  const tripList = Object.keys(expenseTrips).map((tripId, index) => {
    const cost = expenseTrips[tripId];
    const name = trips[tripId] && trips[tripId].trip_name;

    return (
      <ExpenseWrapper key={`${tripId}-${cost}-${index}`}>
        <Name>{name}</Name>:<Price>${cost}</Price>
      </ExpenseWrapper>
    );
  });

  return (
    <CardContainer>
      <TotalExpense>Spending: {expenseTotal}</TotalExpense>
      <Categories>
        <Header>Categories:</Header>
        {categoryList}
      </Categories>
      <Trips>
        <Header>Trips:</Header>
        {tripList}
      </Trips>
    </CardContainer>
  );
};

UserExpense.propTypes = {
  expense: PropTypes.object.isRequired,
  trips: PropTypes.object.isRequired,
};

const Container = styled.div`
  padding: 25px;
`;

const TotalExpense = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Categories = styled.div`
  margin-bottom: 20px;
`;

const Trips = styled.div`
  margin-bottom: 20px;
`;

const Header = styled.div`
  font-size: 18px;
  margin-bottom: 5px;
`;

const ExpenseWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 5px 0;
`;

const Name = styled.div`
  display: inline-block;
  font-weight: 600;
`;

const Price = styled.div`
  display: inline-block;
  margin-left: 5px;
`;

export default connect(mapStateToProps)(UserExpense);
