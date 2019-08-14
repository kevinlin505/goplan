import ActivityType from '@constants/ActivityType';

export default function formAcitivityString(activity) {
  switch (activity.type) {
    case ActivityType.CREATE_TRIP: {
      return `trip created by ${activity.creator.name}`;
    }

    case ActivityType.DELETE_EXPENSE: {
      return `expense ${activity.data.merchant} deleted by ${activity.creator.name}`;
    }

    case ActivityType.INVITE_TRIP: {
      return `${activity.creator.name} invited ${activity.data.emails.join(
        ', ',
      )}`;
    }

    case ActivityType.JOIN_TRIP: {
      return `${activity.creator.name} joined`;
    }

    case ActivityType.LEAVE_TRIP: {
      return `${activity.creator.name} left`;
    }

    case ActivityType.MESSAGE: {
      return `${activity.creator.name}: ${activity.data.message}`;
    }

    case ActivityType.SUBMIT_EXPENSE: {
      return `expense ${activity.data.merchant} submitted by ${activity.creator.name}`;
    }

    case ActivityType.UPDATE_TRIP: {
      return `${activity.creator.name} updated the trip`;
    }

    default:
      return '';
  }
}
