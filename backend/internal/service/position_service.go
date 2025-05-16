package service

import (
	"context"

	"github.com/P1punGorbach/backend/internal/models"
)

type PositionRepo interface {
	GetAll(ctx context.Context) ([]models.Position, error)
}

type PositionService struct {
	repo PositionRepo
}

func NewPositionService(r PositionRepo) *PositionService {
	return &PositionService{repo: r}
}

func (s *PositionService) ListPositions(ctx context.Context) ([]models.Position, error) {
	return s.repo.GetAll(ctx)
}
