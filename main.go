package main

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"
)

func toJSON(v interface{}) string {
	data, _ := json.Marshal(v)
	return string(data)
}

func home(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path != "/" {
		http.Error(w, "404 Not Found", http.StatusNotFound)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "405 Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	tmpl, err := template.New("index.html").
		Funcs(template.FuncMap{
			"toJSON": toJSON,
		}).
		ParseFiles("index.html")

	if err != nil {
		log.Println("ERREUR TEMPLATE :", err)
		http.Error(w, "500 Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, artists)

	if err != nil {
		log.Println("ERREUR TEMPLATE :", err)
		http.Error(w, "500 Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func main() {
	getArtists()
	getRelation()
	getLocations()
	getDates()
	GeocodeArtists()

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	http.HandleFunc("/", home)

	err := http.ListenAndServe(":8080", nil)

	if err != nil {
		log.Fatal(err)
	}
}
