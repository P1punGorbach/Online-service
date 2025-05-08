package models

type Product struct {
  ID          int     `json:"id"`
  Name        string  `json:"name"`
  Description string  `json:"description"`
  Price       float64 `json:"price"`
  BrandID     int     `json:"brand_id"`
  CategoryID  int     `json:"category_id"`
}
