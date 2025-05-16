package repository

import (
    "context"
    "database/sql"

    "github.com/P1punGorbach/backend/internal/models"
)

type CategoryRepo struct{ DB *sql.DB }

func NewCategoryRepo(db *sql.DB) *CategoryRepo {
    return &CategoryRepo{DB: db}
}

func (r *CategoryRepo) GetAll(ctx context.Context) ([]models.Category, error) {
    rows, err := r.DB.QueryContext(ctx, `
        SELECT id, "name", slug, parent_id
        FROM categories
        WHERE parent_id IS NULL
        ORDER BY "name"
    `)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var out []models.Category
    for rows.Next() {
        var c models.Category
        if err := rows.Scan(&c.ID, &c.Name, &c.Slug, &c.ParentID); err != nil {
            return nil, err
        }
        out = append(out, c)
    }
    return out, nil
}
func GetSubcategories(ctx context.Context, db *sql.DB, parentID int) ([]models.Category, error) {
    rows, err := db.QueryContext(ctx, `
        SELECT id, "name", slug, parent_id
        FROM categories
        WHERE parent_id = $1
        ORDER BY "name"
    `, parentID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var out []models.Category
    for rows.Next() {
        var c models.Category
        if err := rows.Scan(&c.ID, &c.Name, &c.Slug, &c.ParentID); err != nil {
            return nil, err
        }
        out = append(out, c)
    }
    return out, nil
}
