import React, { Component } from 'react';
import '../App.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import filterFactory, { numberFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
 
class ResultsTableTable extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                dataField: 'key',
                text: 'Id',
                sort: true,
                headerStyle: {
                    width:'60px'
                },
            },
            {
                dataField: 'start',
                text: 'Start',
                headerStyle: {
                    width:'80px'
                },
                sort: true,
                sortFunc: (a, b, order, dataField) => {
                    if (order === 'asc') {
                      return b - a;
                    }
                    return a - b; // desc
                  }
            },
            {
                dataField: 'end',
                text: 'End',
                headerStyle: {
                    width:'80px'
                },
                sort: true,
                sortFunc: (a, b, order, dataField) => {
                    if (order === 'asc') {
                      return b - a;
                    }
                    return a - b; // desc
                  }
            },
            {
                dataField: 'score',
                text: 'Score',
                headerStyle: {
                    width:'83px'
                },
                sort: true,
                sortFunc: (a, b, order, dataField) => {
                    if (order === 'asc') {
                      return b - a;
                    }
                    return a - b; // desc
                  }
            },
            {
                dataField: 'strand',
                text: 'Strand',
                headerStyle: {
                    width:'90px'
                },
                sort: true
            },
            {
                dataField: 'nt',
                text: 'Tetrads',
                headerStyle: {
                    width:'95px'
                },
                sort: true,
                sortFunc: (a, b, order, dataField) => {
                    if (order === 'asc') {
                      return b - a;
                    }
                    return a - b; // desc
                  }
            },
            {
                dataField: 'nb',
                text: 'Bulges',
                headerStyle: {
                    width:'90px'
                },
                sort: true,
                sortFunc: (a, b, order, dataField) => {
                    if (order === 'asc') {
                      return b - a;
                    }
                    return a - b; // desc
                  }
            },
            {
                dataField: 'nm',
                text: 'Mismatches',
                headerStyle: {
                    width:'130px'
                },
                sort: true,
                sortFunc: (a, b, order, dataField) => {
                    if (order === 'asc') {
                      return b - a;
                    }
                    return a - b; // desc
                  }
            },
            {
                dataField: 'quadruplex',
                text: 'Sequence'
            },
        ];
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-1"></div>
                    <div className="col-md-10 col-sm-10">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <BootstrapTable keyField='key' data={ this.props.data } columns={ this.columns } bootstrap4/>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="col-sm-1"></div>
            </div>
        );
    }
}

export default ResultsTableTable;