package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

// Product blablabal
type Product struct {
	ID         int64  `json:"id,omitempty"`
	Brand      string `json:"brand"`
	Model      string `json:"model"`
	OS         string `json:"os"`
	Image      string `json:"image"`
	Screensize int    `json:"screensize,string"`
}

var db *sql.DB

func serveProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil || id < 1 {
		// No ID given
		switch r.Method {
		case "GET":
			getAllProducts(w)

		case "POST":
			var product Product
			err := json.NewDecoder(r.Body).Decode(&product)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			insertProduct(w, product)

		case "DELETE":
			deleteAllProducts(w)

		default:
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(`{"message": "not found"}`))
		}
	} else {
		// ID has been given
		switch r.Method {
		case "GET":
			getProductByID(w, id)

		case "PUT":
			var product Product
			err := json.NewDecoder(r.Body).Decode(&product)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			updateProduct(w, id, product)

		case "DELETE":
			deleteProductByID(w, id)

		default:
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(`{"message": "not found"}`))
		}
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

	http.HandleFunc("/products", serveProduct)
	http.Handle("/", http.FileServer(http.Dir("../")))
	http.ListenAndServe(":3000", nil)
	defer db.Close()
}

func getAllProducts(w http.ResponseWriter) {
	rows, err := db.Query("select brand, model, os, image, screensize from phones")
	checkErr(err)
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var product Product
		err = rows.Scan(&product.Brand, &product.Model, &product.OS, &product.Image, &product.Screensize)
		checkErr(err)
		products = append(products, product)
	}

	if len(products) < 1 {
		w.Write([]byte("{}"))
	} else {
		jsonData, err := json.Marshal(products)
		checkErr(err)
		w.Write([]byte(jsonData))
	}
}

func getProductByID(w http.ResponseWriter, id int) {
	stmt, err := db.Prepare("select brand, model, os, image, screensize from phones where id = ?")
	checkErr(err)
	defer stmt.Close()

	var product Product
	err = stmt.QueryRow(strconv.Itoa(id)).Scan(&product.Brand, &product.Model, &product.OS, &product.Image, &product.Screensize)
	checkErr(err)

	jsonData, err := json.Marshal(product)
	checkErr(err)
	w.Write([]byte(jsonData))
}

func insertProduct(w http.ResponseWriter, product Product) {
	w.WriteHeader(http.StatusCreated)

	stmt, err := db.Prepare("insert into phones(brand, model, os, image, screensize) values(?, ?, ?, ?, ?)")
	checkErr(err)
	defer stmt.Close()
	_, err = stmt.Exec(product.Brand, product.Model, product.OS, product.Image, product.Screensize)
	checkErr(err)
}

func updateProduct(w http.ResponseWriter, id int, product Product) {
	w.WriteHeader(http.StatusAccepted)

	stmt, err := db.Prepare("update phones set brand=?, model=?, os=?, image=?, screensize=? where id=?")
	checkErr(err)
	defer stmt.Close()
	_, err = stmt.Exec(product.Brand, product.Model, product.OS, product.Image, product.Screensize, strconv.Itoa(id))
	checkErr(err)
}

func deleteAllProducts(w http.ResponseWriter) {
	_, err := db.Exec("delete from phones")
	checkErr(err)
}

func deleteProductByID(w http.ResponseWriter, id int) {
	stmt, err := db.Prepare("delete from phones where id=?")
	checkErr(err)
	_, err = stmt.Exec(strconv.Itoa(id))
	checkErr(err)
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
	checkErr(err)
	stmt, err := tx.Prepare("insert into phones(brand, model, os, image, screensize) values(?, ?, ?, ?, ?)")
	checkErr(err)
	defer stmt.Close()
	_, err = stmt.Exec("Samsung", "Galaxy S10", "Android", "https://example.com", 6)
	checkErr(err)
	_, err = stmt.Exec("Iphone", "11", "IOS", "https://example.com", 7)
	checkErr(err)
	tx.Commit()

	rows, err := db.Query("select id, brand from phones")
	checkErr(err)
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

func checkErr(err error) {
	if err != nil {
		fmt.Println(err)
	}
}
