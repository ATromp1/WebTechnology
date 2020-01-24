function sortTableNoArgs() {
    let asc = $('.asc');
    let desc = $('.desc');

    if (asc[0]) {
        sortTable(asc[0].cellIndex, 'asc');
    }
    if (desc[0]) {
        sortTable(desc[0].cellIndex, 'desc');
    }
}

// Function that sorts the table by descending or ascending order.
// Source: https://codepen.io/andrese52/pen/ZJENqp
function sortTable(n, dir) {
    var i,
        x,
        y,
        shouldSwitch;

    let table = document.getElementById("table1");
    let rows = table.getElementsByTagName("TR");
    let switching = true;

    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < rows.length - 2; i++) { //Change i=0 if you have the header th a separate table.
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

// Generate html from phone data and add it to the end of the table.
function appendPhone(element) {
    $("#table1 thead").append("<tr>"
        + "<td>" + "<img src=" + element.image + "></td>"
        + "<td>" + element.brand + "</td>"
        + "<td>" + element.model + "</td>"
        + "<td>" + element.os + "</td>"
        + "<td>" + element.screensize + "</td>"
        + "</tr>")
}

// Retrieve all phones from the database and add them to the table.
function populateTable() {
    $.getJSON("http://localhost:3000/products", function (data) {
        for (let i = 0; i < data.length; i++) {
            appendPhone(data[i]);
        }
        sortTableNoArgs();
    });
}

// Retrieve latest added phone from the database and adds it to the the table. 
function addLastPhone() {
    $.ajax(
        {
            type: "GET",
            url: "http://localhost:3000/products",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                const element = data[data.length - 1];

                appendPhone(element);
                sortTableNoArgs();
            },
            error: function (msg) {
                alert(msg.responseText);
            }
        });
};

$(document).ready(function () {
    jQuery.support.cors = true;

    // Submit form data to database
    $('#phone_form').submit(function (event) {
        var formElements = document.getElementById("phone_form").elements;
        let entry = {};

        event.preventDefault();

        // Format data into an array
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];

            if (element.nodeName === "INPUT") {
                entry[element.name] = element.value;
            }
        }
        console.log(JSON.stringify(entry));

        // Send input to database
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/products', true);
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify(entry));
        $("#phone_form")[0].reset();        // Clearing form entries
        addLastPhone();
    })

    //Reset button
    $('#reset_id').click(function () {
        $.ajax({
            url: 'http://localhost:3000/reset',
            type: 'DELETE',
            success: function(result) {
                $("#table1 thead").find('tr:gt(0)').remove();
                populateTable();
            }
        });
    })    

    // Sort table column and update icons on header click
    $('.sortable').on('click', function () {
        let th = $(this);
        let isAsc = th.hasClass('asc');

        $('.sortable').removeClass("asc").removeClass("desc");

        if (isAsc) {
            th.addClass('desc');
            sortTable(th.index(), 'desc');
        }
        else {
            th.addClass('asc');
            sortTable(th.index(), 'asc');
        }
    })

    // Populating the initial table from the API
    populateTable();

});

