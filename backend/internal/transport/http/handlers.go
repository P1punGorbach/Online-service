// internal/transport/http/handler.go

package http

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/P1punGorbach/backend/internal/auth"
	"github.com/P1punGorbach/backend/internal/models"
	"github.com/P1punGorbach/backend/internal/repository"
	"github.com/P1punGorbach/backend/internal/service"
	"github.com/P1punGorbach/backend/internal/lust"
	"github.com/gin-gonic/gin"
)

// Handler хранит все сервисы
type Handler struct {
	userSvc     *service.UserService
	prodSvc     *service.ProductService
	brandSvc    *service.BrandService
	categorySvc *service.CategoryService
	positionSvc *service.PositionService
	lustClient  *lust.LustClient
}

// NewHandler создаёт репо→сервисы
func NewHandler(db *sql.DB, lustClient *lust.LustClient) *Handler {
	// user
	userRepo := repository.NewUserRepo(db)
	userSvc := service.NewUserService(userRepo)
	// products
	prodRepo := repository.NewProductRepo(db)
	prodSvc := service.NewProductService(prodRepo)
	// brands
	brandRepo := repository.NewBrandRepo(db)
	brandSvc := service.NewBrandService(brandRepo)

	catRepo := repository.NewCategoryRepo(db)
	catSvc := service.NewCategoryService(catRepo)
	posRepo := repository.NewPositionRepo(db)
	posSvc := service.NewPositionService(posRepo)
	

	return &Handler{
		userSvc:     userSvc,
		prodSvc:     prodSvc,
		brandSvc:    brandSvc,
		categorySvc: catSvc,
		positionSvc: posSvc,
		lustClient:  lustClient,
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

	api.POST("/logout", h.Logout) // 👈 вот здесь

	api.POST("/user/update", middlewareAuth, h.UpdateUser)

	api.GET("/users", middlewareAuth, h.ListUsers)

	api.DELETE("/users/:id", middlewareAuth, h.DeleteUser)

	api.POST("/users", middlewareAuth, h.CreateUser)

	api.POST("/products", middlewareAuth, h.CreateProduct)

	api.GET("/brands", h.ListBrands)

	api.GET("/categories", h.ListCategories)

	api.GET("/positions", h.ListPositions)

	api.GET("/products/:id", h.GetProductByID)

	api.POST("/upload-image", h.UploadProductImage)

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
		"email":       user.Email,
		"name":        profile.Name,
		"height":      profile.HeightCm,
		"weight":      profile.WeightKg,
		"position":    profile.PositionName,
		"position_id": profile.PositionIndex,
		"is_admin":    user.IsAdmin,
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
func (h *Handler) Logout(c *gin.Context) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1, // 👈 удаление куки
		HttpOnly: true,
	})
	c.JSON(http.StatusOK, gin.H{"message": "Выход выполнен"})
}
func (h *Handler) UpdateUser(c *gin.Context) {
	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Неавторизован"})
		return
	}

	var input models.UpdateProfileInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Неверный формат данных"})
		return
	}

	err := h.userSvc.UpdateProfile(c.Request.Context(), userID.(int), input)
	if err != nil {
		log.Println("❌ Ошибка обновления профиля:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка при обновлении профиля"})
		return
	}

	// можно вернуть обновлённого пользователя
	c.JSON(http.StatusOK, gin.H{
		"name":     input.Name,
		"email":    input.Email,
		"height":   input.Height,
		"weight":   input.Weight,
		"position": input.Position,
	})
}
func (h *Handler) ListUsers(c *gin.Context) {
	users, err := h.userSvc.ListAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка загрузки пользователей"})
		return
	}
	c.JSON(http.StatusOK, users)
}
func (h *Handler) DeleteUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Некорректный ID"})
		return
	}

	err = h.userSvc.Delete(c.Request.Context(), id)
	if err != nil {
		if err == repository.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"message": "Пользователь не найден"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка удаления"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Удалено"})
}
func (h *Handler) CreateUser(c *gin.Context) {
	var in service.AdminCreateUserInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Неверный формат данных"})
		return
	}

	user, err := h.userSvc.AdminCreateUser(c.Request.Context(), in)
	if err != nil {
		if err == service.ErrUserAlreadyExists {
			c.JSON(http.StatusConflict, gin.H{"message": "Пользователь уже существует"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка создания пользователя"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":    user.ID,
		"email": user.Email,
	})
}
func (h *Handler) CreateProduct(c *gin.Context) {
	var in models.ProductInput

	if err := c.ShouldBindJSON(&in); err != nil {
		fmt.Println("❌ Ошибка валидации:", err)
		c.JSON(http.StatusBadRequest, gin.H{"message": "Некорректные данные"})
		return
	}

	err := h.prodSvc.CreateProduct(c.Request.Context(), in)
	if err != nil {
		fmt.Println("❌ Ошибка создания продукта:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка при создании товара"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Товар успешно создан"})
}

// GET /api/brands
func (h *Handler) ListBrands(c *gin.Context) {
	brands, err := h.brandSvc.ListBrands()
	if err != nil {
		c.JSON(500, gin.H{"message": "Ошибка при получении брендов"})
		return
	}
	c.JSON(200, brands)
}

// ListCategories — GET /api/categories
func (h *Handler) ListCategories(c *gin.Context) {
	list, err := h.categorySvc.ListCategories(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

// ListPositions — GET /api/positions
func (h *Handler) ListPositions(c *gin.Context) {
	list, err := h.positionSvc.ListPositions(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}
func (h *Handler) GetProductByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{"message": "Неверный ID"})
		return
	}

	product, err := h.prodSvc.GetProductByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(500, gin.H{"message": "Ошибка получения товара"})
		return
	}

	c.JSON(200, product)
}
func (h *Handler) UploadProductImage(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		log.Println("❌ Ошибка получения файла:", err)
		c.JSON(400, gin.H{"message": "Файл не получен"})
		return
	}

	path := "/tmp/" + file.Filename
	if err := c.SaveUploadedFile(file, path); err != nil {
		log.Println("❌ Ошибка сохранения файла:", err)
		c.JSON(500, gin.H{"message": "Ошибка сохранения файла"})
		return
	}

	url, err := h.lustClient.UploadImage(path)
	if err != nil {
		log.Println("❌ Ошибка загрузки в Lust:", err)
		c.JSON(500, gin.H{"message": "Ошибка загрузки в Lust"})
		return
	}
	log.Println("✅ Файл загружен в Lust:", url)
	c.JSON(200, gin.H{"url": url})
}
