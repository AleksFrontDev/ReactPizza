import React, { useEffect, useRef } from "react";
import qs from "qs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { sortList } from "../components/Sort";
import Sort from "../components/Sort";
import Categories from "../components/Categories";
import PizzaBlock from "../components/PizzaBlock";
import Sceleton from "../components/PizzaBlock/Sceleton";
import Pagination from "../components/Pagination";
import { AppContext } from "../App";
import {
  setCategoryId,
  setCurrentPage,
  setFilters,
} from "../redux/slices/filterSlice";
import { fetchPizzas } from "../redux/slices/pizzaSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearch = useRef(false);
  const isMounted = useRef(false);
  const { categoryId, sort, currentPage } = useSelector(
    (state) => state.filter
  );
  const items = useSelector((state) => state.pizza.items);
  const sortType = sort.sortProperty;

  const { searchValue } = React.useContext(AppContext);

  const [isLoading, setIsLoading] = React.useState(true);

  const onChangingCategory = React.useCallback((idx) => {
    dispatch(setCategoryId(idx));
  }, []);

  const onChangePage = (page) => {
    dispatch(setCurrentPage(page));
  };
  const getPizzas = async () => {
    setIsLoading(true);

    const sortBy = sort.sortProperty.replace("-", "");
    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `search=${searchValue}` : "";

    try {
      dispatch(
        fetchPizzas({
          sortBy,
          order,
          category,
          search,
        })
      );
    } catch (error) {
      alert("Ошибка при получении пицц");
      console.log("ERROR", error);
    } finally {
      setIsLoading(false);
    }
    window.scrollTo(0, 0);
  };

  // Если изменили параметры и был первый рендер
  useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sortType, currentPage, sort.sortProperty, navigate]);

  // Если был первый рендер, то проверяем URl-параметры и сохраняем в редуксе
  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      const sort = sortList.find(
        (obj) => obj.sortProperty === params.sortProperty
      );
      dispatch(
        setFilters({
          ...params,
          sort,
        })
      );
      isSearch.current = true;
    }
  }, [dispatch]);

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
  const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />);
  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangingCategory} />
        <Sort value={sort} />
      </div>
      <h2 className="content__title">Все пиццы</h2>

      <div className="content__items">{isLoading ? sceletons : pizzas}</div>
      <Pagination value={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
