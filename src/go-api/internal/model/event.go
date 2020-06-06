package model

type Event struct {
	ID        int    `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	OwnerName string `json:"owner_name" db:"owner_name"`
}
