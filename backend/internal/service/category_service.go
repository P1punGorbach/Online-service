package service

import (
    "context"

    "github.com/P1punGorbach/backend/internal/models"
)

type CategoryRepo interface {
    GetAll(ctx context.Context) ([]models.Category, error)
}

type CategoryService struct {
    repo CategoryRepo
}

func NewCategoryService(r CategoryRepo) *CategoryService {
    return &CategoryService{repo: r}
}

func (s *CategoryService) ListCategories(ctx context.Context) ([]models.Category, error) {
    return s.repo.GetAll(ctx)
}
