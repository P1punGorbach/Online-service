// cmd/server/main.go

package main

import (
  "log"
  "github.com/P1punGorbach/backend/internal/config"
  "github.com/P1punGorbach/backend/internal/database"
  "github.com/P1punGorbach/backend/internal/transport/http"
)

func main() {
  // 1) Загрузить конфиг
  cfg, err := config.Load()
  if err != nil {
    log.Fatalf("config load: %v", err)
  }

  // 2) Подключиться к Postgres
  pg, err := database.ConnectPostgres(cfg.DB_DSN)
  if err != nil {
    log.Fatalf("db connect: %v", err)
  }
  defer pg.Close()

  // 3) Собрать handler со всеми сервисами
  handler := http.NewHandler(pg)

  // 4) Завести все маршруты на одном Gin
  router := handler.InitRoutes()

  log.Printf("server started on :%s", cfg.Port)
  log.Fatal(router.Run(":" + cfg.Port))
}
