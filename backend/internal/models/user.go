package models

import (
	"time"

	"github.com/google/uuid"	
)

type User struct {
	ID           int `db:"id" json:"id" ` // или string, если вы не используете uuid
	Email        string    `db:"email" json:"email"`
	PasswordHash string    `db:"password_hash" json:"password_hash"`
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time `db:"updated_at" json:"updated_at"`
	IsAdmin      bool      `db:"is_admin" json:"is_admin"` // e.g., "admin", "user", etc.
	IsActive     bool      `db:"is_active" json:"is_active"` // whether the user is active
}
type UserProfile struct {	
	UserID     uuid.UUID `db:"user_id"`	// внешний ключ на таблицу пользователей
	Name       string    `db:"name"`	// имя пользователя
	HeightCm   int       `db:"height_cm"` // рост в сантиметрах		// например, 180
	WeightKg   int       `db:"weight_kg"` // вес в килограммах			// например, 75		// Дата рождения
	PositionName string       `db:"position_name"` // id позиции в таблице позиций		
}
