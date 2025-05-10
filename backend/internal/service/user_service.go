// internal/service/user_service.go
package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/P1punGorbach/backend/internal/auth"
	"github.com/P1punGorbach/backend/internal/models"
	"github.com/P1punGorbach/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrUserAlreadyExists  = errors.New("пользователь с такой почтой уже существует")
	ErrInvalidCredentials = errors.New("неверная почта или пароль")
)

type UserService struct {
	repo UserRepository // твой репозиторий
}

type UserRepository interface {
	Create(ctx context.Context, user *models.User) error
	GetByEmail(ctx context.Context, email string) (*models.User, error)
	GetByID(ctx context.Context, id int) (*models.User, *models.UserProfile, error)
	CreateProfile(ctx context.Context, userID int) error
	UpdateProfile(ctx context.Context, userID int, in models.UpdateProfileInput ) error
	ListAll(ctx context.Context) ([]models.User, error)
	Delete(ctx context.Context, id int) error
	// другие методы, которые тебе нужны
}

func NewUserService(r *repository.UserRepo) *UserService {
	return &UserService{repo: r}
}

// RegisterInput — структура входных данных
type RegisterInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}
type AdminCreateUserInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"is_admin"`
}

// Register создаёт пользователя, хеширует пароль и сохраняет в БД
func (s *UserService) Register(ctx context.Context, in RegisterInput) (*models.User, error) {
	// Проверяем, существует ли пользователь с таким email
	existingUser, err := s.repo.GetByEmail(ctx, in.Email)
	if err != nil && !errors.Is(err, repository.ErrNotFound) {
		return nil, err
	}
	if existingUser != nil {
		return nil, ErrUserAlreadyExists
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(in.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:        in.Email,
		PasswordHash: string(hash),
	}

	if err := s.repo.Create(ctx, user); err != nil {
		return nil, err
	}
	fmt.Println("✅ ID нового пользователя:", user.ID)
	// 🔽 Добавь это:
	if err := s.repo.CreateProfile(ctx, user.ID); err != nil {
		return nil, fmt.Errorf("ошибка при создании профиля: %w", err)
	}

	return user, nil
}

type LoginInput struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (s *UserService) Login(ctx context.Context, in LoginInput) (*models.User, string, error) {
	// Ищем пользователя по email
	user, err := s.repo.GetByEmail(ctx, in.Email)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, "", ErrInvalidCredentials
		}
		return nil, "", err
	}

	// Сравниваем хеш пароля
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(in.Password)); err != nil {
		return nil, "", ErrInvalidCredentials
	}
	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}
func (s *UserService) GetUserInfo(ctx context.Context, token string) (*models.User, *models.UserProfile, error) {

	userID, err := auth.ParseToken(token)
	if err != nil {
		fmt.Println("❌ ParseToken вернул ошибку:", err)
		return nil, nil, err
	}
	user, profile, err := s.repo.GetByID(ctx, userID)
	if err != nil {
		return nil, nil, err
	}
	fmt.Println("✅ Распарсили userID:", userID)
	return user, profile, nil
}
func (s *UserService) UpdateProfile(ctx context.Context, userID int, in models.UpdateProfileInput) error {
	return s.repo.UpdateProfile(ctx, userID, in)
}
func (s *UserService) ListAll(ctx context.Context) ([]models.User, error) {
	return s.repo.ListAll(ctx)
}
func (s *UserService) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}
func (s *UserService) AdminCreateUser(ctx context.Context, input AdminCreateUserInput) (*models.User, error) {
	existing, err := s.repo.GetByEmail(ctx, input.Email)
	if err != nil && !errors.Is(err, repository.ErrNotFound) {
		return nil, err
	}
	if existing != nil {
		return nil, ErrUserAlreadyExists
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:        input.Email,
		PasswordHash: string(hash),
		IsAdmin:      input.IsAdmin,
	}

	if err := s.repo.Create(ctx, user); err != nil {
		return nil, err
	}

	// создаём пустой профиль
	if err := s.repo.CreateProfile(ctx, user.ID); err != nil {
		return nil, fmt.Errorf("ошибка создания профиля: %w", err)
	}

	return user, nil
}
