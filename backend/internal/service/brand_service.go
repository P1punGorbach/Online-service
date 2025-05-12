package service

import (
	"github.com/P1punGorbach/backend/internal/models"
	"github.com/P1punGorbach/backend/internal/repository"
)

type BrandService struct {
	repo repository.BrandRepository
}

func NewBrandService(r repository.BrandRepository) *BrandService {
	return &BrandService{repo: r}
}

func (s *BrandService) ListBrands() ([]models.Brand, error) {
	return s.repo.ListBrands()
}
