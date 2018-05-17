import axios from 'axios';
import io from 'socket.io-client';
import { browserHistory } from 'react-router';
import {
    CURRENT_STOCK_DATA,
    NEW_STOCK_DATA,
    HANDLE_SUBMISSION_ERROR,
    USER_SUBMISSION_SUCCESS,
    REMOVE_STOCK
} from './types';
const ROOT_URL = 'https://murmuring-chamber-60018.herokuapp.com';
const ROOT_STOCK_API = 'https://api.iextrading.com/1.0/stock/market/batch?';
let socket = io(ROOT_URL);
function returnRandomHex() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}
export function chartAccessed() {
    return function(dispatch) {
        socket.on('stock data', (data) => {
            //if no stocks are returned then the db is empty
            if(!data['data'].length) {
                return;
            }
            //declare symbol array and color array in order to add the colors using the correct index once the stock_api response returns with the chart data
            let stockSymbols = [];
            let stockColors = [];
            data['data'].forEach((stock) => {
                stockSymbols.push(stock['symbol']);
                stockColors.push(stock['color']);
            })
            axios.get(`${ROOT_STOCK_API}symbols=${stockSymbols}&types=chart&range=1y`)
            .then((response) => {
                    let currentStocks = [];
                    let symbolData = {};
                    //use the index here to find the color and symbol from the previously generated stockSymbols and stockColors arrays
                    Object.keys(response['data']).forEach((stock, i) => {
                        symbolData.chart = response['data'][stock];
                        symbolData.symbol = stockSymbols[i];
                        symbolData.color = stockColors[i];
                        currentStocks.push(symbolData);
                        symbolData = {};
                    })
                    dispatch({
                        type: CURRENT_STOCK_DATA,
                        payload: currentStocks
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    }
}

export function submitStock(symbol) {
    return function(dispatch) {
        //run an initial request to see if symbol is a valid stock symbol. If it isn't display error message
        let checkResponse = {};
        axios.get(`${ROOT_STOCK_API}symbols=${symbol}&types=chart&range=1y`)
            .then((response)=> {
                checkResponse = response['data'];
                if(!Object.keys(checkResponse).length) {
                    dispatch({
                        type: HANDLE_SUBMISSION_ERROR,
                        payload: 'Please enter a valid stock symbol'
                    })
                    return;
                }
                else {
                    //we need to handle the submitter's stock first and then send data to all other users
                    checkResponse.color = returnRandomHex();
                    checkResponse.symbol = symbol;
                    //if symbol is valid then send it to the database
                    socket.emit('new stock submitted', {checkResponse});
                   
                    //use the bad submission error returned from db if the symbol entered is already on the chart
                    socket.on('bad submission', (data) => {
                        //if the stock is already on the chart then show an error message
                        dispatch({
                            type: HANDLE_SUBMISSION_ERROR,
                            payload: data['message']
                        })
                    })
                    socket.on('receive updated stocks', (data) => {
                        //if the new stock is unique handle the database's response
                        let stockSymbols = [];
                        let stockColors = [];
                        data.forEach((stock) => {
                            stockSymbols.push(stock['symbol']);
                            stockColors.push(stock['color']);
                        })
                        axios.get(`${ROOT_STOCK_API}symbols=${stockSymbols}&types=chart&range=1y`)
                        .then((response) => {
                            let updatedStocks = [];
                                let symbolData = {};
                                //use the index here to find the color and symbol from the previously generated stockSymbols and stockColors arrays
                                Object.keys(response['data']).forEach((stock, i) => {
                                    symbolData.chart = response['data'][stock];
                                    symbolData.symbol = stockSymbols[i];
                                    symbolData.color = stockColors[i];
                                    updatedStocks.push(symbolData);
                                    symbolData = {};
                                })
                            dispatch({
                                type: NEW_STOCK_DATA,
                                payload: updatedStocks
                            })
                        })
                    })
                }
            })
    }
}

export function deleteStock(symbol) {
    return function(dispatch) {
        socket.emit('delete stock', symbol);
        socket.on('removed stock', (data) => {
            dispatch({
                type: REMOVE_STOCK,
                payload: data.symbol
            })
        })
    }
}