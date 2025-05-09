// internal/repository/user_repo.go
package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/P1punGorbach/backend/internal/models"
)

var ErrNotFound = errors.New("не найдено")

type UserRepo struct {
	db *sql.DB
}

func NewUserRepo(db *sql.DB) *UserRepo {
	return &UserRepo{db: db}
}

// Create сохраняет нового пользователя в БД
func (r *UserRepo) Create(ctx context.Context, user *models.User) error {
	user.CreatedAt = time.Now()

	return r.db.QueryRowContext(ctx, `
		INSERT INTO users (email, password_hash, created_at)
		VALUES ($1, $2, $3)
		RETURNING id
	`, user.Email, user.PasswordHash, user.CreatedAt).Scan(&user.ID)

}
func (r *UserRepo) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User
	err := r.db.QueryRowContext(ctx, `
        SELECT id, email, password_hash, created_at
        FROM users WHERE email = $1
    `, email).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &user, nil
}
func (r *UserRepo) GetByID(ctx context.Context, id int) (*models.User, *models.UserProfile, error) {
	var user models.User
	var profile models.UserProfile
	fmt.Println("🔎 Ищем пользователя в БД по ID =", id)
	err := r.db.QueryRowContext(ctx, `
SELECT
    u.id,
    u.email,
    u.password_hash,
    u.is_active,
    u.created_at,
    u.updated_at,
    u.is_admin,
    up.name,
    up.height_cm,
    up.weight_kg,
    p.name -- имя позиции
FROM public.users u
INNER JOIN public.user_profiles up ON u.id = up.user_id
INNER JOIN public.positions p ON up.position_id = p.id
WHERE u.id = $1
    `, id).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.IsActive, &user.CreatedAt, &user.UpdatedAt, &user.IsAdmin, &profile.Name, &profile.HeightCm, &profile.WeightKg, &profile.PositionName)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil, ErrNotFound
		}
		return nil, nil, err
	}
	return &user, &profile, nil
}
func (r *UserRepo) CreateProfile(ctx context.Context, userID int) error {
	fmt.Println("📥 Создание профиля в БД для пользователя ID =", userID)
	_, err := r.db.ExecContext(ctx, `
		INSERT INTO user_profiles (user_id, name, height_cm, weight_kg, position_id)
		VALUES ($1, '', 0, 0, 1) 
	`, userID)
	return err
}
func (r *UserRepo) UpdateProfile(ctx context.Context, userID int, in models.UpdateProfileInput) error {
	// Пример: получаем ID позиции по имени
	var positionID int
	err := r.db.QueryRowContext(ctx, `
		SELECT id FROM positions WHERE name = $1
	`, in.Position).Scan(&positionID)
	if err != nil {
		return fmt.Errorf("позиция не найдена: %w", err)
	}

	// Обновляем профиль
	_, err = r.db.ExecContext(ctx, `
		UPDATE user_profiles
		SET name = $1,
		    height_cm = $2,
		    weight_kg = $3,
		    position_id = $4,
		    updated_at = NOW()
		WHERE user_id = $5
	`, in.Name, in.Height, in.Weight, positionID, userID)
	if err != nil {
		return fmt.Errorf("ошибка обновления профиля: %w", err)
	}

	// (по желанию) обновляем email
	_, err = r.db.ExecContext(ctx, `
		UPDATE users
		SET email = $1
		WHERE id = $2
	`, in.Email, userID)
	if err != nil {
		return fmt.Errorf("ошибка обновления email: %w", err)
	}

	return nil
}
