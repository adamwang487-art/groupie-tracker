package main

type Location struct {
	ID        int      `json:"id"`
	Locations []string `json:"locations"`
}

type LocationResponse struct {
	Index []Location `json:"index"`
}

type ConcertDate struct {
	ID    int      `json:"id"`
	Dates []string `json:"dates"`
}

type DateResponse struct {
	Index []ConcertDate `json:"index"`
}

type Relation struct {
	ID             int                 `json:"id"`
	DatesLocations map[string][]string `json:"datesLocations"`
}

type RelationResponse struct {
	Index []Relation `json:"index"`
}

type Coordinates struct {
	Location  string  `json:"location"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type Artist struct {
	ID           int                 `json:"id"`
	Name         string              `json:"name"`
	Image        string              `json:"image"`
	Members      []string            `json:"members"`
	Locations    []string            `json:"locations"`
	Dates        []string            `json:"dates"`
	Concerts     map[string][]string `json:"datesLocations"`
	FirstAlbum   string              `json:"firstAlbum"`
	CreationDate int                 `json:"creationDate"`
	Coordinates  []Coordinates       `json:"coordinates"`
}
