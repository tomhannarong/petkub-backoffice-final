import { Map, fromJS } from 'immutable';
import { INIT } from '../constants/reduxFormConstants';

const initialState = {
  usersLogin: Map({
    email: 'super@gmail.com',
    password: '123123123',
    remember: false
  })
};
const initialImmutableState = fromJS(initialState);
export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case INIT:
      return state;
    default:
      return state;
  }
}
