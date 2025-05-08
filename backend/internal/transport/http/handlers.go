// internal/transport/http/handler.go

package http

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/P1punGorbach/backend/internal/auth"
	"github.com/P1punGorbach/backend/internal/repository"
	"github.com/P1punGorbach/backend/internal/service"
	"github.com/gin-gonic/gin"
)

// Handler хранит все сервисы
type Handler struct {
	userSvc *service.UserService
	prodSvc *service.ProductService
}

// NewHandler создаёт репо→сервисы
func NewHandler(db *sql.DB) *Handler {
	// user
	userRepo := repository.NewUserRepo(db)
	userSvc := service.NewUserService(userRepo)
	// products
	prodRepo := repository.NewProductRepo(db)
	prodSvc := service.NewProductService(prodRepo)

	return &Handler{
		userSvc: userSvc,
		prodSvc: prodSvc,
	}
}

// InitRoutes вешает ВСЕ эндпоинты на Gin
func (h *Handler) InitRoutes() *gin.Engine {
	r := gin.Default()
	api := r.Group("/api")

	// регистрация
	api.POST("/register", h.Register)
	// логин
	api.POST("/login", h.Login)
	// список продуктов
	api.GET("/products", h.ListProducts)

	api.GET("/user", middlewareAuth, h.ApiUserInfo)
	return r
}

// Входные структуры

type registerInput struct {
	Email           string `json:"email"    binding:"required,email"`
	Password        string `json:"password" binding:"required,min=6"`
	ConfirmPassword string `json:"confirmPassword"  binding:"required"`
}

type loginInput struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Register — POST /api/register
func (h *Handler) Register(c *gin.Context) {
	var in registerInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	if in.Password != in.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Пароли не совпадают"})
		return
	}

	user, err := h.userSvc.Register(c.Request.Context(), service.RegisterInput{
		Email:    in.Email,
		Password: in.Password,
	})
	if err != nil {
		if err == service.ErrUserAlreadyExists {
			c.JSON(http.StatusConflict, gin.H{"message": "Пользователь с такой почтой уже существует"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка регистрации"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Пользователь зарегистрирован",
		"id":      user.ID,
		"email":   user.Email,
	})
}

// Login — POST /api/login
func (h *Handler) Login(c *gin.Context) {
	var in loginInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	_, token, err := h.userSvc.Login(c.Request.Context(), service.LoginInput{
		Email:    in.Email,
		Password: in.Password})
	if err != nil {
		if err == service.ErrInvalidCredentials {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Неверный логин или пароль"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка авторизации"})
		}
		return
	}
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // true если HTTPS
		SameSite: http.SameSiteLaxMode,
		MaxAge:   3600, // 1 час
	})

	c.JSON(http.StatusOK, gin.H{
		"message": "Вход выполнен",
		"token":   token,
	})

}

// ListProducts — GET /api/products
func (h *Handler) ListProducts(c *gin.Context) {
	list, err := h.prodSvc.ListProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

func (h *Handler) ApiUserInfo(c *gin.Context) {
	cookie, err := c.Request.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Нет токена"})
		return
	}
	fmt.Println("✅ Токен из куки:", cookie.Value)
	user, profile, err := h.userSvc.GetUserInfo(c.Request.Context(), cookie.Value)
	if err != nil {
		fmt.Println("❌ Ошибка получения пользователя:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"email":    user.Email,
		"name":     profile.Name,
		"height":   profile.HeightCm,
		"weight":   profile.WeightKg,
		"position": profile.PositionName,
	})
}
func middlewareAuth(c *gin.Context) {

	cookie, err := c.Request.Cookie("token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Нет токена"})
		return
	}
	userID, err := auth.ParseToken(cookie.Value)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Неверный токен"})
		return
	}
	c.Set("userID", userID)
	c.Next()
}
