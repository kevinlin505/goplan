import uuidv3 from 'uuid/v3';
import AWS from 'aws-sdk/global';
import S3 from 'aws-sdk/clients/s3';
import Keys from '@constants/Keys';
import expense from '@data/expense';

export const types = {
  GET_TRIP_EXPENSE_REPORTS: 'EXPENSE/GET_TRIP_EXPENSE_REPORTS',
  GET_USER_EXPENSE_REPORTS: 'EXPENSE/GET_USER_EXPENSE_REPORTS',
  SUBMIT_EXPENSE: 'EXPENSE/SUBMIT_EXPENSE',
  SUMMARIZE_EXPENSE_REPORT: 'EXPENSE/SUMMARIZE_EXPENSE_REPORT',
  UPLOAD_RECEIPT: 'EXPENSE/UPLOAD_RECEIPT',
};

const initialState = {
  expenses: [],
  expenseCategories: [],
  expenseTotal: 0,
  expenseTrips: [],
  tripExpenses: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_TRIP_EXPENSE_REPORTS: {
      return {
        ...state,
        tripExpenses: action.reports,
      };
    }

    case types.GET_USER_EXPENSE_REPORTS: {
      return {
        ...state,
        expenses: action.reports,
      };
    }

    case types.SUMMARIZE_EXPENSE_REPORT: {
      return {
        ...state,
        expenseCategories: action.expenseCategories,
        expenseTotal: action.expenseTotal,
        expenseTrips: action.expenseTrips,
      };
    }

    case types.UPLOAD_RECEIPT: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}

export const expenseActions = {
  getUserExpenseReports: () => (dispatch, getState) => {
    const { profile } = getState().auth;

    return expense()
      .getUserCategoryExpenseReports(profile.expenses)
      .then(reportDocs => {
        const reports = reportDocs.map(doc => doc.data());

        dispatch({
          type: types.GET_USER_EXPENSE_REPORTS,
          reports,
        });

        return dispatch(expenseActions.summarizeAllExpenses(reports));
      })
      .catch(err => {
        console.log(err);
      });
  },

  getTripExpenses: expenseRefs => dispatch => {
    return expense()
      .getUserCategoryExpenseReports(expenseRefs)
      .then(expenseDocs => {
        const reports = {};
        expenseDocs.forEach(report => (reports[report.id] = report.data()));

        dispatch({
          type: types.GET_TRIP_EXPENSE_REPORTS,
          reports,
        });
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

  submitExpense: (form, files) => (dispatch, getState) => {
    const {
      auth: { profile },
      trip: { selectedTrip },
    } = getState();

    const expenseForm = {
      ...form,
      date: new Date(form.date),
      receipts: [],
      payer: { userId: profile.id, userName: profile.name },
      tripId: selectedTrip.id,
    };

    // TODO: set a max on total file size
    if (files.length) {
      return Promise.all(
        files.map(file => dispatch(expenseActions.uploadReceipts(file))),
      )
        .then(data => {
          data.forEach(request => {
            const response = request && request.params;
            if (response) {
              // https://goplan-assets-management.s3.amazonaws.com/expense/Gq0IaPgr4moOE0OS4CgM/9a05a01b-35ed-3ee5-8544-58962d445d74
              const receipt = {
                contentType: request.params.ContentType,
                date: request.signedAt || new Date(),
                key: request.params.Key,
                url: `https://${request.params.Bucket}.s3.amazonaws.com/${request.params.Key}`,
              };
              expenseForm.receipts.push(receipt);
            }
          });

          return expense()
            .submitExpense(expenseForm)
            .then(() => {
              dispatch({
                type: types.SUBMIT_EXPENSE,
              });
            });
        })
        .catch(err => {
          // handle form submit error
          console.log(err);
        });
    }

    return expense()
      .submitExpense(expenseForm)
      .then(() => {
        dispatch({
          type: types.SUBMIT_EXPENSE,
        });
      })
      .catch(err => {
        // handle form submit error
        console.log(err);
      });
  },

  uploadReceipts: file => (dispatch, getState) => {
    const { selectedTrip } = getState().trip;

    AWS.config.region = Keys.AWS.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: Keys.AWS.IdentityPoolId,
    });

    const bucket = new S3();
    const params = {
      Bucket: `${Keys.AWS.bucketName}/expense/${selectedTrip.id}`,
      Key: uuidv3(file.name, Keys.AWS.uuid),
      ContentType: file.type,
      Body: file,
    };

    return bucket.putObject(params, (err, data) => {
      if (err) {
        throw err;
      } else {
        dispatch({
          type: types.UPLOAD_RECEIPT,
        });

        return Promise.resolve(data);
      }
    });
  },
};
