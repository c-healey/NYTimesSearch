$(document).ready(function () {

    function clear() {
        $("#list-results").empty();
    }
    function buildQueryURL() {
        // base URL
        let queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
        // api key in object that works with $.param()
        let queryParams = { "api-key": "ItbV99OjdOxW0J9Mre974afxJe8eC1GS" };
        // add the  q=search-term
        queryParams.q = $("#search-term").val().trim();
        // grab start year
        let startYear = $("#start-year").val().trim();
        // was an integer entered and it is 4 digits
        if (parseInt(startYear) && startYear >= 1000) {
            // put it in the proper format for the API
            queryParams.begin_date = startYear + '0101';

        }
        // was an integer entered and it is 4 digits
        let endYear = $("#end-year").val().trim();
        if (parseInt(endYear) && endYear >= 1000) {
            // put it in the proper format for the API
            queryParams.end_date = endYear + '0101';
        }
        // return the formatted url
        return queryURL + $.param(queryParams);
    }
    // THe promise function called on .then
    function updatePage(response) {
        let result = response.response.docs;
        console.log(result);
        // console.log(result[0].headline.main);
        // console.log(result[0].byline.original);
        // console.log(result[0].section_name);
        // console.log(result[0].abstract);
        // console.log(result[0].pub_date);

        // get the article count from teh select list
        let articleCount = parseInt($("#article-count").children("option:selected").val());
        // display up to articleCount articles
        for (i = 0; i < articleCount; i++) {
            // create the html markup
            let markup =
                `<a href="${result[i].web_url}" target="_blank" class="list-group-item list-group-item-action ">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${result[i].headline.main}</h5>
                        <small>${result[i].pub_date}</small>
                    </div>
                    <p class="mb-1">${result[i].byline.original === null ? "" : result[i].byline.original}</p>
                    <p class="mb-1">Section: ${result[i].section_name}</p>
                    <p class="mb-1"> ${result[i].abstract}</p>
                    <p class="mb-1"> ${result[i].lead_paragraph}</p>
                </a>`
            // append the markup to the lists-results div]
            $("#list-results").append(markup);
        }


    }
    $("#clear-button").on("click", function () {
        event.preventDefault();
        clear();

    });

    $("#search-button").on("click", function () {
        // Prevent form default behavior
        event.preventDefault();
        //  Clear results off the page
        clear();
        // Build tthe query url
        let queryURL = buildQueryURL();
        // make the aPI call 
        // Then update the page when results come back

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(updatePage);
    });
});