import React, { useEffect, useRef } from "react";
import qs from "qs";
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";

import { sortList } from "../components/Sort";
import Sort from "../components/Sort";
import Categories from "../components/Categories";
import PizzaBlock from "../components/PizzaBlock";
import Sceleton from "../components/PizzaBlock/Sceleton";
import Pagination from "../components/Pagination";

import {
  selectFilter,
  setCategoryId,
  setCurrentPage,
  setFilters,
} from "../redux/slices/filterSlice";
import {  SearchPizzaParams, fetchPizzas, selectPizzaData } from "../redux/slices/pizzaSlice";
import { useAppDispatch } from "../redux/store";



const Home:React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const isSearch = useRef(false);
  const isMounted = useRef(false);
  const { categoryId, sort, currentPage, searchValue } =
    useSelector(selectFilter);

  const { items, status } = useSelector(selectPizzaData);


  const onChangingCategory = React.useCallback(
    (idx: number) => {
      dispatch(setCategoryId(idx));
    },
    []
  );

  const onChangePage = (page:number) => {
    dispatch(setCurrentPage(page));
  };
  const getPizzas = async () => {
    const sortBy = sort.sortProperty.replace("-", "");
    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `search=${searchValue}` : "";

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage:String(currentPage),
      })
    );
    window.scrollTo(0, 0);
  };

  // Если изменили параметры и был первый рендер
  useEffect(() => {
    if (isMounted.current) {
     const params = {
        sortProperty: sort.sortProperty,
        categoryId: categoryId >0 ? categoryId : null,
        currentPage,
      };

      const queryString = qs.stringify(params, {skipNulls:true})
      navigate(`?${queryString}`);
    }
 if(!window.location.search) {
  dispatch(fetchPizzas({} as SearchPizzaParams))
 }
  }, [categoryId, searchValue, currentPage, sort.sortProperty]);

  useEffect(() => {
    getPizzas();
  }, []);


  // Если был первый рендер, то проверяем URl-параметры и сохраняем в редуксе
  useEffect(() => {
    if (window.location.search) {
      const params =( qs.parse(window.location.search.substring(1)) as unknown) as SearchPizzaParams;
      const sort = sortList.find(
        (obj) => obj.sortProperty === params.sortBy
      );
  
      dispatch(
        setFilters({searchValue: params.search,
          categoryId: Number(params.category),
        currentPage: Number(params.currentPage),
      sort: sort || sortList[0]})
      );
      isMounted.current = true;
    }
  }, []);

  // Если был первый рендер, то запрашиваем пиццы
  React.useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      getPizzas();
    }

    isSearch.current = false;
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  const sceletons = [...new Array(10)].map((_, indexLoading) => (
    <Sceleton key={indexLoading} />
  ));
  const pizzas = items.map((obj:any) => <PizzaBlock key={obj.id} {...obj} />);
  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangingCategory} />
        
        <Sort value={sort} /> 
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === "error" ? (
        <div className="content_error-info">
          <h2>Произошла ошибка 🧐</h2>
          <p>
            К сожалению,не удалось получить пиццы. Попробуйте повторить попытку
            позже
          </p>
        </div>
      ) : (
        <div className="content__items">
          {status === "loading" ? sceletons : pizzas}
        </div>
      )}

      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
