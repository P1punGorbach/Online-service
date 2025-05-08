package repository

import (
  "database/sql"
  "github.com/P1punGorbach/backend/internal/models"
)

type ProductRepo struct{ DB *sql.DB }

func NewProductRepo(db *sql.DB) *ProductRepo {
  return &ProductRepo{DB: db}
}

func (r *ProductRepo) GetAll() ([]models.Product, error) {
  rows, err := r.DB.Query(`SELECT id, name, description, price, brand_id, category_id FROM products`)
  if err != nil {
    return nil, err
  }
  defer rows.Close()

  var out []models.Product
  for rows.Next() {
    var p models.Product
    if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Price, &p.BrandID, &p.CategoryID); err != nil {
      return nil, err
    }
    out = append(out, p)
  }
  return out, nil
}
