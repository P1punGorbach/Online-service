package service

import "github.com/P1punGorbach/backend/internal/models"

type ProductRepo interface {
  GetAll() ([]models.Product, error)
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
