package resources

type RegisterReq struct {
	Name    string `json:"name"`
	Surname string `json:"surname"`
	Gender  string `json:"gender"`
	DayIDs  []int  `json:"day_ids"`
}
