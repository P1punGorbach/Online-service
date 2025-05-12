package repository

import (
	"database/sql"

	"github.com/P1punGorbach/backend/internal/models"
)

type BrandRepository interface {
	ListBrands() ([]models.Brand, error)
}

type brandRepo struct {
	db *sql.DB
}

func NewBrandRepo(db *sql.DB) *brandRepo {
	return &brandRepo{db: db}
}

func (r *brandRepo) ListBrands() ([]models.Brand, error) {
	rows, err := r.db.Query(`SELECT id, name, category_id FROM brands`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var brands []models.Brand
	for rows.Next() {
		var b models.Brand
		if err := rows.Scan(&b.ID, &b.Name, &b.CategoryID); err != nil {
			return nil, err
		}
		brands = append(brands, b)
	}
	return brands, nil
}
