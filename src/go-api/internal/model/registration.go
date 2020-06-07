package model

import "time"

type Registration struct {
	ID        int       `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Surname   string    `json:"surname" db:"surname"`
	Gender    string    `json:"gender" db:"gender"`
	Amount    int       `json:"amount" db:"amount"`
	Payed     *int      `json:"payed" db:"payed"`
	Token     string    `json:"token" db:"token"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
