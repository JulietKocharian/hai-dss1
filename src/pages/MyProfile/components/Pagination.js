import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage = 4,
  totalItems = 0 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    range.push(1);

    // Add pages around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Add dots where there are gaps
    let prev = 0;
    for (const page of range) {
      if (page - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if (page - prev !== 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(page);
      prev = page;
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mt-8 px-4">
      {/* Items info */}
      <div className="text-sm text-white/60">
        Ցուցադրվում է <span className="font-medium text-white">{startItem}-{endItem} - ը </span> {' '}
        <span className="font-medium text-white">{totalItems}</span> նախագծից
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300
            ${currentPage === 1 
              ? 'border-white/20 text-white/40 cursor-not-allowed' 
              : 'border-white/30 text-white hover:border-[#1c92d2] hover:bg-[#1c92d2]/20 hover:text-[#1c92d2]'
            }
          `}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <div 
                  key={`dots-${index}`}
                  className="flex items-center justify-center w-10 h-10 text-white/40"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              );
            }

            const isActive = page === currentPage;
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-xl border text-sm font-medium transition-all duration-300
                  ${isActive
                    ? 'border-[#1c92d2] bg-gradient-to-r from-[#1c92d2] to-[#0ea5e9] text-white shadow-lg shadow-[#1c92d2]/25'
                    : 'border-white/30 text-white hover:border-[#1c92d2] hover:bg-[#1c92d2]/20 hover:text-[#1c92d2]'
                  }
                `}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300
            ${currentPage === totalPages 
              ? 'border-white/20 text-white/40 cursor-not-allowed' 
              : 'border-white/30 text-white hover:border-[#1c92d2] hover:bg-[#1c92d2]/20 hover:text-[#1c92d2]'
            }
          `}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick jump (optional - for large datasets) */}
      {totalPages > 10 && (
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-white/60">Անցնել դեպի:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }}
            className="w-16 px-2 py-1 bg-white/5 border border-white/30 rounded-lg text-white text-center focus:outline-none focus:border-[#1c92d2] focus:ring-1 focus:ring-[#1c92d2]/50"
          />
        </div>
      )}
    </div>
  );
};