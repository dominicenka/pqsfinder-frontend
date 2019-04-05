import React, { Component } from 'react';
import '../App.css';
import '../pages/ResultsTable.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import Pagination from './Pagination';

const customTotal = (page, spp, size) => (
    <span className="pagTotal col-md-3">
      Showing { page } to { (page - 1 + spp) > size ? size : (page - 1 + spp) } of { size } Results
    </span>
  );


class ResultsTableTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            data: [],
            sizePerPage: 10,
            
          };

        this.columns = [
            {
              dataField: 'key',
              hidden: true
            },
            {
                dataField: 'start',
                text: 'Start',
                headerStyle: {
                    // width:'80px'
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
                    // width:'80px'
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
                text: 'Score',
                headerTitle: (column, colIndex) => 'Score',
                headerClasses: 'customColumnStyle',
                headerStyle: {
                    // width:'75px'
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
                headerTitle: (column, colIndex) => 'Strand',
                headerClasses: 'customColumnStyle',
                headerStyle: {
                    // width:'60px'
                },
                sort: true
            },
            {
                dataField: 'nt',
                text: '#Tetrads',
                headerTitle: (column, colIndex) => 'Tetrads',
                headerClasses: 'customColumnStyle',
                headerStyle: {
                    // width:'60px'
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
                text: '#Bulges',
                headerTitle: (column, colIndex) => 'Bulges',
                headerClasses: 'customColumnStyle',
                headerStyle: {
                    // width:'60px'
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
                text: '#Mismatches',
                headerTitle: (column, colIndex) => 'Mismatches',
                headerClasses: 'customColumnStyle',
                headerStyle: {
                    // width:'60px'
                },
                sort: true,
                sortFunc: (a, b, order, dataField) => {
                    if (order === 'asc') {
                      return b - a;
                    }
                    return a - b; // desc
                  }
            },
            // {
            //     dataField: 'quadruplex',
            //     text: 'Sequence',
            //     headerStyle: {
            //         'backgroundColor': '#17a2b8',
            //         color: 'white'
            //     }
            // },
        ];
    }

    componentDidMount() {
        this.setState({data: this.props.data.slice(0,10)});
    }

    handleTableChange = (type, { page, sizePerPage }) => {
        let newPage = page > Math.round((this.props.data.length / sizePerPage)) ? 1 : page;
        const currentIndex = (newPage - 1) * sizePerPage;  
          this.setState(() => ({
            page: newPage,
            data: this.props.data.slice(currentIndex, currentIndex + sizePerPage),
            sizePerPage
          }));
      }

    render() {
      console.log(this.props.data);
      const expandRow = {
        renderer: row => (
            <p>{this.props.data[row.key - 1].quadruplex}</p>
        ),
        showExpandColumn: true,
        expandHeaderColumnRenderer: ({ isAnyExpands }) => {
          if (isAnyExpands) {
            return <b>-</b>;
          }
          return <b>+</b>;
        },
        expandColumnRenderer: ({ expanded }) => {
          if (expanded) {
            return (
              <b>-</b>
            );
          }
          return (
            <b>...</b>
          );
        }
      };
      let {sizePerPage, page} = this.state;
        return (
            <div className="row result-table">
                <div className="col-sm-2"></div>
                    <div className="col-md-8 col-sm-10">
                        <div className="card">
                            <div className={`card-body result-table-body ${this.props.data.length > 10 ? "" : "no-pad"}`}>
                                <div className="row ">
                                  <BootstrapTable striped remote keyField='key' data={ this.state.data } columns={ this.columns } 
                                        bootstrap4 rowClasses={'customRowClass'} 
                                        noDataIndication="No quadruplexes found"
                                        expandRow={ expandRow } />
                                  {this.props.data.length > 10 && 
                                    <div className="row pagination-wrapper">
                                      {customTotal(((page - 1) * sizePerPage) + 1, sizePerPage, this.props.data.length)}
                                      <Pagination
                                        totalCount={this.props.data.length}
                                        page={page}
                                        sizePerPage={sizePerPage}
                                        handleTableChange={(page, sizePerPage) => this.handleTableChange(null, {page, sizePerPage})}
                                       />
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="col-sm-2"></div>
            </div>
        );
    }
}

export default ResultsTableTable;