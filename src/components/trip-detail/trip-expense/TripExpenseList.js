import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Delete } from '@material-ui/icons';
import ButtonStyles from '@constants/ButtonStyles';
import { expenseActions } from '@providers/expense/expense';
import { tripActions } from '@providers/trip/trip';
import convertNumberToCurrency from '@utils/convertNumberToCurrency';
import Button from '@styles/Button';

const mapStateToProps = state => {
  return {
    selectedTrip: state.trip.selectedTrip,
    tripExpenses: state.trip.tripExpenses,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      expense: bindActionCreators(expenseActions, dispatch),
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

export const TripExpenseList = ({
  actions,
  selectedTrip,
  toggleCreateExpenseModal,
  tripExpenses,
}) => {
  function handleRemoveExpense(expenseId) {
    return () => {
      actions.expense.removeExpense(expenseId, tripExpenses[expenseId]);
    };
  }

  useEffect(() => {
    if (selectedTrip.expenses.length !== Object.keys(tripExpenses).length) {
      actions.trip.getTripExpenses(selectedTrip.expenses);
    }
  }, [selectedTrip.expenses.length]);

  function constructPayeeList(payees) {
    if (
      Object.keys(selectedTrip.members).length === Object.keys(payees).length
    ) {
      return 'All Members';
    }

    return Object.keys(payees).map((payeeId, index) => {
      const payee = payees[payeeId];

      return (
        <ExpensePayee key={`payee-name-${payee.name}-${index}`}>
          {`${payee.name}${
            index === Object.keys(payees).length - 1 ? '' : ','
          }`}
        </ExpensePayee>
      );
    });
  }

  function renderExpenseList() {
    return Object.keys(tripExpenses).map((expenseId, idx) => {
      const {
        date,
        amount,
        description,
        merchant,
        payees,
        payer,
        receipts,
      } = tripExpenses[expenseId];

      return (
        <DetailExpenseContent key={`trip-expense-detail-${idx}`}>
          <ExpenseHeader>
            <div>{merchant}</div>
            <Button
              aria-label={`Remove ${merchant} expense`}
              onClick={handleRemoveExpense(expenseId)}
              variant="text"
            >
              <Delete />
            </Button>
          </ExpenseHeader>
          <ExpenseDescription>{description}</ExpenseDescription>
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
              <ListItemText>Who paid</ListItemText>
              <ItemCost>{payer.name}</ItemCost>
            </DetailContentListItem>
            <DetailContentListItem>
              <ListItemText>Who needs to pay?</ListItemText>
              <ItemCost>{constructPayeeList(payees)}</ItemCost>
            </DetailContentListItem>
            <DetailContentListItem>
              {receipts[0] ? (
                <a href={receipts[0].url} target="_blank">
                  Receipt
                </a>
              ) : null}
            </DetailContentListItem>
          </List>
        </DetailExpenseContent>
      );
    });
  }

  return (
    <React.Fragment>
      <Report>
        <Button
          onClick={toggleCreateExpenseModal}
          variant={ButtonStyles.BORDERED}
        >
          Report Expense
        </Button>
      </Report>
      {renderExpenseList()}
    </React.Fragment>
  );
};

TripExpenseList.propTypes = {
  actions: PropTypes.object.isRequired,
  selectedTrip: PropTypes.object.isRequired,
  toggleCreateExpenseModal: PropTypes.func.isRequired,
  tripExpenses: PropTypes.object.isRequired,
};

const Report = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
`;

const DetailExpenseContent = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
`;

const ExpenseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
`;

const ExpenseDescription = styled.div`
  font-size: 14px;
`;

const List = styled.div`
  padding-top: 15px;
`;

const DetailContentListItem = styled.li`
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
`;

const ListItemText = styled.div`
  flex: 1 1 auto;
  margin: 0 15px 0 0;
  text-transform: capitalize;
`;

const ItemCost = styled.div`
  display: inline-block;
`;

const ExpensePayee = styled.div`
  display: inline-block;
  max-width: 50%;
  margin-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TripExpenseList);
