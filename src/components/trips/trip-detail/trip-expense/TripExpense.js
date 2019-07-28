import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import convertNumberToCurrency from '@utils/convertNumberToCurrency';
import { Collapse, List, ListItem, ListSubheader } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

const mapStateToProps = state => {
  return {
    expense: state.expense,
  };
};

const TripExpense = ({ expense, expenseList, totalExpense }) => {
  const [summaryExpense, setSummaryExpense] = useState([]);
  const [expenseSum, setExpenseSum] = useState(0);
  const [detailExpenseList, setDetailExpenseList] = useState({});
  const [attendeePayments, setAttendeePayments] = useState([]);
  const [attendeePaymentsNet, setAttendeePaymentsNet] = useState([]);
  const [isExpenseExpanded, setExpenseExpanded] = useState(
    expenseList.reduce((obj, expenseId) => {
      obj[expenseId] = false;

      return obj;
    }, {}),
  );

  function toggleExpenseDetail(expenseId) {
    return () => {
      const copy = isExpenseExpanded;
      copy[expenseId] = !copy[expenseId];
      setExpenseExpanded(copy);
    };
  }

  function calculatePayments(payments) {
    const payerAmounts = [];
    const netPayerAmounts = [];
    const spiltPayment = expenseSum / Object.keys(payments).length;

    Object.keys(payments).forEach(key => {
      const payerNetAmount = payments[key][1] - spiltPayment;

      payerAmounts.push(
        <AttendeePaymentListItem key={`total-payment-paid-${key}`}>{`${
          payments[key][0]
        } paid: ${convertNumberToCurrency(
          payments[key][1],
        )}`}</AttendeePaymentListItem>,
      );

      netPayerAmounts.push(
        <AttendeePaymentListItem key={`net-payment-${key}`}>
          {`${payments[key][0]} ${
            payerNetAmount > 0 ? 'receives' : 'owes'
          }: ${convertNumberToCurrency(Math.abs(payerNetAmount))}`}
        </AttendeePaymentListItem>,
      );
    });

    setAttendeePayments(payerAmounts);
    setAttendeePaymentsNet(netPayerAmounts);
  }

  useEffect(() => {
    const list = [];
    let sum = 0;

    Object.keys(totalExpense).forEach(category => {
      list.push(
        <ExpenseListItem
          key={`trip-expense-summary-${category}`}
        >{`${category}: ${convertNumberToCurrency(
          totalExpense[category],
        )}`}</ExpenseListItem>,
      );

      sum += totalExpense[category];
    });

    setSummaryExpense(list);
    setExpenseSum(sum);
  }, [totalExpense]);

  useEffect(() => {
    const list = {};
    const payments = {};
    expenseList.forEach(expenseId => {
      if (expense.tripExpenses[expenseId]) {
        const {
          date,
          amount,
          category,
          description,
          merchant,
          payees,
          payer,
          receipts,
        } = expense.tripExpenses[expenseId];

        if (Object.keys(payments).length === 0) {
          payees.forEach(payee => {
            payments[payee.userId] = [payee.userName, 0];
          });
        }

        payments[payer.userId][1] += parseFloat(amount);

        list[expenseId] = (
          // <DetailExpenseContent
          //   key={`trip-expense-detail-${idx}`}
          //   onClick={toggleExpenseDetail(expenseId)}
          // >
          //   Expense #{idx + 1}
          //   <Collapse
          //     in={isExpenseExpanded[expenseId]}
          //     timeout="auto"
          //     unmountOnExit
          //   >
          <List component="div" disablePadding>
            <ListItem>Date: {date.toDate().toLocaleDateString()}</ListItem>
            <ListItem>
              Amount: {convertNumberToCurrency(parseFloat(amount))}
            </ListItem>
            <ListItem>Merchant: {merchant}</ListItem>
            <ListItem>Description: {description}</ListItem>
            <ListItem>Who paid: {payer.userName}</ListItem>
            <ListItem>
              <a href={receipts[0] ? receipts[0].url : ''} target="_blank">
                Receipt
              </a>
            </ListItem>
          </List>
          //   </Collapse>
          // </DetailExpenseContent>,
        );
      }
    });

    calculatePayments(payments);

    setDetailExpenseList(list);
  }, [Object.keys(expense.tripExpenses).length]);

  const renderExpenseList = expenseList.map((expenseId, idx) => {
    if (!detailExpenseList[expenseId]) {
      return null;
    }

    return (
      <DetailExpenseContent
        key={`trip-expense-detail-${idx}`}
        onClick={toggleExpenseDetail(expenseId)}
      >
        Expense #{idx + 1}
        <Collapse
          in={isExpenseExpanded[expenseId]}
          timeout="auto"
          unmountOnExit
        >
          {detailExpenseList[expenseId]}
        </Collapse>
      </DetailExpenseContent>
    );
  });

  return (
    <Container>
      <SummaryContent>
        Total Expense: {convertNumberToCurrency(expenseSum)}
        <ExpenseSummary>{summaryExpense}</ExpenseSummary>
        <AttendeePaymentList>
          Total paid by attendee:
          {attendeePayments}
        </AttendeePaymentList>
        <AttendeePaymentList>
          Net amount by attendee:
          {attendeePaymentsNet}
        </AttendeePaymentList>
      </SummaryContent>
      {renderExpenseList}
    </Container>
  );
};

TripExpense.propTypes = {
  expense: PropTypes.object,
  expenseList: PropTypes.array.isRequired,
  totalExpense: PropTypes.object.isRequired,
};

const Container = styled.div`
  width: 100%;
`;

const SummaryContent = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  padding: 10px;
  margin: 0 0 10px 0;
  font-size: 18px;
`;

const ExpenseSummary = styled.ul`
  list-style: none;
  margin: 0;
  padding: 5px;
  font-size: 14px;
  text-transform: capitalize;
`;

const ExpenseListItem = styled.li`
  padding: 0 10px;
  margin: 5px 0;
`;

const AttendeePaymentList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  font-size: 16px;
`;

const AttendeePaymentListItem = styled.li`
  padding: 0 10px;
  margin: 5px 0;
  font-size: 14px;
`;

const DetailExpenseContent = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  padding: 10px;
  margin: 10px 0;
`;

const DetailExpenseContentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const DetailExpenseContentListItem = styled.li`
  font-size: 14px;
  padding: 0 10px;
  margin: 5px 0;
`;

export default connect(mapStateToProps)(TripExpense);
