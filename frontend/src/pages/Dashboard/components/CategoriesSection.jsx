import CategoryCard from "../../../components/CategoryCard";

function CategoriesSection({ loading, filteredCategories, searchQuery, onSelectCategory }) {
  return (
    <section id="categories-section" className="dashboard-section">
      <div className="section-header">
        <div>
          <h3 className="section-title">Explore Categories</h3>
          <p className="section-subtitle">Choose a topic and start practicing.</p>
        </div>
        <span className="section-count">{filteredCategories.length} available</span>
      </div>

      {loading ? (
        <div className="loading-card">
          <div className="spinner"></div>
          <p>Loading categories...</p>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="categories-flex-wrap">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category._id}
              name={category.name}
              onClick={() => onSelectCategory(category._id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <p className="empty-state-title">No categories found</p>
          <p className="empty-state-text">
            {searchQuery ? `No categories match "${searchQuery}"` : "No categories are currently available."}
          </p>
        </div>
      )}
    </section>
  );
}

export default CategoriesSection;
