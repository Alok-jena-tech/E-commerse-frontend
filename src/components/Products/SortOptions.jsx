import React from 'react'
import { useSearchParams } from 'react-router-dom'
const SortOptions = () => {
  const [searchParams,setSearchParams] = useSearchParams();
  // whatever value in searchParams ,it will automatic show in url as query params so this is the use of useSearchParams
  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy);
    setSearchParams(searchParams);
    // Handle the sort change logic here
  };

  return (
    <div className='mb-4 flex items-center justify-end'>
        <select id='sort' onChange={handleSortChange} value={searchParams.get("sortBy") || ""} className='border focus:outline-none rounded-md p-2'>
            <option value=''>Default</option>
            <option value='priceAsc'>Price:Low to High</option>
            <option value='priceDesc'>Price:High to Low</option>
            <option value="popularity">Popularity</option>
        </select>
    </div>
  )
}

export default SortOptions
