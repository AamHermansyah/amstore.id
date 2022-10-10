import Layout from "../widget/Layout";
import Card from "../components/Card";
import { useContext, useEffect, useState } from "react";
import CardSkeleton from "../widget/CardSkeleton";
import Banner from "../components/Banner";
import { getRandomNum } from "../utils";
import { GlobalContext } from "../context/GlobalContextProvider";

export default function Home(){
  const { state, handleFunction } = useContext(GlobalContext);
  const { fetchStatusProducts, setFetchStatusProducts, userCookie } = state;
  const { handleTotalCheckout } = handleFunction;

  const [dataProducts, setDataProducts] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [randomProductId, setRandomProductId] = useState([]);

  const [limitPagination, setLimitPagination] = useState(5);
  const [paginationFetchStatus, setPaginationFetchStatus] = useState(true);
  const [isLastPagination, setIsLastPagination] = useState(false);

  const [fetchRandomProductsStatus, setFetchRandomProductsStatus] = useState(true);

  const getDataProducts = async () => {
      try {
        const res = await fetch(`https://service-example.sanbercloud.com/api/product`);
        let data = await res.json();
        if(data){
          data = data.filter(product => product.available > 0);
          setDataProducts(data);
          setDataLength(data.length);
          setPaginationFetchStatus(prevBool => !prevBool)
        }
      } catch (error) {
        alert(error);
      }
    }

  const handlePaginationButton = () => {
    setPaginationFetchStatus(prevBool => !prevBool);
    setTimeout(() => {
      setLimitPagination(prev => {
          prev + 5 >= dataProducts.length && setIsLastPagination(true);
          return prev + 5;
      });
      setPaginationFetchStatus(prevBool => !prevBool);
    }, 2000)
  }

  const fetchGetRandomProductsId = () => {
    setRandomProductId(getRandomNum(dataLength, dataLength < 6 ? dataLength : 6));
    setFetchRandomProductsStatus(false);
  };
  
  useEffect(() => {
    if(dataLength !== 0 && fetchRandomProductsStatus){
      fetchGetRandomProductsId();
    }
  }, [dataLength, fetchGetRandomProductsId, fetchRandomProductsStatus]);

  useEffect(() => {
    !fetchStatusProducts && setFetchStatusProducts(true);
  }, []);

  useEffect(() => {
    if(fetchStatusProducts){
      getDataProducts();
      if(userCookie !== undefined) {
        handleTotalCheckout();
      }
      setFetchStatusProducts(prevBool => !prevBool);
    }
  }, [fetchStatusProducts, handleTotalCheckout, setFetchStatusProducts, userCookie]);

  return (
    <>
      <Layout>
        <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
          <Banner />
        </div>

        <div className="p-10 my-10">
          <h1 className="mb-4 font-semibold text-[1.5rem]">Recomendation Products</h1>
          <div className="flex flex-wrap gap-4 md:gap-10 justify-center mt-10">
            {randomProductId
              .map(index => (
                <Card key={index} data={dataProducts[index]} />
              ))}
          </div>
        </div>

        <main className="p-10 sm:mt-10">
          <h1 className="font-bold md:text-[2rem] text-[1.5rem] text-center">All Products</h1>
          <div className="flex flex-wrap gap-4 md:gap-10 justify-center mt-10">
            {dataProducts.length !== 0 && dataProducts
              .filter((product, index) => product.available > 0 && index < limitPagination)
              .map(product => (
                <Card key={product.id} data={product} />
              ))
            }
          </div>
          { paginationFetchStatus ?
              <CardSkeleton /> :
              <div className="flex justify-center">
                <button type="button"
                className={`${isLastPagination ? 'hidden' : ''} py-2.5 mt-10 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-slate-100 rounded-lg border border-gray-300 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
                onClick={handlePaginationButton}>
                  Load more
                </button>
              </div>
              }          
          </main>
        </Layout>
    </>
  )
}
