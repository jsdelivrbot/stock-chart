import { combineReducers } from 'redux';
import stockReducer from './stock_reducer';
const rootReducer = combineReducers({
  stockData: stockReducer
});

export default rootReducer;
