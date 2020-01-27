package main

import (
	"database/sql"
	"fmt"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

type Product struct {
	brand string `json/brand`
	os    string `json/os`
}

var db *sql.DB

func serveProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	ids, ok := r.URL.Query()["id"]
	// if !ok {
	//     fmt.Println("no id")
	//     w.WriteHeader(http.StatusNotFound);
	//     return;
	// }
	id := ids[0]
	fmt.Println(id)

	switch r.Method {
	case "GET":
		w.WriteHeader(http.StatusOK)

		if ok {
			// stmt, err := db.Prepare("select brand, model, os, image, screensize from phones where id = ?")
			// if err != nil {
			//     fmt.Println(err)
			// }
			// defer stmt.Close()
			// var brand string
			// var model string
			// var os string
			// var image string
			// var screensize int
			// err = stmt.QueryRow("1").Scan(&brand, &model, &os, &image, &screensize)
			// if err != nil {
			//     fmt.Println(err)
			// }
			// fmt.Println(brand, model, os, image, screensize)
			rows, err := db.Query("select id, brand from phones")
			if err != nil {
				fmt.Println(err)
			}
			fmt.Println("reached until here")
			// defer rows.Close()
			fmt.Println(db.Ping())
			for rows.Next() {
				var id int
				var brand string
				err = rows.Scan(&id, &brand)
				if err != nil {
					fmt.Println(err)
				}
				fmt.Println(id, brand)

			}
		}
	case "POST":
		w.WriteHeader(http.StatusCreated)

	case "PUT":
		w.WriteHeader(http.StatusAccepted)

	case "DELETE":
		w.WriteHeader(http.StatusOK)

	default:
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"message": "not found"}`))
	}
}

func serveIndex(w http.ResponseWriter, r *http.Request) {
	fmt.Println("The index page has been requested")
	w.WriteHeader(http.StatusOK)
	http.ServeFile(w, r, "../index.html")
}

func main() {
	fmt.Println("Hello, Arch!")

	prepareDatabase()

	http.HandleFunc("/index", serveIndex)
	http.HandleFunc("/products", serveProduct)
	http.ListenAndServe(":8080", nil)
	defer db.Close()
}

func prepareDatabase() {
	var err error

	db, err = sql.Open("sqlite3", "./tables.db")
	if err != nil {
		fmt.Println(err)
	}
	//defer db.Close()

	sqlStmt := `
    create table if not exists phones
    (id 	INTEGER PRIMARY KEY,
    brand	CHAR(100) NOT NULL,
    model 	CHAR(100) NOT NULL,
    os 	    CHAR(10) NOT NULL,
    image 	CHAR(254) NOT NULL,
    screensize INTEGER NOT NULL
    );
	delete from phones;
    `
	_, err = db.Exec(sqlStmt)
	if err != nil {
		fmt.Printf("%q: %s\n", err, sqlStmt)
		return
	}

	tx, err := db.Begin()
	if err != nil {
		fmt.Println(err)
	}
	stmt, err := tx.Prepare("insert into phones(brand, model, os, image, screensize) values(?, ?, ?, ?, ?)")
	if err != nil {
		fmt.Println(err)
	}
	defer stmt.Close()
	_, err = stmt.Exec("Samsung", "Galaxy S10", "Android", "https://example.com", 6)
	if err != nil {
		fmt.Println(err)
	}
	tx.Commit()

	rows, err := db.Query("select id, brand from phones")
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()
	for rows.Next() {
		var id int
		var brand string
		err = rows.Scan(&id, &brand)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(id, brand)
	}
}
