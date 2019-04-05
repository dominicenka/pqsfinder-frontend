import React, { Component } from 'react';
import '../pages/ResultsTable.css';

class Pagination extends Component {

    renderPages(page, count) {
        let pages = [];
        let firstPage = page - 2 <= 0 ? 1 : page - 2;
        let lastPage = page + 2 >= count ? count : (page < 3 ? page + (5-page) : page + 2);
        if (count > 5 && page >= count - 2) firstPage = count - 4; 
        pages.push(
            <button
                onClick={(e) => {
                    e.preventDefault();
                    this.props.handleTableChange(1, this.props.sizePerPage);
                }}
                key="first"
                disabled={page > 1 ? false : true }
                className={`pagination-btn text ${page > 1 ? "" : "disabled"}`}
                >
                First
            </button>
        );
        pages.push(
            <button
                onClick={(e) => {
                    e.preventDefault();
                    this.props.handleTableChange(page - 1, this.props.sizePerPage);
                }}
                key="prev"
                disabled={page > 1 ? false : true }
                className={`pagination-btn text ${page > 1 ? "" : "disabled"}`}
                >
                Prev
            </button>
        );
        if(page > 3) pages.push(<span key="leftMore">...</span>);
        for(let i = firstPage; i <= lastPage; i++) {
            pages.push(
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        this.props.handleTableChange(i, this.props.sizePerPage);
                    }}
                    key={i}
                    className={`pagination-btn ${page === i ? "active" : ""}`}
                    >
                    {i}
                </button>
            )
        }
        if(page < count - 2) pages.push(<span key="rightMore">...</span>);
        pages.push(
            <button
                onClick={(e) => {
                    e.preventDefault();
                    this.props.handleTableChange(page + 1, this.props.sizePerPage);
                }}
                key="next"
                disabled={page < count ? false : true}
                className={`pagination-btn text ${page < count ? "" : "disabled"}`}
                >
                Next
            </button>
        );
        pages.push(
            <button
                onClick={(e) => {
                    e.preventDefault();
                    this.props.handleTableChange(count, this.props.sizePerPage);
                }}
                key="last"
                disabled={page < count ? false : true }
                className={`pagination-btn text ${page < count ? "" : "disabled"}`}
                >
                Last
            </button>
        );
        return pages;
    }   

    render() {
      let numberOfPages = Math.round(this.props.totalCount / this.props.sizePerPage);
        return this.props.totalCount > 10 ? (
            <div className="col-md-8">
                <div className="row">
                <div className="col-md-4 pag-showMore">
                                          Items per page: 
                                          <select className="pag-select" onChange={(e) => this.props.handleTableChange(this.props.page, Number(e.target.value))}>
                                              <option value="10" key="10">10</option>
                                              <option value="20" key="20">20</option>
                                              <option value="30" key="30">30</option>
                                              <option value="40" key="40">40</option>
                                              <option value="50" key="50">50</option>
                                          </select>
                                      </div>
                <div className="pagination ">
                    <div className="pages">
                        {this.renderPages(this.props.page, numberOfPages)}
                    </div>
                </div>
                </div>
            </div>
        ) : null;
    }
}

export default Pagination;