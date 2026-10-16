function CategoryCard({ name, onClick }) {
  return (
    <button type="button" className="category-card" onClick={onClick}>
      {name}
    </button>
  );
}

export default CategoryCard;
