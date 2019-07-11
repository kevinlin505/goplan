import React from 'react';
import {Link} from 'react-router-dom';

const TripDetail = props => {
    return (
        <div>
            <h2>Trip Details</h2>
            <Link to='/home'>Back to Home</Link>
        </div>
    )
}

export default TripDetail;