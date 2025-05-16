package models

// Category представляет категорию товара.
type Category struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Slug     string  `json:"slug"`
	ParentID *int    `json:"parentId"` // nil, если нет родителя
}
