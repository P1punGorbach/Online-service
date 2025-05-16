package service

import (
	"context"

	"github.com/P1punGorbach/backend/internal/models"
)

type ProductRepo interface {
	GetAll() ([]models.Product, error)
	Create(ctx context.Context, in models.ProductInput) error
	GetProductByID(ctx context.Context, id int) (*models.Product, error)
}

type ProductService struct {
	repo ProductRepo
}

func NewProductService(r ProductRepo) *ProductService {
	return &ProductService{repo: r}
}

func (s *ProductService) ListProducts() ([]models.Product, error) {
	return s.repo.GetAll()
}
func (s *ProductService) CreateProduct(ctx context.Context, in models.ProductInput) error {
	return s.repo.Create(ctx, in)
}
func (s *ProductService) GetProductByID(ctx context.Context, id int) (*models.Product, error) {
	return s.repo.GetProductByID(ctx, id)
}

