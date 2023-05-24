import React, { useEffect } from "react";
import qs from "qs";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { list } from "../components/Sort";
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

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryId, sort, currentPage } = useSelector(
    (state) => state.filter
  );
  const sortType = sort.sortProperty;

  const { searchValue } = React.useContext(AppContext);
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const onChangingCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  const fetchPizzas = () => {
    setIsLoading(true);

    const sortBy = sortType.replace("-", "");
    const order = sortType.includes("-") ? "asc" : " desc";
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `search=${searchValue}` : "";

    axios
      .get(
        `https://6460b48efe8d6fb29e35726a.mockapi.io/objects?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}&${search}`
      )
      .then((res) => {
        setItems(res.data);

        setIsLoading(false);
      });
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      const sort = list.find((obj) => obj.sortProperty === params.sortProperty);
      dispatch(
        setFilters({
          ...params,
          sort,
        })
      );
    }
  }, []);

  useEffect(() => {
    window.scroll(0, 0);
  }, [categoryId, sortType, searchValue, currentPage]);

  useEffect(() => {
    const queryString = qs.stringify({
      sortProperty: sort.sortProperty,
      categoryId,
      currentPage,
    });
    navigate(`?${queryString}`);
  }, [categoryId, sortType, currentPage]);

  const sceletons = [...new Array(10)].map((_, indexLoading) => (
    <Sceleton key={indexLoading} />
  ));
  const pizzas = items.map((obj) => <PizzaBlock {...obj} />);
  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangingCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>

      <div className="content__items">{isLoading ? sceletons : pizzas}</div>
      <Pagination value={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
