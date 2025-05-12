package models

type Product struct {
  ID          int     `json:"id"`
  Name        string  `json:"name"`
  Description string  `json:"description"`
  BrandID     int     `json:"brand_id"`
  Price      float64  `json:"price"`
  CategoryID  int     `json:"category_id"`
}
type ProductInput struct {
	Name         string   `json:"name"`
	CategoryID   int      `json:"categoryId"`
	BrandID      int      `json:"brandId"`
	Description  string   `json:"description"`
	GrowthMin    int      `json:"growthMin"`
	GrowthMax    int      `json:"growthMax"`
	WeightMin    int      `json:"weightMin"`
	WeightMax    int      `json:"weightMax"`
	PositionIDs  []int    `json:"positionIds"`
	BallSize     string   `json:"ballSize"`
	TopType      string   `json:"topType"`
	BottomType   string   `json:"bottomType"`
	AccessoryType string  `json:"accessoryType"`
	StoreLinks   []string `json:"storeLinks"`
}
