package model

type Owner struct {
	ID       int    `db:"id"`
	Name     string `db:"name"`
	Surname  string `db:"surname"`
	Email    string `db:"email"`
	Login    string `db:"login"`
	Password string `db:"password"`
}
