package models

type ProductStoreLink struct {
  URL   string  `json:"url"`
  Price float64 `json:"price"`
}

type Product struct {
  ID          int     `json:"id"`
  Name        string  `json:"name"`
  Description string  `json:"description"`
  BrandID     int     `json:"brand_id"`
  Price      float64  `json:"price"`
  CategoryID  int     `json:"category_id"`
  SubcatID    int     `json:"subcat_id"`
  BallSize    *int    `json:"ball_size"`
  ImageURL []string `json:"images"`
  StoreLinks  []ProductStoreLink `json:"storeLinks"`
}

type ProductInput struct {
	Name         string   `json:"name"`
	CategoryID   int      `json:"categoryId"`
	SubcatID     int      `json:"subcatId"`
	BrandID      int      `json:"brandId"`
	Description  string   `json:"description"`
	GrowthMin    int      `json:"growthMin"`
	GrowthMax    int      `json:"growthMax"`
	WeightMin    int      `json:"weightMin"`
	WeightMax    int      `json:"weightMax"`
	PositionIDs  []int    `json:"positionIds"`
	BallSize     *int   `json:"ballSize"`
	TopType      string   `json:"topType"`
	BottomType   string   `json:"bottomType"`
	StoreLinks   []ProductStoreLink `json:"storeLinks"`
	ImageURL []string `json:"images"`
	
}
