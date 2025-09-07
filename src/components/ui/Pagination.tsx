"use client" ;


interface PaginationProps{
  currentPage:number;
  totalPages:number;
  onPageChange:(page:number)=> void;
}

export default function Pagination({currentPage,totalPages,onPageChange}:PaginationProps){
  if(totalPages<1)return null;
  const pages= Array.from({length:totalPages},(_,i)=>i+1);
  return (
    <div className="flex gap-2 mt -4 justify-center">
      <button 
        disabled={currentPage===1}
        onClick={()=>onPageChange(currentPage-1)}
        className="px-3 py-1 border rounded disabled:opacity-50">
          Prev
        </button>
        {pages.map((page)=>(
          <button
          key={page}
          onClick={()=>onPageChange(page)}
          className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-blue-600 text-white' : ''}`}
          >
            {page}
          </button>
        ))}
         <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}
