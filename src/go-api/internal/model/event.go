package model

type Event struct {
	ID          int     `json:"id" db:"id"`
	Title       string  `json:"title" db:"title"`
	Description string  `json:"description" db:"title"`
	DateFrom    string  `json:"date_from" db:"date_from"`
	DateTo      string  `json:"date_to" db:"date_to"`
	Location    string  `json:"location" db:"location"`
	MinAge      int     `json:"min_age" db:"min_age"`
	MaxAge      int     `json:"max_age" db:"max_age"`
	Info        *string `json:"info" db:"info"`
	Photo       string  `json:"photo" db:"photo"`
	OwnerName   string  `json:"owner_name" db:"owner_name"`
	Days        []Day   `json:"days"`
}

type Day struct {
	ID          int    `json:"id" db:"id"`
	Description string `json:"description" db:"description"`
	Capacity    int    `json:"capacity" db:"capacity"`
	LimitBoys   *int   `json:"limit_boys" db:"limit_boys"`
	LimitGirls  *int   `json:"limit_girls" db:"limit_girls"`
	Price       int    `json:"price" db:"price"`
}
