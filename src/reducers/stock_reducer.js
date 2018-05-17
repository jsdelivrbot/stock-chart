import {
    CURRENT_STOCK_DATA,
    NEW_STOCK_DATA,
    HANDLE_SUBMISSION_ERROR,
    USER_SUBMISSION_SUCCESS,
    REMOVE_STOCK
} from '../actions/types';
export default function(state = {stocks: [], errorMessage: ''}, action) {
    switch(action.type) {
        case CURRENT_STOCK_DATA: 
            return {...state, stocks: action.payload};
        case NEW_STOCK_DATA:
            return {...state, stocks: action.payload, errorMessage: ''};
        case HANDLE_SUBMISSION_ERROR:
            return {...state, errorMessage: action.payload};
        case REMOVE_STOCK:
            let updatedStocks = state.stocks.filter((stock, i) => {
                if(stock.symbol !== action.payload) {
                    return stock;
                }
            })
            return {...state, stocks: updatedStocks};
    }
    return state;
}