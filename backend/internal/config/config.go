package config

import (
	"fmt"
	"os"
	

	"github.com/joho/godotenv"
)

// Config — все параметры конфигурации вашего сервиса
type Config struct {
	// DSN для подключения к Postgres
	// например: "host=localhost port=5432 user=pguser password=pgpass dbname=mydb sslmode=disable"
	DB_DSN string

	// HTTP-порт, на котором будет слушать Gin
	Port string
}

// Load подгружает .env (если есть) и читает переменные из окружения
func Load() (*Config, error) {
	// Попробуем загрузить .env из корня проекта (не будет падать, если его нет)
	_ = godotenv.Load()

	// Собираем DSN из отдельных переменных (чтобы не пихать всё в одну строку)
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}
	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "5432"
	}
	user := os.Getenv("DB_USER")
	if user == "" {
		user = "postgres"
	}
	pass := os.Getenv("DB_PASSWORD")
	// dbname
	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		dbname = "postgres"
	}
	sslmode := os.Getenv("DB_SSLMODE")
	if sslmode == "" {
		sslmode = "disable"
	}

	// Формируем одну строку DSN
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, pass, dbname, sslmode,
	)

	// HTTP-порт
	httpPort := os.Getenv("PORT")
	if httpPort == "" {
		httpPort = "8080"
	}

	return &Config{
		DB_DSN: dsn,
		Port:  httpPort,
	}, nil
}
