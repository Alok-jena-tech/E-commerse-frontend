import React, { useEffect,useState } from 'react'
import Hero from '../components/Layout/Hero'
import NewArrivals from '../components/Products/NewArrivals'
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturedSection from '../components/Products/FeaturedSection'
import axios from 'axios'
import { useDispatch,useSelector } from 'react-redux'
import { fetchProductsByFilters } from '../redux/slices/productsSlice'

const Home = () => {
  const dispatch = useDispatch();
  const {products,loading,error}=useSelector((state)=>state.products);
    // console.log("products in Home:", products);

  const [bestSellerProduct,setBestSellerProduct]=useState(null);

  useEffect(()=>{
    // Fetch products for a specific collection
   dispatch(fetchProductsByFilters({ gender:"Women",category:"Bottom Wear",limit:8}));
  //  Fetch best seller products
  const fetchBestSellers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
      );
      setBestSellerProduct(response.data);
    } catch (error) {
      console.error("Error fetching best sellers:", error);
    }
  }
    fetchBestSellers();
  }, [dispatch]);
  return (
    <div>
      <Hero/>
      <GenderCollectionSection/>
      <NewArrivals/>
      {/* best seller */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Sellers</h2>
      {bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id} />) : (<p className='text-center'>Loading best seller product...</p>)}
      <div className="max-w-[84.5vw]  mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">Top Wears for Women</h2>
          <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCollection/>
      <FeaturedSection/>
    </div>
  )
}

export default Home
