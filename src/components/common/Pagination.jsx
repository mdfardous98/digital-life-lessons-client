const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="join">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={`join-item btn ${
            currentPage === i + 1 ? "btn-active" : ""
          }`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};
export default Pagination;
