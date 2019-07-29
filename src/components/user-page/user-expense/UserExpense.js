import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Collapse, List, ListItem, ListSubheader } from '@material-ui/core';
import {
  AttachMoney,
  ExpandLess,
  ExpandMore,
  ListAlt,
  LocationOn,
} from '@material-ui/icons';
import convertNumberToCurrency from '@utils/convertNumberToCurrency';
import CardContainer from '@styles/card/CardContainer';

const mapStateToProps = state => {
  return {
    trips: state.trip.trips,
    userExpenses: state.user.userExpenses,
  };
};

export const UserExpense = ({
  userExpenses: { expenseCategories, expenseTotal, expenseTrips },
  trips,
}) => {
  const [isCategoryExpand, setCategoryExpand] = useState(true);
  const [isTripExpand, setTripExpand] = useState(true);
  const toggleCategoryList = () => {
    setCategoryExpand(!isCategoryExpand);
  };

  const toggleTripList = () => {
    setTripExpand(!isTripExpand);
  };

  const categoryList = Object.keys(expenseCategories).map((category, index) => {
    const cost = expenseCategories[category];

    return (
      <NestedListItem key={`${category}-${index}`}>
        <NestedListItemText>{category}</NestedListItemText>
        <ItemCost>{convertNumberToCurrency(cost)}</ItemCost>
      </NestedListItem>
    );
  });

  const tripList = Object.keys(expenseTrips).map((tripId, index) => {
    const cost = expenseTrips[tripId];
    const name = trips[tripId] && trips[tripId].trip_name;

    return (
      <NestedListItem key={`${tripId}-${cost}-${index}`}>
        <NestedListItemText>{name}</NestedListItemText>
        <ItemCost>{convertNumberToCurrency(cost)}</ItemCost>
      </NestedListItem>
    );
  });

  return (
    <CardContainer>
      <List
        aria-labelledby="nested-list-subheader"
        component="nav"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Spending Summary
          </ListSubheader>
        }
      >
        <ListItem button>
          <ListItemIcon>
            <AttachMoney />
          </ListItemIcon>
          <ListItemText>Total</ListItemText>
          <ItemCost>{convertNumberToCurrency(expenseTotal)}</ItemCost>
        </ListItem>
        <ListItem button onClick={toggleCategoryList}>
          <ListItemIcon>
            <ListAlt />
          </ListItemIcon>
          <ListItemText>Categories</ListItemText>
          {isCategoryExpand ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isCategoryExpand} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {categoryList}
          </List>
        </Collapse>
        <ListItem button onClick={toggleTripList}>
          <ListItemIcon>
            <LocationOn />
          </ListItemIcon>
          <ListItemText>Trips</ListItemText>
          {isTripExpand ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isTripExpand} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {tripList}
          </List>
        </Collapse>
      </List>
    </CardContainer>
  );
};

UserExpense.propTypes = {
  trips: PropTypes.object.isRequired,
  userExpenses: PropTypes.object.isRequired,
};

const ListItemIcon = styled.div`
  display: inline-flex;
  margin-right: 5px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ListItemText = styled.div`
  flex: 1 1 auto;
  margin: 4px 0;
  font-weight: 600;
  text-transform: uppercase;
`;

const NestedListItem = styled.div`
  display: flex;
  justify-content: flex-start;
  position: relative;
  align-items: center;
  padding: 8px 16px 8px 32px;
  font-size: 14px;
  text-align: left;
  text-decoration: none;
  text-transform: capitalize;
`;

const NestedListItemText = styled.div`
  flex: 1 1 auto;
  margin: 4px 0;
`;

const ItemCost = styled.div`
  display: inline-block;
`;

export default connect(mapStateToProps)(UserExpense);
