// Source: https://codepen.io/andrese52/pen/ZJENqp
function sortTable(n) {
    var table,
        rows,
        switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;
    table = document.getElementById("table1");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
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
            //Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


document.onload = function() {
    // Submit form data to database
    document.getElementById("submit").onclick = function() {
        var formElements = document.getElementById("phone_form").elements;
        let entry = {};

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
        xhr.open('POST', 'https://wt.ops.labs.vu.nl/api20/47dc2ad7', true);
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify(entry)); 
    }

}


$(document).ready(function () {
    jQuery.support.cors = true;
    
    // Reset button
    $('#reset_id').click(function () {
        $.get("https://wt.ops.labs.vu.nl/api20/47dc2ad7/reset")
    });
    
    // Load table from database
    $.ajax(
        {
            type: "GET",
            url: "https://wt.ops.labs.vu.nl/api20/47dc2ad7",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    console.log(element);

                    $("#table1 tbody").append("<tr>"
                        + "<td>" + "<img src=" + element.image + "></td>"
                        + "<td>" + element.brand + "</td>"
                        + "<td>" + element.model + "</td>"
                        + "<td>" + element.os + "</td>"
                        + "<td>" + element.screensize + "</td>"
                        + "</tr>")
                }
            },
            error: function (msg) {

                alert(msg.responseText);
            }
        });
});