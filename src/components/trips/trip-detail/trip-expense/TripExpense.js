import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import convertNumberToCurrency from '@utils/convertNumberToCurrency';

const mapStateToProps = state => {
  return {
    expense: state.expense,
  };
};

const TripExpense = ({ expense, expenseList, totalExpense }) => {
  const [summaryExpense, setSummaryExpense] = useState([]);
  const [expenseSum, setExpenseSum] = useState(0);
  const [detailExpenseList, setDetailExpenseList] = useState([]);
  const [attendeePayments, setAttendeePayments] = useState([]);
  const [attendeePaymentsNet, setAttendeePaymentsNet] = useState([]);

  function calculatePayments(payments) {
    const payerAmounts = [];
    const netPayerAmounts = [];
    const spiltPayment = expenseSum / Object.keys(payments).length;

    Object.keys(payments).forEach(key => {
      const payerNetAmount = payments[key] - spiltPayment;

      payerAmounts.push(
        <AttendeePaymentListItem
          key={`total-payment-paid-${key}`}
        >{`${key} paid: ${convertNumberToCurrency(
          payments[key],
        )}`}</AttendeePaymentListItem>,
      );

      netPayerAmounts.push(
        <AttendeePaymentListItem key={`net-payment-${key}`}>
          {`${key} ${
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
    const list = [];
    const payments = {};
    expenseList.forEach((expenseId, idx) => {
      if (expense.tripExpenses[expenseId]) {
        const {
          date,
          amount,
          category,
          description,
          merchant,
          payees,
          payerId,
          receipts,
        } = expense.tripExpenses[expenseId];

        if (Object.keys(payments).length === 0) {
          payees.forEach(payee => {
            payments[payee] = 0;
          });
        }

        payments[payerId] += parseFloat(amount);

        list.push(
          <DetailExpenseContent key={`trip-expense-detail-${idx}`}>
            Expense #{idx + 1}
            <DetailExpenseContentList>
              <DetailExpenseContentListItem>
                Date: {date.toDate().toLocaleDateString()}
              </DetailExpenseContentListItem>
              <DetailExpenseContentListItem>
                Amount: {convertNumberToCurrency(parseFloat(amount))}
              </DetailExpenseContentListItem>
              <DetailExpenseContentListItem>
                Merchant: {merchant}
              </DetailExpenseContentListItem>
              <DetailExpenseContentListItem>
                Description: {description}
              </DetailExpenseContentListItem>
              <DetailExpenseContentListItem>
                Who paid: {payerId}
              </DetailExpenseContentListItem>
              <DetailExpenseContentListItem>
                <a href={receipts[0] ? receipts[0].url : ''} target="_blank">
                  Receipt
                </a>
              </DetailExpenseContentListItem>
            </DetailExpenseContentList>
          </DetailExpenseContent>,
        );
      }
    });

    calculatePayments(payments);

    setDetailExpenseList(list);
  }, [expense.tripExpenses]);

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
      {detailExpenseList}
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
