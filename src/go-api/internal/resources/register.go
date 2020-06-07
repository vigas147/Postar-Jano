package resources

type RegisterReq struct {
	Name    string `json:"name"`
	Surname string `json:"surname"`
	DayIDs  []int  `json:"day_ids"`
}
