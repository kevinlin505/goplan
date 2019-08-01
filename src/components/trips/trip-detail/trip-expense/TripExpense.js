import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import convertNumberToCurrency from '@utils/convertNumberToCurrency';
import { Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

const mapStateToProps = state => {
  return {
    tripExpenses: state.trip.tripExpenses,
  };
};

const TripExpense = ({ tripExpenses, expenseList, totalExpense }) => {
  const [summaryExpense, setSummaryExpense] = useState([]);
  const [expenseSum, setExpenseSum] = useState(0);
  const [detailExpenseList, setDetailExpenseList] = useState({});
  const [attendeePayments, setAttendeePayments] = useState({});
  const [attendeeNetPayments, setAttendeeNetPayments] = useState({});

  const defaultExpenseExpandList = expenseList.reduce((obj, expenseId) => {
    obj[expenseId] = false;

    return obj;
  }, {});
  const [isExpenseExpanded, setExpenseExpanded] = useState(
    defaultExpenseExpandList,
  );

  function toggleExpenseDetail(expenseId) {
    return () => {
      const copy = { ...isExpenseExpanded };
      copy[expenseId] = !copy[expenseId];
      setExpenseExpanded(copy);
    };
  }

  function renderNetPayments(netPayments) {
    return Object.keys(netPayments).map(id => {
      return (
        <AttendeePaymentListItem key={`net-payment-${id}`}>
          <div>{`${netPayments[id][0]} ${
            netPayments[id][1] > 0 ? 'receives' : 'owes'
          }`}</div>
          <div>{convertNumberToCurrency(Math.abs(netPayments[id][1]))}</div>
        </AttendeePaymentListItem>
      );
    });
  }

  function renderPayments(payments) {
    return Object.keys(payments).map(id => {
      return (
        <AttendeePaymentListItem key={`total-payment-paid-${id}`}>
          <div>{`${payments[id][0]} paid`}</div>
          <div>{convertNumberToCurrency(payments[id][1])}</div>
        </AttendeePaymentListItem>
      );
    });
  }

  useEffect(() => {
    const list = [];
    let sum = 0;

    Object.keys(totalExpense).forEach(category => {
      list.push(
        <ExpenseListItem key={`trip-expense-summary-${category}`}>
          <div>{category}</div>
          <div>{convertNumberToCurrency(totalExpense[category])}</div>
        </ExpenseListItem>,
      );

      sum += totalExpense[category];
    });

    setSummaryExpense(list);
    setExpenseSum(sum);
  }, [totalExpense]);

  useEffect(() => {
    const list = {};
    const netPayments = {};
    const payments = {};
    expenseList.forEach(expenseId => {
      if (tripExpenses[expenseId]) {
        const {
          date,
          amount,
          description,
          merchant,
          payees,
          payer,
          receipts,
        } = tripExpenses[expenseId];
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

        list[expenseId] = (
          <DetailContentList>
            <DetailContentListItem>
              <div>Date</div>
              <div>{date.toDate().toLocaleDateString()}</div>
            </DetailContentListItem>
            <DetailContentListItem>
              <div>Amount</div>
              <div>{convertNumberToCurrency(parseFloat(amount))}</div>
            </DetailContentListItem>
            <DetailContentListItem>
              <div>Merchant</div>
              <div>{merchant}</div>
            </DetailContentListItem>
            <DetailContentListItem>
              <div>Description</div>
              <div style={{ textAlign: 'right' }}>{description}</div>
            </DetailContentListItem>
            <DetailContentListItem>
              <div>Who paid</div>
              <div>{payer.name}</div>
            </DetailContentListItem>
            <DetailContentListItem>
              {receipts[0] ? (
                <a href={receipts[0].url} target="_blank">
                  Receipt
                </a>
              ) : null}
            </DetailContentListItem>
          </DetailContentList>
        );
      }
    });

    setAttendeeNetPayments(netPayments);
    setAttendeePayments(payments);
    setDetailExpenseList(list);
  }, [Object.keys(tripExpenses).length]);

  const renderExpenseList = expenseList.map((expenseId, idx) => {
    if (!detailExpenseList[expenseId]) {
      return null;
    }

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
          {detailExpenseList[expenseId]}
        </Collapse>
      </DetailExpenseContent>
    );
  });

  return (
    <Container>
      <SummaryContent>
        <SummaryContentHeader>
          <div>Total Expense</div>
          <div>{convertNumberToCurrency(expenseSum)}</div>
        </SummaryContentHeader>
        <ExpenseSummary>{summaryExpense}</ExpenseSummary>
        {
          <AttendeePaymentList>
            Total paid by attendee
            {renderPayments(attendeePayments)}
          </AttendeePaymentList>
        }
        {
          <AttendeePaymentList>
            Net amount by attendee
            {renderNetPayments(attendeeNetPayments)}
          </AttendeePaymentList>
        }
      </SummaryContent>
      {renderExpenseList}
    </Container>
  );
};

TripExpense.propTypes = {
  expenseList: PropTypes.array.isRequired,
  totalExpense: PropTypes.object.isRequired,
  tripExpenses: PropTypes.object,
};

const Container = styled.div`
  width: 100%;
`;

const SummaryContent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  padding: 10px;
  margin: 0 0 10px 0;
  font-size: 18px;
  box-shadow: 0px 1px 3px 0px ${({ theme }) => theme.colors.divider};
`;

const SummaryContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ExpenseSummary = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 0 0;
  font-size: 14px;
  text-transform: capitalize;
`;

const ExpenseListItem = styled.li`
  padding: 0 10px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
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
  display: flex;
  justify-content: space-between;
`;

const DetailExpenseContent = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px ${({ theme }) => theme.colors.divider};
`;

const DetailContentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const DetailContentListItem = styled.li`
  font-size: 14px;
  padding: 0px 20px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
`;

const DetailContentListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 10px;
  margin: 10px 0 0 0;
  border-radius: 4px;

  &:active,
  &:focus,
  &:hover {
    cursor: pointer;
  }
`;

export default connect(mapStateToProps)(TripExpense);
