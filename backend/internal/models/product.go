package models

type Product struct {
  ID          int     `json:"id"`
  Name        string  `json:"name"`
  Description string  `json:"description"`
  BrandID     int     `json:"brand_id"`
  CategoryID  int     `json:"category_id"`
}
