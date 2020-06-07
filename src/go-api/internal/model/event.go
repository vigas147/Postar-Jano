package model

type Event struct {
	ID          int     `json:"id" db:"id"`
	Title       string  `json:"title" db:"title"`
	Description string  `json:"description" db:"description"`
	DateFrom    string  `json:"date_from" db:"date_from"`
	DateTo      string  `json:"date_to" db:"date_to"`
	Location    string  `json:"location" db:"location"`
	MinAge      int     `json:"min_age" db:"min_age"`
	MaxAge      int     `json:"max_age" db:"max_age"`
	Info        *string `json:"info" db:"info"`
	Photo       string  `json:"photo" db:"photo"`
	Time        *string `json:"time" db:"time"`
	Price       *string `json:"price" db:"price"`
	EventOwner  `json:"owner"`
	Days        []Day `json:"days"`
}

type Day struct {
	ID          int    `json:"id" db:"id"`
	Description string `json:"description" db:"description"`
	Capacity    int    `json:"capacity" db:"capacity"`
	LimitBoys   *int   `json:"limit_boys" db:"limit_boys"`
	LimitGirls  *int   `json:"limit_girls" db:"limit_girls"`
	Price       int    `json:"price" db:"price"`
}

type EventOwner struct {
	OwnerName    string `json:"name" db:"owner_name"`
	OwnerSurname string `json:"surname" db:"owner_surname"`
	OwnerEmail   string `json:"email" db:"owner_email"`
	OwnerPhone   string `json:"phone" db:"owner_phone"`
	OwnerPhoto   string `json:"photo" db:"owner_photo"`
	OwnerGender  string `json:"gender" db:"owner_gender"`
}
