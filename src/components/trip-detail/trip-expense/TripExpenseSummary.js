import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse, List, ListItem } from '@material-ui/core';
import {
  AttachMoney,
  ExpandLess,
  ExpandMore,
  HowToReg,
  ListAlt,
  Money,
  People,
} from '@material-ui/icons';
import { getExpenseIdList } from '@selectors/tripSelector';
import convertNumberToCurrency from '@utils/convertNumberToCurrency';
import CardContainer from '@styles/card/CardContainer';

const mapStateToProps = state => {
  return {
    expenseIdList: getExpenseIdList(state),
    tripExpenses: state.trip.tripExpenses,
  };
};

const TripExpenseSummary = ({
  members,
  tripExpenses,
  expenseIdList,
  totalExpense,
}) => {
  const [summaryExpense, setSummaryExpense] = useState([]);
  const [expenseSum, setExpenseSum] = useState(0);
  const [memberPayments, setMemberPayments] = useState({});
  const [memberNetPayments, setMemberNetPayments] = useState({});
  const [isCategoryExpand, setCategoryExpand] = useState(true);
  const [isMemberPaidExpand, setMemberPaidExpand] = useState(true);
  const [isNetAmountExpand, setNetAmountExpand] = useState(true);

  function toggleCategoryList() {
    setCategoryExpand(prevCategoryExpand => !prevCategoryExpand);
  }

  function toggleMemberPaidList() {
    setMemberPaidExpand(prevMemberPaidExpand => !prevMemberPaidExpand);
  }

  function toggleNetAmountList() {
    setNetAmountExpand(prevNetAmountExpand => !prevNetAmountExpand);
  }

  function renderNetPayments() {
    return Object.keys(memberNetPayments).map(id => {
      return (
        <NestedListItem key={`net-payment-${id}`}>
          <NestedListItemText>{memberNetPayments[id][0]}</NestedListItemText>
          <ItemCost>
            {memberNetPayments[id][1] < 0 && '-'}
            {convertNumberToCurrency(Math.abs(memberNetPayments[id][1]))}
          </ItemCost>
        </NestedListItem>
      );
    });
  }

  function renderPayments() {
    return Object.keys(memberPayments).map(id => {
      return (
        <NestedListItem key={`total-payment-paid-${id}`}>
          <NestedListItemText>{memberPayments[id][0]}</NestedListItemText>
          <ItemCost>{convertNumberToCurrency(memberPayments[id][1])}</ItemCost>
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
    expenseIdList.forEach(expenseId => {
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

    setMemberNetPayments(netPayments);
    setMemberPayments(payments);
  }, [Object.keys(tripExpenses).length]);

  return (
    <CardContainer>
      <List>
        <ListHeader>Expense Summary</ListHeader>
        <ListItem>
          <ListItemIcon>
            <AttachMoney />
          </ListItemIcon>
          <ListItemText>Total</ListItemText>
          <ItemCost>{convertNumberToCurrency(expenseSum)}</ItemCost>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Money />
          </ListItemIcon>
          <ListItemText>Average</ListItemText>
          <ItemCost>
            {convertNumberToCurrency(expenseSum / Object.keys(members).length)}
          </ItemCost>
        </ListItem>
        <ListItem button onClick={toggleCategoryList}>
          <ListItemIcon>
            <ListAlt />
          </ListItemIcon>
          <ListItemText>Category</ListItemText>
          {isCategoryExpand ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isCategoryExpand} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {summaryExpense}
          </List>
        </Collapse>
        <ListItem button onClick={toggleMemberPaidList}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText>Total Paid by Member</ListItemText>
          {isMemberPaidExpand ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isMemberPaidExpand} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {renderPayments()}
          </List>
        </Collapse>
        <ListItem button onClick={toggleNetAmountList}>
          <ListItemIcon>
            <HowToReg />
          </ListItemIcon>
          <ListItemText>Net Amount by Member</ListItemText>
          {isNetAmountExpand ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isNetAmountExpand} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {renderNetPayments()}
          </List>
        </Collapse>
      </List>
    </CardContainer>
  );
};

TripExpenseSummary.propTypes = {
  expenseIdList: PropTypes.array.isRequired,
  members: PropTypes.object.isRequired,
  totalExpense: PropTypes.object.isRequired,
  tripExpenses: PropTypes.object.isRequired,
};

const ListHeader = styled.div`
  padding: 5px 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ListItemIcon = styled.div`
  display: inline-flex;
  margin-right: 5px;
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
  padding: 4px 16px 4px 32px;
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
