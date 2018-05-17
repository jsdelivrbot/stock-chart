import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
class StockCard extends Component {
    constructor(props) {
        super(props);
        this.stockDelete = this.stockDelete.bind(this);
    }
    stockDelete(e) {
        this.props.deleteStock(e.target.value);
    }
    render() {
        return (
            <div className="col-sm-4">
                <div className="panel panel-default">

                    <div className="panel-body">
                        <div className="col-sm-6">
                        <p className="stock-symbol" style={{color: this.props.color}}><strong>{this.props.symbol}</strong></p>
                        </div>
                        <button value={this.props.symbol} className="btn btn-danger" onClick={this.stockDelete}>Delete</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, actions)(StockCard);
