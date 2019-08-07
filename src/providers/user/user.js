import user from '@data/user';
import expense from '@data/expense';

export const types = {
  GET_ALL_MEMBERS: 'USER/GET_ALL_MEMBERS',
  GET_USER_EXPENSE_REPORTS: 'EXPENSE/GET_USER_EXPENSE_REPORTS',
  SUMMARIZE_EXPENSE_REPORT: 'EXPENSE/SUMMARIZE_EXPENSE_REPORT',
  UPDATE_USER_DETAILS: 'USER/UPDATE_USER_DETAILS',
};

const initialState = {
  userExpenses: {
    expenses: [],
    expenseCategories: [],
    expenseTotal: 0,
    expenseTrips: [],
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_ALL_MEMBERS: {
      return {
        ...state,
        users: action.members,
      };
    }

    case types.GET_USER_EXPENSE_REPORTS: {
      return {
        ...state,
        userExpenses: {
          ...state.userExpenses,
          expenses: action.reports,
        },
      };
    }

    case types.SUMMARIZE_EXPENSE_REPORT: {
      return {
        ...state,
        userExpenses: {
          ...state.userExpenses,
          expenseCategories: action.expenseCategories,
          expenseTotal: action.expenseTotal,
          expenseTrips: action.expenseTrips,
        },
      };
    }

    default:
      return state;
  }
}

export const userActions = {
  // fetch all members of a trip and dispatch it to the store
  getAllMembers: memberList => dispatch => {
    user()
      .getAllMembers(memberList)
      .then(docs => {
        const members = docs.reduce((obj, doc) => {
          const data = doc.data();
          data.id = doc.id;
          obj[doc.id] = data;
          return obj;
        }, {});

        dispatch({
          type: types.GET_ALL_MEMBERS,
          members,
        });
      });
  },

  getUserExpenseReports: () => (dispatch, getState) => {
    const { profile } = getState().auth;

    return expense()
      .getExpenseReports(profile.expenses)
      .then(reportDocs => {
        const reports = reportDocs.map(doc => doc.data());

        dispatch({
          type: types.GET_USER_EXPENSE_REPORTS,
          reports,
        });

        return dispatch(userActions.summarizeAllExpenses(reports));
      })
      .catch(err => {
        console.log(err);
      });
  },

  summarizeAllExpenses: reports => dispatch => {
    const { expenseCategories, expenseTotal, expenseTrips } = reports.reduce(
      (expenseSummary, report) => {
        const cost = report.amount / report.payees.length;
        const categoryCost =
          expenseSummary.expenseCategories[report.category] || 0;
        const tripCost = expenseSummary.expenseTrips[report.tripId] || 0;

        expenseSummary.expenseCategories[report.category] = categoryCost + cost;
        expenseSummary.expenseTrips[report.tripId] = tripCost + cost;
        expenseSummary.expenseTotal += cost;

        return expenseSummary;
      },
      {
        expenseCategories: {},
        expenseTotal: 0,
        expenseTrips: {},
      },
    );

    return dispatch({
      type: types.SUMMARIZE_EXPENSE_REPORT,
      expenseCategories,
      expenseTotal,
      expenseTrips,
    });
  },

  updateProfile: profile => dispatch => {
    return user()
      .updateUserProfile(profile)
      .then(() => {
        return dispatch({
          type: types.UPDATE_USER_DETAILS,
        });
      })
      .catch(error => Promise.resolve());
  },
};
