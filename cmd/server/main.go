package main

import (
	"fashiondemon/internal/config"
	"fashiondemon/internal/order"
	"fashiondemon/internal/product"
	"fashiondemon/internal/user"
	"net/http"
)

func main() {
	config.InitDB()

	runMigrations()

	order.Migrate()

	mux := http.NewServeMux()
	user.RegisterRoutes(mux)
	product.RegisterRoutes(mux)
	order.RegisterRoutes(mux)

	// CORS Middleware
	corsMux := enableCORS(mux)

	http.ListenAndServe(":8080", corsMux)
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func runMigrations() {
	config.DB.AutoMigrate(
		&product.Category{},
		&product.Product{},
		&user.User{},
	)
}
