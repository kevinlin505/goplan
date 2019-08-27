import expense from '@data/expense';
import activity from '@data/activity';
import ActivityType from '@constants/ActivityType';
import Notification from '@constants/Notification';
import { notificationActions } from '@providers/notification/notification';
import compressFile from '@utils/compressFile';

export const types = {
  REMOVE_EXPENSE: 'EXPENSE/REMOVE_EXPENSE',
  SUBMIT_EXPENSE: 'EXPENSE/SUBMIT_EXPENSE',
  UPLOAD_RECEIPT: 'EXPENSE/UPLOAD_RECEIPT',
};

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.UPLOAD_RECEIPT: {
      return { ...state };
    }
    case types.REMOVE_EXPENSE: {
      return { ...state };
    }
    default:
      return state;
  }
}

export const expenseActions = {
  submitExpense: (form, files) => (dispatch, getState) => {
    const {
      auth: { profile },
      trip: { selectedTrip },
    } = getState();

    const expenseForm = {
      ...form,
      date: new Date(form.date),
      receipts: [],
      payer: { email: profile.email, id: profile.id, name: profile.name },
      tripId: selectedTrip.id,
    };

    if (files.length) {
      return Promise.all(
        [
          new Promise((resolve, reject) => {
            // set a max of 5 files per upload
            if (files.length > 5) reject();
            resolve();
          }),
        ].concat(
          files.map(file =>
            compressFile(file).then(reducedFile =>
              dispatch(expenseActions.uploadReceipts(reducedFile)),
            ),
          ),
        ),
      )
        .then(data => {
          data.forEach(dataUrl => {
            if (dataUrl) {
              const receipt = {
                url: dataUrl,
              };
              expenseForm.receipts.push(receipt);
            }
          });

          return expense()
            .submitExpense(expenseForm)
            .then(() => {
              activity().updateActivity(
                ActivityType.SUBMIT_EXPENSE,
                selectedTrip.id,
                expenseForm,
              );

              dispatch(
                notificationActions.setNotification(
                  Notification.SUCCESS,
                  `Successfully created expense.`,
                ),
              );

              return dispatch({
                type: types.SUBMIT_EXPENSE,
              });
            });
        })
        .catch(err =>
          dispatch(
            notificationActions.setNotification(
              Notification.ERROR,
              'Oops! Something is wrong, please try again!',
            ),
          ),
        );
    }

    return expense()
      .submitExpense(expenseForm)
      .then(() => {
        activity().updateActivity(
          ActivityType.SUBMIT_EXPENSE,
          selectedTrip.id,
          expenseForm,
        );

        dispatch(
          notificationActions.setNotification(
            Notification.SUCCESS,
            `Successfully created expense.`,
          ),
        );

        return dispatch({
          type: types.SUBMIT_EXPENSE,
        });
      })
      .catch(err =>
        dispatch(
          notificationActions.setNotification(
            Notification.ERROR,
            'Oops! Something is wrong, please try again!',
          ),
        ),
      );
  },

  removeExpense: (expenseId, expenseObject) => (dispatch, getState) => {
    const {
      auth: { profile },
      trip: { selectedTrip },
    } = getState();

    if (expenseObject.payer.id === profile.id) {
      return expense()
        .removeExpense(expenseId, expenseObject)
        .then(() => {
          activity().updateActivity(
            ActivityType.DELETE_EXPENSE,
            selectedTrip.id,
            expenseObject,
          );

          const urls = expenseObject.receipts.map(receipt => {
            return receipt.url;
          });

          expense().deleteReceipts({ urls });

          return dispatch({ type: types.REMOVE_EXPENSE });
        })
        .catch(err =>
          dispatch(
            notificationActions.setNotification(
              Notification.WARNING,
              'Oops! Something is wrong, please try again!',
            ),
          ),
        );
    }

    return dispatch(
      notificationActions.setNotification(
        Notification.WARNING,
        'You are not the payer of this expense.',
      ),
    );
  },

  uploadReceipts: file => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      // set file size limit to be 5MB
      const maxFileSize = 5 * 1024 * 1024;
      if (file.size > maxFileSize) {
        reject();
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const { selectedTrip } = getState().trip;
        const options = {
          data: reader.result,
          type: file.type,
          name: file.name,
          tripId: selectedTrip.id,
          env: process.env.environment,
        };
        expense()
          .uploadReceipt(options)
          .then(res => {
            dispatch({
              type: types.UPLOAD_RECEIPT,
            });

            return resolve(res.data);
          });
      };
      reader.onerror = error => {
        reject(error);
      };
    });
  },
};
