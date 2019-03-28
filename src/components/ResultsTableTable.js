import React, { Component } from 'react';
import '../App.css';
import '../pages/ResultsTable.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total pagTotal">
      <br></br>Showing { from } to { to } of { size } Results
    </span>
  );

  const pageButtonRenderer = ({
    page,
    active,
    disable,
    title,
    onPageChange
  }) => {
    const handleClick = (e) => {
      e.preventDefault();
      onPageChange(page);
    };
    const activeStyle = {};
    if (active) {
      activeStyle.backgroundColor = '#17a2b8';
      activeStyle.color = 'white';
    } else {
      activeStyle.backgroundColor = 'white';
      activeStyle.color = '#17a2b8';
    }
    if (typeof page === 'string') {
      activeStyle.backgroundColor = 'white';
      activeStyle.color = '#17a2b8';
    }
    return (
      <li className="page-item" style={activeStyle}>
        <button className="btn btn-info"  onClick={ handleClick } style={ activeStyle }>{ page }</button>
      </li>
    );
  };
  
const options = {
    // alwaysShowAllBtns: true, // Always show next and previous button
    showTotal: true,
    paginationTotalRenderer: customTotal,
    pageButtonRenderer,
  }; 

class ResultsTableTable extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                dataField: 'start',
                text: 'Start',
                headerStyle: {
                    width:'80px'
                },
                headerClasses: 'customColumnStyle',
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
                headerClasses: 'customColumnStyle',
                headerStyle: {
                    width:'80px'
                },
                // sort: true,
                sortFunc: (a, b, order, dataField) => {
                    if (order === 'asc') {
                      return b - a;
                    }
                    return a - b; // desc
                  }
            },
            {
                dataField: 'score',
                text: 'Sc',
                headerTitle: (column, colIndex) => 'Score',
                headerClasses: 'customColumnStyle',
                headerStyle: {
                    width:'75px'
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
                text: 'S',
                headerTitle: (column, colIndex) => 'Strand',
                headerClasses: 'customColumnStyle',
                headerStyle: {
                    width:'60px'
                },
                sort: true
            },
            {
                dataField: 'nt',
                text: '#T',
                headerTitle: (column, colIndex) => 'Tetrads',
                headerClasses: 'customColumnStyle',
                headerStyle: {
                    width:'60px'
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
                text: '#B',
                headerTitle: (column, colIndex) => 'Bulges',
                headerClasses: 'customColumnStyle',
                headerStyle: {
                    width:'60px'
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
                text: '#M',
                headerTitle: (column, colIndex) => 'Mismatches',
                headerClasses: 'customColumnStyle',
                headerStyle: {
                    width:'60px'
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
                text: 'Sequence',
                headerStyle: {
                    'backgroundColor': '#17a2b8',
                    color: 'white'
                }
            },
        ];
    }

    setPagination() {
        return this.props.data.length > 10 ? paginationFactory(options) : null;
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-1"></div>
                    <div className="col-md-10 col-sm-10">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <BootstrapTable striped keyField='key' data={ this.props.data } columns={ this.columns } 
                                                bootstrap4 rowClasses={'customRowClass'}  pagination={this.setPagination()} 
                                                noDataIndication="No quadruplexes found" />
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