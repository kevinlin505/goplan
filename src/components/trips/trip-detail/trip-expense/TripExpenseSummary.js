import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse, List, ListItem } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import convertNumberToCurrency from '@utils/convertNumberToCurrency';

const mapStateToProps = state => {
  return {
    tripExpenses: state.trip.tripExpenses,
  };
};

const TripExpenseSummary = ({ tripExpenses, expenseList, totalExpense }) => {
  const [summaryExpense, setSummaryExpense] = useState([]);
  const [expenseSum, setExpenseSum] = useState(0);
  const [attendeePayments, setAttendeePayments] = useState({});
  const [attendeeNetPayments, setAttendeeNetPayments] = useState({});
  const [isCategoryExpand, setCategoryExpand] = useState(true);
  const [isAttendeePaidExpand, setAttendeePaidExpand] = useState(true);
  const [isNetAmountExpand, setNetAmountExpand] = useState(true);

  function toggleCategoryList() {
    setCategoryExpand(prevCategoryExpand => !prevCategoryExpand);
  }

  function toggleAttendeePaidList() {
    setAttendeePaidExpand(prevAttendeePaidExpand => !prevAttendeePaidExpand);
  }

  function toggleNetAmountList() {
    setNetAmountExpand(prevNetAmountExpand => !prevNetAmountExpand);
  }

  function renderNetPayments() {
    return Object.keys(attendeeNetPayments).map(id => {
      return (
        <NestedListItem key={`net-payment-${id}`}>
          <NestedListItemText>{`${attendeeNetPayments[id][0]} ${
            attendeeNetPayments[id][1] > 0 ? 'receives' : 'owes'
          }`}</NestedListItemText>
          <ItemCost>
            {convertNumberToCurrency(Math.abs(attendeeNetPayments[id][1]))}
          </ItemCost>
        </NestedListItem>
      );
    });
  }

  function renderPayments() {
    return Object.keys(attendeePayments).map(id => {
      return (
        <NestedListItem key={`total-payment-paid-${id}`}>
          <NestedListItemText>{`${
            attendeePayments[id][0]
          } paid`}</NestedListItemText>
          <ItemCost>
            {convertNumberToCurrency(attendeePayments[id][1])}
          </ItemCost>
        </NestedListItem>
      );
    });
  }

  useEffect(() => {
    const list = [];
    let sum = 0;

    Object.keys(totalExpense).forEach((category, idx) => {
      list.push(
        <NestedListItem key={`${category}-${idx}`}>
          <NestedListItemText>{category}</NestedListItemText>
          <ItemCost>{convertNumberToCurrency(totalExpense[category])}</ItemCost>
        </NestedListItem>,
      );

      sum += totalExpense[category];
    });

    setSummaryExpense(list);
    setExpenseSum(sum);
  }, [totalExpense]);

  useEffect(() => {
    const netPayments = {};
    const payments = {};
    expenseList.forEach(expenseId => {
      if (tripExpenses[expenseId]) {
        const { amount, payees, payer } = tripExpenses[expenseId];
        const splitAmount = parseFloat(amount) / payees.length;

        if (!payments[payer.id]) {
          payments[payer.id] = [payer.name, 0];
        }
        payments[payer.id][1] += parseFloat(amount);

        payees.forEach(payee => {
          if (!netPayments[payee.id]) {
            netPayments[payee.id] = [payee.name, 0];
          }
          netPayments[payee.id][1] -= splitAmount;
        });
        netPayments[payer.id][1] += parseFloat(amount);
      }
    });

    setAttendeeNetPayments(netPayments);
    setAttendeePayments(payments);
  }, [Object.keys(tripExpenses).length]);

  return (
    <List>
      <ListHeader>Expense Summary</ListHeader>
      <ListItem>
        <ListItemText>Total</ListItemText>
        <ItemCost>{convertNumberToCurrency(expenseSum)}</ItemCost>
      </ListItem>
      <ListItem button onClick={toggleCategoryList}>
        <ListItemText>Category</ListItemText>
        {isCategoryExpand ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isCategoryExpand} timeout="auto" unmountOnExit>
        <List component="div">{summaryExpense}</List>
      </Collapse>
      <ListItem button onClick={toggleAttendeePaidList}>
        <ListItemText>Total Paid by Attendee</ListItemText>
        {isAttendeePaidExpand ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isAttendeePaidExpand} timeout="auto" unmountOnExit>
        <List component="div">{renderPayments()}</List>
      </Collapse>
      <ListItem button onClick={toggleNetAmountList}>
        <ListItemText>Net Amount by Attendee</ListItemText>
        {isNetAmountExpand ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isNetAmountExpand} timeout="auto" unmountOnExit>
        <List component="div">{renderNetPayments()}</List>
      </Collapse>
    </List>
  );
};

TripExpenseSummary.propTypes = {
  expenseList: PropTypes.array.isRequired,
  totalExpense: PropTypes.object.isRequired,
  tripExpenses: PropTypes.object.isRequired,
};

const ListHeader = styled.div`
  padding: 5px 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ListItemText = styled.div`
  flex: 1 1 auto;
  font-weight: 600;
  text-transform: uppercase;
`;

const NestedListItem = styled.div`
  display: flex;
  justify-content: flex-start;
  position: relative;
  align-items: center;
  padding: 0px 16px 0px 32px;
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

export default connect(mapStateToProps)(TripExpenseSummary);
