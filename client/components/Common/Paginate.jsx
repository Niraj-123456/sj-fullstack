import React, { useState, useEffect } from "react";

import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";

function Paginate(props) {
  const container = {
    listStyle: "none",
    display: "flex",
  };

  const styles = {
    padding: "8px 13px",
    borderRadius: "5px",
    marginLeft: "4px",
    marginRight: "4px",
    cursor: "pointer",
    border: "none",
  };

  const listStyle = {
    ...styles,
    border: "1px solid #979797",
    fontSize: "14px",
    fontWeight: "500",
  };

  const listStyleActive = {
    background: "var(--color-blue-2)",
    color: "var(--color-white)",
    border: 0,
  };
  const { pageIndex, pageSize, itemCounts, handlePageChange } = props;

  const pageRange = Math.ceil(itemCounts / pageSize);

  const pages = _.range(1, pageRange + 1);

  // return (
  //   <ReactPaginate
  //     breakLabel={"..."}
  //     previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
  //     nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
  //     onPageChange={(page) => handlePageChange(page.selected)}
  //     marginPagesDisplayed={1}
  //     pageRangeDisplayed={4}
  //     pageCount={pageSize}
  //     renderOnZeroPageCount={null}
  //     containerClassName="pagination-container"
  //     pageClassName="pagination-page"
  //     pageLinkClassName="pagination-page-link"
  //     activeClassName="pagination-active-page"
  //     previousClassName="pagination-previous"
  //     nextClassName="pagination-next"
  //     disabledClassName="pagination-disabled"
  //     breakClassName="pagination-break-label"
  //   />
  // );

  return (
    pages.length > 1 && (
      <>
        <button
          onClick={() => handlePageChange(pageIndex - 1)}
          disabled={pageIndex === 1}
          style={styles}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <ul style={{ listStyle: "none", display: "flex" }}>
          {pages.map((page) => {
            return (
              <li
                key={page}
                style={{
                  ...listStyle,
                  ...(pageIndex === page ? { ...listStyleActive } : ""),
                }}
                onClick={() => handlePageChange(page)}
                className="active"
              >
                {page}
              </li>
            );
          })}
        </ul>
        <button
          onClick={() => handlePageChange(pageIndex + 1)}
          disabled={pageIndex === pages.length}
          style={styles}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </>
    )
  );
}

export default Paginate;
