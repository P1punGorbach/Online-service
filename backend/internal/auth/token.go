package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func ParseToken(token string) (int, error) {
	// Пример реализации с использованием библиотеки jwt-go
	type Claims struct {
		UserID int `json:"user_id"`
		jwt.RegisteredClaims
	}

	// Здесь нужно использовать секретный ключ, который ты использовал для подписания токена
	secretKey := []byte("your_secret_key")

	tokenObj, err := jwt.ParseWithClaims(token, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})
	if err != nil {
		return 0, err
	}

	claims, ok := tokenObj.Claims.(*Claims)
	if !ok || !tokenObj.Valid {
		return 0, errors.New("invalid token")
	}

	return claims.UserID, nil
}
func GenerateToken(userID int) (string, error) {
	// Пример реализации с использованием библиотеки jwt-go
	type Claims struct {
		UserID int `json:"user_id"`
		jwt.RegisteredClaims
	}

	secretKey := []byte("your_secret_key")
	expirationTime := time.Now().Add(24 * time.Hour)

	claims := &Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}
