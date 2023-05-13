import React from "react";

const Categories = () => {
  const [category, setCategory] = React.useState(0);
  const categories = [
    "Все",
    "Мясные",
    "Вегетарианская",
    "Гриль",
    "Острые",
    "Закрытые",
  ];

  return (
    <div class="categories">
      <ul>
        {categories.map((value, index) => (
          <li
            onClick={() => setCategory(index)}
            className={category === index ? "active" : ""}
          >
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
