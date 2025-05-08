package lust

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

type LustClient struct {
	BaseURL string
	Client  *http.Client
}

func NewLustClient(baseURL string) *LustClient {
	return &LustClient{
		BaseURL: baseURL,
		Client:  &http.Client{},
	}
}

// UploadImage загружает изображение на Lust и возвращает URL загруженного файла
func (lc *LustClient) UploadImage(filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", fmt.Errorf("ошибка открытия файла: %w", err)
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", filepath.Base(filePath))
	if err != nil {
		return "", fmt.Errorf("ошибка создания multipart: %w", err)
	}
	_, err = io.Copy(part, file)
	if err != nil {
		return "", fmt.Errorf("ошибка копирования файла: %w", err)
	}

	writer.Close()

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/upload", lc.BaseURL), body)
	if err != nil {
		return "", fmt.Errorf("ошибка создания запроса: %w", err)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := lc.Client.Do(req)
	if err != nil {
		return "", fmt.Errorf("ошибка запроса: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("ошибка загрузки изображения, статус: %s", resp.Status)
	}

	// Предполагаем, что сервис возвращает URL в теле ответа
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("ошибка чтения ответа: %w", err)
	}

	return string(respBody), nil
}

// FetchImage получает изображение по ID или пути
func (lc *LustClient) FetchImage(imageID string) ([]byte, error) {
	resp, err := lc.Client.Get(fmt.Sprintf("%s/image/%s", lc.BaseURL, imageID))
	if err != nil {
		return nil, fmt.Errorf("ошибка запроса изображения: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("изображение не найдено, статус: %s", resp.Status)
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("ошибка чтения изображения: %w", err)
	}

	return data, nil
}

// DeleteImage удаляет изображение по ID
func (lc *LustClient) DeleteImage(imageID string) error {
	req, err := http.NewRequest("DELETE", fmt.Sprintf("%s/image/%s", lc.BaseURL, imageID), nil)
	if err != nil {
		return fmt.Errorf("ошибка создания запроса на удаление: %w", err)
	}

	resp, err := lc.Client.Do(req)
	if err != nil {
		return fmt.Errorf("ошибка удаления изображения: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("не удалось удалить изображение, статус: %s", resp.Status)
	}

	return nil
}
