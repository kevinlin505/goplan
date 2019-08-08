import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { expenseActions } from '@providers/expense/expense';
import convertNumberToCurrency from '@utils/convertNumberToCurrency';
import { Button, Collapse, List } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

const mapStateToProps = state => {
  return {
    tripExpenses: state.trip.tripExpenses,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      expense: bindActionCreators(expenseActions, dispatch),
    },
  };
};

const TripExpenseSummary = ({ actions, tripExpenses, expenseList }) => {
  const defaultExpenseExpandList = expenseList.reduce((obj, expenseId) => {
    obj[expenseId] = false;

    return obj;
  }, {});
  const [isExpenseExpanded, setExpenseExpanded] = useState(
    defaultExpenseExpandList,
  );

  function handleRemoveExpense(expenseId) {
    return () => {
      actions.expense.removeExpense(expenseId, tripExpenses[expenseId]);
    };
  }

  // Toggle isExpenseExpanded object with expenseId as key and boolean as values.
  // Make a copy of the isExpenseExpanded object before changing the value as not
  // to mutate the object in the state and then change the state with setState.
  function toggleExpenseDetail(expenseId) {
    return () => {
      const copy = { ...isExpenseExpanded };
      copy[expenseId] = !copy[expenseId];
      setExpenseExpanded(copy);
    };
  }

  function renderExpenseListItem(expenseId) {
    if (tripExpenses[expenseId]) {
      const {
        date,
        amount,
        description,
        merchant,
        payer,
        receipts,
      } = tripExpenses[expenseId];

      return (
        <List>
          <DetailContentListItem>
            <ListItemText>Date</ListItemText>
            <ItemCost>{date.toDate().toLocaleDateString()}</ItemCost>
          </DetailContentListItem>
          <DetailContentListItem>
            <ListItemText>Amount</ListItemText>
            <ItemCost>{convertNumberToCurrency(parseFloat(amount))}</ItemCost>
          </DetailContentListItem>
          <DetailContentListItem>
            <ListItemText>Merchant</ListItemText>
            <ItemCost>{merchant}</ItemCost>
          </DetailContentListItem>
          <DetailContentListItem>
            <ListItemText>Description</ListItemText>
            <ItemCost style={{ textAlign: 'right' }}>{description}</ItemCost>
          </DetailContentListItem>
          <DetailContentListItem>
            <ListItemText>Who paid</ListItemText>
            <ItemCost>{payer.name}</ItemCost>
          </DetailContentListItem>
          <DetailContentListItem>
            {receipts[0] ? (
              <a href={receipts[0].url} target="_blank">
                Receipt
              </a>
            ) : null}
          </DetailContentListItem>
          <Button
            color="primary"
            onClick={handleRemoveExpense(expenseId)}
            variant="contained"
          >
            Remove Expense
          </Button>
        </List>
      );
    }

    return null;
  }

  function renderExpenseList() {
    return expenseList.map((expenseId, idx) => {
      return (
        <DetailExpenseContent key={`trip-expense-detail-${idx}`}>
          <DetailContentListHeader onClick={toggleExpenseDetail(expenseId)}>
            <div>Expense #{idx + 1}</div>
            {isExpenseExpanded[expenseId] ? <ExpandLess /> : <ExpandMore />}
          </DetailContentListHeader>
          <Collapse
            in={isExpenseExpanded[expenseId]}
            timeout="auto"
            unmountOnExit
          >
            {renderExpenseListItem(expenseId)}
          </Collapse>
        </DetailExpenseContent>
      );
    });
  }

  return (
    <Container>
      <DetailContentCotainer>{renderExpenseList()}</DetailContentCotainer>
    </Container>
  );
};

TripExpenseSummary.propTypes = {
  actions: PropTypes.object.isRequired,
  expenseList: PropTypes.array.isRequired,
  totalExpense: PropTypes.object.isRequired,
  tripExpenses: PropTypes.object.isRequired,
};

const Container = styled.div`
  width: 100%;
`;

const DetailContentCotainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const DetailExpenseContent = styled.div`
  width: 25%;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px ${({ theme }) => theme.colors.divider};
  margin: 10px 15px;
`;

const ListItemText = styled.div`
  flex: 1 1 auto;
  margin: 0 15px 0 0;
  font-weight: 400;
  text-transform: capitalize;
`;

const ItemCost = styled.div`
  display: inline-block;
`;

const DetailContentListItem = styled.li`
  font-size: 14px;
  padding: 0px 20px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
`;

const DetailContentListHeader = styled.div`
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 10px;
  margin: 5px 0;
  border-radius: 4px;

  &:active,
  &:focus,
  &:hover {
    cursor: pointer;
  }
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TripExpenseSummary);
