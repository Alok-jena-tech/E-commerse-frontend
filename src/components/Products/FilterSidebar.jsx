import React from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });
  // console.log("Search Params:", searchParams);

  const [priceRange, setPriceRange] = React.useState([0, 100]);
  const categories = ["Top Wear", "Bottom Wear"];
  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
    "Beige",
    "Navy",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = [
    "Cotton",
    "Wool",
    "Denim",
    "Polyester",
    "Silk",
    "Linen",
    "Viscose",
    "Fleece",
  ];
  const brands = [
    "Urban Threads",
    "Modern Fit",
    "Street Style",
    "Beach Breeze",
    "Fashionista",
    "ChicStyle",
  ];
  const genders = ["Men", "Women"];
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 100,
    });
    setPriceRange([0, params.maxPrice || 100]);
  }, [searchParams]);

  const handleFilterChange=(e)=>{
    const {name,value,checked,type}=e.target;
    // console.log("okkkkk",{name,value,checked,type})

    let newFilters={...filters};

    if(type==="checkbox"){
      if(checked){
        newFilters[name]=[...(newFilters[name] || []), value];
      }else{
        newFilters[name]=newFilters[name].filter((item)=>item!==value);
      }
    }else{
      newFilters[name]=value;
    }
    setFilters(newFilters);
    console.log(newFilters)
    updateURLParams(newFilters);
  }

  const updateURLParams=(newFilters)=>{
    const params=new URLSearchParams();
    Object.keys(newFilters).forEach((key)=>{
      if(Array.isArray(newFilters[key]) && newFilters[key].length>0){
        params.append(key,newFilters[key].join(",")); //"XS,S,L"

      }else if(newFilters[key]){
        params.append(key,newFilters[key]);
      }
    })
    setSearchParams(params);
    navigate(`?${params.toString()}`);
     //?category=Top+Wear&size=XS%2CS      //%2c means ,
    // here first ,after onchange handlefilterchange will run then  set all data in filters
    // then updateURLparams will run as we have to send the query parameter in url so 
    // in updateURLParams ,by the help of new URLSearchParams all filter add will append then convert in string then nagivate that string 
    // for fetching according filter data and here setSearchPatams with params as we will set all query parameter in useSearchParams so it help for 
    // make key and value fame then we can create object by the help of Object.fromEntries() what we have selected for filter.then again set in filter 
    // *** by the help of setSearchParams we can set the query params .whatever set params in setSearchParams it will set in searchParams and it will show in url automatic .
    // it is the power of usesearchparams.so we do not need navigate to put tha param string in url. 
    // so Usesearchparams help to set the query param in url and URLSearchParam help to create the queryparam
  }

  const handlePriceChange=(e)=>{
    const newPrice=e.target.value;
    setPriceRange([0,newPrice]);
    const newFilters={...filters,minPrice:0,maxPrice:newPrice};
    setFilters(newFilters);
    updateURLParams(newFilters);
  }
  return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Filters</h3>
      {/* Category Filter */}
      <div className="mb-6">
        <label htmlFor="" className="block text-gray-600 font-medium mb-2">
          Category
        </label>
        {categories.map((category) => (
          <div className="flex items-center mb-1" key={category}>
            <input
              type="radio"
              name="category"
              value={category}
              checked={filters.category === category}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4text-blue-500 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-gray-700 ">{category}</span>
          </div>
        ))}
      </div>
      {/* Gender Filter */}
      <div className="mb-6">
        <label htmlFor="" className="block text-gray-600 font-medium mb-2">
          Gender
        </label>
        {genders.map((gender) => (
          <div className="flex items-center mb-1" key={gender}>
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={filters.gender === gender}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4text-blue-500 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-gray-700 ">{gender}</span>
          </div>
        ))}
      </div>
      {/* Color Filter */}
      <div className="mb-6">
        <label htmlFor="" className="block text-gray-600 font-medium mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              name="color"
              value={color}
              onClick={handleFilterChange}
              className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${filters.color === color ? "ring-2 ring-blue-500" : ""}`}
              style={{ backgroundColor: color.toLocaleLowerCase() }}
            ></button>
          ))}
        </div>
      </div>
      {/* size filter */}
      <div className="mb-6">
        <label htmlFor="" className="block text-gray-600 font-medium mb-2">
          Size
        </label>
        {sizes.map((size) => (
          <div key={size} className="flex items-center mb-1">
            <input type="checkbox" name="size" value={size} onChange={handleFilterChange} checked={filters.size.includes(size)} className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />{" "}
            <span className="text-gray-700">{size}</span>
          </div>
        ))}
      </div>
      {/* material filter */}
       <div className="mb-6">
        <label htmlFor="" className="block text-gray-600 font-medium mb-2">
          Material
        </label>
        {materials.map((material) => (
          <div key={material} className="flex items-center mb-1">
            <input type="checkbox" name="material" value={material} checked={filters.material.includes(material)} onChange={handleFilterChange} className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />{" "}
            <span className="text-gray-700">{material}</span>
          </div>
        ))}
      </div>
      {/* brand filter */}
       <div className="mb-6">
        <label htmlFor="" className="block text-gray-600 font-medium mb-2">
          Brand
        </label>
        {brands.map((brand) => (
          <div key={brand} className="flex items-center mb-1">
            <input type="checkbox" name="brand" value={brand} onChange={handleFilterChange} checked={filters.brand.includes(brand)} className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />{" "}
            <span className="text-gray-700">{brand}</span>
          </div>
        ))}
      </div>
      {/* Prise range filter */}
      <div className="mb-8">
        <label htmlFor="" className="block text-gray-600 font-medium mb-2">Price Range</label>
        <input type="Range" min={0} max={100} value={priceRange[1]} onChange={handlePriceChange} name="priceRange" className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" />
        <div className="flex justify-between mt-2 text-gray-600">
          <span className="text-gray-600 text-sm">$0</span>
          <span className="text-gray-600 text-sm">${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
