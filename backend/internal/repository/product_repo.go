package repository

import (
	"context"
	"database/sql"
	"log"

	"github.com/P1punGorbach/backend/internal/models"
)

type ProductRepo struct{ DB *sql.DB }

func NewProductRepo(db *sql.DB) *ProductRepo {
	return &ProductRepo{DB: db}
}

func (r *ProductRepo) GetAll() ([]models.Product, error) {
	rows, err := r.DB.Query(`
  SELECT id, name, price, description, price, brand_id, category_id
  FROM products
`)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []models.Product
	for rows.Next() {
		var p models.Product
		log.Println("🔎 Ищем продукт в БД")
		if err := rows.Scan(
			&p.ID,
			&p.Name,
			&p.Price,
			&p.Description,
			&p.Price,
			&p.BrandID,
			&p.CategoryID,
		); err != nil {
			log.Println("Ошибка при сканировании продукта:", err)
			return nil, err
		}
		log.Println("Продукт найден:", p)
		out = append(out, p)
	}

	return out, nil
}
func (r *ProductRepo) Create(ctx context.Context, in models.ProductInput) error {
	tx, err := r.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		} else {
			_ = tx.Commit()
		}
	}()
	var price float64
	for i, link := range in.StoreLinks {
		if link.Price <= 0 {
			continue
		}
		if i == 0 || link.Price < price || price == 0 {
			price = link.Price
		}
	}
	var productID int
	category := in.SubcatID
	if category == 0 {
		category = in.CategoryID
	}
	err = tx.QueryRowContext(ctx, `
		INSERT INTO products (
			name, category_id, brand_id, description, 
			ball_size, subcat_id, price
		)
		VALUES ($1,$2,$3,$4,$5,$6,$7)
		RETURNING id
	`,
		in.Name,
		category,
		in.BrandID,
		in.Description,

		in.BallSize,
		in.SubcatID,
		price,
	).Scan(&productID)
	if err != nil {
		return err

	}

	// Вставка диапазона роста

	_, err = tx.ExecContext(ctx, `
			INSERT INTO product_growth_ranges (product_id, min_cm, max_cm)
			VALUES ($1, $2, $3)
		`, productID, in.GrowthMin, in.GrowthMax)
	if err != nil {
		return err
	}

	// Вставка диапазона веса (если у тебя есть product_weight_ranges — аналогично)

	// Вставка позиций (если есть product_positions)
	if len(in.PositionIDs) > 0 {
		for _, posID := range in.PositionIDs {
			_, err = tx.ExecContext(ctx, `
				INSERT INTO product_positions (product_id, position_id)
				VALUES ($1, $2)
			`, productID, posID)
			if err != nil {
				return err
			}
		}
	}
	for _, link := range in.StoreLinks {
		if link.URL == "" || link.Price <= 0 {
			continue
		}
		_, err = tx.ExecContext(ctx, `
    INSERT INTO product_store_links (product_id, url, price)
    VALUES ($1, $2, $3)
  `, productID, link.URL, link.Price)
		if err != nil {
			return err
		}
	}
	for i, url := range in.ImageURL {
		if url == "" {
			continue
		}
		_, err := tx.ExecContext(ctx, `
    INSERT INTO product_images (product_id, url, sort_order)
    VALUES ($1, $2, $3)
  `, productID, url, i)
		if err != nil {
			return err
		}
	}

	return nil

}
func (r *ProductRepo) GetProductByID(ctx context.Context, id int) (*models.Product, error) {
	row := r.DB.QueryRowContext(ctx, `
		SELECT id, name, description, price, brand_id, category_id, subcat_id, ball_size
		FROM products
		WHERE id = $1
	`, id)

	var p models.Product
	var err error // ← добавь это

	err = row.Scan(
		&p.ID,
		&p.Name,
		&p.Description,
		&p.Price,
		&p.BrandID,
		&p.CategoryID,
		&p.SubcatID,
		&p.BallSize,
	)
	if err != nil {
		return nil, err
	}

	// Получить изображения товара
	rows, err := r.DB.QueryContext(ctx, `
		SELECT url FROM product_images
		WHERE product_id = $1
		ORDER BY sort_order
	`, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var images []string
	for rows.Next() {
		var url string
		if err := rows.Scan(&url); err != nil {
			return nil, err
		}
		images = append(images, url)
	}

	p.ImageURL = images
	return &p, nil
}
