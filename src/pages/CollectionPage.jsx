import React from "react";
import { useEffect, useState, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import { useDispatch,useSelector } from "react-redux";
const CollectionPage = () => {
  const {collection}=useParams();
  // console.log("CollectionPage collection param:",collection);
  const [searchParams]=useSearchParams();
  // searchParams is present in three components like collectionPage,Filtersidebar,SortOptions 
  // so when new params add in any component all searchParams will change same.so when state change component will render.
  // so when in any component param change collectionPage will render.
  const dispatch=useDispatch();
  
  const {products,loading,error}=useSelector((state)=>state.products);
  const queryParams=Object.fromEntries([...searchParams]);

  const sidebarRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(()=>{
    dispatch(fetchProductsByFilters({collection,...queryParams}));
  },[dispatch,collection,searchParams]);

  // toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };
  useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  return (
    <div className="flex flex-col lg:flex-row">
      {/* mobile filter button */}
      <button
        className="lg:hidden border p-2 flex justify-center items-center"
        onClick={toggleSidebar}
      >
        <FaFilter className="mr-2" />
      </button>
      {/* filter sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 z-50 left-0  w-64  overflow-y-auto  transform transition-transform duration-300 ease-in-out bg-white lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <FilterSidebar />
        
      </div>
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4 ">All Collection</h2>
        {/* Sort options */}
        <SortOptions />
        
        {/* product Grid */}
        <ProductGrid products={products} loading={loading} error={error}/>
      </div>
    </div>
  );
};

export default CollectionPage;
