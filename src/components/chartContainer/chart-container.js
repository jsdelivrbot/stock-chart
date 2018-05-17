import React, { Component } from 'react';
import SearchBar from './search-bar';
import StockCard from './stock-card';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { VictoryChart, VictoryVoronoiContainer, VictoryGroup, VictoryTooltip, VictoryLine, VictoryScatter, VictoryAxis } from 'victory';

class ChartContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.searchBarChange = this.searchBarChange.bind(this);
        this.searchBarSubmit = this.searchBarSubmit.bind(this);
    }
    componentWillMount() {
        this.props.chartAccessed();
    }
    searchBarChange(e) {
        this.setState({value: e.target.value});
    }
    searchBarSubmit(e) {
        e.preventDefault();
        this.props.submitStock(this.state.value);
    }

    render() {
       
        if(!this.props.stockData.stocks.length) {
            return (
                <div>
                    <h1>Stock Charter</h1>
                    <p className="bg-danger" aria-polite={this.props.stockData.errorMessage}>{this.props.stockData.errorMessage}</p>
                    <SearchBar onSubmit={this.searchBarSubmit}
                       onChange={this.searchBarChange} /> 
                </div>
            )
        }
       let lines = this.props.stockData.stocks.map((stockData, i) => {
                let stockDataArray = [];
                if(stockData['chart'] == undefined) {
                    stockData[stockData.symbol.toUpperCase()]['chart'].forEach(function(day) {
                        let stockChartData = {};
                        stockChartData.x = day['date'];
                        stockChartData.y = day['close'];
                        stockDataArray.push(stockChartData);
                        stockChartData = {};
                    })
                }
                else if(stockData['chart']['chart'].length) {
                    stockData['chart']['chart'].forEach(function(day) {
                        let stockChartData = {};
                        stockChartData.x = day['date'];
                        stockChartData.y = day['close'];
                        stockDataArray.push(stockChartData);
                        stockChartData = {};
                    })
                    return (
                        <VictoryGroup
                            key={i}
                            color={stockData.color}
                            labels={(d) => `${d.x}: ${d.y}`}
                            labelComponent={
                            <VictoryTooltip 
                                style={{fontSize: 10}}/>
                            }
                            data={stockDataArray}>
                            <VictoryLine/>
                        </VictoryGroup>
                    )
                }
           })
        let stockCards = this.props.stockData.stocks.map((stockData, i) => {
            return (
               <StockCard key={i}
                          color={stockData.color}
                           symbol={stockData.symbol}/>
            )
        })
        return (
            <div>
                <h1>Stock Charter</h1>
                <p className="bg-danger" aria-polite={this.props.stockData.errorMessage}>{this.props.stockData.errorMessage}</p>
                
                <VictoryChart height={400} width={750} 
                
                containerComponent={<VictoryVoronoiContainer/>
                }>
                <VictoryAxis
                    orientation="bottom"
                    tickFormat={() => ''}
                />
                <VictoryAxis
                    dependentAxis
                    orientation="left"
                />
                
                    {lines}
                </VictoryChart>
                <div className="row">
                {stockCards}
                </div>
                <SearchBar onSubmit={this.searchBarSubmit}
                   onChange={this.searchBarChange} />
            </div>
        )
        
    }

}


function mapStateToProps(state) {
    return {stockData: state.stockData}
}
export default connect(mapStateToProps, actions)(ChartContainer);