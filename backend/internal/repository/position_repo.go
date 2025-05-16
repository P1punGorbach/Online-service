package repository

import (
    "context"
    "database/sql"

    "github.com/P1punGorbach/backend/internal/models"
)

type PositionRepo struct{ DB *sql.DB }

func NewPositionRepo(db *sql.DB) *PositionRepo {
    return &PositionRepo{DB: db}
}

func (r *PositionRepo) GetAll(ctx context.Context) ([]models.Position, error) {
    rows, err := r.DB.QueryContext(ctx, `
        SELECT id, "name"
        FROM positions
        ORDER BY id
    `)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var out []models.Position
    for rows.Next() {
        var p models.Position
        if err := rows.Scan(&p.ID, &p.Name); err != nil {
            return nil, err
        }
        out = append(out, p)
    }
    return out, nil
}
