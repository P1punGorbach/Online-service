package repository

import (
	"context"
	"database/sql"

	"github.com/P1punGorbach/backend/internal/models"
	"github.com/lib/pq"
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
func (r *ProductRepo) Create(ctx context.Context, in models.ProductInput) error {
	_, err := r.DB.ExecContext(ctx, `
		INSERT INTO products (
			name, category_id, brand_id, description,
			growth_min, growth_max, weight_min, weight_max,
			ball_size, top_type, bottom_type, accessory_type, store_links
		)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
	`, in.Name, in.CategoryID, in.BrandID, in.Description,
		in.GrowthMin, in.GrowthMax, in.WeightMin, in.WeightMax,
		in.BallSize, in.TopType, in.BottomType, in.AccessoryType,
		pq.Array(in.StoreLinks),
	)
	return err
}
